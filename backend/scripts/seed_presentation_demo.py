import json
import random
import sys
from datetime import date, datetime, timedelta
from pathlib import Path

import psycopg2
from psycopg2.extras import Json
from slugify import slugify

CURRENT_DIR = Path(__file__).resolve().parent
BACKEND_DIR = CURRENT_DIR.parent
if str(BACKEND_DIR) not in sys.path:
    sys.path.append(str(BACKEND_DIR))

from app.auth.password_utils import hash_password
from app.config import get_settings

settings = get_settings()
PASSWORD = "Pass@123"
MARKETPLACE_EMAIL_DOMAIN = "travelgenie.in"
SEED_TAG = "marketplace_seed"
RANDOM_SEED = 20260715
random.seed(RANDOM_SEED)


def connect():
    if settings.DATABASE_URL:
        return psycopg2.connect(settings.DATABASE_URL)
    return psycopg2.connect(
        host=settings.DB_HOST,
        database=settings.DB_NAME,
        user=settings.DB_USER,
        password=settings.DB_PASSWORD,
        port=settings.DB_PORT,
    )


def initials_image(seed):
    return f"https://api.dicebear.com/8.x/initials/svg?seed={seed.replace(' ', '%20')}"


def map_url(location):
    return f"https://www.google.com/maps/search/?api=1&query={location.replace(' ', '+')}"


def package_image(title):
    known = {
        "Rajgad Fort Heritage Trek": "rajgad.jpg",
        "Harishchandragad Expedition": "harishchandragad.jpg",
        "Kalsubai Sunrise Trek": "Kalsubai.jpg",
        "Torna Fort Trek": "torna.jpg",
        "Sinhagad Night Trek": "sinhagad-night-trek-1.svg",
        "Lohagad Monsoon Trek": "lohagad.jpg",
        "Visapur Trek": "visapur.jpg",
        "Pawna Lake Camping": "pawna-camping.jpg",
        "Alibaug Beach Escape": "alibaug-camping.jpg",
        "Konkan Coastal Tour": "kokan.jpg",
        "Bhandardara Camping": "bhandardara-camping.jpg",
        "Igatpuri Nature Retreat": "igatpuri.jpg",
        "Mahabaleshwar Escape": "mahabaleshwar.jpg",
        "Lonavala Adventure Weekend": "lonavala.jpg",
        "Andharban Forest Trek": "andharban.jpg",
        "Rajmachi Monsoon Trek": "rajmachi.jpg",
        "Harihar Fort Climb": "harihar-fort.jpg",
        "Matheran Heritage Walk": "matheran.jpg",
    }
    filename = known.get(title, random.choice([
        "sahyadri.jpg",
        "western-ghats.jpeg",
        "monsoon-treks.jpg",
        "fort-treks.jpg",
        "camping.jpg",
        "waterfalls.jpg",
    ]))
    return f"/uploads/packages/{filename}"


VENDORS = [
    ("Sahyadri Adventure Club", "Aditya Pawar", "Pune", 4.8, "Safety-first fort treks and mountain weekends across the Sahyadri ranges."),
    ("Western Ghats Explorers", "Rohan Shinde", "Nashik", 4.9, "Curated peak climbs, nature retreats, and monsoon trail programs."),
    ("Rajgad Trekking Co.", "Sagar More", "Pune", 4.7, "Specialist guides for Rajgad, Torna, Sinhagad, and Maval fort circuits."),
    ("Konkan Escape Tours", "Aman Patil", "Alibaug", 4.6, "Family-friendly coastal tours, beach camping, and Konkan food trails."),
    ("Maharashtra Fort Trails", "Nikhil Jadhav", "Satara", 4.8, "Heritage-led fort expeditions with local history and practical trail support."),
    ("Pawna Lakeside Adventures", "Kunal Bhosale", "Lonavala", 4.7, "Lakeside camping, kayaking add-ons, and relaxed weekend escapes."),
    ("Kalsubai Expedition Group", "Meera Kulkarni", "Igatpuri", 4.9, "Professional sunrise treks to Maharashtra's highest summit."),
    ("Harishchandragad Treks", "Prasad Kale", "Ahmednagar", 4.8, "Experienced leaders for Konkan Kada, Kokankada camping, and rugged treks."),
    ("Sinhagad Outdoor Ventures", "Rutuja Deshpande", "Pune", 4.6, "Short night treks, beginner outings, and school or college adventure days."),
    ("Nashik Nature Trails", "Tanmay Joshi", "Nashik", 4.7, "Vineyard weekends, waterfall trails, and peaceful nature itineraries."),
    ("Monsoon Mavericks", "Devika Sawant", "Mumbai", 4.8, "Mumbai and Pune monsoon specialists for waterfalls and forest trails."),
    ("Trek Maharashtra Collective", "Omkar Gawade", "Thane", 4.7, "Community-style treks with verified route leaders and transparent pricing."),
    ("Weekend Wanderers India", "Isha Naik", "Mumbai", 4.6, "Compact weekend trips for working professionals and student groups."),
    ("Fort Heritage Adventures", "Vikram Salunkhe", "Kolhapur", 4.8, "History-rich fort travel with homestay, food, and village experiences."),
    ("Sahyadri Peak Explorers", "Neel Pawar", "Pune", 4.9, "Advanced climbs, endurance treks, and high-altitude Sahyadri training trips."),
]


