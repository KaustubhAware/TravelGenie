import os
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


def get_seed_connection():
    if settings.DATABASE_URL:
        return psycopg2.connect(settings.DATABASE_URL)
    return psycopg2.connect(
        host=settings.DB_HOST,
        database=settings.DB_NAME,
        user=settings.DB_USER,
        password=settings.DB_PASSWORD,
        port=settings.DB_PORT,
    )


def apply_schema(conn):
    cursor = conn.cursor()
    schema_path = BACKEND_DIR / "schema.sql"
    cursor.execute(schema_path.read_text(encoding="utf-8"))
    for migration in sorted((BACKEND_DIR / "migrations").glob("*.sql")):
        cursor.execute(migration.read_text(encoding="utf-8"))
    conn.commit()
    cursor.close()


def truncate_all(conn):
    cursor = conn.cursor()
    cursor.execute(
        """
        TRUNCATE TABLE
            activity_logs,
            analytics_events,
            booking_notes,
            invoices,
            notifications,
            ai_chat_history,
            saved_itineraries,
            payment_transactions,
            reviews,
            bookings,
            trips,
            trip_batches,
            package_images,
            vendor_packages,
            packages,
            vendors,
            agents,
            admins,
            users
        RESTART IDENTITY CASCADE
        """
    )
    conn.commit()
    cursor.close()


USERS = [
    ("admin@travelgenie.com", "TravelGenie Admin", "admin", "Pune"),
    ("ananya.patil@example.com", "Ananya Patil", "customer", "Pune"),
    ("rohan.kulkarni@example.com", "Rohan Kulkarni", "customer", "Mumbai"),
    ("mira.deshmukh@example.com", "Mira Deshmukh", "customer", "Nashik"),
    ("sahil.shah@example.com", "Sahil Shah", "customer", "Thane"),
    ("priya.more@example.com", "Priya More", "customer", "Nagpur"),
    ("omkar.joshi@example.com", "Omkar Joshi", "customer", "Pune"),
    ("isha.naik@example.com", "Isha Naik", "customer", "Mumbai"),
    ("neel.sawant@example.com", "Neel Sawant", "customer", "Kolhapur"),
    ("tara.bendre@example.com", "Tara Bendre", "customer", "Aurangabad"),
    ("advait.kale@example.com", "Advait Kale", "customer", "Satara"),
]

VENDORS = [
    ("Sahyadri Trekkers Collective", "Aditya Pawar", "Premium fort treks and monsoon trails across the Sahyadri belt.", "Pune", 4.8),
    ("Monsoon Mavericks Outdoors", "Rohit Shinde", "Weekend monsoon specialists for waterfalls, forest walks, and camping.", "Mumbai", 4.7),
    ("Western Ghats Adventure Co", "Sanket Jadhav", "Safety-first trekking, camping, and corporate outdoor experiences.", "Nashik", 4.9),
    ("Konkan Trails Studio", "Aman Patil", "Coastal camps, beach weekends, and Konkan food trails.", "Alibaug", 4.6),
    ("Maval Fort Guides", "Nikhil More", "Local-guided fort treks from Pune, Lonavala, and Karjat.", "Lonavala", 4.7),
]

