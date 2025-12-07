import { d as db, a as announcements } from '../../../chunks/index_CJ7lrqfB.mjs';
import { eq } from 'drizzle-orm';
export { renderers } from '../../../renderers.mjs';

const prerender = false;
function verifyAuth(request) {
  request.headers.get("Authorization");
  {
    console.warn("API_SECRET_KEY not configured");
    return false;
  }
}
const PATCH = async ({ params, request }) => {
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
  const { id } = params;
  if (!id) {
    return new Response(JSON.stringify({
      success: false,
      error: "Announcement ID is required"
    }), {
      status: 400,
      headers: {
        "Content-Type": "application/json"
      }
    });
  }
  try {
    const body = await request.json();
    const updateData = {
      updatedAt: /* @__PURE__ */ new Date()
    };
    if (body.title) updateData.title = body.title;
    if (body.content) updateData.content = body.content;
    if (body.category) updateData.category = body.category;
    if (body.isPinned !== void 0) updateData.isPinned = body.isPinned;
    if (body.isPublic !== void 0) updateData.isPublic = body.isPublic;
    const updatedAnnouncement = await db.update(announcements).set(updateData).where(eq(announcements.id, parseInt(id))).returning();
    if (updatedAnnouncement.length === 0) {
      return new Response(JSON.stringify({
        success: false,
        error: "Announcement not found"
      }), {
        status: 404,
        headers: {
          "Content-Type": "application/json"
        }
      });
    }
    return new Response(JSON.stringify({
      success: true,
      data: updatedAnnouncement[0],
      message: "Announcement updated successfully"
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json"
      }
    });
  } catch (error) {
    console.error("Error updating announcement:", error);
    return new Response(JSON.stringify({
      success: false,
      error: "Failed to update announcement",
      details: error instanceof Error ? error.message : "Unknown error"
    }), {
      status: 500,
      headers: {
        "Content-Type": "application/json"
      }
    });
  }
};
const DELETE = async ({ params, request }) => {
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
  const { id } = params;
  if (!id) {
    return new Response(JSON.stringify({
      success: false,
      error: "Announcement ID is required"
    }), {
      status: 400,
      headers: {
        "Content-Type": "application/json"
      }
    });
  }
  try {
    const deletedAnnouncement = await db.delete(announcements).where(eq(announcements.id, parseInt(id))).returning();
    if (deletedAnnouncement.length === 0) {
      return new Response(JSON.stringify({
        success: false,
        error: "Announcement not found"
      }), {
        status: 404,
        headers: {
          "Content-Type": "application/json"
        }
      });
    }
    return new Response(JSON.stringify({
      success: true,
      message: "Announcement deleted successfully"
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json"
      }
    });
  } catch (error) {
    console.error("Error deleting announcement:", error);
    return new Response(JSON.stringify({
      success: false,
      error: "Failed to delete announcement",
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
  DELETE,
  PATCH,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
