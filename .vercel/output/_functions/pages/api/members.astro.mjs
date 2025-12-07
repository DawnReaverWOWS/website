import { d as db, m as members } from '../../chunks/index_CJ7lrqfB.mjs';
export { renderers } from '../../renderers.mjs';

const prerender = false;
const GET = async () => {
  try {
    const allMembers = await db.select().from(members).orderBy(members.role);
    return new Response(JSON.stringify({
      success: true,
      data: allMembers,
      count: allMembers.length
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json"
      }
    });
  } catch (error) {
    console.error("Error fetching members:", error);
    return new Response(JSON.stringify({
      success: false,
      error: "Failed to fetch members"
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
