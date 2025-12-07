import type { APIRoute } from 'astro';
import { db } from '../../../db';
import { announcements } from '../../../db/schema';
import { desc, eq } from 'drizzle-orm';

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
 * GET /api/announcements
 * Fetch all announcements (public only by default, or include members-only with auth)
 */
export const GET: APIRoute = async ({ url, request }) => {
  try {
    const includePrivate = url.searchParams.get('includePrivate') === 'true';
    const category = url.searchParams.get('category');
    const limit = parseInt(url.searchParams.get('limit') || '50');

    // If requesting private announcements, require auth
    if (includePrivate && !verifyAuth(request)) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Unauthorized - private announcements require authentication',
      }), {
        status: 401,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }

    let query = db.select().from(announcements);

    // Filter by public/private
    if (!includePrivate) {
      query = query.where(eq(announcements.isPublic, true));
    }

    // Filter by category if provided
    if (category) {
      query = query.where(eq(announcements.category, category));
    }

    const results = await query
      .orderBy(desc(announcements.isPinned), desc(announcements.createdAt))
      .limit(limit);

    return new Response(JSON.stringify({
      success: true,
      data: results,
      count: results.length,
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error fetching announcements:', error);
    return new Response(JSON.stringify({
      success: false,
      error: 'Failed to fetch announcements',
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
};

/**
 * POST /api/announcements
 * Create new announcement (Discord bot only - requires auth)
 */
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
    const body = await request.json();

    // Validate required fields
    const requiredFields = ['title', 'content', 'author', 'authorDiscordId'];
    for (const field of requiredFields) {
      if (!body[field]) {
        return new Response(JSON.stringify({
          success: false,
          error: `Missing required field: ${field}`,
        }), {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
          },
        });
      }
    }

    // Create new announcement
    const newAnnouncement = await db.insert(announcements).values({
      title: body.title,
      content: body.content,
      author: body.author,
      authorDiscordId: body.authorDiscordId,
      category: body.category || 'general',
      isPinned: body.isPinned || false,
      isPublic: body.isPublic !== undefined ? body.isPublic : true,
      discordMessageId: body.discordMessageId || null,
      discordChannelId: body.discordChannelId || null,
    }).returning();

    return new Response(JSON.stringify({
      success: true,
      data: newAnnouncement[0],
      message: 'Announcement created successfully',
    }), {
      status: 201,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error creating announcement:', error);
    return new Response(JSON.stringify({
      success: false,
      error: 'Failed to create announcement',
      details: error instanceof Error ? error.message : 'Unknown error',
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
};
