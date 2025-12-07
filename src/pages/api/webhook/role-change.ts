import type { APIRoute } from 'astro';

export const prerender = false;

// Verify API secret for webhook
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
 * Webhook endpoint for Discord bot to receive role change notifications
 *
 * Expected payload from Discord bot:
 * {
 *   "discordId": "123456789",
 *   "accountId": 1234567,
 *   "oldRole": "private",
 *   "newRole": "officer",
 *   "timestamp": "2025-01-15T12:00:00Z"
 * }
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
    const requiredFields = ['discordId', 'oldRole', 'newRole'];
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

    // This webhook is primarily for receiving notifications from Discord bot
    // The actual role updates happen via the /api/members/sync endpoint
    // This endpoint can be used for logging or triggering additional actions

    console.log('Role change webhook received:', {
      discordId: body.discordId,
      oldRole: body.oldRole,
      newRole: body.newRole,
      timestamp: body.timestamp || new Date().toISOString(),
    });

    return new Response(JSON.stringify({
      success: true,
      message: 'Role change notification received',
      data: {
        discordId: body.discordId,
        oldRole: body.oldRole,
        newRole: body.newRole,
      },
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error processing webhook:', error);
    return new Response(JSON.stringify({
      success: false,
      error: 'Failed to process webhook',
      details: error instanceof Error ? error.message : 'Unknown error',
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
};