PACKAGES = [
    ("Rajmachi Monsoon Trek", "Lonavala, Maharashtra", "2D/1N", 2499, "Moderate", "2710 ft", "Monsoon Trek", "Jun-Sep"),
    ("Kalsubai Sunrise Trek", "Igatpuri, Maharashtra", "1D", 1999, "Hard", "5400 ft", "Peak Trek", "Oct-Feb"),
    ("Harishchandragad Trek", "Ahmednagar, Maharashtra", "2D/1N", 3299, "Hard", "4670 ft", "Fort Trek", "Jul-Feb"),
    ("Lohagad Fort Trek", "Lonavala, Maharashtra", "1D", 1499, "Easy", "3389 ft", "Beginner Trek", "Jun-Feb"),
    ("Visapur Fort Trek", "Malavli, Maharashtra", "1D", 1599, "Moderate", "3556 ft", "Fort Trek", "Jun-Feb"),
    ("Tikona Fort Trek", "Pawna, Maharashtra", "1D", 1399, "Easy", "3500 ft", "Beginner Trek", "Oct-Feb"),
    ("Pawna Lake Camping", "Pawna, Maharashtra", "1N", 1999, "Easy", "2100 ft", "Camping", "Oct-Mar"),
    ("Bhandardara Lakeside Camping", "Bhandardara, Maharashtra", "2D/1N", 2799, "Easy", "2470 ft", "Camping", "Oct-Mar"),
    ("Andharban Forest Trek", "Tamhini Ghat, Maharashtra", "1D", 2199, "Moderate", "2160 ft", "Forest Trek", "Jun-Sep"),
    ("Torna Fort Trek", "Velhe, Maharashtra", "1D", 1799, "Hard", "4603 ft", "Fort Trek", "Oct-Feb"),
    ("Sinhagad Night Trek", "Pune, Maharashtra", "1N", 1299, "Easy", "4320 ft", "Night Trek", "Nov-Feb"),
    ("Alibaug Beach Camping", "Alibaug, Maharashtra", "1N", 2499, "Easy", "Sea level", "Beach Camping", "Oct-Mar"),
    ("Konkan Coastal Trip", "Dapoli, Maharashtra", "3D/2N", 6999, "Easy", "Sea level", "Coastal Trip", "Nov-Feb"),
    ("Fireflies Festival Trek", "Bhandardara, Maharashtra", "1N", 2299, "Easy", "2470 ft", "Seasonal Trek", "May-Jun"),
    ("Sahyadri Monsoon Trek", "Malshej Ghat, Maharashtra", "1D", 1899, "Moderate", "2297 ft", "Monsoon Trek", "Jun-Sep"),
]


def package_svg(slug, title, location):
    colors = {
        "rajmachi-monsoon-trek": ("#f97316", "#166534"),
        "kalsubai-sunrise-trek": ("#fb923c", "#7c2d12"),
        "alibaug-beach-camping": ("#f97316", "#0e7490"),
        "konkan-coastal-trip": ("#ea580c", "#0369a1"),
    }
    a, b = colors.get(slug, ("#f97316", "#14532d"))
    return f"""<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="760" viewBox="0 0 1200 760">
<defs><linearGradient id="sky" x1="0" x2="1" y1="0" y2="1"><stop stop-color="{a}"/><stop offset="1" stop-color="{b}"/></linearGradient></defs>
<rect width="1200" height="760" fill="url(#sky)"/>
<circle cx="940" cy="145" r="70" fill="#fff7ed" opacity=".9"/>
<path d="M0 560 L210 310 L390 525 L560 250 L790 555 L980 330 L1200 575 V760 H0 Z" fill="#1f2937" opacity=".88"/>
<path d="M0 640 C190 590 310 620 470 580 C660 532 820 585 1200 520 V760 H0 Z" fill="#0f172a" opacity=".5"/>
<text x="70" y="105" font-family="Arial, sans-serif" font-size="54" font-weight="800" fill="#fff">{title}</text>
<text x="72" y="158" font-family="Arial, sans-serif" font-size="28" fill="#ffedd5">{location}</text>
<text x="72" y="700" font-family="Arial, sans-serif" font-size="24" fill="#fff7ed">TravelGenie Maharashtra Trek Collection</text>
</svg>"""


def ensure_package_images():
    upload_dir = Path(settings.UPLOAD_DIR) / "packages"
    upload_dir.mkdir(parents=True, exist_ok=True)
    image_paths = {}
    for title, location, *_ in PACKAGES:
        slug = slugify(title)
        paths = []
        for index in range(1, 4):
            filename = f"{slug}-{index}.svg"
            path = upload_dir / filename
            path.write_text(package_svg(slug, title, location), encoding="utf-8")
            paths.append(f"/uploads/packages/{filename}")
        image_paths[slug] = paths
    return image_paths


def seed_users(conn):
    cursor = conn.cursor()
    user_ids = {}
    for idx, (email, name, role, city) in enumerate(USERS, start=1):
        cursor.execute(
            """
            INSERT INTO users (
                email, password_hash, name, full_name, phone, city, country,
                preferences, travel_preferences, favorite_destinations,
                profile_image, profile_completed, role, is_deleted,
                created_at, updated_at
            )
            VALUES (%s,%s,%s,%s,%s,%s,'India',%s,%s,%s,%s,TRUE,%s,FALSE,NOW(),NOW())
            RETURNING id
            """,
            (
                email,
                hash_password("Admin123" if role == "admin" else "Demo123"),
                name,
                name,
                f"9{idx:09d}",
                city,
                "Trekking, camping, forts, local food",
                Json(["fort treks", "camping", "monsoon trails"]),
                "Rajmachi, Kalsubai, Pawna",
                f"https://api.dicebear.com/8.x/initials/svg?seed={name.replace(' ', '%20')}",
                role,
            ),
        )
        user_ids[email] = cursor.fetchone()[0]

    cursor.execute(
        """
        INSERT INTO admins (username, password_hash, full_name)
        VALUES (%s,%s,%s)
        """,
        (settings.ADMIN_USERNAME, hash_password(settings.ADMIN_PASSWORD), "TravelGenie Administrator"),
    )
    conn.commit()
    cursor.close()
    return user_ids


