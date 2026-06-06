import logging

from fastapi import APIRouter, Depends, HTTPException

from app.auth.jwt_handler import get_current_user
from app.db import get_connection, get_cursor
from app.responses import success_response

logger = logging.getLogger(__name__)

router = APIRouter()


def _current_user_id(user):
    try:
        return int(user.get("id") or user.get("uid"))
    except (TypeError, ValueError) as exc:
        raise HTTPException(status_code=401, detail="Invalid token identity") from exc


@router.get("/notifications")
def list_notifications(user=Depends(get_current_user)):
    conn = get_connection()
    cursor = get_cursor(conn)

    try:
        user_id = _current_user_id(user)
        cursor.execute(
            """
            SELECT
                id, title, message, audience, type, metadata,
                is_read, read_at, created_at
            FROM notifications
            WHERE user_id = %s
            ORDER BY created_at DESC
            LIMIT 50
            """,
            (user_id,),
        )
        notifications = [dict(row) for row in cursor.fetchall()]
        for item in notifications:
            item["created_at"] = str(item["created_at"]) if item.get("created_at") else None
            item["read_at"] = str(item["read_at"]) if item.get("read_at") else None

        cursor.execute(
            """
            SELECT COUNT(*)
            FROM notifications
            WHERE user_id = %s AND is_read = FALSE
            """,
            (user_id,),
        )
        count_row = cursor.fetchone()
        unread_count = (
            count_row["count"]
            if hasattr(count_row, "keys")
            else count_row[0]
        )

        return success_response(
            message="Notifications fetched",
            data={
                "notifications": notifications,
                "unread_count": unread_count,
            },
        )
    finally:
        cursor.close()
        conn.close()


@router.post("/notifications/{notification_id}/read")
def mark_notification_read(notification_id: int, user=Depends(get_current_user)):
    conn = get_connection()
    cursor = get_cursor(conn)

    try:
        user_id = _current_user_id(user)
        cursor.execute(
            """
            UPDATE notifications
            SET is_read = TRUE, read_at = CURRENT_TIMESTAMP
            WHERE id = %s AND user_id = %s AND is_read = FALSE
            """,
            (notification_id, user_id),
        )
        if cursor.rowcount == 0:
            cursor.execute(
                """
                SELECT id
                FROM notifications
                WHERE id = %s AND user_id = %s
                LIMIT 1
                """,
                (notification_id, user_id),
            )
            if not cursor.fetchone():
                raise HTTPException(status_code=404, detail="Notification not found")
        conn.commit()
        return success_response(message="Notification marked as read")
    except HTTPException:
        conn.rollback()
        raise
    except Exception as exc:
        conn.rollback()
        logger.error("Notification update failed: %s", exc)
        raise HTTPException(status_code=500, detail="Notification update failed") from exc
    finally:
        cursor.close()
        conn.close()


@router.post("/notifications/read-all")
def mark_all_notifications_read(user=Depends(get_current_user)):
    conn = get_connection()
    cursor = get_cursor(conn)

    try:
        user_id = _current_user_id(user)
        cursor.execute(
            """
            UPDATE notifications
            SET is_read = TRUE, read_at = CURRENT_TIMESTAMP
            WHERE user_id = %s AND is_read = FALSE
            """,
            (user_id,),
        )
        conn.commit()
        return success_response(message="Notifications marked as read")
    except Exception as exc:
        conn.rollback()
        logger.error("Notification bulk update failed: %s", exc)
        raise HTTPException(status_code=500, detail="Notification update failed") from exc
    finally:
        cursor.close()
        conn.close()
