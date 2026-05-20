-- TravelGenie PostgreSQL baseline schema
-- Safe to run repeatedly on a development database.

CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    firebase_uid VARCHAR(160) UNIQUE NOT NULL,
    email VARCHAR(180) UNIQUE NOT NULL,
    full_name VARCHAR(160),
    phone VARCHAR(30),
    city VARCHAR(100),
    country VARCHAR(100),
    preferences TEXT,
    favorite_destinations TEXT,
    profile_completed BOOLEAN DEFAULT FALSE,
    role VARCHAR(30) DEFAULT 'customer',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS agents (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    employee_code VARCHAR(60) UNIQUE,
    department VARCHAR(100),
    status VARCHAR(30) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS admins (
    id SERIAL PRIMARY KEY,
    username VARCHAR(80) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    full_name VARCHAR(160),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS packages (
    id SERIAL PRIMARY KEY,
    title VARCHAR(140) NOT NULL,
    destination VARCHAR(120) NOT NULL,
    duration VARCHAR(60) NOT NULL,
    price NUMERIC(12, 2) NOT NULL DEFAULT 0,
    description TEXT NOT NULL,
    image TEXT,
    services TEXT,
    hotel_details TEXT,
    transport_details TEXT,
    itinerary TEXT,
    category VARCHAR(80),
    status VARCHAR(30) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS bookings (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    package_id INTEGER REFERENCES packages(id) ON DELETE SET NULL,
    booking_id VARCHAR(40) UNIQUE NOT NULL,
    destination VARCHAR(120) NOT NULL,
    name VARCHAR(180) NOT NULL,
    email VARCHAR(180) NOT NULL,
    phone VARCHAR(30) NOT NULL,
    budget NUMERIC(12, 2) DEFAULT 0,
    days INTEGER DEFAULT 1,
    status VARCHAR(30) DEFAULT 'pending',
    payment_status VARCHAR(30) DEFAULT 'unpaid',
    agent_id INTEGER REFERENCES agents(id) ON DELETE SET NULL,
    departure_date DATE,
    return_date DATE,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS saved_itineraries (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    destination VARCHAR(120) NOT NULL,
    budget NUMERIC(12, 2) DEFAULT 0,
    days INTEGER DEFAULT 1,
    preferences TEXT,
    itinerary TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS payments (
    id SERIAL PRIMARY KEY,
    booking_id INTEGER REFERENCES bookings(id) ON DELETE CASCADE,
    payment_reference VARCHAR(100) UNIQUE,
    amount NUMERIC(12, 2) NOT NULL DEFAULT 0,
    method VARCHAR(50) DEFAULT 'card',
    status VARCHAR(30) DEFAULT 'success',
    paid_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS invoices (
    id SERIAL PRIMARY KEY,
    booking_id INTEGER REFERENCES bookings(id) ON DELETE CASCADE,
    invoice_number VARCHAR(80) UNIQUE NOT NULL,
    amount NUMERIC(12, 2) NOT NULL DEFAULT 0,
    status VARCHAR(30) DEFAULT 'issued',
    issued_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS booking_notes (
    id SERIAL PRIMARY KEY,
    booking_id INTEGER REFERENCES bookings(id) ON DELETE CASCADE,
    note_type VARCHAR(40) DEFAULT 'internal',
    note TEXT NOT NULL,
    created_by VARCHAR(120),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS analytics_events (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    event_type VARCHAR(80) NOT NULL,
    entity_type VARCHAR(80),
    entity_id INTEGER,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS activity_logs (
    id SERIAL PRIMARY KEY,
    actor VARCHAR(120),
    actor_role VARCHAR(40),
    action VARCHAR(120) NOT NULL,
    entity_type VARCHAR(80),
    entity_id VARCHAR(80),
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_bookings_user_id ON bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
CREATE INDEX IF NOT EXISTS idx_bookings_created_at ON bookings(created_at);
CREATE INDEX IF NOT EXISTS idx_packages_destination ON packages(destination);
CREATE INDEX IF NOT EXISTS idx_saved_itineraries_user_id ON saved_itineraries(user_id);

ALTER TABLE users ADD COLUMN IF NOT EXISTS favorite_destinations TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS role VARCHAR(30) DEFAULT 'customer';
ALTER TABLE users ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;

ALTER TABLE packages ADD COLUMN IF NOT EXISTS hotel_details TEXT;
ALTER TABLE packages ADD COLUMN IF NOT EXISTS transport_details TEXT;
ALTER TABLE packages ADD COLUMN IF NOT EXISTS itinerary TEXT;
ALTER TABLE packages ADD COLUMN IF NOT EXISTS category VARCHAR(80);
ALTER TABLE packages ADD COLUMN IF NOT EXISTS status VARCHAR(30) DEFAULT 'active';
ALTER TABLE packages ADD COLUMN IF NOT EXISTS seasonal_price NUMERIC(12, 2);
ALTER TABLE packages ADD COLUMN IF NOT EXISTS featured BOOLEAN DEFAULT FALSE;
ALTER TABLE packages ADD COLUMN IF NOT EXISTS availability_calendar JSONB DEFAULT '{}'::jsonb;
ALTER TABLE packages ADD COLUMN IF NOT EXISTS gallery JSONB DEFAULT '[]'::jsonb;
ALTER TABLE packages ADD COLUMN IF NOT EXISTS rating NUMERIC(3, 2) DEFAULT 0;
ALTER TABLE packages ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;

ALTER TABLE bookings ADD COLUMN IF NOT EXISTS package_id INTEGER REFERENCES packages(id) ON DELETE SET NULL;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS payment_status VARCHAR(30) DEFAULT 'unpaid';
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS agent_id INTEGER REFERENCES agents(id) ON DELETE SET NULL;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS assigned_agent VARCHAR(120);
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS adjusted_price NUMERIC(12, 2);
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS internal_notes TEXT;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS departure_date DATE;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS return_date DATE;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS notes TEXT;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;


ALTER TABLE packages

ADD COLUMN IF NOT EXISTS difficulty VARCHAR(50),

ADD COLUMN IF NOT EXISTS group_size VARCHAR(50),

ADD COLUMN IF NOT EXISTS best_season VARCHAR(120),

ADD COLUMN IF NOT EXISTS altitude VARCHAR(120),

ADD COLUMN IF NOT EXISTS included TEXT,

ADD COLUMN IF NOT EXISTS excluded TEXT,

ADD COLUMN IF NOT EXISTS itinerary TEXT,

ADD COLUMN IF NOT EXISTS hotel_details TEXT,

ADD COLUMN IF NOT EXISTS transport_details TEXT,

ADD COLUMN IF NOT EXISTS gallery TEXT;