def seed_vendors(conn, user_ids=None):
    cursor = conn.cursor()
    vendor_ids = []
    vendor_user_emails = []
    for idx, (business, owner, description, city, rating) in enumerate(VENDORS, start=1):
        email = f"vendor{idx}@travelgenie.in"
        cursor.execute(
            """
            INSERT INTO users (
                email, password_hash, name, full_name, phone, city, country,
                profile_completed, role, is_deleted, created_at, updated_at
            )
            VALUES (%s,%s,%s,%s,%s,%s,'India',TRUE,'vendor',FALSE,NOW(),NOW())
            RETURNING id
            """,
            (email, hash_password("Vendor123"), owner, owner, f"8{idx:09d}", city),
        )
        vendor_user_id = cursor.fetchone()[0]
        vendor_user_emails.append(email)
        cursor.execute(
            """
            INSERT INTO vendors (
                user_id, business_name, owner_name, contact_email, phone,
                description, verification_status, logo, rating, response_time,
                verified_badge, is_active, is_deleted, created_at, updated_at
            )
            VALUES (%s,%s,%s,%s,%s,%s,'approved',%s,%s,'Usually responds in 20 mins',TRUE,TRUE,FALSE,NOW(),NOW())
            RETURNING vendor_id
            """,
            (
                vendor_user_id,
                business,
                owner,
                email,
                f"9876543{idx:03d}",
                description,
                f"https://api.dicebear.com/8.x/initials/svg?seed={slugify(business)}",
                rating,
            ),
        )
        vendor_ids.append(cursor.fetchone()[0])
    conn.commit()
    cursor.close()
    return vendor_ids, vendor_user_emails


def _package_details(title, location, difficulty, season):
    return {
        "short": f"{title} with verified guides, planned pickup points, and practical Maharashtra travel support.",
        "full": (
            f"{title} is curated for travelers who want a dependable Maharashtra outdoor experience around {location}. "
            "The plan balances trail time, local food stops, safety checks, and enough buffer for weather changes."
        ),
        "highlights": [
            f"{difficulty} trail profile with guided pacing",
            f"Best suited for {season}",
            "Verified trek lead with first-aid support",
            "Curated Pune/Mumbai pickup options",
        ],
        "included": ["Travel from selected pickup point", "Trek guide", "Basic meals", "First-aid support", "Entry coordination"],
        "excluded": ["Personal expenses", "Insurance", "Anything not listed in inclusions", "Emergency evacuation charges"],
        "pickup": ["Shivajinagar Pune", "Dadar Mumbai", "Thane Teen Hath Naka", "Lonavala station when applicable"],
        "nearby": ["Base village viewpoint", "Local Maharashtrian food stop", "Seasonal waterfall belt", "Historic fort trail section"],
        "safety": ["Wear shoes with strong grip", "Carry 2 litres of water", "Avoid cotton clothing during monsoon", "Inform the guide about medical issues"],
        "weather": {
            "best_season": season,
            "temperature_range": "16-29 C",
            "advice": "Expect slippery patches in monsoon and cold winds on early morning summit sections.",
        },
        "transport": {
            "primary": "Tempo traveller or private bus from pickup points",
            "nearest_railway": "Shared after booking confirmation",
            "notes": "Exact reporting time is sent one day before departure.",
        },
        "faq": [
            {"question": "Is prior trekking experience required?", "answer": f"This trek is rated {difficulty}. Basic fitness is recommended."},
            {"question": "Are meals included?", "answer": "Basic meals listed in inclusions are covered. Extra snacks are self-paid."},
            {"question": "Can dates change due to weather?", "answer": "Yes. Trek leads may adjust timing for safety during heavy rain or low visibility."},
        ],
    }


