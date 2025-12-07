import { d as db, m as members } from '../../../chunks/index_CJ7lrqfB.mjs';
import { eq } from 'drizzle-orm';
export { renderers } from '../../../renderers.mjs';

const prerender = false;
const GET = async ({ params }) => {
  const { discordId } = params;
  if (!discordId) {
    return new Response(JSON.stringify({
      success: false,
      error: "Discord ID is required"
    }), {
      status: 400,
      headers: {
        "Content-Type": "application/json"
      }
    });
  }
  try {
    const member = await db.select().from(members).where(eq(members.discordId, discordId)).limit(1);
    if (member.length === 0) {
      return new Response(JSON.stringify({
        success: false,
        error: "Member not found"
      }), {
        status: 404,
        headers: {
          "Content-Type": "application/json"
        }
      });
    }
    return new Response(JSON.stringify({
      success: true,
      data: member[0]
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json"
      }
    });
  } catch (error) {
    console.error("Error fetching member:", error);
    return new Response(JSON.stringify({
      success: false,
      error: "Failed to fetch member"
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
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