CUSTOMERS = [
    ("Rahul Sharma", "Pune"), ("Priya Patil", "Mumbai"), ("Neha Joshi", "Nashik"),
    ("Amit Deshmukh", "Nagpur"), ("Akash Kulkarni", "Pune"), ("Rutuja Shinde", "Satara"),
    ("Omkar Jadhav", "Kolhapur"), ("Sneha More", "Thane"), ("Karan Patil", "Mumbai"),
    ("Tejas Pawar", "Pune"), ("Ananya Bendre", "Aurangabad"), ("Sahil Shah", "Mumbai"),
    ("Mira Deshpande", "Nashik"), ("Isha Naik", "Ratnagiri"), ("Advait Kale", "Satara"),
    ("Tara Bhosale", "Pune"), ("Rohan Kulkarni", "Thane"), ("Pooja Sawant", "Mumbai"),
    ("Nikhil More", "Kolhapur"), ("Shruti Jadhav", "Pune"), ("Mayur Gawade", "Sangli"),
    ("Aditi Salunkhe", "Nashik"), ("Yash Patil", "Pune"), ("Tanvi Joshi", "Mumbai"),
    ("Sanket Shinde", "Solapur"), ("Mrunal Pawar", "Pune"), ("Dev Shah", "Thane"),
    ("Gauri Deshmukh", "Nagpur"), ("Pratik Naik", "Ratnagiri"), ("Kavya More", "Pune"),
    ("Siddhesh Kale", "Satara"), ("Manasi Kulkarni", "Mumbai"), ("Harshad Bendre", "Aurangabad"),
    ("Riya Patil", "Nashik"), ("Mandar Joshi", "Pune"), ("Vaidehi Sawant", "Mumbai"),
    ("Atharva Jadhav", "Kolhapur"), ("Janhavi Shinde", "Pune"), ("Sameer Deshpande", "Thane"),
    ("Ketaki Pawar", "Satara"),
]


PACKAGES = [
    ("Rajgad Fort Heritage Trek", "Rajgad, Maharashtra", "1 Day", 1699, "Moderate", "Fort Trek", "Oct-Feb", "4514 ft", "10 km"),
    ("Harishchandragad Expedition", "Ahmednagar, Maharashtra", "2D/1N", 3499, "Hard", "Fort Trek", "Jul-Feb", "4670 ft", "14 km"),
    ("Kalsubai Sunrise Trek & Camping", "Igatpuri, Maharashtra", "1 Night", 2199, "Hard", "Peak Trek", "Oct-Feb", "5400 ft", "6.6 km"),
    ("Torna Fort Adventure", "Velhe, Maharashtra", "1 Day", 1899, "Hard", "Fort Trek", "Oct-Feb", "4603 ft", "12 km"),
    ("Sinhagad Night Trek", "Pune, Maharashtra", "1 Night", 1299, "Easy", "Night Trek", "Nov-Feb", "4320 ft", "5 km"),
    ("Lohagad Monsoon Trek", "Lonavala, Maharashtra", "1 Day", 1499, "Easy", "Monsoon Trek", "Jun-Sep", "3389 ft", "7 km"),
    ("Visapur Trek", "Malavli, Maharashtra", "1 Day", 1599, "Moderate", "Fort Trek", "Jun-Feb", "3556 ft", "8 km"),
    ("Pawna Lake Camping Retreat", "Pawna, Maharashtra", "1N", 2199, "Easy", "Camping", "Oct-Mar", "2100 ft", "Local walks"),
    ("Alibaug Coastal Escape", "Alibaug, Maharashtra", "2D/1N", 3299, "Easy", "Beach", "Oct-Mar", "Sea level", "Flexible"),
    ("Konkan Coastal Tour", "Dapoli, Maharashtra", "3D/2N", 7999, "Easy", "Coastal Tour", "Nov-Feb", "Sea level", "Flexible"),
    ("Malshej Ghat Weekend", "Malshej Ghat, Maharashtra", "2D/1N", 3499, "Easy", "Nature Retreat", "Jun-Sep", "2297 ft", "5 km"),
    ("Bhandardara Camping", "Bhandardara, Maharashtra", "2D/1N", 2899, "Easy", "Camping", "Oct-Mar", "2470 ft", "Local walks"),
    ("Igatpuri Nature Retreat", "Igatpuri, Maharashtra", "2D/1N", 4499, "Easy", "Nature Retreat", "Jul-Feb", "1900 ft", "Flexible"),
    ("Mahabaleshwar Family Tour", "Mahabaleshwar, Maharashtra", "3D/2N", 6999, "Easy", "Hill Station", "Oct-Jun", "4439 ft", "Flexible"),
    ("Lonavala Adventure Weekend", "Lonavala, Maharashtra", "2D/1N", 3999, "Moderate", "Adventure", "Jun-Feb", "2047 ft", "6 km"),
    ("Rajmachi Fireflies Trek", "Rajmachi, Maharashtra", "2D/1N", 2699, "Moderate", "Monsoon Trek", "Jun-Sep", "2710 ft", "14 km"),
    ("Andharban Forest Trek", "Tamhini Ghat, Maharashtra", "1 Day", 2299, "Moderate", "Forest Trek", "Jun-Sep", "2160 ft", "13 km"),
    ("Devkund Waterfall Trail", "Bhira, Maharashtra", "1 Day", 1999, "Moderate", "Waterfall", "Jun-Oct", "1800 ft", "7 km"),
    ("Harihar Fort Climb", "Nashik, Maharashtra", "1 Day", 1899, "Hard", "Fort Trek", "Oct-Feb", "3676 ft", "6 km"),
    ("Sandhan Valley Adventure", "Bhandardara, Maharashtra", "2D/1N", 3799, "Hard", "Valley Trek", "Nov-Feb", "4100 ft", "10 km"),
    ("Tikona Fort Trek", "Pawna, Maharashtra", "1 Day", 1399, "Easy", "Beginner Trek", "Oct-Feb", "3500 ft", "5 km"),
    ("Vasota Jungle Trek", "Satara, Maharashtra", "2D/1N", 4299, "Hard", "Jungle Trek", "Oct-Feb", "3842 ft", "12 km"),
    ("Ratangad Fort Trek", "Bhandardara, Maharashtra", "2D/1N", 3199, "Moderate", "Fort Trek", "Oct-Feb", "4255 ft", "9 km"),
    ("Matheran Heritage Walk", "Matheran, Maharashtra", "2D/1N", 3699, "Easy", "Heritage Walk", "Oct-Mar", "2625 ft", "Flexible"),
    ("Nashik Vineyard Tour", "Nashik, Maharashtra", "2D/1N", 5999, "Easy", "Leisure", "Nov-Feb", "2300 ft", "Flexible"),
    ("Aadrai Jungle Trek", "Malshej Ghat, Maharashtra", "1 Day", 2399, "Moderate", "Forest Trek", "Jun-Sep", "2450 ft", "11 km"),
    ("Bhimashankar Wildlife Trek", "Bhimashankar, Maharashtra", "2D/1N", 3599, "Hard", "Wildlife Trek", "Jul-Feb", "3500 ft", "16 km"),
    ("Karnala Bird Sanctuary Trail", "Panvel, Maharashtra", "1 Day", 1299, "Easy", "Nature Trail", "Oct-Mar", "1440 ft", "4 km"),
    ("Prabalgad Kalavantin Trek", "Panvel, Maharashtra", "1 Day", 1999, "Hard", "Fort Trek", "Oct-Feb", "2300 ft", "8 km"),
    ("Kolad River Rafting", "Kolad, Maharashtra", "1 Day", 2499, "Moderate", "Adventure", "Jun-Feb", "120 ft", "Rafting stretch"),
    ("Lavasa Lakeside Weekend", "Lavasa, Maharashtra", "2D/1N", 4999, "Easy", "Leisure", "Oct-Mar", "2100 ft", "Flexible"),
    ("Raigad Fort Heritage Tour", "Raigad, Maharashtra", "1 Day", 1999, "Moderate", "Heritage", "Oct-Feb", "2700 ft", "5 km"),
    ("Panchgani Family Escape", "Panchgani, Maharashtra", "2D/1N", 5499, "Easy", "Family", "Oct-Jun", "4242 ft", "Flexible"),
    ("Diveagar Beach Weekend", "Diveagar, Maharashtra", "2D/1N", 4499, "Easy", "Beach", "Oct-Mar", "Sea level", "Flexible"),
    ("Amboli Waterfall Weekend", "Amboli, Maharashtra", "2D/1N", 4799, "Easy", "Waterfall", "Jun-Sep", "2260 ft", "Flexible"),
    ("Chikhaldara Nature Escape", "Chikhaldara, Maharashtra", "3D/2N", 7499, "Easy", "Nature Retreat", "Oct-Feb", "3664 ft", "Flexible"),
    ("Ajanta Ellora Heritage Circuit", "Aurangabad, Maharashtra", "3D/2N", 8999, "Easy", "Heritage", "Oct-Mar", "1900 ft", "Flexible"),
    ("Ganpatipule Coastal Stay", "Ganpatipule, Maharashtra", "3D/2N", 8499, "Easy", "Coastal Tour", "Nov-Feb", "Sea level", "Flexible"),
    ("Karjat Waterfall Trek", "Karjat, Maharashtra", "1 Day", 1599, "Moderate", "Waterfall", "Jun-Sep", "2100 ft", "7 km"),
    ("Kas Pathar Flower Trail", "Satara, Maharashtra", "1 Day", 2199, "Easy", "Seasonal", "Aug-Oct", "3937 ft", "Flexible"),
    ("Panhala Fort Weekend", "Kolhapur, Maharashtra", "2D/1N", 3999, "Easy", "Heritage", "Oct-Feb", "3177 ft", "Flexible"),
    ("Tadoba Wildlife Getaway", "Chandrapur, Maharashtra", "3D/2N", 10999, "Easy", "Wildlife", "Oct-Jun", "650 ft", "Safari"),
    ("Velas Turtle Festival Trip", "Velas, Maharashtra", "2D/1N", 4999, "Easy", "Seasonal", "Feb-Apr", "Sea level", "Flexible"),
    ("Bhor Valley Cycling Tour", "Bhor, Maharashtra", "1 Day", 1799, "Moderate", "Cycling", "Oct-Feb", "2200 ft", "35 km"),
    ("Durshet Forest Camping", "Durshet, Maharashtra", "2D/1N", 3299, "Easy", "Camping", "Oct-Mar", "1800 ft", "Local walks"),
]