def seed_packages(conn, vendor_ids=None):
    if vendor_ids is None:
        cursor = conn.cursor()
        cursor.execute("SELECT vendor_id FROM vendors ORDER BY vendor_id")
        vendor_ids = [row[0] for row in cursor.fetchall()]
        cursor.close()
    image_paths = ensure_package_images()
    cursor = conn.cursor()
    package_ids = []
    for idx, (title, location, duration, price, difficulty, altitude, category, season) in enumerate(PACKAGES):
        vendor_id = vendor_ids[idx % len(vendor_ids)]
        slug = slugify(title)
        details = _package_details(title, location, difficulty, season)
        gallery = image_paths[slug]
        itinerary = [
            {"day": 1, "title": "Departure and trail briefing", "activities": ["Pickup from selected point", "Breakfast stop", "Trail briefing and ascent"]},
            {"day": 2, "title": "Experience and return", "activities": ["Sunrise or viewpoint session", "Local meal", "Return travel with drop-off"]},
        ] if "2" in duration or "3" in duration else [
            {"day": 1, "title": "Full day trek experience", "activities": ["Pickup", "Trail briefing", "Summit or campsite experience", "Return"]},
        ]
        cursor.execute(
            """
            INSERT INTO packages (
                vendor_id, title, slug, location, region, duration, price,
                description, short_description, full_description, featured_image,
                gallery, itinerary, category, difficulty, group_size, best_season,
                altitude, trek_distance, included, excluded, pickup_points,
                fitness_required, travel_type, status, featured,
                rating, total_reviews, highlights, weather_details, faq,
                nearby_attractions, safety_notes, transport_info, map_url,
                created_at, updated_at
            )
            VALUES (
                %s,%s,%s,%s,'Maharashtra',%s,%s,%s,%s,%s,%s,
                %s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,
                %s,'trek','active',%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,NOW(),NOW()
            )
            RETURNING id
            """,
            (
                vendor_id, title, slug, location, duration, price,
                details["full"], details["short"], details["full"], gallery[0],
                Json(gallery), Json(itinerary), category, difficulty,
                random.choice(["18", "22", "28", "32"]), season, altitude,
                random.choice(["4-6 km", "8-12 km", "12-16 km"]),
                "\n".join(details["included"]), "\n".join(details["excluded"]),
                Json(details["pickup"]), f"{difficulty} fitness level; consult the guide for medical concerns.",
                idx < 6, round(random.uniform(4.4, 4.9), 1), random.randint(42, 260),
                Json(details["highlights"]), Json(details["weather"]), Json(details["faq"]),
                Json(details["nearby"]), Json(details["safety"]), Json(details["transport"]),
                f"https://www.google.com/maps/search/?api=1&query={location.replace(' ', '+')}",
            ),
        )
        package_id = cursor.fetchone()[0]
        package_ids.append(package_id)
        cursor.execute(
            """
            INSERT INTO vendor_packages (
                vendor_id, title, destination, pricing, itinerary,
                package_images, availability, status, is_deleted,
                created_at, updated_at
            )
            VALUES (%s,%s,%s,%s,%s,%s,%s,'active',FALSE,NOW(),NOW())
            """,
            (
                vendor_id,
                title,
                location,
                price,
                details["full"],
                Json(gallery),
                Json({"batches": "Weekly weekend departures", "season": season}),
            ),
        )
        for order, path in enumerate(gallery):
            cursor.execute(
                """
                INSERT INTO package_images (package_id, image_path, alt_text, sort_order, is_featured)
                VALUES (%s,%s,%s,%s,%s)
                """,
                (package_id, path, f"{title} gallery image {order + 1}", order, order == 0),
            )
    conn.commit()
    cursor.close()
    return package_ids


def seed_trip_batches(conn, package_ids=None):
    cursor = conn.cursor()
    if package_ids is None:
        cursor.execute("SELECT id FROM packages ORDER BY id")
        package_ids = [row[0] for row in cursor.fetchall()]
    guides = ["Aditya Pawar", "Rohit Shinde", "Mira Trek Lead", "Sanket Jadhav", "Nikhil More"]
    for package_id in package_ids:
        for offset in (9, 18, 32, 49):
            start = date.today() + timedelta(days=offset + random.randint(0, 4))
            end = start + timedelta(days=random.choice([0, 1, 1, 2]))
            max_seats = random.choice([18, 22, 25, 30])
            cursor.execute(
                """
                INSERT INTO trip_batches (
                    package_id, start_date, end_date, booking_deadline,
                    max_seats, booked_seats, pickup_location, guide_name,
                    batch_status, created_at, updated_at
                )
                VALUES (%s,%s,%s,%s,%s,%s,%s,%s,'open',NOW(),NOW())
                """,
                (
                    package_id, start, end, start - timedelta(days=2),
                    max_seats, random.randint(3, max_seats - 4),
                    random.choice(["Shivajinagar Pune", "Dadar Mumbai", "Thane", "Lonavala Station"]),
                    random.choice(guides),
                ),
            )
    conn.commit()
    cursor.close()


