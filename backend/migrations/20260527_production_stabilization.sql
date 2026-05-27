-- TravelGenie production stabilization migration
-- Aligns existing databases with schema.sql, route expectations, seeds,
-- Razorpay transaction safety, notifications, and AI history.

ALTER TABLE bookings
    ADD COLUMN IF NOT EXISTS id SERIAL,
    ADD COLUMN IF NOT EXISTS total_amount NUMERIC(12, 2) DEFAULT 0,
    ADD COLUMN IF NOT EXISTS budget NUMERIC(12, 2) DEFAULT 0,
    ADD COLUMN IF NOT EXISTS adjusted_price NUMERIC(12, 2),
    ADD COLUMN IF NOT EXISTS travelers INTEGER DEFAULT 1,
    ADD COLUMN IF NOT EXISTS persons INTEGER DEFAULT 1,
    ADD COLUMN IF NOT EXISTS destination VARCHAR(120),
    ADD COLUMN IF NOT EXISTS name VARCHAR(180),
    ADD COLUMN IF NOT EXISTS email VARCHAR(180),
    ADD COLUMN IF NOT EXISTS phone VARCHAR(30),
    ADD COLUMN IF NOT EXISTS days INTEGER DEFAULT 1,
    ADD COLUMN IF NOT EXISTS status VARCHAR(30) DEFAULT 'pending',
    ADD COLUMN IF NOT EXISTS payment_status VARCHAR(30) DEFAULT 'unpaid',
    ADD COLUMN IF NOT EXISTS package_title TEXT,
    ADD COLUMN IF NOT EXISTS package_image TEXT,
    ADD COLUMN IF NOT EXISTS travel_date DATE,
    ADD COLUMN IF NOT EXISTS special_request TEXT,
    ADD COLUMN IF NOT EXISTS internal_notes TEXT,
    ADD COLUMN IF NOT EXISTS assigned_agent VARCHAR(120),
    ADD COLUMN IF NOT EXISTS agent_id INTEGER,
    ADD COLUMN IF NOT EXISTS departure_date DATE,
    ADD COLUMN IF NOT EXISTS return_date DATE,
    ADD COLUMN IF NOT EXISTS notes TEXT,
    ADD COLUMN IF NOT EXISTS booking_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP;

CREATE UNIQUE INDEX IF NOT EXISTS idx_bookings_id_unique
    ON bookings(id);

ALTER TABLE bookings
    ALTER COLUMN booking_id TYPE VARCHAR(40)
    USING booking_id::text;

ALTER TABLE packages
    ADD COLUMN IF NOT EXISTS highlights JSONB DEFAULT '[]'::jsonb,
    ADD COLUMN IF NOT EXISTS weather_details JSONB DEFAULT '{}'::jsonb,
    ADD COLUMN IF NOT EXISTS faq JSONB DEFAULT '[]'::jsonb,
    ADD COLUMN IF NOT EXISTS nearby_attractions JSONB DEFAULT '[]'::jsonb,
    ADD COLUMN IF NOT EXISTS safety_notes JSONB DEFAULT '[]'::jsonb,
    ADD COLUMN IF NOT EXISTS transport_info JSONB DEFAULT '{}'::jsonb,
    ADD COLUMN IF NOT EXISTS map_url TEXT;

ALTER TABLE packages
    ALTER COLUMN itinerary TYPE JSONB
    USING CASE
        WHEN itinerary IS NULL OR itinerary::text = '' THEN '[]'::jsonb
        WHEN itinerary::text ~ '^\s*[\[{]' THEN itinerary::jsonb
        ELSE jsonb_build_array(itinerary::text)
    END,
    ALTER COLUMN itinerary SET DEFAULT '[]'::jsonb;

CREATE TABLE IF NOT EXISTS package_images (
    id SERIAL PRIMARY KEY,
    package_id INTEGER NOT NULL REFERENCES packages(id) ON DELETE CASCADE,
    image_path TEXT NOT NULL,
    alt_text VARCHAR(200),
    sort_order INTEGER DEFAULT 0,
    is_featured BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_package_images_package
    ON package_images(package_id);

UPDATE bookings
SET total_amount = COALESCE(NULLIF(total_amount, 0), adjusted_price, budget, 0)
WHERE total_amount IS NULL OR total_amount = 0;

UPDATE bookings
SET persons = COALESCE(NULLIF(persons, 0), travelers, 1)
WHERE persons IS NULL OR persons = 0;

ALTER TABLE notifications
    ADD COLUMN IF NOT EXISTS is_read BOOLEAN DEFAULT FALSE;

UPDATE notifications
SET is_read = (read_at IS NOT NULL)
WHERE is_read IS NULL;

ALTER TABLE ai_chat_history
    ADD COLUMN IF NOT EXISTS prompt TEXT,
    ADD COLUMN IF NOT EXISTS response TEXT,
    ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}'::jsonb;

