import type { APIRoute } from 'astro';
import { db } from '../../../db';
import { members, auditLog } from '../../../db/schema';
import { eq } from 'drizzle-orm';
import { getClanMembers } from '../../../lib/wargaming-api';

export const prerender = false;

// Verify API secret for protected endpoint
function verifyAuth(request: Request): boolean {
  const authHeader = request.headers.get('Authorization');
  const apiSecret = import.meta.env.API_SECRET_KEY;

  if (!apiSecret) {
    console.warn('API_SECRET_KEY not configured');
    return false;
  }

  return authHeader === `Bearer ${apiSecret}`;
}

export const POST: APIRoute = async ({ request }) => {
  // Verify authentication
  if (!verifyAuth(request)) {
    return new Response(JSON.stringify({
      success: false,
      error: 'Unauthorized',
    }), {
      status: 401,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  try {
    // Fetch latest member data from WoWS API
    const wowsMembers = await getClanMembers();

    const updates = [];
    const additions = [];
    const roleChanges = [];

    for (const wowsMember of wowsMembers) {
      // Check if member exists in database
      const existingMember = await db.select()
        .from(members)
        .where(eq(members.accountId, wowsMember.account_id))
        .limit(1);

      if (existingMember.length > 0) {
        // Member exists - check for role changes
        const dbMember = existingMember[0];

        if (dbMember.role !== wowsMember.role) {
          // Role changed!
          roleChanges.push({
            accountId: wowsMember.account_id,
            nickname: wowsMember.name,
            discordId: dbMember.discordId,
            oldRole: dbMember.role,
            newRole: wowsMember.role,
          });

          // Log the change
          await db.insert(auditLog).values({
            action: 'role_changed',
            performedBy: 'system',
            targetUser: wowsMember.name,
            details: {
              accountId: wowsMember.account_id,
              oldRole: dbMember.role,
              newRole: wowsMember.role,
            },
          });
        }

        // Update member data
        await db.update(members)
          .set({
            nickname: wowsMember.name,
            role: wowsMember.role,
            battles: wowsMember.battles,
            winRate: Math.round(wowsMember.winRate * 100), // Store as integer (5500 = 55.00%)
            avgDamage: Math.round(wowsMember.avgDamage),
            personalRating: wowsMember.pr,
            lastUpdated: new Date(),
          })
          .where(eq(members.accountId, wowsMember.account_id));

        updates.push(wowsMember.account_id);
      } else {
        // New member - add to database
        await db.insert(members).values({
          accountId: wowsMember.account_id,
          nickname: wowsMember.name,
          role: wowsMember.role,
          joinedAt: new Date(wowsMember.joined_at * 1000),
          battles: wowsMember.battles,
          winRate: Math.round(wowsMember.winRate * 100),
          avgDamage: Math.round(wowsMember.avgDamage),
          personalRating: wowsMember.pr,
          isActive: true,
        });

        additions.push({
          accountId: wowsMember.account_id,
          nickname: wowsMember.name,
          role: wowsMember.role,
        });

        // Log the addition
        await db.insert(auditLog).values({
          action: 'member_added',
          performedBy: 'system',
          targetUser: wowsMember.name,
          details: {
            accountId: wowsMember.account_id,
            role: wowsMember.role,
          },
        });
      }
    }

    return new Response(JSON.stringify({
      success: true,
      data: {
        totalMembers: wowsMembers.length,
        updated: updates.length,
        added: additions.length,
        roleChanges: roleChanges,
      },
      changes: {
        additions,
        roleChanges,
      },
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error syncing members:', error);
    return new Response(JSON.stringify({
      success: false,
      error: 'Failed to sync members',
      details: error instanceof Error ? error.message : 'Unknown error',
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
};
