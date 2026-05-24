-- TravelGenie PostgreSQL baseline schema (authoritative)
-- Safe additive migrations for existing databases.

-- =====================================================
-- USERS
-- =====================================================

CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    firebase_uid VARCHAR(160) UNIQUE NOT NULL,
    email VARCHAR(180) UNIQUE NOT NULL,
    name VARCHAR(120),
    full_name VARCHAR(160),
    phone VARCHAR(30),
    city VARCHAR(100),
    country VARCHAR(100),
    preferences TEXT,
    favorite_destinations TEXT,
    profile_completed BOOLEAN DEFAULT FALSE,
    role VARCHAR(30) DEFAULT 'customer',
    is_deleted BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- AGENTS & ADMINS
-- =====================================================

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

-- =====================================================
-- VENDORS (marketplace)
-- =====================================================

CREATE TABLE IF NOT EXISTS vendors (
    vendor_id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    business_name VARCHAR(200) NOT NULL,
    owner_name VARCHAR(160),
    contact_email VARCHAR(180) NOT NULL,
    phone VARCHAR(30),
    description TEXT,
    verification_status VARCHAR(30) DEFAULT 'pending',
    logo TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    is_deleted BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_vendors_user_id ON vendors(user_id);
CREATE INDEX IF NOT EXISTS idx_vendors_verification ON vendors(verification_status);

-- =====================================================
-- PACKAGES (platform + vendor)
-- =====================================================

CREATE TABLE IF NOT EXISTS packages (
    id SERIAL PRIMARY KEY,
    vendor_id INTEGER REFERENCES vendors(vendor_id) ON DELETE SET NULL,
    title VARCHAR(140) NOT NULL,
    slug VARCHAR(180),
    location VARCHAR(120),
    region VARCHAR(120),
    duration VARCHAR(60),
    price NUMERIC(12, 2) NOT NULL DEFAULT 0,
    seasonal_price NUMERIC(12, 2),
    description TEXT,
    short_description TEXT,
    full_description TEXT,
    image TEXT,
    featured_image TEXT,
    gallery JSONB DEFAULT '[]'::jsonb,
    services TEXT,
    hotel_details TEXT,
    transport_details TEXT,
    itinerary TEXT,
    category VARCHAR(80),
    difficulty VARCHAR(50),
    group_size VARCHAR(50),
    best_season VARCHAR(120),
    altitude VARCHAR(120),
    trek_distance VARCHAR(80),
    included TEXT,
    excluded TEXT,
    pickup_points JSONB DEFAULT '[]'::jsonb,
    fitness_required VARCHAR(120),
    travel_type VARCHAR(80),
    status VARCHAR(30) DEFAULT 'active',
    featured BOOLEAN DEFAULT FALSE,
    availability_calendar JSONB DEFAULT '{}'::jsonb,
    rating NUMERIC(3, 2) DEFAULT 0,
    total_reviews INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- VENDOR PACKAGES (marketplace listings)
-- =====================================================

CREATE TABLE IF NOT EXISTS vendor_packages (
    id SERIAL PRIMARY KEY,
    vendor_id INTEGER NOT NULL REFERENCES vendors(vendor_id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    destination VARCHAR(120) NOT NULL,
    pricing NUMERIC(12, 2) NOT NULL DEFAULT 0,
    itinerary TEXT,
    package_images JSONB DEFAULT '[]'::jsonb,
    availability JSONB DEFAULT '{}'::jsonb,
    status VARCHAR(30) DEFAULT 'active',
    is_deleted BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_vendor_packages_vendor ON vendor_packages(vendor_id);

-- =====================================================
-- TRIPS
-- =====================================================

CREATE TABLE IF NOT EXISTS trips (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(160) NOT NULL REFERENCES users(firebase_uid) ON DELETE CASCADE,
    vendor_id INTEGER REFERENCES vendors(vendor_id) ON DELETE SET NULL,
    package_id INTEGER REFERENCES packages(id) ON DELETE SET NULL,
    vendor_package_id INTEGER REFERENCES vendor_packages(id) ON DELETE SET NULL,
    title VARCHAR(200),
    destination VARCHAR(120) NOT NULL,
    start_date DATE,
    end_date DATE,
    travelers INTEGER DEFAULT 1,
    budget NUMERIC(12, 2) DEFAULT 0,
    days INTEGER DEFAULT 1,
    preferences TEXT,
    cost NUMERIC(12, 2) DEFAULT 0,
    sentiment VARCHAR(50),
    itinerary JSON DEFAULT '[]'::json,
    status VARCHAR(30) DEFAULT 'planned',
    metadata JSONB DEFAULT '{}'::jsonb,
    is_deleted BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_trips_user_id ON trips(user_id);
CREATE INDEX IF NOT EXISTS idx_trips_vendor_id ON trips(vendor_id);
CREATE INDEX IF NOT EXISTS idx_trips_status ON trips(status);

-- =====================================================
-- BOOKINGS
-- =====================================================

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
    package_title TEXT,
    package_image TEXT,
    travel_date DATE,
    travelers INTEGER DEFAULT 1,
    special_request TEXT,
    internal_notes TEXT,
    assigned_agent VARCHAR(120),
    adjusted_price NUMERIC(12, 2),
    departure_date DATE,
    return_date DATE,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- REVIEWS
-- =====================================================

CREATE TABLE IF NOT EXISTS reviews (
    review_id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    package_id INTEGER REFERENCES packages(id) ON DELETE SET NULL,
    trip_id INTEGER REFERENCES trips(id) ON DELETE SET NULL,
    vendor_id INTEGER REFERENCES vendors(vendor_id) ON DELETE SET NULL,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    review_text TEXT,
    image_url TEXT,
    moderation_status VARCHAR(30) DEFAULT 'pending',
    is_featured BOOLEAN DEFAULT FALSE,
    is_deleted BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_reviews_package ON reviews(package_id);
CREATE INDEX IF NOT EXISTS idx_reviews_user ON reviews(user_id);
CREATE INDEX IF NOT EXISTS idx_reviews_vendor ON reviews(vendor_id);
CREATE INDEX IF NOT EXISTS idx_reviews_moderation ON reviews(moderation_status);

-- =====================================================
-- SAVED ITINERARIES, PAYMENTS, INVOICES
-- =====================================================

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

-- =====================================================
-- ANALYTICS & AUDIT
-- =====================================================

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

-- =====================================================
-- INDEXES
-- =====================================================

CREATE INDEX IF NOT EXISTS idx_bookings_user_id ON bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
CREATE INDEX IF NOT EXISTS idx_bookings_created_at ON bookings(created_at);
CREATE INDEX IF NOT EXISTS idx_packages_location ON packages(location);
CREATE INDEX IF NOT EXISTS idx_saved_itineraries_user_id ON saved_itineraries(user_id);
