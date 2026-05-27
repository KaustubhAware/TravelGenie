from seed_common import get_seed_connection, seed_vendors


if __name__ == "__main__":
    conn = get_seed_connection()
    try:
        seed_vendors(conn)
        print("Vendors seeded.")
    finally:
        conn.close()
