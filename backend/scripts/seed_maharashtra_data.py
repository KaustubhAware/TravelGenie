import os
import sys
import random

from datetime import datetime, timedelta

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

# =====================================================
# SETTINGS
# =====================================================

settings = get_settings()

# =====================================================
# DATABASE CONNECTION
# =====================================================

conn = psycopg2.connect(
    host=settings.DB_HOST,
    database=settings.DB_NAME,
    user=settings.DB_USER,
    password=settings.DB_PASSWORD,
    port=settings.DB_PORT,
)

cursor = conn.cursor()

print("=" * 60)
print("SEEDING MAHARASHTRA TREK ECOSYSTEM")
print("=" * 60)

# =====================================================
# DEMO USERS
# =====================================================

demo_user_ids = []

print("SEEDING DEMO USERS...")

for idx in range(1, 11):

    cursor.execute(
        """
        INSERT INTO users (
            firebase_uid,
            email,
            full_name,
            phone,
            city,
            country,
            preferences,
            profile_completed,
            name,
            favorite_destinations,
            role,
            updated_at,
            is_deleted,
            created_at
        )
        VALUES (
            %s,%s,%s,%s,%s,%s,%s,%s,
            %s,%s,%s,NOW(),%s,NOW()
        )
        RETURNING id
        """,
        (
            f"demo_firebase_uid_{idx}",
            f"demo{idx}@travelgenie.in",
            f"Demo User {idx}",
            f"99999999{idx:02d}",
            "Pune",
            "India",
            Json({
                "trekking": True,
                "camping": True,
                "monsoon": True,
            }),
            True,
            f"Demo User {idx}",
            Json([
                "Rajmachi",
                "Kalsubai",
                "Harishchandragad",
            ]),
            "customer",
            False,
        ),
    )

    user_id = cursor.fetchone()[0]

    demo_user_ids.append(user_id)

# =====================================================
# VENDORS
# =====================================================

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
    {
        "name": "Trek Maharashtra",
        "owner_name": "Omkar Deshmukh",
        "description": "Fort treks and monsoon adventures in Maharashtra.",
        "rating": 4.8,
    },
]

vendor_ids = []

# =====================================================
# SEED VENDORS
# =====================================================

print("SEEDING VENDORS...")

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
            f"contact{idx + 1}@travelgenie.in",
            f"98765432{idx + 1:02d}",
            vendor["description"],
            "approved",
            "vendor-logo.png",
            True,
            False,
            vendor["rating"],
            "Usually responds in 15 mins",
            True,
        ),
    )

    vendor_id = cursor.fetchone()[0]

    vendor_ids.append(vendor_id)

# =====================================================
# PACKAGES
# =====================================================

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
    },
    {
        "title": "Harishchandragad Kokankada Trek",
        "location": "Ahmednagar, Maharashtra",
        "difficulty": "Hard",
        "price": 2999,
        "duration": "2 Days",
        "best_season": "Monsoon",
        "altitude": "4670 ft",
        "category": "Fort Trek",
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
    },
    {
        "title": "Visapur Waterfall Trek",
        "location": "Malavli, Maharashtra",
        "difficulty": "Moderate",
        "price": 1799,
        "duration": "1 Day",
        "best_season": "Monsoon",
        "altitude": "3556 ft",
        "category": "Waterfall Trek",
    },
    {
        "title": "Andharban Jungle Trek",
        "location": "Tamhini Ghat, Maharashtra",
        "difficulty": "Moderate",
        "price": 2199,
        "duration": "1 Day",
        "best_season": "Monsoon",
        "altitude": "2160 ft",
        "category": "Forest Trek",
    },
    {
        "title": "Devkund Waterfall Trek",
        "location": "Bhira, Maharashtra",
        "difficulty": "Easy",
        "price": 1599,
        "duration": "1 Day",
        "best_season": "Monsoon",
        "altitude": "2700 ft",
        "category": "Waterfall Trek",
    },
    {
        "title": "Sandhan Valley Trek",
        "location": "Bhandardara, Maharashtra",
        "difficulty": "Hard",
        "price": 3499,
        "duration": "2 Days",
        "best_season": "Winter",
        "altitude": "4100 ft",
        "category": "Adventure Trek",
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
    },
    {
        "title": "Bhandardara Fireflies Camping",
        "location": "Bhandardara, Maharashtra",
        "difficulty": "Easy",
        "price": 2499,
        "duration": "1 Night",
        "best_season": "Pre-Monsoon",
        "altitude": "2400 ft",
        "category": "Camping",
    },
]

