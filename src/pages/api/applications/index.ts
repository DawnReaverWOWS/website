import type { APIRoute } from 'astro';
import { db } from '../../../db';
import { applications, auditLog } from '../../../db/schema';
import { eq } from 'drizzle-orm';

export const prerender = false;

export const GET: APIRoute = async ({ url }) => {
  try {
    const status = url.searchParams.get('status');

    let query = db.select().from(applications);

    // Filter by status if provided
    if (status) {
      query = query.where(eq(applications.status, status));
    }

    const allApplications = await query.orderBy(applications.createdAt);

    return new Response(JSON.stringify({
      success: true,
      data: allApplications,
      count: allApplications.length,
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error fetching applications:', error);
    return new Response(JSON.stringify({
      success: false,
      error: 'Failed to fetch applications',
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
};

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();

    // Validate required fields
    const requiredFields = ['discordId', 'discordUsername', 'wowsNickname'];
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

    // Create new application
    const newApplication = await db.insert(applications).values({
      discordId: body.discordId,
      discordUsername: body.discordUsername,
      wowsNickname: body.wowsNickname,
      wowsAccountId: body.wowsAccountId || null,
      availability: body.availability || null,
      tierXShips: body.tierXShips || null,
      experience: body.experience || null,
      whyJoin: body.whyJoin || null,
      status: 'pending',
    }).returning();

    // Log the application
    await db.insert(auditLog).values({
      action: 'application_submitted',
      performedBy: body.discordId,
      targetUser: body.discordUsername,
      details: {
        wowsNickname: body.wowsNickname,
        applicationId: newApplication[0].id,
      },
    });

    return new Response(JSON.stringify({
      success: true,
      data: newApplication[0],
      message: 'Application submitted successfully',
    }), {
      status: 201,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error creating application:', error);
    return new Response(JSON.stringify({
      success: false,
      error: 'Failed to create application',
      details: error instanceof Error ? error.message : 'Unknown error',
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
};
