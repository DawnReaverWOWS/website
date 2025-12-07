// Database schema for DawnReaver clan website & Discord bot

import { pgTable, serial, text, integer, timestamp, boolean, varchar, jsonb } from 'drizzle-orm/pg-core';

/**
 * Members table - stores clan member data
 */
export const members = pgTable('members', {
  id: serial('id').primaryKey(),
  accountId: integer('account_id').notNull().unique(), // WoWS account ID
  nickname: varchar('nickname', { length: 255 }).notNull(),
  discordId: varchar('discord_id', { length: 255 }), // Discord user ID (for bot linking)
  role: varchar('role', { length: 100 }).notNull(), // commander, executive_officer, etc.
  joinedAt: timestamp('joined_at').notNull(),
  lastUpdated: timestamp('last_updated').defaultNow(),

  // Stats cache (updated periodically from WoWS API)
  battles: integer('battles').default(0),
  winRate: integer('win_rate').default(0), // Stored as percentage * 100 (e.g., 5500 = 55.00%)
  avgDamage: integer('avg_damage').default(0),
  personalRating: integer('personal_rating').default(0),

  // Additional data
  notes: text('notes'), // Admin notes
  isActive: boolean('is_active').default(true),
});

/**
 * Attendance tracking for clan battles
 */
export const attendance = pgTable('attendance', {
  id: serial('id').primaryKey(),
  accountId: integer('account_id').notNull(),
  eventDate: timestamp('event_date').notNull(),
  eventType: varchar('event_type', { length: 50 }).notNull(), // 'clan_battle', 'training', 'division'
  attended: boolean('attended').notNull(),
  excused: boolean('excused').default(false),
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow(),
});

/**
 * Clan events/calendar
 */
export const events = pgTable('events', {
  id: serial('id').primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description'),
  eventType: varchar('event_type', { length: 50 }).notNull(), // 'clan_battle', 'training', 'social'
  startTime: timestamp('start_time').notNull(),
  endTime: timestamp('end_time'),
  discordMessageId: varchar('discord_message_id', { length: 255 }), // For Discord event integration
  createdBy: varchar('created_by', { length: 255 }).notNull(), // Discord ID of creator
  createdAt: timestamp('created_at').defaultNow(),
  isActive: boolean('is_active').default(true),
});

/**
 * Applications/recruitment tracking
 */
export const applications = pgTable('applications', {
  id: serial('id').primaryKey(),
  discordId: varchar('discord_id', { length: 255 }).notNull(),
  discordUsername: varchar('discord_username', { length: 255 }).notNull(),
  wowsNickname: varchar('wows_nickname', { length: 255 }).notNull(),
  wowsAccountId: integer('wows_account_id'),

  // Application details
  availability: text('availability'), // Free-form text
  tierXShips: text('tier_x_ships'), // Comma-separated list
  experience: text('experience'), // Previous clan experience
  whyJoin: text('why_join'),

  // Status tracking
  status: varchar('status', { length: 50 }).notNull().default('pending'), // pending, approved, rejected, trial
  reviewedBy: varchar('reviewed_by', { length: 255 }), // Discord ID
  reviewNotes: text('review_notes'),

  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

/**
 * Bot configuration & settings
 */
export const botConfig = pgTable('bot_config', {
  id: serial('id').primaryKey(),
  key: varchar('key', { length: 255 }).notNull().unique(),
  value: text('value').notNull(),
  description: text('description'),
  updatedAt: timestamp('updated_at').defaultNow(),
});

/**
 * Announcements/Updates posted from Discord
 */
export const announcements = pgTable('announcements', {
  id: serial('id').primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  content: text('content').notNull(),
  author: varchar('author', { length: 255 }).notNull(), // Discord username
  authorDiscordId: varchar('author_discord_id', { length: 255 }).notNull(),
  category: varchar('category', { length: 50 }).default('general'), // general, clan_battle, event, maintenance
  isPinned: boolean('is_pinned').default(false),
  isPublic: boolean('is_public').default(true), // false = members only
  discordMessageId: varchar('discord_message_id', { length: 255 }), // Original Discord message ID
  discordChannelId: varchar('discord_channel_id', { length: 255 }), // Channel it was posted in
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

/**
 * Friends of the Clan - Former members
 */
export const friendsOfClan = pgTable('friends_of_clan', {
  id: serial('id').primaryKey(),
  accountId: integer('account_id').notNull().unique(), // WoWS account ID
  nickname: varchar('nickname', { length: 255 }).notNull(),
  role: varchar('role', { length: 100 }).notNull(), // Their role when they left
  joinedAt: timestamp('joined_at').notNull(), // When they joined the clan
  leftAt: timestamp('left_at').notNull(), // When they left the clan
  reason: varchar('reason', { length: 100 }), // 'retired', 'moved', 'removed', etc. (optional)
  notes: text('notes'), // Optional admin notes
  createdAt: timestamp('created_at').defaultNow(),
});

/**
 * Audit log for tracking changes
 */
export const auditLog = pgTable('audit_log', {
  id: serial('id').primaryKey(),
  action: varchar('action', { length: 255 }).notNull(), // 'member_added', 'role_changed', etc.
  performedBy: varchar('performed_by', { length: 255 }).notNull(), // Discord ID or 'system'
  targetUser: varchar('target_user', { length: 255 }), // Affected user
  details: jsonb('details'), // Additional data
  timestamp: timestamp('timestamp').defaultNow(),
});

// Type exports for TypeScript
export type Member = typeof members.$inferSelect;
export type NewMember = typeof members.$inferInsert;
export type Attendance = typeof attendance.$inferSelect;
export type NewAttendance = typeof attendance.$inferInsert;
export type Event = typeof events.$inferSelect;
export type NewEvent = typeof events.$inferInsert;
export type Application = typeof applications.$inferSelect;
export type NewApplication = typeof applications.$inferInsert;
export type Announcement = typeof announcements.$inferSelect;
export type NewAnnouncement = typeof announcements.$inferInsert;
export type FriendOfClan = typeof friendsOfClan.$inferSelect;
export type NewFriendOfClan = typeof friendsOfClan.$inferInsert;
