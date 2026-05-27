import os
import sys
import random
import json

from datetime import (
    datetime,
    timedelta,
)

# =====================================================
# FIX PYTHON PATH
# =====================================================

CURRENT_DIR = os.path.dirname(__file__)

BACKEND_DIR = os.path.abspath(
    os.path.join(CURRENT_DIR, "..")
)

sys.path.append(BACKEND_DIR)

# =====================================================
# IMPORTS
# =====================================================

import psycopg2

from psycopg2.extras import Json

from app.config import get_settings

from app.auth.password_utils import (
    hash_password,
)

# =====================================================
# SETTINGS
# =====================================================

settings = get_settings()

# =====================================================
# DATABASE CONNECTION
# =====================================================

if settings.DATABASE_URL:

    conn = psycopg2.connect(
        settings.DATABASE_URL
    )

else:

    conn = psycopg2.connect(
        host=settings.DB_HOST,
        database=settings.DB_NAME,
        user=settings.DB_USER,
        password=settings.DB_PASSWORD,
        port=settings.DB_PORT,
    )

cursor = conn.cursor()

# =====================================================
# START
# =====================================================

print("=" * 70)
print("SEEDING TRAVELGENIE MAHARASHTRA ECOSYSTEM")
print("=" * 70)

# =====================================================
# ADMIN USER
# =====================================================

print("CREATING ADMIN USER...")

cursor.execute(
    """
    INSERT INTO users (
        email,
        password_hash,
        full_name,
        phone,
        city,
        country,
        role,
        profile_completed,
        is_deleted,
        created_at,
        updated_at
    )
    VALUES (
        %s,%s,%s,%s,%s,%s,%s,%s,%s,
        NOW(),
        NOW()
    )
    ON CONFLICT (email)
    DO NOTHING
    """,
    (
        "admin@travelgenie.com",
        hash_password("Admin123"),
        "TravelGenie Admin",
        "9999999999",
        "Pune",
        "India",
        "admin",
        True,
        False,
    ),
)

cursor.execute(
    """
    INSERT INTO admins (
        username,
        password_hash,
        full_name,
        created_at
    )
    VALUES (%s,%s,%s,NOW())
    ON CONFLICT (username)
    DO UPDATE SET password_hash = EXCLUDED.password_hash
    """,
    (
        settings.ADMIN_USERNAME,
        hash_password(settings.ADMIN_PASSWORD),
        "TravelGenie Administrator",
    ),
)

# =====================================================
# DEMO USERS
# =====================================================

print("SEEDING DEMO USERS...")

demo_user_ids = []

for idx in range(1, 11):

    cursor.execute(
        """
        INSERT INTO users (
            email,
            password_hash,
            full_name,
            phone,
            city,
            country,
            preferences,
            profile_completed,
            role,
            favorite_destinations,
            updated_at,
            is_deleted,
            created_at
        )
        VALUES (
            %s,%s,%s,%s,%s,%s,%s,%s,
            %s,%s,NOW(),%s,NOW()
        )
        RETURNING id
        """,
        (
            f"demo{idx}@travelgenie.in",
            hash_password("Demo123"),
            f"Demo User {idx}",
            f"99999999{idx:02d}",
            "Pune",
            "India",
            json.dumps({
                "trekking": True,
                "camping": True,
                "monsoon": True,
            }),
            True,
            "customer",
            json.dumps([
                "Rajmachi",
                "Kalsubai",
                "Harishchandragad",
            ]),
            False,
        ),
    )

    result = cursor.fetchone()

    if result:

        demo_user_ids.append(
            result[0]
        )

# =====================================================
# VENDORS
# =====================================================

print("SEEDING VENDORS...")

vendors = [
    {
        "name": "Sahyadri Trekkers",
        "owner_name": "Aditya Pawar",
        "description": "Premium Sahyadri trekking experiences across Maharashtra.",
        "rating": 4.8,
    },
    {
        "name": "Monsoon Mavericks",
        "owner_name": "Rohit Shinde",
        "description": "Weekend monsoon trekking specialists.",
        "rating": 4.7,
    },
    {
        "name": "Western Ghats Adventures",
        "owner_name": "Sanket Jadhav",
        "description": "Camping and trekking adventures in the Western Ghats.",
        "rating": 4.9,
    },
    {
        "name": "Konkan Trails",
        "owner_name": "Aman Patil",
        "description": "Konkan coastal camping and trekking experiences.",
        "rating": 4.6,
    },
    {
        "name": "Pune Trek Group",
        "owner_name": "Nikhil More",
        "description": "Affordable weekend treks from Pune and Mumbai.",
        "rating": 4.7,
    },
]

