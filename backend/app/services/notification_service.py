import json
import logging

logger = logging.getLogger(__name__)


def create_notification(
    cursor,
    user_id,
    title,
    message,
    notification_type="general",
    audience="customer",
    metadata=None,
):
    if not user_id:
        return

    try:
        cursor.execute("SAVEPOINT notification_insert")
        cursor.execute(
            """
            INSERT INTO notifications (
                user_id, title, message, audience, type, metadata
            )
            VALUES (%s, %s, %s, %s, %s, %s::jsonb)
            """,
            (
                user_id,
                title,
                message,
                audience,
                notification_type,
                json.dumps(metadata or {}),
            ),
        )
    except Exception as exc:
        cursor.execute("ROLLBACK TO SAVEPOINT notification_insert")
        logger.warning("Notification insert skipped: %s", exc)
    finally:
        try:
            cursor.execute("RELEASE SAVEPOINT notification_insert")
        except Exception:
            pass


def create_admin_notification(
    cursor,
    title,
    message,
    notification_type="admin",
    metadata=None,
):
    try:
        cursor.execute(
            """
            SELECT id
            FROM users
            WHERE role = 'admin'
              AND COALESCE(is_deleted, FALSE) = FALSE
            """
        )
        rows = cursor.fetchall()
    except Exception as exc:
        logger.warning("Admin notification lookup skipped: %s", exc)
        return

    for row in rows:
        admin_id = row["id"] if hasattr(row, "keys") else row[0]
        create_notification(
            cursor,
            admin_id,
            title,
            message,
            notification_type=notification_type,
            audience="admin",
            metadata=metadata,
        )