def seed_bookings(conn):
    cursor = conn.cursor()
    cursor.execute("SELECT id, email, full_name FROM users WHERE role = 'customer' ORDER BY id")
    users = cursor.fetchall()
    cursor.execute("SELECT id, title, location, featured_image, price FROM packages ORDER BY id")
    packages = cursor.fetchall()
    statuses = [("paid", "paid"), ("completed", "paid"), ("pending", "unpaid"), ("payment_pending", "pending"), ("cancelled", "cancelled")]
    booking_ids = []
    for idx in range(48):
        user_id, email, name = random.choice(users)
        package_id, title, location, image, price = random.choice(packages)
        status, payment_status = random.choice(statuses)
        travelers = random.randint(1, 5)
        total = float(price) * travelers
        booking_ref = f"TG-BOOK-{202600 + idx}"
        cursor.execute(
            """
            INSERT INTO bookings (
                user_id, package_id, booking_id, destination, name, email,
                phone, budget, total_amount, days, persons, status,
                payment_status, package_title, package_image, travel_date,
                travelers, special_request, booking_date, created_at, updated_at
            )
            VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)
            """,
            (
                user_id, package_id, booking_ref, location, name, email,
                f"9{random.randint(100000000, 999999999)}", total, total,
                random.choice([1, 2, 3]), travelers, status, payment_status,
                title, image, date.today() + timedelta(days=random.randint(5, 90)),
                travelers, random.choice(["Vegetarian meals preferred", "Window seat if possible", "", "Need pickup confirmation"]),
                datetime.now() - timedelta(days=random.randint(1, 70)),
                datetime.now() - timedelta(days=random.randint(1, 70)),
                datetime.now(),
            ),
        )
        booking_ids.append((booking_ref, total, payment_status))
    conn.commit()
    cursor.close()
    return booking_ids


def seed_payments(conn, booking_ids=None):
    cursor = conn.cursor()
    if booking_ids is None:
        cursor.execute("SELECT booking_id, COALESCE(total_amount, budget), payment_status FROM bookings")
        booking_ids = cursor.fetchall()
    for idx, (booking_ref, amount, payment_status) in enumerate(booking_ids, start=1):
        if payment_status == "unpaid":
            continue
        status = "paid" if payment_status == "paid" else ("failed" if payment_status == "cancelled" else "created")
        cursor.execute(
            """
            INSERT INTO payment_transactions (
                booking_id, razorpay_order_id, razorpay_payment_id,
                amount, currency, status, failure_reason, created_at
            )
            VALUES (%s,%s,%s,%s,'INR',%s,%s,NOW())
            """,
            (
                booking_ref,
                f"order_TG{idx:06d}",
                f"pay_TG{idx:06d}" if status == "paid" else None,
                amount,
                status,
                "Customer payment failed or booking cancelled" if status == "failed" else None,
            ),
        )
    conn.commit()
    cursor.close()


def seed_reviews(conn):
    cursor = conn.cursor()
    cursor.execute("SELECT id FROM users WHERE role = 'customer'")
    users = [row[0] for row in cursor.fetchall()]
    cursor.execute("SELECT id, vendor_id FROM packages")
    packages = cursor.fetchall()
    comments = [
        "Well organized trek with clear pickup communication and good safety checks.",
        "The guide knew the trail well and handled the rain conditions professionally.",
        "Great value for a weekend plan. Food and transport were better than expected.",
        "Beautiful views and a smooth booking experience through TravelGenie.",
        "Would recommend for anyone planning a Maharashtra outdoor trip.",
    ]
    for package_id, vendor_id in packages:
        for _ in range(5):
            cursor.execute(
                """
                INSERT INTO reviews (
                    user_id, package_id, vendor_id, rating, review_text,
                    moderation_status, is_featured, is_deleted, created_at, updated_at
                )
                VALUES (%s,%s,%s,%s,%s,'approved',%s,FALSE,NOW(),NOW())
                """,
                (random.choice(users), package_id, vendor_id, random.randint(4, 5), random.choice(comments), random.choice([True, False])),
            )
    conn.commit()
    cursor.close()


