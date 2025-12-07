# Discord Bot API Integration Guide

This guide explains how to post announcements from your Discord bot to the DawnReaver website.

## Prerequisites

1. **Database Setup**: First, you need to apply the database migrations to create the `announcements` table in Vercel Postgres.

### Applying Migrations to Vercel Postgres

**Option A: Using Vercel CLI (Recommended)**
```bash
# Install Vercel CLI if you haven't already
npm i -g vercel

# Pull environment variables from Vercel
vercel env pull .env.local

# Run the migration
npm run db:push
```

**Option B: Manual SQL Execution**
1. Go to your [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project
3. Go to "Storage" → Your Postgres database
4. Click "Query" tab
5. Copy and paste the SQL from `drizzle/0000_brainy_demogoblin.sql`
6. Execute the SQL

2. **API Secret Key**: Set up the `API_SECRET_KEY` environment variable in your Vercel project:
   - Go to Vercel Dashboard → Your Project → Settings → Environment Variables
   - Add `API_SECRET_KEY` with a secure random value
   - Save and redeploy

## API Endpoints

### Base URL
```
Production: https://website-seven-sable-40.vercel.app
```

### Authentication
All protected endpoints require Bearer token authentication:
```
Authorization: Bearer YOUR_API_SECRET_KEY
```

---

## 1. Create Announcement (POST)

**Endpoint**: `POST /api/announcements`

**Headers**:
```
Authorization: Bearer YOUR_API_SECRET_KEY
Content-Type: application/json
```

**Request Body**:
```json
{
  "title": "Clan Battle Season 23 Starting!",
  "content": "Get ready commanders! CB Season 23 starts this Friday at 7 PM EST. We'll be running Hurricane league teams. Make sure your T10 ships are ready!",
  "author": "CommanderName",
  "authorDiscordId": "123456789012345678",
  "category": "clan_battle",
  "isPinned": false,
  "isPublic": true,
  "discordMessageId": "987654321098765432",
  "discordChannelId": "111222333444555666"
}
```

**Field Descriptions**:
- `title` (required): Announcement title (max 255 chars)
- `content` (required): Main announcement text
- `author` (required): Display name of author
- `authorDiscordId` (required): Discord user ID of author
- `category` (optional): One of: `general`, `clan_battle`, `event`, `maintenance` (default: `general`)
- `isPinned` (optional): Pin to top of announcements (default: `false`)
- `isPublic` (optional): Show on public website (default: `true`)
- `discordMessageId` (optional): Discord message ID for reference
- `discordChannelId` (optional): Discord channel ID for reference

**Success Response** (201):
```json
{
  "success": true,
  "data": {
    "id": 1,
    "title": "Clan Battle Season 23 Starting!",
    "content": "Get ready commanders!...",
    "author": "CommanderName",
    "authorDiscordId": "123456789012345678",
    "category": "clan_battle",
    "isPinned": false,
    "isPublic": true,
    "discordMessageId": "987654321098765432",
    "discordChannelId": "111222333444555666",
    "createdAt": "2025-01-15T12:00:00.000Z",
    "updatedAt": "2025-01-15T12:00:00.000Z"
  },
  "message": "Announcement created successfully"
}
```

**Error Response** (400):
```json
{
  "success": false,
  "error": "Missing required field: title"
}
```

**Error Response** (401):
```json
{
  "success": false,
  "error": "Unauthorized"
}
```

---

## 2. Update Announcement (PATCH)

**Endpoint**: `PATCH /api/announcements/[id]`

**Headers**:
```
Authorization: Bearer YOUR_API_SECRET_KEY
Content-Type: application/json
```

**Request Body** (all fields optional):
```json
{
  "title": "Updated Title",
  "content": "Updated content",
  "category": "general",
  "isPinned": true,
  "isPublic": false
}
```

**Success Response** (200):
```json
{
  "success": true,
  "data": {
    "id": 1,
    "title": "Updated Title",
    "content": "Updated content",
    "category": "general",
    "isPinned": true,
    "isPublic": false,
    "updatedAt": "2025-01-15T12:30:00.000Z"
  },
  "message": "Announcement updated successfully"
}
```

**Error Response** (404):
```json
{
  "success": false,
  "error": "Announcement not found"
}
```

---

## 3. Delete Announcement (DELETE)

**Endpoint**: `DELETE /api/announcements/[id]`

**Headers**:
```
Authorization: Bearer YOUR_API_SECRET_KEY
```

**Success Response** (200):
```json
{
  "success": true,
  "message": "Announcement deleted successfully"
}
```

**Error Response** (404):
```json
{
  "success": false,
  "error": "Announcement not found"
}
```

---

## 4. Get Announcements (GET)

**Endpoint**: `GET /api/announcements`

**Headers**:
```
Authorization: Bearer YOUR_API_SECRET_KEY (only if includePrivate=true)
```

**Query Parameters**:
- `includePrivate` (optional): `true` to include members-only announcements (requires auth)
- `category` (optional): Filter by category (`general`, `clan_battle`, `event`, `maintenance`)
- `limit` (optional): Max number of results (default: 50)

**Examples**:
```
GET /api/announcements
GET /api/announcements?category=clan_battle
GET /api/announcements?includePrivate=true&limit=20
```

**Success Response** (200):
```json
{
  "success": true,
  "data": [
    {
      "id": 2,
      "title": "Pinned Announcement",
      "content": "This is pinned",
      "author": "Admin",
      "authorDiscordId": "123456789012345678",
      "category": "general",
      "isPinned": true,
      "isPublic": true,
      "createdAt": "2025-01-15T12:00:00.000Z",
      "updatedAt": "2025-01-15T12:00:00.000Z"
    },
    {
      "id": 1,
      "title": "Regular Announcement",
      "content": "This is a regular announcement",
      "author": "Commander",
      "authorDiscordId": "987654321098765432",
      "category": "event",
      "isPinned": false,
      "isPublic": true,
      "createdAt": "2025-01-14T10:00:00.000Z",
      "updatedAt": "2025-01-14T10:00:00.000Z"
    }
  ],
  "count": 2
}
```

---

## Discord Bot Example Code

### Python (discord.py)

```python
import discord
from discord.ext import commands
import aiohttp
import os

# Load API secret from environment
API_SECRET_KEY = os.getenv('API_SECRET_KEY')
WEBSITE_URL = 'https://website-seven-sable-40.vercel.app'

bot = commands.Bot(command_prefix='!')

@bot.command(name='announce')
@commands.has_permissions(administrator=True)
async def announce(ctx, category: str, pinned: str, *, content: str):
    """
    Post an announcement to the website
    Usage: !announce <category> <pinned> <content>
    Example: !announce clan_battle yes Clan Battle tonight at 7 PM EST!
    """

    # Parse parameters
    is_pinned = pinned.lower() in ['yes', 'true', 'pin', 'pinned']

    # Extract title from first line of content
    lines = content.split('\n', 1)
    title = lines[0]
    announcement_content = lines[1] if len(lines) > 1 else lines[0]

    # Prepare request
    headers = {
        'Authorization': f'Bearer {API_SECRET_KEY}',
        'Content-Type': 'application/json'
    }

    payload = {
        'title': title,
        'content': announcement_content,
        'author': ctx.author.display_name,
        'authorDiscordId': str(ctx.author.id),
        'category': category,
        'isPinned': is_pinned,
        'isPublic': True,
        'discordMessageId': str(ctx.message.id),
        'discordChannelId': str(ctx.channel.id)
    }

    # Post to website API
    async with aiohttp.ClientSession() as session:
        async with session.post(
            f'{WEBSITE_URL}/api/announcements',
            headers=headers,
            json=payload
        ) as response:
            data = await response.json()

            if response.status == 201:
                embed = discord.Embed(
                    title="✅ Announcement Posted",
                    description=f"Successfully posted to website!\n\n**Title:** {title}",
                    color=discord.Color.green()
                )
                embed.add_field(name="Category", value=category, inline=True)
                embed.add_field(name="Pinned", value="Yes" if is_pinned else "No", inline=True)
                embed.add_field(name="View", value="[Website](https://website-seven-sable-40.vercel.app/announcements)", inline=False)
                await ctx.send(embed=embed)
            else:
                await ctx.send(f"❌ Error posting announcement: {data.get('error', 'Unknown error')}")

@bot.command(name='unannounce')
@commands.has_permissions(administrator=True)
async def unannounce(ctx, announcement_id: int):
    """
    Delete an announcement from the website
    Usage: !unannounce <id>
    Example: !unannounce 5
    """

    headers = {
        'Authorization': f'Bearer {API_SECRET_KEY}'
    }

    async with aiohttp.ClientSession() as session:
        async with session.delete(
            f'{WEBSITE_URL}/api/announcements/{announcement_id}',
            headers=headers
        ) as response:
            data = await response.json()

            if response.status == 200:
                await ctx.send(f"✅ Announcement #{announcement_id} deleted from website")
            else:
                await ctx.send(f"❌ Error: {data.get('error', 'Unknown error')}")

bot.run('YOUR_BOT_TOKEN')
```

### JavaScript (discord.js)

```javascript
const { Client, GatewayIntentBits, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const axios = require('axios');

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent]
});

const API_SECRET_KEY = process.env.API_SECRET_KEY;
const WEBSITE_URL = 'https://website-seven-sable-40.vercel.app';

client.on('messageCreate', async (message) => {
  if (message.author.bot || !message.content.startsWith('!')) return;

  const args = message.content.slice(1).trim().split(/ +/);
  const command = args.shift().toLowerCase();

  // !announce command
  if (command === 'announce') {
    if (!message.member.permissions.has(PermissionFlagsBits.Administrator)) {
      return message.reply('❌ You need Administrator permissions to use this command.');
    }

    const [category, pinnedArg, ...contentParts] = args;
    const content = contentParts.join(' ');

    if (!category || !pinnedArg || !content) {
      return message.reply('Usage: `!announce <category> <yes|no> <content>`');
    }

    const isPinned = ['yes', 'true', 'pin', 'pinned'].includes(pinnedArg.toLowerCase());
    const lines = content.split('\n');
    const title = lines[0];
    const announcementContent = lines.slice(1).join('\n') || lines[0];

    try {
      const response = await axios.post(
        `${WEBSITE_URL}/api/announcements`,
        {
          title,
          content: announcementContent,
          author: message.member.displayName,
          authorDiscordId: message.author.id,
          category,
          isPinned,
          isPublic: true,
          discordMessageId: message.id,
          discordChannelId: message.channel.id
        },
        {
          headers: {
            'Authorization': `Bearer ${API_SECRET_KEY}`,
            'Content-Type': 'application/json'
          }
        }
      );

      const embed = new EmbedBuilder()
        .setTitle('✅ Announcement Posted')
        .setDescription(`Successfully posted to website!\n\n**Title:** ${title}`)
        .setColor(0x00ff00)
        .addFields(
          { name: 'Category', value: category, inline: true },
          { name: 'Pinned', value: isPinned ? 'Yes' : 'No', inline: true },
          { name: 'View', value: '[Website](https://website-seven-sable-40.vercel.app/announcements)', inline: false }
        );

      await message.reply({ embeds: [embed] });
    } catch (error) {
      console.error('Error posting announcement:', error);
      await message.reply(`❌ Error posting announcement: ${error.response?.data?.error || error.message}`);
    }
  }

  // !unannounce command
  if (command === 'unannounce') {
    if (!message.member.permissions.has(PermissionFlagsBits.Administrator)) {
      return message.reply('❌ You need Administrator permissions to use this command.');
    }

    const announcementId = args[0];

    if (!announcementId) {
      return message.reply('Usage: `!unannounce <id>`');
    }

    try {
      await axios.delete(
        `${WEBSITE_URL}/api/announcements/${announcementId}`,
        {
          headers: {
            'Authorization': `Bearer ${API_SECRET_KEY}`
          }
        }
      );

      await message.reply(`✅ Announcement #${announcementId} deleted from website`);
    } catch (error) {
      console.error('Error deleting announcement:', error);
      await message.reply(`❌ Error: ${error.response?.data?.error || error.message}`);
    }
  }
});

client.login(process.env.DISCORD_BOT_TOKEN);
```

---

## Category Options

- `general` - General clan announcements
- `clan_battle` - Clan Battle related announcements
- `event` - Special events and operations
- `maintenance` - Maintenance and downtime notices

Each category has a different color on the website for easy identification.

---

## Workflow

1. User posts announcement in Discord using bot command
2. Discord bot sends POST request to `/api/announcements` with announcement data
3. Website stores announcement in database
4. Announcement automatically appears on `/announcements` page
5. Optional: Discord bot can update or delete announcements using PATCH/DELETE endpoints

---

## Troubleshooting

**Issue**: "Unauthorized" error
- **Solution**: Check that `API_SECRET_KEY` environment variable is set correctly in both Vercel and your Discord bot

**Issue**: Announcements not showing on website
- **Solution**: Make sure database migrations have been applied (see Prerequisites section)

**Issue**: "Missing required field" error
- **Solution**: Ensure all required fields (`title`, `content`, `author`, `authorDiscordId`) are included in the request body

**Issue**: Database connection errors
- **Solution**: Verify `POSTGRES_URL` environment variable is set in Vercel project settings
