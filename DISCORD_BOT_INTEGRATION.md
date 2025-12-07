# Discord Bot Integration Guide

This document explains how to integrate the DawnReaver Discord bot with the website database and API endpoints.

## Database Connection

### Connection String

The bot should connect to Vercel Postgres using the connection string from environment variables:

```env
POSTGRES_URL="postgres://default:password@host/database"
```

You'll receive this connection string after deploying the website to Vercel and setting up Vercel Postgres.

### Database Schema

The database includes the following tables:

#### `members` - Clan Member Data
- `id` - Serial primary key
- `accountId` - WoWS account ID (unique)
- `nickname` - In-game name
- `discordId` - Discord user ID (for linking)
- `role` - Clan role (commander, executive_officer, etc.)
- `joinedAt` - Date joined clan
- `lastUpdated` - Last stats update timestamp
- `battles` - Total battles
- `winRate` - Win rate as integer (5500 = 55.00%)
- `avgDamage` - Average damage
- `personalRating` - PR rating
- `notes` - Admin notes
- `isActive` - Active status

#### `attendance` - Clan Battle Attendance
- `id` - Serial primary key
- `accountId` - WoWS account ID
- `eventDate` - Event date/time
- `eventType` - Type (clan_battle, training, division)
- `attended` - Boolean attendance
- `excused` - Excused absence
- `notes` - Additional notes

#### `events` - Clan Calendar
- `id` - Serial primary key
- `title` - Event title
- `description` - Event description
- `eventType` - Type (clan_battle, training, social)
- `startTime` - Start date/time
- `endTime` - End date/time
- `discordMessageId` - Discord event message ID
- `createdBy` - Discord ID of creator
- `isActive` - Active status

#### `applications` - Recruitment Applications
- `id` - Serial primary key
- `discordId` - Applicant's Discord ID
- `discordUsername` - Discord username
- `wowsNickname` - WoWS in-game name
- `wowsAccountId` - WoWS account ID
- `availability` - Text field for availability
- `tierXShips` - Tier X ships owned
- `experience` - Previous clan experience
- `whyJoin` - Reason for joining
- `status` - Application status (pending, approved, rejected, trial)
- `reviewedBy` - Discord ID of reviewer
- `reviewNotes` - Review notes

#### `botConfig` - Bot Configuration
- `id` - Serial primary key
- `key` - Config key (unique)
- `value` - Config value
- `description` - Config description

#### `auditLog` - Change Tracking
- `id` - Serial primary key
- `action` - Action type
- `performedBy` - Discord ID or 'system'
- `targetUser` - Affected user
- `details` - JSONB additional data
- `timestamp` - Action timestamp

## API Endpoints

All API endpoints require the `Authorization` header with a Bearer token for protected operations:

```
Authorization: Bearer YOUR_API_SECRET_KEY
```

### Member Management

#### GET `/api/members`
Fetch all clan members with their roles and stats.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "accountId": 1234567,
      "nickname": "PlayerName",
      "discordId": "123456789",
      "role": "officer",
      "battles": 5000,
      "winRate": 5500,
      "avgDamage": 45000,
      "personalRating": 1500
    }
  ],
  "count": 42
}
```

#### GET `/api/members/[discordId]`
Fetch a specific member by Discord ID.

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "accountId": 1234567,
    "nickname": "PlayerName",
    "discordId": "123456789",
    "role": "officer"
  }
}
```

#### POST `/api/members/sync`
**Protected Endpoint** - Trigger a sync from WoWS API to database.

**Headers:**
```
Authorization: Bearer YOUR_API_SECRET_KEY
```

**Response:**
```json
{
  "success": true,
  "data": {
    "totalMembers": 42,
    "updated": 40,
    "added": 2,
    "roleChanges": [
      {
        "accountId": 1234567,
        "nickname": "PlayerName",
        "discordId": "123456789",
        "oldRole": "private",
        "newRole": "officer"
      }
    ]
  },
  "changes": {
    "additions": [],
    "roleChanges": [...]
  }
}
```

### Application Management