def cleanup(cur):
    bad_user_names = (
        "Smoke Customer", "QA Customer", "Test Customer", "Smoke Vendor",
        "QA Vendor", "Demo Vendor", "Test User", "Demo User", "Sample User",
    )
    bad_businesses = ("Smoke Vendor", "QA Vendor", "Demo Vendor")
    bad_packages = ("Test Package", "Demo Package")

    cur.execute(
        """
        SELECT id
        FROM users
        WHERE full_name = ANY(%s) OR name = ANY(%s)
        """,
        (list(bad_user_names), list(bad_user_names)),
    )
    bad_user_ids = [row[0] for row in cur.fetchall()]

    if bad_user_ids:
        cur.execute(
            """
            DELETE FROM payment_transactions
            WHERE booking_id IN (
                SELECT booking_id FROM bookings WHERE user_id = ANY(%s)
            )
            """,
            (bad_user_ids,),
        )
        cur.execute(
            """
            DELETE FROM invoices
            WHERE booking_id IN (
                SELECT id FROM bookings WHERE user_id = ANY(%s)
            )
            """,
            (bad_user_ids,),
        )
        cur.execute(
            """
            DELETE FROM booking_notes
            WHERE booking_id IN (
                SELECT id FROM bookings WHERE user_id = ANY(%s)
            )
            """,
            (bad_user_ids,),
        )
        cur.execute("DELETE FROM notifications WHERE user_id = ANY(%s)", (bad_user_ids,))
        cur.execute("DELETE FROM ai_chat_history WHERE user_id = ANY(%s)", (bad_user_ids,))
        cur.execute("DELETE FROM saved_itineraries WHERE user_id = ANY(%s)", (bad_user_ids,))
        cur.execute("DELETE FROM trips WHERE user_id = ANY(%s)", (bad_user_ids,))
        cur.execute("DELETE FROM reviews WHERE user_id = ANY(%s)", (bad_user_ids,))
        cur.execute("DELETE FROM bookings WHERE user_id = ANY(%s)", (bad_user_ids,))
        cur.execute("DELETE FROM vendors WHERE user_id = ANY(%s)", (bad_user_ids,))

    cur.execute("DELETE FROM notifications WHERE title ILIKE '%smoke%' OR message ILIKE '%smoke%'")
    cur.execute("DELETE FROM reviews WHERE review_text ILIKE '%test review%' OR review_text ILIKE '%sample review%'")
    cur.execute("DELETE FROM packages WHERE title = ANY(%s)", (list(bad_packages),))
    cur.execute("DELETE FROM vendors WHERE business_name = ANY(%s)", (list(bad_businesses),))
    cur.execute("DELETE FROM users WHERE full_name = ANY(%s) OR name = ANY(%s)", (list(bad_user_names), list(bad_user_names)))

    cur.execute("DELETE FROM notifications WHERE metadata->>'seed' IN ('presentation_demo', 'marketplace_seed')")
    cur.execute("DELETE FROM ai_chat_history WHERE metadata->>'seed' IN ('presentation_demo', 'marketplace_seed')")
    cur.execute("DELETE FROM saved_itineraries WHERE metadata->>'seed' IN ('presentation_demo', 'marketplace_seed')")
    cur.execute("DELETE FROM trips WHERE metadata->>'seed' IN ('presentation_demo', 'marketplace_seed')")
    cur.execute("DELETE FROM payment_transactions WHERE metadata->>'seed' IN ('presentation_demo', 'marketplace_seed')")
    cur.execute("DELETE FROM reviews WHERE image_url IN ('presentation_demo', 'marketplace_seed')")
    cur.execute(
        """
        DELETE FROM payment_transactions
        WHERE razorpay_order_id LIKE 'order_TGPRES_%'
           OR razorpay_order_id LIKE 'order_TG%'
           OR metadata->>'seed' IN ('presentation_demo', 'marketplace_seed')
        """
    )
    cur.execute("DELETE FROM bookings WHERE booking_id LIKE 'TGPRES-%' OR booking_id LIKE 'TG-BOOK-%'")
    cur.execute("DELETE FROM trip_batches WHERE package_id IN (SELECT id FROM packages WHERE slug LIKE 'presentation-%' OR title LIKE '%Presentation%' OR title LIKE '%QA Trek%' OR title LIKE '%Demo Trek%')")
    cur.execute("DELETE FROM package_images WHERE package_id IN (SELECT id FROM packages WHERE slug LIKE 'presentation-%')")
    cur.execute("DELETE FROM vendor_packages WHERE title LIKE '[Presentation] %' OR title LIKE '%QA %' OR title LIKE '%Demo %'")
    cur.execute("DELETE FROM trip_batches WHERE package_id IN (SELECT id FROM packages WHERE vendor_id IS NULL)")
    cur.execute("DELETE FROM package_images WHERE package_id IN (SELECT id FROM packages WHERE vendor_id IS NULL)")
    cur.execute("DELETE FROM packages WHERE vendor_id IS NULL")
    cur.execute("DELETE FROM packages WHERE slug LIKE 'presentation-%' OR title LIKE '%Presentation%' OR title LIKE '%QA Trek%' OR title LIKE '%Demo Trek%'")
    for _title, *_rest in PACKAGES:
        cur.execute("DELETE FROM package_images WHERE package_id IN (SELECT id FROM packages WHERE slug = %s)", (slugify(_title),))
        cur.execute("DELETE FROM trip_batches WHERE package_id IN (SELECT id FROM packages WHERE slug = %s)", (slugify(_title),))
        cur.execute("DELETE FROM packages WHERE slug = %s", (slugify(_title),))
    cur.execute("DELETE FROM vendors WHERE contact_email LIKE %s OR contact_email LIKE %s OR business_name ILIKE '%%qa%%' OR business_name ILIKE '%%demo%%' OR business_name ILIKE '%%smoke%%'",
                (f"%@{MARKETPLACE_EMAIL_DOMAIN}", "%@presentation.travelgenie.in"))
    cur.execute("DELETE FROM users WHERE email LIKE %s OR email LIKE %s OR email ILIKE '%%qa.%%' OR email ILIKE '%%smoke.%%' OR email ILIKE '%%demo.%%'",
                (f"%@{MARKETPLACE_EMAIL_DOMAIN}", "%@presentation.travelgenie.in"))


