import { d as db, m as members, c as auditLog } from '../../../chunks/index_CJ7lrqfB.mjs';
import { eq } from 'drizzle-orm';
import { g as getClanMembers } from '../../../chunks/wargaming-api_DeHAJQWA.mjs';
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
    const wowsMembers = await getClanMembers();
    const updates = [];
    const additions = [];
    const roleChanges = [];
    for (const wowsMember of wowsMembers) {
      const existingMember = await db.select().from(members).where(eq(members.accountId, wowsMember.account_id)).limit(1);
      if (existingMember.length > 0) {
        const dbMember = existingMember[0];
        if (dbMember.role !== wowsMember.role) {
          roleChanges.push({
            accountId: wowsMember.account_id,
            nickname: wowsMember.name,
            discordId: dbMember.discordId,
            oldRole: dbMember.role,
            newRole: wowsMember.role
          });
          await db.insert(auditLog).values({
            action: "role_changed",
            performedBy: "system",
            targetUser: wowsMember.name,
            details: {
              accountId: wowsMember.account_id,
              oldRole: dbMember.role,
              newRole: wowsMember.role
            }
          });
        }
        await db.update(members).set({
          nickname: wowsMember.name,
          role: wowsMember.role,
          battles: wowsMember.battles,
          winRate: Math.round(wowsMember.winRate * 100),
          // Store as integer (5500 = 55.00%)
          avgDamage: Math.round(wowsMember.avgDamage),
          personalRating: wowsMember.pr,
          lastUpdated: /* @__PURE__ */ new Date()
        }).where(eq(members.accountId, wowsMember.account_id));
        updates.push(wowsMember.account_id);
      } else {
        await db.insert(members).values({
          accountId: wowsMember.account_id,
          nickname: wowsMember.name,
          role: wowsMember.role,
          joinedAt: new Date(wowsMember.joined_at * 1e3),
          battles: wowsMember.battles,
          winRate: Math.round(wowsMember.winRate * 100),
          avgDamage: Math.round(wowsMember.avgDamage),
          personalRating: wowsMember.pr,
          isActive: true
        });
        additions.push({
          accountId: wowsMember.account_id,
          nickname: wowsMember.name,
          role: wowsMember.role
        });
        await db.insert(auditLog).values({
          action: "member_added",
          performedBy: "system",
          targetUser: wowsMember.name,
          details: {
            accountId: wowsMember.account_id,
            role: wowsMember.role
          }
        });
      }
    }
    return new Response(JSON.stringify({
      success: true,
      data: {
        totalMembers: wowsMembers.length,
        updated: updates.length,
        added: additions.length,
        roleChanges
      },
      changes: {
        additions,
        roleChanges
      }
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json"
      }
    });
  } catch (error) {
    console.error("Error syncing members:", error);
    return new Response(JSON.stringify({
      success: false,
      error: "Failed to sync members",
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