#### GET `/api/applications`
Fetch all applications. Optional query parameter: `?status=pending`

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "discordId": "987654321",
      "discordUsername": "Applicant#1234",
      "wowsNickname": "NewPlayer",
      "status": "pending",
      "createdAt": "2025-01-15T12:00:00Z"
    }
  ],
  "count": 5
}
```

#### POST `/api/applications`
Submit a new recruitment application.

**Request Body:**
```json
{
  "discordId": "987654321",
  "discordUsername": "Applicant#1234",
  "wowsNickname": "NewPlayer",
  "wowsAccountId": 1234567,
  "availability": "Mon/Wed/Fri 8PM EST",
  "tierXShips": "Yamato, Montana, Moskva",
  "experience": "Previous clan: XYZ",
  "whyJoin": "Looking for competitive gameplay"
}
```

**Response:**
```json
{
  "success": true,
  "data": {...},
  "message": "Application submitted successfully"
}
```

#### PATCH `/api/applications/[id]`
**Protected Endpoint** - Update application status.

**Headers:**
```
Authorization: Bearer YOUR_API_SECRET_KEY
```

**Request Body:**
```json
{
  "status": "approved",
  "reviewedBy": "123456789",
  "reviewNotes": "Strong stats, approved for trial"
}
```

**Response:**
```json
{
  "success": true,
  "data": {...},
  "message": "Application updated successfully"
}
```

### Webhooks

#### POST `/api/webhook/role-change`
**Protected Endpoint** - Receive role change notifications from Discord bot.

**Headers:**
```
Authorization: Bearer YOUR_API_SECRET_KEY
```

**Request Body:**
```json
{
  "discordId": "123456789",
  "accountId": 1234567,
  "oldRole": "private",
  "newRole": "officer",
  "timestamp": "2025-01-15T12:00:00Z"
}
```

## Discord Bot Features

### Recommended Bot Implementation

#### 1. Periodic Member Sync
```javascript
// Run every 60 minutes
setInterval(async () => {
  const response = await fetch('https://your-site.vercel.app/api/members/sync', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.API_SECRET_KEY}`,
      'Content-Type': 'application/json'
    }
  });

  const data = await response.json();

  // Check for role changes
  if (data.changes.roleChanges.length > 0) {
    for (const change of data.changes.roleChanges) {
      // Update Discord role for this member
      await updateDiscordRole(change.discordId, change.newRole);
    }
  }
}, 60 * 60 * 1000); // 60 minutes
```

#### 2. Application Monitoring
```javascript
// Check for new applications
const checkApplications = async () => {
  const response = await fetch('https://your-site.vercel.app/api/applications?status=pending');
  const data = await response.json();

  for (const app of data.data) {
    // Post to #recruitment channel
    await postToRecruitment(app);
  }
};
```

#### 3. Application Command
```javascript
// Discord slash command: /apply
client.on('interactionCreate', async (interaction) => {
  if (interaction.commandName === 'apply') {
    // Create modal for application
    const modal = new Modal()
      .setCustomId('recruitment-application')
      .setTitle('DawnReaver Application');

    // Add fields...

    // On submit, POST to /api/applications
    await fetch('https://your-site.vercel.app/api/applications', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        discordId: interaction.user.id,
        discordUsername: interaction.user.tag,
        wowsNickname: modalData.wowsNickname,
        // ... other fields
      })
    });
  }
});
```

#### 4. Role Management
```javascript
// Map WoWS roles to Discord roles
const roleMapping = {
  'commander': 'Commander',
  'executive_officer': 'Deputy Commander',
  'commissioned_officer': 'Officer',
  'recruitment_officer': 'Recruiter',
  'officer': 'Officer',
  'private': 'Member'
};

async function updateDiscordRole(discordId, wowsRole) {
  const member = await guild.members.fetch(discordId);
  const discordRoleName = roleMapping[wowsRole];
  const role = guild.roles.cache.find(r => r.name === discordRoleName);

  if (role) {
    await member.roles.add(role);
  }
}
```

## Setup Instructions

### 1. Deploy Website to Vercel
```bash
cd www
vercel deploy
```

### 2. Set Up Vercel Postgres
1. Go to Vercel Dashboard → Your Project → Storage
2. Click "Create Database" → Choose "Postgres"
3. Copy the connection strings (both pooling and non-pooling)

### 3. Set Environment Variables in Vercel
```bash
POSTGRES_URL=postgres://...
POSTGRES_URL_NON_POOLING=postgres://...
API_SECRET_KEY=your-random-secret-key-here
```

### 4. Generate and Run Migrations
```bash
# Generate migration from schema
npm run db:generate

# Push to database
npm run db:push

# Or run migrations
npm run db:migrate
```

Add these scripts to `package.json`:
```json
{
  "scripts": {
    "db:generate": "drizzle-kit generate",
    "db:push": "drizzle-kit push",
    "db:migrate": "drizzle-kit migrate",
    "db:studio": "drizzle-kit studio"
  }
}
```

### 5. Configure Discord Bot
Set these environment variables in your Discord bot:
```env
DATABASE_URL=postgres://... (from Vercel)
API_BASE_URL=https://your-site.vercel.app
API_SECRET_KEY=your-random-secret-key-here
```

## Role Hierarchy

WoWS clan roles (in order):
1. `commander` - Clan Commander
2. `executive_officer` - Deputy Commander
3. `commissioned_officer` - Commissioned Officer
4. `recruitment_officer` - Recruitment Officer
5. `officer` - Petty Officer
6. `private` - Seaman

Discord roles should match these for automatic sync.

## Security Notes

- **Never** expose `API_SECRET_KEY` in client-side code
- All protected endpoints require `Authorization: Bearer {API_SECRET_KEY}` header
- Use HTTPS for all API calls
- Store database credentials securely in environment variables
- Validate all user input before database operations

## Support

For issues or questions, contact the clan leadership on Discord.
