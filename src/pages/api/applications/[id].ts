import type { APIRoute } from 'astro';
import { db } from '../../../db';
import { applications, auditLog } from '../../../db/schema';
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

export const PATCH: APIRoute = async ({ params, request }) => {
  // Verify authentication for status updates
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
      error: 'Application ID is required',
    }), {
      status: 400,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  try {
    const body = await request.json();

    // Validate status if provided
    const validStatuses = ['pending', 'approved', 'rejected', 'trial'];
    if (body.status && !validStatuses.includes(body.status)) {
      return new Response(JSON.stringify({
        success: false,
        error: `Invalid status. Must be one of: ${validStatuses.join(', ')}`,
      }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }

    // Get current application
    const currentApp = await db.select()
      .from(applications)
      .where(eq(applications.id, parseInt(id)))
      .limit(1);

    if (currentApp.length === 0) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Application not found',
      }), {
        status: 404,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }

    // Update application
    const updateData: any = {
      updatedAt: new Date(),
    };

    if (body.status) updateData.status = body.status;
    if (body.reviewedBy) updateData.reviewedBy = body.reviewedBy;
    if (body.reviewNotes) updateData.reviewNotes = body.reviewNotes;

    const updatedApplication = await db.update(applications)
      .set(updateData)
      .where(eq(applications.id, parseInt(id)))
      .returning();

    // Log the status change if status was updated
    if (body.status) {
      await db.insert(auditLog).values({
        action: 'application_status_changed',
        performedBy: body.reviewedBy || 'system',
        targetUser: currentApp[0].discordUsername,
        details: {
          applicationId: parseInt(id),
          oldStatus: currentApp[0].status,
          newStatus: body.status,
          reviewNotes: body.reviewNotes || null,
        },
      });
    }

    return new Response(JSON.stringify({
      success: true,
      data: updatedApplication[0],
      message: 'Application updated successfully',
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error updating application:', error);
    return new Response(JSON.stringify({
      success: false,
      error: 'Failed to update application',
      details: error instanceof Error ? error.message : 'Unknown error',
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
};
