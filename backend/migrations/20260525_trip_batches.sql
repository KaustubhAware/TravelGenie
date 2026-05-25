-- TravelGenie trip batch migration for existing local databases.
-- Safe to run multiple times.

CREATE TABLE IF NOT EXISTS trip_batches (
    id SERIAL PRIMARY KEY,
    package_id INTEGER NOT NULL REFERENCES packages(id) ON DELETE CASCADE,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    booking_deadline DATE NOT NULL,
    max_seats INTEGER NOT NULL DEFAULT 20,
    booked_seats INTEGER NOT NULL DEFAULT 0,
    pickup_location VARCHAR(160),
    guide_name VARCHAR(160),
    batch_status VARCHAR(30) DEFAULT 'open',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CHECK (max_seats >= 0),
    CHECK (booked_seats >= 0),
    CHECK (booked_seats <= max_seats)
);

CREATE INDEX IF NOT EXISTS idx_trip_batches_package ON trip_batches(package_id);
CREATE INDEX IF NOT EXISTS idx_trip_batches_start_date ON trip_batches(start_date);
CREATE INDEX IF NOT EXISTS idx_trip_batches_status ON trip_batches(batch_status);

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_schema = 'public'
          AND table_name = 'bookings'
          AND column_name = 'trip_batch_id'
    ) THEN
        ALTER TABLE bookings
        ADD COLUMN trip_batch_id INTEGER REFERENCES trip_batches(id) ON DELETE SET NULL;
    END IF;

    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_schema = 'public'
          AND table_name = 'vendors'
          AND column_name = 'rating'
    ) THEN
        ALTER TABLE vendors
        ADD COLUMN rating NUMERIC(3, 2) DEFAULT 4.7;
    END IF;

    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_schema = 'public'
          AND table_name = 'vendors'
          AND column_name = 'response_time'
    ) THEN
        ALTER TABLE vendors
        ADD COLUMN response_time VARCHAR(80) DEFAULT 'Within 24 hours';
    END IF;

    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_schema = 'public'
          AND table_name = 'vendors'
          AND column_name = 'verified_badge'
    ) THEN
        ALTER TABLE vendors
        ADD COLUMN verified_badge BOOLEAN DEFAULT FALSE;
    END IF;
END $$;
