from seed_common import get_seed_connection, seed_reviews


if __name__ == "__main__":
    conn = get_seed_connection()
    try:
        seed_reviews(conn)
        print("Reviews seeded.")
    finally:
        conn.close()