def seed_notifications(conn):
    cursor = conn.cursor()
    cursor.execute("SELECT id FROM users WHERE role IN ('customer','vendor')")
    users = [row[0] for row in cursor.fetchall()]
    messages = [
        ("Booking confirmed", "Your upcoming trek booking has been confirmed."),
        ("Payment update", "Your Razorpay payment status has been updated."),
        ("AI itinerary ready", "Your Maharashtra travel plan is ready in the AI planner."),
        ("Upcoming trek reminder", "Your trek batch starts soon. Check pickup details."),
        ("New package alert", "A new Sahyadri weekend batch is now open."),
    ]
    for user_id in users:
        for title, message in random.sample(messages, 3):
            cursor.execute(
                """
                INSERT INTO notifications (user_id, title, message, is_read, created_at)
                VALUES (%s,%s,%s,%s,NOW())
                """,
                (user_id, title, message, random.choice([False, False, True])),
            )
    conn.commit()
    cursor.close()


def seed_ai_history(conn):
    cursor = conn.cursor()
    cursor.execute("SELECT id FROM users WHERE role = 'customer'")
    users = [row[0] for row in cursor.fetchall()]
    prompts = [
        "Plan a 2 day Rajmachi monsoon trek from Pune",
        "Suggest a beginner fort trek near Mumbai",
        "Give me a Pawna camping budget plan for two people",
        "What should I pack for Kalsubai sunrise trek?",
        "Find safe Maharashtra treks for monsoon weekends",
    ]
    for user_id in users:
        for prompt in random.sample(prompts, 3):
            response = f"TravelGenie recommends a structured Maharashtra itinerary for: {prompt}. Include pickup, safety checks, meals, budget, and weather planning."
            cursor.execute(
                """
                INSERT INTO ai_chat_history (
                    user_id, role, prompt, response, content, metadata, created_at
                )
                VALUES (%s,'assistant',%s,%s,%s,%s,NOW())
                """,
                (user_id, prompt, response, f"Prompt: {prompt}\n\nResponse: {response}", Json({"source": "seed"})),
            )
        cursor.execute(
            """
            INSERT INTO trips (
                user_id, title, destination, travelers, budget, days,
                preferences, cost, sentiment, itinerary, status, metadata,
                created_at, updated_at
            )
            VALUES (%s,%s,%s,%s,%s,%s,%s,%s,'Positive',%s,'planned',%s,NOW(),NOW())
            RETURNING id, destination, budget, days, preferences, itinerary, metadata
            """,
            (
                user_id,
                "AI Weekend Trek Plan",
                random.choice(["Rajmachi", "Kalsubai", "Pawna", "Bhandardara"]),
                random.randint(1, 4),
                random.choice([3500, 5000, 7500, 12000]),
                random.choice([1, 2, 3]),
                "forts, camping, local food",
                random.choice([2999, 4999, 6999]),
                Json([
                    {
                        "day": 1,
                        "title": "Travel and trail experience",
                        "activities": ["Pickup", "Breakfast halt", "Guided trek", "Local meal"],
                    }
                ]),
                Json({"source": "seed_ai_history"}),
            ),
        )
        trip_id, destination, budget, days, preferences, itinerary, metadata = cursor.fetchone()
        cursor.execute(
            """
            INSERT INTO saved_itineraries (
                user_id, trip_id, destination, budget, days, preferences,
                itinerary, metadata, created_at, updated_at
            )
            VALUES (%s,%s,%s,%s,%s,%s,%s,%s,NOW(),NOW())
            """,
            (
                user_id,
                trip_id,
                destination,
                budget,
                days,
                preferences,
                Json(itinerary),
                Json(metadata or {"source": "seed_ai_history"}),
            ),
        )
    conn.commit()
    cursor.close()


def seed_activity(conn):
    cursor = conn.cursor()
    actions = ["booking_created", "payment_verified", "vendor_approved", "package_published", "review_approved"]
    for idx in range(45):
        cursor.execute(
            """
            INSERT INTO activity_logs (actor, actor_role, action, entity_type, entity_id, metadata, created_at)
            VALUES (%s,%s,%s,%s,%s,%s,%s)
            """,
            (
                "system",
                "admin",
                random.choice(actions),
                random.choice(["booking", "payment", "package", "vendor", "review"]),
                str(idx + 1),
                Json({"seeded": True}),
                datetime.now() - timedelta(days=random.randint(0, 45)),
            ),
        )
    conn.commit()
    cursor.close()
