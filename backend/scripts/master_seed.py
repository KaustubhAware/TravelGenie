from seed_common import (
    apply_schema,
    get_seed_connection,
    seed_activity,
    seed_ai_history,
    seed_bookings,
    seed_notifications,
    seed_packages,
    seed_payments,
    seed_reviews,
    seed_trip_batches,
    seed_users,
    seed_vendors,
    truncate_all,
)


def main():
    conn = get_seed_connection()
    try:
        print("Applying schema and migrations...")
        apply_schema(conn)

        print("Truncating existing TravelGenie data...")
        truncate_all(conn)

        print("Seeding users...")
        user_ids = seed_users(conn)

        print("Seeding vendors...")
        vendor_ids, _ = seed_vendors(conn, user_ids)

        print("Seeding Maharashtra packages and local package images...")
        package_ids = seed_packages(conn, vendor_ids)

        print("Seeding trip batches...")
        seed_trip_batches(conn, package_ids)

        print("Seeding bookings...")
        booking_ids = seed_bookings(conn)

        print("Seeding payments...")
        seed_payments(conn, booking_ids)

        print("Seeding reviews...")
        seed_reviews(conn)

        print("Seeding notifications...")
        seed_notifications(conn)

        print("Seeding AI history...")
        seed_ai_history(conn)

        print("Seeding activity logs...")
        seed_activity(conn)

        print("TravelGenie production ecosystem seeded successfully.")
        print("Admin login: admin / value of ADMIN_PASSWORD in .env")
        print("Customer login: ananya.patil@example.com / Demo123")
        print("Vendor login: vendor1@travelgenie.in / Vendor123")
    finally:
        conn.close()


if __name__ == "__main__":
    main()
