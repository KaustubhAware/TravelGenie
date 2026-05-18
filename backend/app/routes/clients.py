from fastapi import APIRouter, HTTPException

from app.db import get_connection

router = APIRouter()

# =====================================================
# GET ALL CLIENTS
# =====================================================

@router.get("/admin/clients")
def get_clients():

    conn = get_connection()

    cursor = conn.cursor()

    try:

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

        WHERE
            COALESCE(u.is_deleted, FALSE) = FALSE

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

                "full_name": row[1] or "Unknown User",

                "email": row[2],

                "phone": row[3],

                "city": row[4],

                "country": row[5],

                "total_bookings": row[6],

                "total_spent": float(row[7]) if row[7] else 0,

                "latest_booking":
                    str(row[8]) if row[8] else None
            })

        return {
            "success": True,
            "clients": clients
        }

    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail=str(e)
        )

    finally:

        cursor.close()

        conn.close()

# =====================================================
# SOFT DELETE CLIENT
# =====================================================

@router.delete("/admin/clients/{client_id}")
def delete_client(client_id: int):

    conn = get_connection()

    cursor = conn.cursor()

    try:

        # =============================================
        # CHECK CLIENT EXISTS
        # =============================================

        cursor.execute(
            """
            SELECT id
            FROM users
            WHERE id = %s
            """,
            (client_id,)
        )

        existing_user = cursor.fetchone()

        if not existing_user:

            raise HTTPException(
                status_code=404,
                detail="Client not found"
            )

        # =============================================
        # SOFT DELETE CLIENT
        # =============================================

        cursor.execute(
            """
            UPDATE users
            SET is_deleted = TRUE
            WHERE id = %s
            """,
            (client_id,)
        )

        conn.commit()

        return {

            "success": True,

            "message":
                "Client deleted successfully"
        }

    except HTTPException:

        raise

    except Exception as e:

        conn.rollback()

        raise HTTPException(
            status_code=500,
            detail=str(e)
        )

    finally:

        cursor.close()

        conn.close()