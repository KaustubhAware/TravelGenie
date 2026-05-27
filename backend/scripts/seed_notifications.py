from seed_common import get_seed_connection, seed_notifications


if __name__ == "__main__":
    conn = get_seed_connection()
    try:
        seed_notifications(conn)
        print("Notifications seeded.")
    finally:
        conn.close()
