import type { APIRoute } from 'astro';
import { db } from '../../../db';
import { members } from '../../../db/schema';
import { eq } from 'drizzle-orm';

export const GET: APIRoute = async ({ params }) => {
  const { discordId } = params;

  if (!discordId) {
    return new Response(JSON.stringify({
      success: false,
      error: 'Discord ID is required',
    }), {
      status: 400,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  try {
    const member = await db.select()
      .from(members)
      .where(eq(members.discordId, discordId))
      .limit(1);

    if (member.length === 0) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Member not found',
      }), {
        status: 404,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }

    return new Response(JSON.stringify({
      success: true,
      data: member[0],
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error fetching member:', error);
    return new Response(JSON.stringify({
      success: false,
      error: 'Failed to fetch member',
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
};
