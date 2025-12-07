export { renderers } from '../../../renderers.mjs';

const prerender = false;
function verifyAuth(request) {
  request.headers.get("Authorization");
  {
    console.warn("API_SECRET_KEY not configured");
    return false;
  }
}
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
    const requiredFields = ["discordId", "oldRole", "newRole"];
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
    console.log("Role change webhook received:", {
      discordId: body.discordId,
      oldRole: body.oldRole,
      newRole: body.newRole,
      timestamp: body.timestamp || (/* @__PURE__ */ new Date()).toISOString()
    });
    return new Response(JSON.stringify({
      success: true,
      message: "Role change notification received",
      data: {
        discordId: body.discordId,
        oldRole: body.oldRole,
        newRole: body.newRole
      }
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json"
      }
    });
  } catch (error) {
    console.error("Error processing webhook:", error);
    return new Response(JSON.stringify({
      success: false,
      error: "Failed to process webhook",
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
  POST,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