def seed_admin(cur):
    password_hash = hash_password(PASSWORD)
    cur.execute(
        """
        INSERT INTO users (
            email, password_hash, name, full_name, phone, city, country,
            role, profile_completed, is_deleted, created_at, updated_at
        )
        VALUES (%s,%s,%s,%s,%s,%s,'India','admin',TRUE,FALSE,NOW(),NOW())
        ON CONFLICT (email) DO UPDATE
        SET password_hash = EXCLUDED.password_hash,
            name = EXCLUDED.name,
            full_name = EXCLUDED.full_name,
            role = 'admin',
            profile_completed = TRUE,
            is_deleted = FALSE,
            updated_at = NOW()
        RETURNING id
        """,
        ("admin@travelgenie.com", password_hash, "TravelGenie Admin", "TravelGenie Admin", "9999999999", "Pune"),
    )
    admin_user_id = cur.fetchone()[0]
    cur.execute(
        """
        INSERT INTO admins (username, password_hash, full_name)
        VALUES (%s,%s,%s)
        ON CONFLICT (username) DO UPDATE
        SET password_hash = EXCLUDED.password_hash,
            full_name = EXCLUDED.full_name
        """,
        ("admin@travelgenie.com", password_hash, "TravelGenie Admin"),
    )
    return admin_user_id


def seed_customers(cur):
    interests = [
        ["fort treks", "monsoon trails", "local food"],
        ["camping", "lakeside stays", "sunrise treks"],
        ["heritage", "family trips", "hill stations"],
        ["wildlife", "nature retreats", "photography"],
    ]
    destinations = [
        "Rajgad, Kalsubai, Pawna", "Alibaug, Dapoli, Ganpatipule",
        "Nashik, Igatpuri, Bhandardara", "Mahabaleshwar, Panchgani, Kas Pathar",
    ]
    ids = []
    credentials = []
    for index, (name, city) in enumerate(CUSTOMERS, start=1):
        email = f"{slugify(name)}@{MARKETPLACE_EMAIL_DOMAIN}"
        cur.execute(
            """
            INSERT INTO users (
                email, password_hash, name, full_name, phone, emergency_contact,
                city, country, preferences, travel_preferences,
                favorite_destinations, profile_image, profile_completed,
                role, is_vendor, vendor_status, is_deleted, created_at, updated_at
            )
            VALUES (%s,%s,%s,%s,%s,%s,%s,'India',%s,%s,%s,%s,TRUE,'customer',FALSE,'none',FALSE,%s,NOW())
            RETURNING id
            """,
            (
                email, hash_password(PASSWORD), name, name,
                f"9{720000000 + index:09d}", f"9{820000000 + index:09d}",
                city, ", ".join(interests[index % len(interests)]),
                Json(interests[index % len(interests)]), destinations[index % len(destinations)],
                initials_image(name), datetime.now() - timedelta(days=random.randint(15, 180)),
            ),
        )
        ids.append((cur.fetchone()[0], name, email, city))
        if index <= 10:
            credentials.append((name, email))
    return ids, credentials