CREATE TABLE IF NOT EXISTS saved_itineraries (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    trip_id INTEGER REFERENCES trips(id) ON DELETE SET NULL,
    destination VARCHAR(120) NOT NULL,
    budget NUMERIC(12, 2) DEFAULT 0,
    days INTEGER DEFAULT 1,
    preferences TEXT,
    itinerary JSONB DEFAULT '[]'::jsonb,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE saved_itineraries
    ADD COLUMN IF NOT EXISTS trip_id INTEGER REFERENCES trips(id) ON DELETE SET NULL,
    ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}'::jsonb,
    ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;

ALTER TABLE saved_itineraries
    ALTER COLUMN itinerary TYPE JSONB
    USING CASE
        WHEN itinerary IS NULL OR itinerary::text = '' THEN '[]'::jsonb
        WHEN itinerary::text ~ '^\s*[\[{]' THEN itinerary::jsonb
        ELSE jsonb_build_array(itinerary::text)
    END,
    ALTER COLUMN itinerary SET DEFAULT '[]'::jsonb;

ALTER TABLE payment_transactions
    ADD COLUMN IF NOT EXISTS currency VARCHAR(10) DEFAULT 'INR',
    ADD COLUMN IF NOT EXISTS failure_reason TEXT,
    ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}'::jsonb;

ALTER TABLE payment_transactions
    ALTER COLUMN booking_id TYPE VARCHAR(40)
    USING booking_id::text;

ALTER TABLE payment_transactions
    ALTER COLUMN amount SET DEFAULT 0,
    ALTER COLUMN status SET DEFAULT 'created';

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.table_constraints
        WHERE table_schema = 'public'
        AND table_name = 'payment_transactions'
        AND constraint_name = 'payment_transactions_booking_fk'
    ) THEN
        ALTER TABLE payment_transactions
            ADD CONSTRAINT payment_transactions_booking_fk
            FOREIGN KEY (booking_id)
            REFERENCES bookings(booking_id)
            ON DELETE SET NULL;
    END IF;
END $$;

CREATE UNIQUE INDEX IF NOT EXISTS idx_packages_slug_unique
    ON packages(slug)
    WHERE slug IS NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS idx_payment_order_unique
    ON payment_transactions(razorpay_order_id);

CREATE UNIQUE INDEX IF NOT EXISTS idx_payment_id_unique
    ON payment_transactions(razorpay_payment_id);

CREATE INDEX IF NOT EXISTS idx_payments_booking_id
    ON payment_transactions(booking_id);

WITH ranked_active_orders AS (
    SELECT
        id,
        ROW_NUMBER() OVER (
            PARTITION BY booking_id
            ORDER BY created_at DESC, id DESC
        ) AS active_rank
    FROM payment_transactions
    WHERE booking_id IS NOT NULL
    AND razorpay_order_id IS NOT NULL
    AND status IN ('created', 'attempted')
)
UPDATE payment_transactions pt
SET status = 'stale',
    metadata = COALESCE(pt.metadata, '{}'::jsonb)
        || jsonb_build_object('staled_by_migration', '20260527_production_stabilization')
FROM ranked_active_orders ranked
WHERE pt.id = ranked.id
AND ranked.active_rank > 1;

CREATE UNIQUE INDEX IF NOT EXISTS idx_payment_one_active_order_per_booking
    ON payment_transactions(booking_id)
    WHERE booking_id IS NOT NULL
    AND status IN ('created', 'attempted')
    AND razorpay_order_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_ai_chat_history_user_id
    ON ai_chat_history(user_id);

CREATE INDEX IF NOT EXISTS idx_saved_itineraries_user_id
    ON saved_itineraries(user_id);

CREATE INDEX IF NOT EXISTS idx_saved_itineraries_trip_id
    ON saved_itineraries(trip_id);

CREATE INDEX IF NOT EXISTS idx_notifications_user_read
    ON notifications(user_id, is_read);

INSERT INTO saved_itineraries (
    user_id,
    trip_id,
    destination,
    budget,
    days,
    preferences,
    itinerary,
    metadata,
    created_at,
    updated_at
)
SELECT
    t.user_id,
    t.id,
    t.destination,
    t.budget,
    t.days,
    t.preferences,
    t.itinerary::jsonb,
    COALESCE(t.metadata, '{}'::jsonb)
        || jsonb_build_object('backfilled_from', 'trips'),
    t.created_at,
    COALESCE(t.updated_at, t.created_at)
FROM trips t
WHERE NOT EXISTS (
    SELECT 1
    FROM saved_itineraries si
    WHERE si.trip_id = t.id
);