package_ids = []

# =====================================================
# SEED PACKAGES
# =====================================================

print("SEEDING PACKAGES...")

for package in packages:

    vendor_id = random.choice(vendor_ids)

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
        "Extra Snacks",
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
            pickup_points,
            featured_image,
            created_at
        )
        VALUES (
            %s,%s,%s,%s,%s,%s,%s,%s,%s,
            %s,%s,%s,%s,%s,%s,%s,%s,
            %s,%s,%s,%s,NOW()
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
            round(random.uniform(4.5, 4.9), 1),
            random.randint(50, 300),
            random.randint(15, 35),
            True,
            "active",
            slug,
            f"Experience the beauty of {package['title']} in Maharashtra.",
            f"{package['title']} is one of the most scenic trekking experiences in Maharashtra with breathtaking Sahyadri landscapes.",
            Json(included),
            Json(excluded),
            Json(pickup_points),
            "placeholder-trek.jpg",
        ),
    )

    package_id = cursor.fetchone()[0]

    package_ids.append(package_id)

# =====================================================
# SEED TRIP BATCHES
# =====================================================

print("SEEDING TRIP BATCHES...")

guides = [
    "Aditya Trek Lead",
    "Rohit Adventure Guide",
    "Sanket Trek Captain",
    "Aman Expedition Lead",
]

for package_id in package_ids:

    for _ in range(4):

        start_date = (
            datetime.now()
            + timedelta(days=random.randint(5, 90))
        )

        end_date = (
            start_date
            + timedelta(days=random.randint(1, 3))
        )

        booking_deadline = (
            start_date
            - timedelta(days=2)
        )

        max_seats = random.choice([20, 25, 30])

        booked_seats = random.randint(5, max_seats - 1)

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
                "active",
            ),
        )

# =====================================================
# SEED REVIEWS
# =====================================================

print("SEEDING REVIEWS...")

review_comments = [
    "Amazing trek management and safety.",
    "Best monsoon trekking experience.",
    "Guide was extremely supportive and friendly.",
    "Food and camping arrangements were excellent.",
    "Perfect weekend getaway from Pune.",
    "Highly recommended for beginners.",
    "The Sahyadri views were breathtaking.",
    "Well-organized trek and smooth travel experience.",
    "Loved the camping experience near the lake.",
    "One of the best trekking communities in Maharashtra.",
]

for package_id in package_ids:

    for _ in range(10):

        cursor.execute(
            """
            INSERT INTO reviews (
                user_id,
                package_id,
                trip_id,
                vendor_id,
                rating,
                review_text,
                image_url,
                moderation_status,
                is_featured,
                is_deleted,
                created_at,
                updated_at
            )
            VALUES (
                %s,%s,%s,%s,%s,%s,%s,%s,%s,%s,
                NOW(),
                NOW()
            )
            """,
            (
                random.choice(demo_user_ids),
                package_id,
                None,
                None,
                random.randint(4, 5),
                random.choice(review_comments),
                None,
                "approved",
                random.choice([True, False]),
                False,
            ),
        )

# =====================================================
# COMMIT
# =====================================================

conn.commit()

cursor.close()
conn.close()

print("=" * 60)
print("MAHARASHTRA TREK ECOSYSTEM SEEDED SUCCESSFULLY")
print("=" * 60)
print(f"Users Added: {len(demo_user_ids)}")
print(f"Vendors Added: {len(vendors)}")
print(f"Packages Added: {len(packages)}")
print(f"Trip Batches Added: {len(package_ids) * 4}")
print(f"Reviews Added: {len(package_ids) * 10}")
print("=" * 60)