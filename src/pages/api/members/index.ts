import type { APIRoute } from 'astro';
import { db } from '../../../db';
import { members } from '../../../db/schema';
import { eq } from 'drizzle-orm';

export const GET: APIRoute = async () => {
  try {
    const allMembers = await db.select().from(members).orderBy(members.role);

    return new Response(JSON.stringify({
      success: true,
      data: allMembers,
      count: allMembers.length,
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error fetching members:', error);
    return new Response(JSON.stringify({
      success: false,
      error: 'Failed to fetch members',
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
};
