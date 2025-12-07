import { d as db, b as applications, c as auditLog } from '../../chunks/index_CJ7lrqfB.mjs';
import { eq } from 'drizzle-orm';
export { renderers } from '../../renderers.mjs';

const prerender = false;
const GET = async ({ url }) => {
  try {
    const status = url.searchParams.get("status");
    let query = db.select().from(applications);
    if (status) {
      query = query.where(eq(applications.status, status));
    }
    const allApplications = await query.orderBy(applications.createdAt);
    return new Response(JSON.stringify({
      success: true,
      data: allApplications,
      count: allApplications.length
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json"
      }
    });
  } catch (error) {
    console.error("Error fetching applications:", error);
    return new Response(JSON.stringify({
      success: false,
      error: "Failed to fetch applications"
    }), {
      status: 500,
      headers: {
        "Content-Type": "application/json"
      }
    });
  }
};
const POST = async ({ request }) => {
  try {
    const body = await request.json();
    const requiredFields = ["discordId", "discordUsername", "wowsNickname"];
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
    const newApplication = await db.insert(applications).values({
      discordId: body.discordId,
      discordUsername: body.discordUsername,
      wowsNickname: body.wowsNickname,
      wowsAccountId: body.wowsAccountId || null,
      availability: body.availability || null,
      tierXShips: body.tierXShips || null,
      experience: body.experience || null,
      whyJoin: body.whyJoin || null,
      status: "pending"
    }).returning();
    await db.insert(auditLog).values({
      action: "application_submitted",
      performedBy: body.discordId,
      targetUser: body.discordUsername,
      details: {
        wowsNickname: body.wowsNickname,
        applicationId: newApplication[0].id
      }
    });
    return new Response(JSON.stringify({
      success: true,
      data: newApplication[0],
      message: "Application submitted successfully"
    }), {
      status: 201,
      headers: {
        "Content-Type": "application/json"
      }
    });
  } catch (error) {
    console.error("Error creating application:", error);
    return new Response(JSON.stringify({
      success: false,
      error: "Failed to create application",
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
