from seed_common import get_seed_connection, seed_payments


if __name__ == "__main__":
    conn = get_seed_connection()
    try:
        seed_payments(conn)
        print("Payments seeded.")
    finally:
        conn.close()
