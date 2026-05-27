ALTER TABLE users DROP COLUMN IF EXISTS firebase_uid;
ALTER TABLE users ADD COLUMN IF NOT EXISTS password_hash TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS emergency_contact VARCHAR(60);
ALTER TABLE users ADD COLUMN IF NOT EXISTS travel_preferences JSONB DEFAULT '[]'::jsonb;
ALTER TABLE users ADD COLUMN IF NOT EXISTS profile_image TEXT;

ALTER TABLE trips DROP CONSTRAINT IF EXISTS trips_user_id_fkey;
ALTER TABLE trips ALTER COLUMN user_id DROP NOT NULL;
ALTER TABLE trips
    ALTER COLUMN user_id TYPE INTEGER
    USING CASE
        WHEN user_id::text ~ '^[0-9]+$' THEN user_id::text::integer
        ELSE NULL
    END;
ALTER TABLE trips
    ADD CONSTRAINT trips_user_id_fkey
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;

CREATE TABLE IF NOT EXISTS payment_transactions (
    id SERIAL PRIMARY KEY,
    booking_id TEXT,
    razorpay_order_id TEXT,
    razorpay_payment_id TEXT,
    amount NUMERIC,
    status TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS ai_chat_history (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    role VARCHAR(30) NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS notifications (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(160) NOT NULL,
    message TEXT,
    read_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