vendor_ids = []

for idx, vendor in enumerate(vendors):

    cursor.execute(
        """
        INSERT INTO vendors (
            user_id,
            business_name,
            owner_name,
            contact_email,
            phone,
            description,
            verification_status,
            logo,
            is_active,
            is_deleted,
            rating,
            response_time,
            verified_badge,
            created_at,
            updated_at
        )
        VALUES (
            %s,%s,%s,%s,%s,%s,%s,%s,
            %s,%s,%s,%s,%s,NOW(),NOW()
        )
        RETURNING vendor_id
        """,
        (
            None,
            vendor["name"],
            vendor["owner_name"],
            f"vendor{idx + 1}@travelgenie.in",
            f"98765432{idx + 1:02d}",
            vendor["description"],
            "approved",
            "https://images.unsplash.com/photo-1527631746610-bca00a040d60",
            True,
            False,
            vendor["rating"],
            "Usually responds in 15 mins",
            True,
        ),
    )

    result = cursor.fetchone()

    if result:

        vendor_ids.append(
            result[0]
        )

# =====================================================
# PACKAGES
# =====================================================

print("SEEDING PACKAGES...")

packages = [
    {
        "title": "Rajmachi Monsoon Trek",
        "location": "Lonavala, Maharashtra",
        "difficulty": "Moderate",
        "price": 2499,
        "duration": "2 Days",
        "best_season": "Monsoon",
        "altitude": "2710 ft",
        "category": "Monsoon Trek",
        "image": "https://images.unsplash.com/photo-1506744038136-46273834b3fb",
    },
    {
        "title": "Kalsubai Sunrise Trek",
        "location": "Igatpuri, Maharashtra",
        "difficulty": "Hard",
        "price": 1999,
        "duration": "1 Day",
        "best_season": "Winter",
        "altitude": "5400 ft",
        "category": "Peak Trek",
        "image": "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b",
    },
    {
        "title": "Harishchandragad Trek",
        "location": "Ahmednagar, Maharashtra",
        "difficulty": "Hard",
        "price": 2999,
        "duration": "2 Days",
        "best_season": "Monsoon",
        "altitude": "4670 ft",
        "category": "Fort Trek",
        "image": "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee",
    },
    {
        "title": "Lohagad Fort Trek",
        "location": "Lonavala, Maharashtra",
        "difficulty": "Easy",
        "price": 1499,
        "duration": "1 Day",
        "best_season": "Monsoon",
        "altitude": "3389 ft",
        "category": "Beginner Trek",
        "image": "https://images.unsplash.com/photo-1501785888041-af3ef285b470",
    },
    {
        "title": "Pawna Lake Camping",
        "location": "Pawna, Maharashtra",
        "difficulty": "Easy",
        "price": 1999,
        "duration": "1 Night",
        "best_season": "Winter",
        "altitude": "2100 ft",
        "category": "Camping",
        "image": "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429",
    },
]

package_ids = []

for package in packages:

    vendor_id = random.choice(
        vendor_ids
    )

    slug = (
        package["title"]
        .lower()
        .replace(" ", "-")
    )

    included = [
        "Travel",
        "Breakfast",
        "Guide Charges",
        "First Aid",
    ]

    excluded = [
        "Personal Expenses",
        "Insurance",
    ]

    pickup_points = [
        "Shivajinagar Pune",
        "Dadar Mumbai",
    ]

    cursor.execute(
        """
        INSERT INTO packages (
            vendor_id,
            title,
            location,
            price,
            duration,
            difficulty,
            best_season,
            altitude,
            category,
            rating,
            total_reviews,
            group_size,
            featured,
            status,
            slug,
            short_description,
            full_description,
            included,
            excluded,
            highlights,
            weather_details,
            faq,
            pickup_points,
            featured_image,
            created_at
        )
        VALUES (
            %s,%s,%s,%s,%s,%s,%s,%s,%s,
            %s,%s,%s,%s,%s,%s,%s,%s,
            %s,%s,%s,%s,%s,%s,%s,NOW()
        )
        RETURNING id
        """,
        (
            vendor_id,
            package["title"],
            package["location"],
            package["price"],
            package["duration"],
            package["difficulty"],
            package["best_season"],
            package["altitude"],
            package["category"],
            round(
                random.uniform(4.5, 4.9),
                1,
            ),
            random.randint(50, 300),
            random.randint(15, 35),
            True,
            "active",
            slug,
            f"Experience the beauty of {package['title']}.",
            f"{package['title']} is one of Maharashtra's best trekking experiences.",
            "\n".join(included),
            "\n".join(excluded),
            Json([
                f"{package['difficulty']} grade Sahyadri trail",
                f"Best experienced in {package['best_season']}",
                "Certified trek lead and first-aid support",
                "Curated pickup from Pune and Mumbai",
            ]),
            Json({
                "best_season": package["best_season"],
                "advice": "Carry rainwear in monsoon and a warm layer for winter sunrise batches.",
                "temperature_range": "16-28 C",
            }),
            Json([
                {
                    "question": "Is this trek beginner friendly?",
                    "answer": f"This is rated {package['difficulty']}; follow vendor fitness guidance before booking.",
                },
                {
                    "question": "Are pickup points included?",
                    "answer": "Common Pune and Mumbai pickup points are available batch-wise.",
                },
            ]),
            Json(pickup_points),
            package["image"],
        ),
    )

    result = cursor.fetchone()

    if result:

        package_ids.append(
            result[0]
        )

