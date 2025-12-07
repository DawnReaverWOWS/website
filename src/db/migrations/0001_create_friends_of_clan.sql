-- Migration: Create friends_of_clan table
-- Created: 2025-12-06
-- Description: Table to track former clan members (Friends of the Clan)

CREATE TABLE IF NOT EXISTS friends_of_clan (
  id SERIAL PRIMARY KEY,
  account_id INTEGER NOT NULL UNIQUE,
  nickname VARCHAR(255) NOT NULL,
  role VARCHAR(100) NOT NULL,
  joined_at TIMESTAMP NOT NULL,
  left_at TIMESTAMP NOT NULL,
  reason VARCHAR(100),
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create index on left_at for sorting
CREATE INDEX idx_friends_of_clan_left_at ON friends_of_clan(left_at DESC);

-- Add comment to table
COMMENT ON TABLE friends_of_clan IS 'Former clan members who served with honor';
