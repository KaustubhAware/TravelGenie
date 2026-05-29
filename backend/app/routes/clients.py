from fastapi import APIRouter, Depends, HTTPException

from app.db import get_connection
from app.routes.auth import get_current_user

router = APIRouter()

# =====================================================
# GET ALL CLIENTS
# =====================================================

@router.get("/admin/clients")
def get_clients(
    include_deleted: bool = False,
    admin=Depends(get_current_user),
):

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

            MAX(b.created_at) AS latest_booking,

            COALESCE(u.is_deleted, FALSE) AS is_deleted,

            u.deleted_at

        FROM users u

        LEFT JOIN bookings b
        ON u.id = b.user_id

        WHERE
            (%s = TRUE OR COALESCE(u.is_deleted, FALSE) = FALSE)

        GROUP BY
            u.id,
            u.full_name,
            u.email,
            u.phone,
            u.city,
            u.country,
            u.is_deleted,
            u.deleted_at

        ORDER BY total_spent DESC
        """

        cursor.execute(query, (include_deleted,))

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
                    str(row[8]) if row[8] else None,

                "is_deleted": bool(row[9]),

                "deleted_at": str(row[10]) if row[10] else None,
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
def delete_client(client_id: int, admin=Depends(get_current_user)):

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
            SET
                is_deleted = TRUE,
                deleted_at = CURRENT_TIMESTAMP,
                updated_at = CURRENT_TIMESTAMP
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


@router.post("/admin/clients/{client_id}/restore")
def restore_client(client_id: int, admin=Depends(get_current_user)):

    conn = get_connection()

    cursor = conn.cursor()

    try:

        cursor.execute(
            """
            UPDATE users
            SET
                is_deleted = FALSE,
                deleted_at = NULL,
                updated_at = CURRENT_TIMESTAMP
            WHERE id = %s
            """,
            (client_id,),
        )

        if cursor.rowcount == 0:

            raise HTTPException(
                status_code=404,
                detail="Client not found"
            )

        conn.commit()

        return {
            "success": True,
            "message": "Client restored successfully"
        }

    except HTTPException:

        conn.rollback()

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
