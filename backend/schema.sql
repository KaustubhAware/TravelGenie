-- TravelGenie PostgreSQL baseline schema (authoritative)
-- Safe additive migrations for existing databases.

-- =====================================================
-- USERS
-- =====================================================

CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(180) UNIQUE NOT NULL,
    password_hash TEXT,
    name VARCHAR(120),
    full_name VARCHAR(160),
    phone VARCHAR(30),
    emergency_contact VARCHAR(60),
    city VARCHAR(100),
    country VARCHAR(100),
    preferences TEXT,
    travel_preferences JSONB DEFAULT '[]'::jsonb,
    favorite_destinations TEXT,
    profile_image TEXT,
    profile_completed BOOLEAN DEFAULT FALSE,
    role VARCHAR(30) DEFAULT 'customer',
    is_vendor BOOLEAN DEFAULT FALSE,
    vendor_status VARCHAR(30) DEFAULT 'none',
    approved_by INTEGER,
    approved_at TIMESTAMP,
    rejection_reason TEXT,
    is_deleted BOOLEAN DEFAULT FALSE,
    deleted_at TIMESTAMP,
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
    gst_number VARCHAR(80),
    business_address TEXT,
    website_url TEXT,
    social_links JSONB DEFAULT '[]'::jsonb,
    years_experience INTEGER DEFAULT 0,
    categories JSONB DEFAULT '[]'::jsonb,
    government_id_path TEXT,
    description TEXT,
    verification_status VARCHAR(30) DEFAULT 'pending',
    logo TEXT,
    rating NUMERIC(3, 2) DEFAULT 4.7,
    response_time VARCHAR(80) DEFAULT 'Within 24 hours',
    verified_badge BOOLEAN DEFAULT FALSE,
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
    itinerary JSONB DEFAULT '[]'::jsonb,
    category VARCHAR(80),
    difficulty VARCHAR(50),
    group_size VARCHAR(50),
    best_season VARCHAR(120),
    altitude VARCHAR(120),
    trek_distance VARCHAR(80),
    included TEXT,
    excluded TEXT,
    highlights JSONB DEFAULT '[]'::jsonb,
    weather_details JSONB DEFAULT '{}'::jsonb,
    faq JSONB DEFAULT '[]'::jsonb,
    nearby_attractions JSONB DEFAULT '[]'::jsonb,
    safety_notes JSONB DEFAULT '[]'::jsonb,
    transport_info JSONB DEFAULT '{}'::jsonb,
    map_url TEXT,
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

CREATE TABLE IF NOT EXISTS package_images (
    id SERIAL PRIMARY KEY,
    package_id INTEGER NOT NULL REFERENCES packages(id) ON DELETE CASCADE,
    image_path TEXT NOT NULL,
    alt_text VARCHAR(200),
    sort_order INTEGER DEFAULT 0,
    is_featured BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_package_images_package ON package_images(package_id);

-- =====================================================
-- TRIP BATCHES / DEPARTURES
-- =====================================================

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

-- =====================================================
-- TRIPS
-- =====================================================

CREATE TABLE IF NOT EXISTS trips (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
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
    trip_batch_id INTEGER REFERENCES trip_batches(id) ON DELETE SET NULL,
    booking_id VARCHAR(40) UNIQUE NOT NULL,
    destination VARCHAR(120) NOT NULL,
    name VARCHAR(180) NOT NULL,
    email VARCHAR(180) NOT NULL,
    phone VARCHAR(30) NOT NULL,
    budget NUMERIC(12, 2) DEFAULT 0,
    total_amount NUMERIC(12, 2) DEFAULT 0,
    days INTEGER DEFAULT 1,
    persons INTEGER DEFAULT 1,
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
    booking_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
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
-- PAYMENTS, AI HISTORY, NOTIFICATIONS, INVOICES
-- =====================================================

CREATE TABLE IF NOT EXISTS payment_transactions (
    id SERIAL PRIMARY KEY,
    booking_id VARCHAR(40) REFERENCES bookings(booking_id) ON DELETE SET NULL,
    razorpay_order_id TEXT UNIQUE,
    razorpay_payment_id TEXT UNIQUE,
    amount NUMERIC(12, 2) NOT NULL DEFAULT 0,
    currency VARCHAR(10) DEFAULT 'INR',
    status VARCHAR(30) NOT NULL DEFAULT 'created',
    failure_reason TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS ai_chat_history (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    role VARCHAR(30) NOT NULL,
    prompt TEXT,
    response TEXT,
    content TEXT NOT NULL,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

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

CREATE TABLE IF NOT EXISTS notifications (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(160) NOT NULL,
    message TEXT,
    audience VARCHAR(30) DEFAULT 'customer',
    type VARCHAR(60) DEFAULT 'general',
    metadata JSONB DEFAULT '{}'::jsonb,
    is_read BOOLEAN DEFAULT FALSE,
    read_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
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
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_schema = 'public'
        AND table_name = 'bookings'
        AND column_name = 'id'
    ) THEN
        CREATE UNIQUE INDEX IF NOT EXISTS idx_bookings_id_unique ON bookings(id);
    END IF;
END $$;
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
CREATE INDEX IF NOT EXISTS idx_bookings_created_at ON bookings(created_at);
CREATE INDEX IF NOT EXISTS idx_packages_location ON packages(location);
CREATE UNIQUE INDEX IF NOT EXISTS idx_packages_slug_unique ON packages(slug) WHERE slug IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_payments_booking_id ON payment_transactions(booking_id);
CREATE UNIQUE INDEX IF NOT EXISTS idx_payment_one_active_order_per_booking
    ON payment_transactions(booking_id)
    WHERE booking_id IS NOT NULL
    AND status IN ('created', 'attempted')
    AND razorpay_order_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_ai_chat_history_user_id ON ai_chat_history(user_id);
CREATE INDEX IF NOT EXISTS idx_saved_itineraries_user_id ON saved_itineraries(user_id);
CREATE INDEX IF NOT EXISTS idx_saved_itineraries_trip_id ON saved_itineraries(trip_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_read ON notifications(user_id, is_read);
