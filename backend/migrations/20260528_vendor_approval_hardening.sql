-- TravelGenie enterprise vendor approval and upload hardening.

ALTER TABLE users
    ADD COLUMN IF NOT EXISTS is_vendor BOOLEAN DEFAULT FALSE,
    ADD COLUMN IF NOT EXISTS vendor_status VARCHAR(30) DEFAULT 'none',
    ADD COLUMN IF NOT EXISTS approved_by INTEGER NULL,
    ADD COLUMN IF NOT EXISTS approved_at TIMESTAMP NULL,
    ADD COLUMN IF NOT EXISTS rejection_reason TEXT;

UPDATE users
SET is_vendor = (role = 'vendor')
WHERE is_vendor IS NULL;

UPDATE users
SET vendor_status = CASE
    WHEN role = 'vendor' THEN 'approved'
    ELSE 'none'
END
WHERE vendor_status IS NULL;

ALTER TABLE vendors
    ADD COLUMN IF NOT EXISTS gst_number VARCHAR(80),
    ADD COLUMN IF NOT EXISTS business_address TEXT,
    ADD COLUMN IF NOT EXISTS website_url TEXT,
    ADD COLUMN IF NOT EXISTS social_links JSONB DEFAULT '[]'::jsonb,
    ADD COLUMN IF NOT EXISTS years_experience INTEGER DEFAULT 0,
    ADD COLUMN IF NOT EXISTS categories JSONB DEFAULT '[]'::jsonb,
    ADD COLUMN IF NOT EXISTS government_id_path TEXT,
    ADD COLUMN IF NOT EXISTS rejection_reason TEXT;

UPDATE vendors
SET is_active = FALSE
WHERE verification_status IN ('pending', 'rejected', 'suspended');

CREATE INDEX IF NOT EXISTS idx_users_vendor_status
    ON users(is_vendor, vendor_status);

CREATE INDEX IF NOT EXISTS idx_vendors_status_active
    ON vendors(verification_status, is_active);
