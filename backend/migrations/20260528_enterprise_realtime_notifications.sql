-- TravelGenie enterprise polish additive migration
-- Soft-delete restore metadata and richer notification payloads.

ALTER TABLE users
ADD COLUMN IF NOT EXISTS is_deleted BOOLEAN DEFAULT FALSE;

ALTER TABLE users
ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP;

UPDATE users
SET is_deleted = FALSE
WHERE is_deleted IS NULL;

ALTER TABLE notifications
ADD COLUMN IF NOT EXISTS audience VARCHAR(50) DEFAULT 'customer',
ADD COLUMN IF NOT EXISTS type VARCHAR(60) DEFAULT 'general',
ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}'::jsonb,
ADD COLUMN IF NOT EXISTS is_read BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS read_at TIMESTAMP;

UPDATE notifications
SET audience = 'customer'
WHERE audience IS NULL;

UPDATE notifications
SET type = 'general'
WHERE type IS NULL;

UPDATE notifications
SET metadata = '{}'::jsonb
WHERE metadata IS NULL;

UPDATE notifications
SET is_read = COALESCE(is_read, read_at IS NOT NULL, FALSE)
WHERE is_read IS NULL;

ALTER TABLE packages
ADD COLUMN IF NOT EXISTS status VARCHAR(30) DEFAULT 'active',
ADD COLUMN IF NOT EXISTS featured BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS featured_image TEXT,
ADD COLUMN IF NOT EXISTS gallery JSONB DEFAULT '[]'::jsonb;

CREATE INDEX IF NOT EXISTS idx_users_active_deleted
ON users (is_deleted, deleted_at);

CREATE INDEX IF NOT EXISTS idx_notifications_user_created
ON notifications (user_id, created_at DESC);
