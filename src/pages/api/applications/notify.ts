import type { APIRoute } from 'astro';
import { db } from '../../../db';
import { applications } from '../../../db/schema';
import { eq } from 'drizzle-orm';

export const prerender = false;

// Discord webhook URL for officer notifications
// This should be set in environment variables
const DISCORD_WEBHOOK_URL = import.meta.env.DISCORD_WEBHOOK_URL;

// Officer review channel ID on DawnReaver server
const OFFICER_REVIEW_CHANNEL_ID = '1411105143151263805'; // #clan-leadership channel

/**
 * POST /api/applications/notify
 * Send a Discord notification when a new application is submitted
 */
export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { applicationId } = body;

    if (!applicationId) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Missing applicationId',
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Get the application from database
    const [application] = await db
      .select()
      .from(applications)
      .where(eq(applications.id, applicationId));

    if (!application) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Application not found',
      }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Build the Discord embed
    const embed = {
      title: '⚓ New Clan Application',
      color: 0x00D4FF, // Cyan color matching site theme
      fields: [
        {
          name: '👤 WoWS Username',
          value: application.wowsNickname || 'Not provided',
          inline: true,
        },
        {
          name: '💬 Discord',
          value: application.discordUsername || 'Not provided',
          inline: true,
        },
        {
          name: '📊 Status',
          value: application.status?.toUpperCase() || 'PENDING',
          inline: true,
        },
        {
          name: '🚢 Tier X Ships',
          value: application.tierXShips || 'Not specified',
          inline: false,
        },
        {
          name: '📅 Availability',
          value: application.availability || 'Not specified',
          inline: false,
        },
        {
          name: '📜 Previous Experience',
          value: application.experience || 'None provided',
          inline: false,
        },
        {
          name: '❓ Why Join DawnReaver',
          value: application.whyJoin || 'No reason given',
          inline: false,
        },
      ],
      footer: {
        text: `Application ID: ${application.id}`,
      },
      timestamp: new Date().toISOString(),
    };

    // Add WoWS stats link if we have the account ID
    if (application.wowsAccountId) {
      embed.fields.push({
        name: '🔗 WoWS Stats',
        value: `[View on WoWS Numbers](https://na.wows-numbers.com/player/${application.wowsAccountId},${encodeURIComponent(application.wowsNickname || '')})`,
        inline: false,
      });
    }

    // Send to Discord webhook
    if (DISCORD_WEBHOOK_URL) {
      const webhookResponse = await fetch(DISCORD_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: '📋 **New Application Received!** Officers, please review.',
          embeds: [embed],
        }),
      });

      if (!webhookResponse.ok) {
        console.error('Discord webhook failed:', await webhookResponse.text());
        // Don't fail the request if webhook fails, just log it
      }
    } else {
      console.warn('DISCORD_WEBHOOK_URL not configured - notification skipped');
    }

    return new Response(JSON.stringify({
      success: true,
      message: 'Notification sent',
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error sending notification:', error);
    return new Response(JSON.stringify({
      success: false,
      error: 'Failed to send notification',
      details: error instanceof Error ? error.message : 'Unknown error',
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