def seed_vendors(cur):
    ids = []
    credentials = []
    for index, (business, owner, city, rating, description) in enumerate(VENDORS, start=1):
        email = f"{slugify(business)}@{MARKETPLACE_EMAIL_DOMAIN}"
        cur.execute(
            """
            INSERT INTO users (
                email, password_hash, name, full_name, phone, city, country,
                role, is_vendor, vendor_status, approved_at,
                profile_completed, is_deleted, created_at, updated_at
            )
            VALUES (%s,%s,%s,%s,%s,%s,'India','vendor',TRUE,'approved',NOW(),TRUE,FALSE,%s,NOW())
            RETURNING id
            """,
            (
                email, hash_password(PASSWORD), owner, owner,
                f"8{810000000 + index:09d}", city,
                datetime.now() - timedelta(days=random.randint(70, 260)),
            ),
        )
        user_id = cur.fetchone()[0]
        cur.execute(
            """
            INSERT INTO vendors (
                user_id, business_name, owner_name, contact_email, phone,
                gst_number, business_address, website_url, social_links,
                years_experience, categories, description, verification_status,
                logo, rating, response_time, verified_badge, is_active,
                is_deleted, created_at, updated_at
            )
            VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,'approved',%s,%s,%s,TRUE,TRUE,FALSE,%s,NOW())
            RETURNING vendor_id
            """,
            (
                user_id, business, owner, email, f"9{510000000 + index:09d}",
                f"27ABCDE{index:04d}F1Z{index % 9 + 1}",
                f"{random.randint(11, 89)}, {city} Adventure Office, {city}, Maharashtra",
                f"https://www.{slugify(business)}.in",
                Json([{"platform": "instagram", "url": f"https://instagram.com/{slugify(business).replace('-', '')}"}]),
                random.randint(4, 12),
                Json(["Trekking", "Camping", "Maharashtra Tourism"]),
                description,
                initials_image(business),
                rating,
                random.choice(["Usually responds in 15 mins", "Usually responds in 30 mins", "Within 1 hour"]),
                datetime.now() - timedelta(days=random.randint(60, 220)),
            ),
        )
        vendor_id = cur.fetchone()[0]
        ids.append((vendor_id, business, email))
        credentials.append((business, email))
    return ids, credentials


def package_details(title, location, difficulty, season, category):
    included = ["Expert trip leader", "Basic first aid", "Pickup from listed points", "Meals mentioned in itinerary", "Entry coordination"]
    excluded = ["Personal expenses", "Insurance", "Anything not listed in inclusions", "Emergency evacuation charges"]
    return {
        "short": f"A professionally managed {category.lower()} experience at {location} with verified guides and practical travel support.",
        "full": (
            f"{title} is designed for travelers who want a polished Maharashtra travel experience without losing local character. "
            f"The plan covers route briefing, weather-aware scheduling, clean communication, and enough buffer for safe movement around {location}."
        ),
        "included": "\n".join(included),
        "excluded": "\n".join(excluded),
        "highlights": [
            f"{difficulty} grade route planning",
            f"Best season: {season}",
            "Verified local guide and support team",
            "Clear pickup communication before departure",
        ],
        "pickup_points": ["Shivajinagar Pune", "Dadar Mumbai", "Thane Teen Hath Naka", "Lonavala Station"],
        "weather": {"best_season": season, "temperature_range": "16-29 C", "advice": "Check final weather advisory one day before departure."},
        "faq": [
            {"question": "Is this suitable for first-time travelers?", "answer": f"This package is rated {difficulty}. The vendor shares fitness guidance before travel."},
            {"question": "Are meals included?", "answer": "Meals mentioned in the itinerary are included; extra snacks are self-paid."},
        ],
        "nearby": ["Local viewpoint", "Traditional Maharashtrian food stop", "Seasonal waterfall point", "Historic trail section"],
        "safety": ["Carry valid ID proof", "Use shoes with reliable grip", "Carry personal medication", "Follow guide instructions during weather changes"],
        "transport": {"primary": "Tempo traveller or private bus", "notes": "Exact vehicle and reporting time are shared after confirmation."},
    }


