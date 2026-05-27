from seed_common import get_seed_connection, seed_ai_history


if __name__ == "__main__":
    conn = get_seed_connection()
    try:
        seed_ai_history(conn)
        print("AI history seeded.")
    finally:
        conn.close()