# =====================================================
# TRIP BATCHES
# =====================================================

print("SEEDING TRIP BATCHES...")

guides = [
    "Aditya Trek Lead",
    "Rohit Adventure Guide",
    "Sanket Trek Captain",
]

for package_id in package_ids:

    for _ in range(4):

        start_date = (
            datetime.now()
            + timedelta(
                days=random.randint(5, 90)
            )
        )

        end_date = (
            start_date
            + timedelta(days=2)
        )

        booking_deadline = (
            start_date
            - timedelta(days=2)
        )

        max_seats = random.choice(
            [20, 25, 30]
        )

        booked_seats = random.randint(
            5,
            max_seats - 1,
        )

        cursor.execute(
            """
            INSERT INTO trip_batches (
                package_id,
                start_date,
                end_date,
                booking_deadline,
                max_seats,
                booked_seats,
                pickup_location,
                guide_name,
                batch_status,
                created_at,
                updated_at
            )
            VALUES (
                %s,%s,%s,%s,%s,%s,%s,%s,%s,
                NOW(),
                NOW()
            )
            """,
            (
                package_id,
                start_date,
                end_date,
                booking_deadline,
                max_seats,
                booked_seats,
                "Shivajinagar Pune",
                random.choice(guides),
                "open",
            ),
        )

# =====================================================
# BOOKINGS
# =====================================================

print("SEEDING BOOKINGS...")

statuses = [
    "confirmed",
    "pending",
    "cancelled",
]

payment_statuses = [
    "paid",
    "pending",
]

booking_ids = []

for _ in range(20):

    package_id = random.choice(
        package_ids
    )

    user_id = random.choice(
        demo_user_ids
    )

    total_amount = random.randint(
        1500,
        5000,
    )

    cursor.execute(
        """
        INSERT INTO bookings (
            user_id,
            package_id,
            booking_id,
            destination,
            name,
            email,
            phone,
            budget,
            days,
            status,
            payment_status,
            total_amount,
            persons,
            package_title,
            package_image,
            travelers,
            booking_date,
            created_at,
            updated_at
        )
        VALUES (
            %s,%s,%s,%s,%s,%s,%s,%s,%s,%s,
            %s,%s,%s,%s,%s,NOW(),NOW(),NOW()
        )
        RETURNING booking_id
        """,
        (
            user_id,
            package_id,
            f"TG-BOOK-{random.randint(100000,999999)}",
            "Maharashtra Trek",
            f"Demo Traveller {user_id}",
            f"demo{user_id}@travelgenie.in",
            f"88888888{random.randint(10,99)}",
            total_amount,
            random.randint(1, 3),
            random.choice(statuses),
            random.choice(
                payment_statuses
            ),
            total_amount,
            random.randint(1, 5),
            "Maharashtra Trek Package",
            "",
            random.randint(1, 5),
        ),
    )

    result = cursor.fetchone()

    if result:

        booking_ids.append(
            result[0]
        )

# =====================================================
# PAYMENT TRANSACTIONS
# =====================================================

print("SEEDING PAYMENT TRANSACTIONS...")

for booking_id in booking_ids:

    cursor.execute(
        """
        INSERT INTO payment_transactions (
            booking_id,
            razorpay_order_id,
            razorpay_payment_id,
            amount,
            status,
            created_at
        )
        VALUES (
            %s,%s,%s,%s,%s,NOW()
        )
        """,
        (
            booking_id,
            f"order_{random.randint(10000,99999)}",
            f"pay_{random.randint(10000,99999)}",
            random.randint(1500, 5000),
            "paid",
        ),
    )

