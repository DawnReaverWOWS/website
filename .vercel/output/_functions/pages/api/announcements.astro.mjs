import { d as db, a as announcements } from '../../chunks/index_CJ7lrqfB.mjs';
import { eq, desc } from 'drizzle-orm';
export { renderers } from '../../renderers.mjs';

const prerender = false;
function verifyAuth(request) {
  request.headers.get("Authorization");
  {
    console.warn("API_SECRET_KEY not configured");
    return false;
  }
}
const GET = async ({ url, request }) => {
  try {
    const includePrivate = url.searchParams.get("includePrivate") === "true";
    const category = url.searchParams.get("category");
    const limit = parseInt(url.searchParams.get("limit") || "50");
    if (includePrivate && !verifyAuth(request)) {
      return new Response(JSON.stringify({
        success: false,
        error: "Unauthorized - private announcements require authentication"
      }), {
        status: 401,
        headers: {
          "Content-Type": "application/json"
        }
      });
    }
    let query = db.select().from(announcements);
    if (!includePrivate) {
      query = query.where(eq(announcements.isPublic, true));
    }
    if (category) {
      query = query.where(eq(announcements.category, category));
    }
    const results = await query.orderBy(desc(announcements.isPinned), desc(announcements.createdAt)).limit(limit);
    return new Response(JSON.stringify({
      success: true,
      data: results,
      count: results.length
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json"
      }
    });
  } catch (error) {
    console.error("Error fetching announcements:", error);
    return new Response(JSON.stringify({
      success: false,
      error: "Failed to fetch announcements"
    }), {
      status: 500,
      headers: {
        "Content-Type": "application/json"
      }
    });
  }
};
const POST = async ({ request }) => {
  if (!verifyAuth(request)) {
    return new Response(JSON.stringify({
      success: false,
      error: "Unauthorized"
    }), {
      status: 401,
      headers: {
        "Content-Type": "application/json"
      }
    });
  }
  try {
    const body = await request.json();
    const requiredFields = ["title", "content", "author", "authorDiscordId"];
    for (const field of requiredFields) {
      if (!body[field]) {
        return new Response(JSON.stringify({
          success: false,
          error: `Missing required field: ${field}`
        }), {
          status: 400,
          headers: {
            "Content-Type": "application/json"
          }
        });
      }
    }
    const newAnnouncement = await db.insert(announcements).values({
      title: body.title,
      content: body.content,
      author: body.author,
      authorDiscordId: body.authorDiscordId,
      category: body.category || "general",
      isPinned: body.isPinned || false,
      isPublic: body.isPublic !== void 0 ? body.isPublic : true,
      discordMessageId: body.discordMessageId || null,
      discordChannelId: body.discordChannelId || null
    }).returning();
    return new Response(JSON.stringify({
      success: true,
      data: newAnnouncement[0],
      message: "Announcement created successfully"
    }), {
      status: 201,
      headers: {
        "Content-Type": "application/json"
      }
    });
  } catch (error) {
    console.error("Error creating announcement:", error);
    return new Response(JSON.stringify({
      success: false,
      error: "Failed to create announcement",
      details: error instanceof Error ? error.message : "Unknown error"
    }), {
      status: 500,
      headers: {
        "Content-Type": "application/json"
      }
    });
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET,
  POST,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