def seed_packages(cur, vendor_ids):
    ids = []
    for index, item in enumerate(PACKAGES, start=1):
        title, location, duration, price, difficulty, category, season, altitude, distance = item
        vendor_id = vendor_ids[(index - 1) % len(vendor_ids)][0]
        slug = slugify(title)
        image = package_image(title)
        gallery = [image, package_image(random.choice(PACKAGES)[0]), package_image(random.choice(PACKAGES)[0])]
        details = package_details(title, location, difficulty, season, category)
        days = 3 if "3D" in duration else 2 if "2D" in duration else 1
        itinerary = [
            {"day": day, "title": f"Day {day} - {title}", "activities": [
                "Pickup and trip briefing" if day == 1 else "Local exploration and guided experience",
                "Meals as per plan",
                "Safety check and progress update",
                "Return coordination" if day == days else "Evening check-in",
            ]}
            for day in range(1, days + 1)
        ]
        cur.execute(
            """
            INSERT INTO packages (
                vendor_id, title, slug, location, region, duration, price,
                seasonal_price, description, short_description, full_description,
                image, featured_image, gallery, services, hotel_details,
                transport_details, itinerary, category, difficulty, group_size,
                best_season, altitude, trek_distance, included, excluded,
                highlights, weather_details, faq, nearby_attractions,
                safety_notes, transport_info, map_url, pickup_points,
                fitness_required, travel_type, status, featured, rating,
                total_reviews, created_at, updated_at
            )
            VALUES (%s,%s,%s,%s,'Maharashtra',%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,'active',%s,%s,%s,%s,NOW())
            RETURNING id
            """,
            (
                vendor_id, title, slug, location, duration, price, round(price * 1.15, 2),
                details["full"], details["short"], details["full"], image, image, Json(gallery),
                "Guide, meals, route support, transport coordination",
                "Partner stays or tents included for overnight packages",
                "Shared AC/non-AC vehicle based on batch size",
                Json(itinerary), category, difficulty, random.choice(["18", "22", "25", "30"]),
                season, altitude, distance, details["included"], details["excluded"],
                Json(details["highlights"]), Json(details["weather"]), Json(details["faq"]),
                Json(details["nearby"]), Json(details["safety"]), Json(details["transport"]),
                map_url(location), Json(details["pickup_points"]),
                f"{difficulty} fitness level recommended", category, index <= 12,
                round(random.uniform(4.3, 4.9), 1), random.randint(18, 145),
                datetime.now() - timedelta(days=random.randint(10, 150)),
            ),
        )
        package_id = cur.fetchone()[0]
        ids.append((package_id, title, location, price, image, vendor_id, duration))
        cur.execute(
            """
            INSERT INTO vendor_packages (
                vendor_id, title, destination, pricing, itinerary,
                package_images, availability, status, is_deleted, created_at, updated_at
            )
            VALUES (%s,%s,%s,%s,%s,%s,%s,'active',FALSE,NOW(),NOW())
            """,
            (vendor_id, title, location, price, details["full"], Json(gallery), Json({"season": season, "departures": "3-5 upcoming batches"})),
        )
        for sort_order, path in enumerate(gallery):
            cur.execute(
                """
                INSERT INTO package_images (package_id, image_path, alt_text, sort_order, is_featured)
                VALUES (%s,%s,%s,%s,%s)
                """,
                (package_id, path, f"{title} image {sort_order + 1}", sort_order, sort_order == 0),
            )
    return ids


def seed_batches(cur, packages):
    ids = []
    offsets = [34, 39, 46, 53, 60]
    guides = ["Aditya Pawar", "Meera Kulkarni", "Rohan Shinde", "Prasad Kale", "Rutuja Deshpande"]
    for index, (package_id, title, _location, _price, _image, _vendor_id, duration) in enumerate(packages):
        batch_count = random.choice([3, 4, 5])
        for offset in offsets[:batch_count]:
            start = date.today() + timedelta(days=offset + (index % 5))
            end = start + timedelta(days=2 if "3D" in duration else 1 if "2D" in duration or "1N" in duration or "Night" in duration else 0)
            max_seats = random.choice([18, 22, 25, 30])
            booked = random.randint(3, max_seats - 6)
            cur.execute(
                """
                INSERT INTO trip_batches (
                    package_id, start_date, end_date, booking_deadline,
                    max_seats, booked_seats, pickup_location, guide_name,
                    batch_status, created_at, updated_at
                )
                VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,NOW(),NOW())
                RETURNING id
                """,
                (
                    package_id, start, end, start - timedelta(days=3), max_seats,
                    booked, random.choice(["Shivajinagar Pune", "Dadar Mumbai", "Thane", "Nashik CBS"]),
                    random.choice(guides), random.choice(["open", "open", "open", "closed"]),
                ),
            )
            ids.append((cur.fetchone()[0], package_id, start, end, max_seats, booked))
    return ids


def seed_bookings(cur, customers, packages, batches):
    bookings = []
    status_plan = ["paid"] * 78 + ["completed"] * 26 + ["pending"] * 20 + ["cancelled"] * 6
    random.shuffle(status_plan)
    batch_by_package = {}
    for batch in batches:
        batch_by_package.setdefault(batch[1], []).append(batch)
    requests = ["Vegetarian meals preferred", "Need pickup confirmation", "Window seat if possible", "First trek, please assign beginner-friendly guide", ""]
    for index, status in enumerate(status_plan, start=1):
        user_id, name, email, _city = random.choice(customers)
        package = random.choice(packages)
        package_id, title, location, price, image, _vendor_id, duration = package
        batch = random.choice(batch_by_package.get(package_id) or batches)
        travelers = random.randint(1, 5)
        amount = int(price) * travelers
        booking_ref = f"TG-BOOK-{index:05d}"
        payment_status = "paid" if status in ("paid", "completed") else "pending" if status == "pending" else "cancelled"
        created_at = datetime.now() - timedelta(days=random.randint(1, 120))
        cur.execute(
            """
            INSERT INTO bookings (
                user_id, package_id, trip_batch_id, booking_id, destination,
                name, email, phone, budget, total_amount, days, persons,
                status, payment_status, package_title, package_image,
                travel_date, travelers, special_request, internal_notes,
                assigned_agent, adjusted_price, departure_date, return_date,
                notes, booking_date, created_at, updated_at
            )
            VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,NOW())
            """,
            (
                user_id, package_id, batch[0], booking_ref, location, name, email,
                f"9{random.randint(100000000, 999999999)}", amount, amount,
                3 if "3D" in duration else 2 if "2D" in duration else 1,
                travelers, status, payment_status, title, image, batch[2],
                travelers, random.choice(requests),
                "Marketplace booking", random.choice(["Anjali Support", "TravelGenie Desk", "TravelGenie Support"]),
                amount, batch[2], batch[3], "Confirmed through TravelGenie marketplace", created_at, created_at,
            ),
        )
        bookings.append((booking_ref, amount, payment_status, status, user_id, package_id))
    return bookings


def seed_payments(cur, bookings):
    failure_reasons = ["Bank authentication failed", "Customer abandoned checkout", "Card limit exceeded"]
    for index, (booking_ref, amount, payment_status, status, user_id, package_id) in enumerate(bookings, start=1):
        pay_status = "successful" if payment_status == "paid" else "pending" if payment_status == "pending" else "failed"
        cur.execute(
            """
            INSERT INTO payment_transactions (
                booking_id, razorpay_order_id, razorpay_payment_id, amount,
                currency, status, failure_reason, metadata, created_at
            )
            VALUES (%s,%s,%s,%s,'INR',%s,%s,%s,%s)
            """,
            (
                booking_ref, f"order_TG{index:06d}",
                f"pay_TG{index:06d}" if pay_status == "successful" else None,
                amount, pay_status, random.choice(failure_reasons) if pay_status == "failed" else None,
                Json({"seed": SEED_TAG, "user_id": user_id, "package_id": package_id}),
                datetime.now() - timedelta(days=random.randint(1, 120)),
            ),
        )