# =====================================================
# REVIEWS
# =====================================================

print("SEEDING REVIEWS...")

review_comments = [
    "Amazing trek management and safety.",
    "Beautiful Sahyadri views.",
    "Loved the camping experience.",
    "Perfect weekend getaway.",
    "Highly recommended trek.",
]

for package_id in package_ids:

    for _ in range(5):

        cursor.execute(
            """
            INSERT INTO reviews (
                user_id,
                package_id,
                rating,
                review_text,
                moderation_status,
                is_featured,
                is_deleted,
                created_at,
                updated_at
            )
            VALUES (
                %s,%s,%s,%s,%s,%s,%s,
                NOW(),
                NOW()
            )
            """,
            (
                random.choice(
                    demo_user_ids
                ),
                package_id,
                random.randint(4, 5),
                random.choice(
                    review_comments
                ),
                "approved",
                random.choice(
                    [True, False]
                ),
                False,
            ),
        )

# =====================================================
# NOTIFICATIONS
# =====================================================

print("SEEDING NOTIFICATIONS...")

notifications = [
    "Your trek booking has been confirmed.",
    "Payment completed successfully.",
    "New monsoon trek added near Lonavala.",
    "AI Planner generated your itinerary.",
]

for user_id in demo_user_ids:

    for _ in range(3):

        cursor.execute(
            """
            INSERT INTO notifications (
                user_id,
                title,
                message,
                is_read,
                created_at
            )
            VALUES (
                %s,%s,%s,%s,NOW()
            )
            """,
            (
                user_id,
                "TravelGenie Update",
                random.choice(
                    notifications
                ),
                False,
            ),
        )

# =====================================================
# AI CHAT HISTORY
# =====================================================

print("SEEDING AI CHAT HISTORY...")

prompts = [
    "Suggest a monsoon trek near Pune",
    "Best camping places in Maharashtra",
    "Plan a 2-day trekking trip",
    "Best beginner trek near Mumbai",
    "Affordable camping trip suggestions",
    "Top Sahyadri trekking destinations",
    "Best winter treks in Maharashtra",
    "Easy weekend treks for couples",
]

responses = [
    "Rajmachi Trek is highly recommended for monsoon adventures and scenic waterfalls.",
    "Pawna Lake camping is perfect for weekend camping experiences with bonfire and lakeside views.",
    "Kalsubai trek is ideal for experienced adventure lovers looking for challenging climbs.",
    "Lohagad Fort trek is beginner-friendly and offers beautiful panoramic views.",
    "Harishchandragad offers one of Maharashtra's best trekking experiences with Konkan Kada.",
    "Tikona Fort trek is great for beginners and short weekend trips.",
    "Bhandardara camping is ideal for peaceful lakeside experiences.",
    "Andharban trek is one of the best dense forest treks during monsoon.",
]

roles = [
    "user",
    "assistant",
]

for user_id in demo_user_ids:

    for _ in range(5):

        selected_prompt = random.choice(
            prompts
        )

        selected_response = random.choice(
            responses
        )

        selected_role = random.choice(
            roles
        )

        combined_content = (
            f"Prompt: {selected_prompt}\n\n"
            f"Response: {selected_response}"
        )

        cursor.execute(
            """
            INSERT INTO ai_chat_history (
                user_id,
                role,
                content,
                prompt,
                response,
                created_at
            )
            VALUES (
                %s,%s,%s,%s,%s,NOW()
            )
            """,
            (
                user_id,
                selected_role,
                combined_content,
                selected_prompt,
                selected_response,
            ),
        )

print("AI CHAT HISTORY SEEDED SUCCESSFULLY")
# =====================================================
# COMMIT
# =====================================================

conn.commit()

cursor.close()

conn.close()

# =====================================================
# DONE
# =====================================================

print("=" * 70)
print("TRAVELGENIE ECOSYSTEM SEEDED SUCCESSFULLY")
print("=" * 70)
print(f"Demo Users Added: {len(demo_user_ids)}")
print(f"Vendors Added: {len(vendor_ids)}")
print(f"Packages Added: {len(package_ids)}")
print(f"Bookings Added: {len(booking_ids)}")
print(f"Trip Batches Added: {len(package_ids) * 4}")
print(f"Reviews Added: {len(package_ids) * 5}")
print("=" * 70)

print("\nADMIN LOGIN")
print("-" * 30)
print("Email: admin@travelgenie.com")
print("Password: Admin123")

print("\nDEMO USER LOGIN")
print("-" * 30)
print("Email: demo1@travelgenie.in")
print("Password: Demo123")

print("=" * 70)
