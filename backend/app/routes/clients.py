from fastapi import APIRouter

from app.db import get_connection

router = APIRouter()

# =====================================================
# GET ALL CLIENTS
# =====================================================

@router.get("/admin/clients")
def get_clients():

    conn = get_connection()

    cursor = conn.cursor()

    query = """
    SELECT
        u.id,
        u.full_name,
        u.email,
        u.phone,
        u.city,
        u.country,

        COUNT(b.booking_id) AS total_bookings,

        COALESCE(
            SUM(b.budget),
            0
        ) AS total_spent,

        MAX(b.created_at) AS latest_booking

    FROM users u

    LEFT JOIN bookings b
    ON u.id = b.user_id

    GROUP BY
        u.id,
        u.full_name,
        u.email,
        u.phone,
        u.city,
        u.country

    ORDER BY total_spent DESC
    """

    cursor.execute(query)

    rows = cursor.fetchall()

    clients = []

    for row in rows:

        clients.append({

            "id": row[0],

            "full_name": row[1],

            "email": row[2],

            "phone": row[3],

            "city": row[4],

            "country": row[5],

            "total_bookings": row[6],

            "total_spent": row[7],

            "latest_booking": str(row[8]) if row[8] else None

        })

    cursor.close()

    conn.close()

    return {
        "clients": clients
    }
# =====================================================
# DELETE CLIENT
# =====================================================

@router.delete("/admin/clients/{client_id}")
def delete_client(client_id: int):

    try:

        conn = get_connection()

        cursor = conn.cursor()

        # DELETE BOOKINGS

        cursor.execute(
            """
            DELETE FROM bookings
            WHERE user_id = %s
            """,
            (client_id,)
        )

        # DELETE USER

        cursor.execute(
            """
            DELETE FROM users
            WHERE id = %s
            """,
            (client_id,)
        )

        conn.commit()

        return {
            "message": "Client deleted successfully"
        }

    except Exception as e:

        print("DELETE ERROR:", e)

        return {
            "error": str(e)
        }

    finally:

        cursor.close()

        conn.close()
    return {
        "message": "Client deleted successfully"
    }