def seed_reviews(cur, customers, packages):
    comments = [
        "Excellent trek management and professional guides.",
        "Well organized trip with comfortable camping.",
        "Amazing sunrise experience at Kalsubai.",
        "Pickup coordination was clear and the guide handled the group well.",
        "Good value for a weekend plan with clean communication.",
        "The itinerary was practical and the local food stop was memorable.",
        "Slight delay at pickup, but the overall experience was worth it.",
        "Safe, scenic, and well paced for our group.",
        "The vendor team was responsive before and during the trip.",
        "Great choice for first-time Maharashtra travelers.",
    ]
    for package_id, _title, _location, _price, _image, vendor_id, _duration in packages:
        for _ in range(random.choice([3, 4, 5])):
            user_id = random.choice(customers)[0]
            rating = random.choice([5, 5, 5, 4, 4, 3])
            cur.execute(
                """
                INSERT INTO reviews (
                    user_id, package_id, vendor_id, rating, review_text,
                    image_url, moderation_status, is_featured, is_deleted,
                    created_at, updated_at
                )
                VALUES (%s,%s,%s,%s,%s,%s,'approved',%s,FALSE,%s,NOW())
                """,
                (user_id, package_id, vendor_id, rating, random.choice(comments), SEED_TAG, rating >= 5, datetime.now() - timedelta(days=random.randint(1, 110))),
            )


def rich_itinerary(destination):
    return [
        {
            "day": 1,
            "title": f"Arrival and {destination} orientation",
            "activities": ["Check into recommended stay", "Visit primary viewpoint or attraction", "Dinner at a local restaurant"],
            "hotels": ["Hotel Sai Palace", "MTDC Approved Stay"],
            "restaurants": ["Local Maharashtrian Thali House", "Cafe Trailside"],
            "weather": {"summary": "Pleasant with possible evening showers", "temperature": "18-27 C"},
            "maps": {"search": map_url(destination)},
        },
        {
            "day": 2,
            "title": "Guided local experience",
            "activities": ["Breakfast", "Guided trek or sightseeing", "Shopping or sunset point", "Return planning"],
            "attractions": ["Fort viewpoint", "Waterfall trail", "Local market"],
        },
    ]


def seed_saved_trips(cur, customers):
    saved_trip_names = [
        ("Rajgad Adventure Weekend", "Rajgad", 6500),
        ("Konkan Family Escape", "Dapoli", 18000),
        ("Nashik Vineyard Tour", "Nashik", 14000),
        ("Kalsubai Sunrise Expedition", "Kalsubai", 4500),
        ("Pawna Lakeside Camping Plan", "Pawna", 8000),
        ("Mahabaleshwar Couple Retreat", "Mahabaleshwar", 22000),
    ]
    for user_id, _name, _email, _city in customers[:30]:
        for trip_name, destination, budget in random.sample(saved_trip_names, 2):
            itinerary = rich_itinerary(destination)
            metadata = {
                "seed": SEED_TAG,
                "title": trip_name,
                "hotels": ["Hotel Sai Palace", "MTDC Approved Stay", "Green Valley Homestay"],
                "restaurants": ["Local Maharashtrian Thali House", "Cafe Trailside", "Family Garden Restaurant"],
                "weather": {"summary": "Travel-friendly with seasonal checks recommended"},
                "attractions": ["Fort viewpoint", "Waterfall trail", "Local market"],
                "maps": {"search": map_url(destination)},
            }
            cur.execute(
                """
                INSERT INTO trips (
                    user_id, title, destination, start_date, end_date,
                    travelers, budget, days, preferences, cost, sentiment,
                    itinerary, status, metadata, is_deleted, created_at, updated_at
                )
                VALUES (%s,%s,%s,%s,%s,%s,%s,2,%s,%s,'Positive',%s,'planned',%s,FALSE,%s,NOW())
                RETURNING id
                """,
                (
                    user_id, trip_name, destination, date.today() + timedelta(days=random.randint(20, 80)),
                    date.today() + timedelta(days=random.randint(82, 120)), random.randint(1, 4),
                    budget, "hotels, restaurants, weather, attractions, maps", budget,
                    Json(itinerary), Json(metadata), datetime.now() - timedelta(days=random.randint(1, 45)),
                ),
            )
            trip_id = cur.fetchone()[0]
            cur.execute(
                """
                INSERT INTO saved_itineraries (
                    user_id, trip_id, destination, budget, days, preferences,
                    itinerary, metadata, created_at, updated_at
                )
                VALUES (%s,%s,%s,%s,2,%s,%s,%s,NOW(),NOW())
                """,
                (user_id, trip_id, destination, budget, "hotels, restaurants, weather, attractions, maps", Json(itinerary), Json(metadata)),
            )


