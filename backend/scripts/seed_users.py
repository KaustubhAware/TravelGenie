from seed_common import get_seed_connection, seed_users


if __name__ == "__main__":
    conn = get_seed_connection()
    try:
        seed_users(conn)
        print("Users seeded.")
    finally:
        conn.close()
