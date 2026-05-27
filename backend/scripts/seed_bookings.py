from seed_common import get_seed_connection, seed_bookings


if __name__ == "__main__":
    conn = get_seed_connection()
    try:
        seed_bookings(conn)
        print("Bookings seeded.")
    finally:
        conn.close()