def seed_notifications(cur, customers, vendors, bookings):
    customer_messages = [
        ("Booking Confirmed", "Your upcoming Maharashtra trip booking is confirmed.", "booking_confirmed"),
        ("Payment Successful", "Your payment has been recorded successfully.", "payment_success"),
        ("Review Published", "Your review is live on TravelGenie.", "review_published"),
        ("Trip Saved", "Your AI planner trip has been saved.", "trip_saved"),
    ]
    vendor_messages = [
        ("Vendor Approved", "Your vendor profile is approved and visible to customers.", "vendor_approved"),
        ("New Booking Received", "A customer booked one of your Maharashtra packages.", "booking_received"),
        ("Package Performance", "Your package received new views and bookings this week.", "analytics_update"),
    ]
    for user_id, _name, _email, _city in customers:
        for title, message, kind in random.sample(customer_messages, 3):
            cur.execute(
                """
                INSERT INTO notifications (user_id, title, message, audience, type, metadata, is_read, created_at)
                VALUES (%s,%s,%s,'customer',%s,%s,%s,%s)
                """,
                (user_id, title, message, kind, Json({"seed": SEED_TAG}), random.choice([False, False, True]), datetime.now() - timedelta(days=random.randint(0, 30))),
            )
    for vendor_id, business, email in vendors:
        cur.execute("SELECT user_id FROM vendors WHERE vendor_id = %s", (vendor_id,))
        user_id = cur.fetchone()[0]
        for title, message, kind in vendor_messages:
            cur.execute(
                """
                INSERT INTO notifications (user_id, title, message, audience, type, metadata, is_read, created_at)
                VALUES (%s,%s,%s,'vendor',%s,%s,%s,%s)
                """,
                (user_id, title, f"{message} ({business})", kind, Json({"seed": SEED_TAG, "vendor_email": email}), random.choice([False, True]), datetime.now() - timedelta(days=random.randint(0, 25))),
            )
    for booking_ref, _amount, _payment, _status, user_id, _package_id in bookings[:40]:
        cur.execute(
            """
            INSERT INTO notifications (user_id, title, message, audience, type, metadata, is_read, created_at)
            VALUES (%s,'Booking Update',%s,'customer','booking_update',%s,FALSE,NOW())
            """,
            (user_id, f"Booking {booking_ref} has an updated travel status.", Json({"seed": SEED_TAG, "booking_id": booking_ref})),
        )


def seed_ai_history(cur, customers):
    prompts = [
        "Plan a Rajgad adventure weekend from Pune",
        "Create a Konkan family escape with hotels and restaurants",
        "Suggest a Nashik vineyard tour for two days",
        "Prepare a Kalsubai sunrise expedition packing list",
        "Find a Pawna camping plan with budget and weather",
    ]
    for user_id, _name, _email, _city in customers[:25]:
        for prompt in random.sample(prompts, 3):
            response = (
                f"TravelGenie recommends a Maharashtra itinerary for: {prompt}. "
                "The plan includes budget, hotels, restaurants, weather, attractions, maps, and local safety notes."
            )
            cur.execute(
                """
                INSERT INTO ai_chat_history (
                    user_id, role, prompt, response, content, metadata, created_at
                )
                VALUES (%s,'assistant',%s,%s,%s,%s,%s)
                """,
                (user_id, prompt, response, f"Prompt: {prompt}\n\nResponse: {response}", Json({"seed": SEED_TAG}), datetime.now() - timedelta(days=random.randint(1, 35))),
            )


def seed_activity(cur, bookings):
    actions = ["booking_created", "payment_successful", "vendor_approved", "package_published", "review_published", "trip_saved"]
    for index in range(80):
        cur.execute(
            """
            INSERT INTO activity_logs (actor, actor_role, action, entity_type, entity_id, metadata, created_at)
            VALUES (%s,%s,%s,%s,%s,%s,%s)
            """,
            (
                "travelgenie-seed", "admin", random.choice(actions),
                random.choice(["booking", "payment", "vendor", "package", "review", "saved_trip"]),
                bookings[index % len(bookings)][0] if bookings else str(index + 1),
                Json({"seed": SEED_TAG}),
                datetime.now() - timedelta(days=random.randint(0, 90)),
            ),
        )


def write_credentials(vendor_credentials, customer_credentials, summary):
    docs_dir = BACKEND_DIR.parent / "docs"
    docs_dir.mkdir(exist_ok=True)
    lines = [
        "# TravelGenie Marketplace Login Credentials",
        "",
        "All marketplace accounts use password: `Pass@123`",
        "",
        "## Admin",
        "",
        "| Role | Email / Username | Password |",
        "| --- | --- | --- |",
        "| Admin | admin@travelgenie.com | Pass@123 |",
        "",
        "## Vendor Accounts",
        "",
        "| Vendor | Email | Password |",
        "| --- | --- | --- |",
    ]
    lines.extend([f"| {name} | {email} | Pass@123 |" for name, email in vendor_credentials])
    lines.extend([
        "",
        "## Customer Accounts",
        "",
        "| Customer | Email | Password |",
        "| --- | --- | --- |",
    ])
    lines.extend([f"| {name} | {email} | Pass@123 |" for name, email in customer_credentials])
    lines.extend([
        "",
        "## Seed Summary",
        "",
    ])
    lines.extend([f"- {key}: {value}" for key, value in summary.items()])
    (docs_dir / "PRESENTATION_LOGIN_CREDENTIALS.md").write_text("\n".join(lines) + "\n", encoding="utf-8")


def main():
    conn = connect()
    try:
        cur = conn.cursor()
        print("Cleaning smoke, QA, test, and previous presentation records...")
        cleanup(cur)
        print("Creating admin, customers, vendors, packages, batches, bookings, payments, reviews, saved trips, and notifications...")
        seed_admin(cur)
        customers, customer_credentials = seed_customers(cur)
        vendors, vendor_credentials = seed_vendors(cur)
        packages = seed_packages(cur, vendors)
        batches = seed_batches(cur, packages)
        bookings = seed_bookings(cur, customers, packages, batches)
        seed_payments(cur, bookings)
        seed_reviews(cur, customers, packages)
        seed_saved_trips(cur, customers)
        seed_notifications(cur, customers, vendors, bookings)
        seed_ai_history(cur, customers)
        seed_activity(cur, bookings)
        conn.commit()

        summary = {
            "Users created": len(customers) + len(vendors) + 1,
            "Vendors created": len(vendors),
            "Packages created": len(packages),
            "Batches created": len(batches),
            "Bookings created": len(bookings),
            "Payments created": len(bookings),
            "Reviews created": "3-5 per package",
            "Saved Trips created": 60,
            "Customer notifications created": "120+",
            "Vendor notifications created": len(vendors) * 3,
        }
        write_credentials(vendor_credentials, customer_credentials, summary)
        print(json.dumps(summary, indent=2))
        print("Credentials written to docs/PRESENTATION_LOGIN_CREDENTIALS.md")
    except Exception:
        conn.rollback()
        raise
    finally:
        conn.close()


if __name__ == "__main__":
    main()
