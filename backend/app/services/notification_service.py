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
