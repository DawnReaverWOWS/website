CREATE TABLE "announcements" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" varchar(255) NOT NULL,
	"content" text NOT NULL,
	"author" varchar(255) NOT NULL,
	"author_discord_id" varchar(255) NOT NULL,
	"category" varchar(50) DEFAULT 'general',
	"is_pinned" boolean DEFAULT false,
	"is_public" boolean DEFAULT true,
	"discord_message_id" varchar(255),
	"discord_channel_id" varchar(255),
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "applications" (
	"id" serial PRIMARY KEY NOT NULL,
	"discord_id" varchar(255) NOT NULL,
	"discord_username" varchar(255) NOT NULL,
	"wows_nickname" varchar(255) NOT NULL,
	"wows_account_id" integer,
	"availability" text,
	"tier_x_ships" text,
	"experience" text,
	"why_join" text,
	"status" varchar(50) DEFAULT 'pending' NOT NULL,
	"reviewed_by" varchar(255),
	"review_notes" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "attendance" (
	"id" serial PRIMARY KEY NOT NULL,
	"account_id" integer NOT NULL,
	"event_date" timestamp NOT NULL,
	"event_type" varchar(50) NOT NULL,
	"attended" boolean NOT NULL,
	"excused" boolean DEFAULT false,
	"notes" text,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "audit_log" (
	"id" serial PRIMARY KEY NOT NULL,
	"action" varchar(255) NOT NULL,
	"performed_by" varchar(255) NOT NULL,
	"target_user" varchar(255),
	"details" jsonb,
	"timestamp" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "bot_config" (
	"id" serial PRIMARY KEY NOT NULL,
	"key" varchar(255) NOT NULL,
	"value" text NOT NULL,
	"description" text,
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "bot_config_key_unique" UNIQUE("key")
);
--> statement-breakpoint
CREATE TABLE "events" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" varchar(255) NOT NULL,
	"description" text,
	"event_type" varchar(50) NOT NULL,
	"start_time" timestamp NOT NULL,
	"end_time" timestamp,
	"discord_message_id" varchar(255),
	"created_by" varchar(255) NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"is_active" boolean DEFAULT true
);
--> statement-breakpoint
CREATE TABLE "members" (
	"id" serial PRIMARY KEY NOT NULL,
	"account_id" integer NOT NULL,
	"nickname" varchar(255) NOT NULL,
	"discord_id" varchar(255),
	"role" varchar(100) NOT NULL,
	"joined_at" timestamp NOT NULL,
	"last_updated" timestamp DEFAULT now(),
	"battles" integer DEFAULT 0,
	"win_rate" integer DEFAULT 0,
	"avg_damage" integer DEFAULT 0,
	"personal_rating" integer DEFAULT 0,
	"notes" text,
	"is_active" boolean DEFAULT true,
	CONSTRAINT "members_account_id_unique" UNIQUE("account_id")
);
