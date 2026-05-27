from seed_common import get_seed_connection, seed_packages, seed_trip_batches


if __name__ == "__main__":
    conn = get_seed_connection()
    try:
        package_ids = seed_packages(conn)
        seed_trip_batches(conn, package_ids)
        print("Packages and trip batches seeded.")
    finally:
        conn.close()
