import type { APIRoute } from 'astro';
import { db } from '../../../db';
import { announcements } from '../../../db/schema';
import { eq } from 'drizzle-orm';

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

/**
 * PATCH /api/announcements/[id]
 * Update announcement (Discord bot only - requires auth)
 */
export const PATCH: APIRoute = async ({ params, request }) => {
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

  const { id } = params;

  if (!id) {
    return new Response(JSON.stringify({
      success: false,
      error: 'Announcement ID is required',
    }), {
      status: 400,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  try {
    const body = await request.json();

    // Build update object
    const updateData: any = {
      updatedAt: new Date(),
    };

    if (body.title) updateData.title = body.title;
    if (body.content) updateData.content = body.content;
    if (body.category) updateData.category = body.category;
    if (body.isPinned !== undefined) updateData.isPinned = body.isPinned;
    if (body.isPublic !== undefined) updateData.isPublic = body.isPublic;

    const updatedAnnouncement = await db.update(announcements)
      .set(updateData)
      .where(eq(announcements.id, parseInt(id)))
      .returning();

    if (updatedAnnouncement.length === 0) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Announcement not found',
      }), {
        status: 404,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }

    return new Response(JSON.stringify({
      success: true,
      data: updatedAnnouncement[0],
      message: 'Announcement updated successfully',
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error updating announcement:', error);
    return new Response(JSON.stringify({
      success: false,
      error: 'Failed to update announcement',
      details: error instanceof Error ? error.message : 'Unknown error',
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
};

/**
 * DELETE /api/announcements/[id]
 * Delete announcement (Discord bot only - requires auth)
 */
export const DELETE: APIRoute = async ({ params, request }) => {
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

  const { id } = params;

  if (!id) {
    return new Response(JSON.stringify({
      success: false,
      error: 'Announcement ID is required',
    }), {
      status: 400,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  try {
    const deletedAnnouncement = await db.delete(announcements)
      .where(eq(announcements.id, parseInt(id)))
      .returning();

    if (deletedAnnouncement.length === 0) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Announcement not found',
      }), {
        status: 404,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }

    return new Response(JSON.stringify({
      success: true,
      message: 'Announcement deleted successfully',
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error deleting announcement:', error);
    return new Response(JSON.stringify({
      success: false,
      error: 'Failed to delete announcement',
      details: error instanceof Error ? error.message : 'Unknown error',
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
};
