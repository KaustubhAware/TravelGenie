import logging
import smtplib
from email.message import EmailMessage
from threading import Thread

from app.config import get_settings

logger = logging.getLogger(__name__)


def send_email(to_email, subject, body):
    settings = get_settings()

    if not to_email:
        return False

    if not (
        settings.SMTP_HOST
        and settings.SMTP_USERNAME
        and settings.SMTP_PASSWORD
        and settings.SMTP_FROM_EMAIL
    ):
        logger.warning("SMTP not configured; skipped email to %s", to_email)
        return False

    message = EmailMessage()
    message["From"] = settings.SMTP_FROM_EMAIL
    message["To"] = to_email
    message["Subject"] = subject
    message.set_content(body)

    try:
        with smtplib.SMTP(settings.SMTP_HOST, settings.SMTP_PORT, timeout=10) as smtp:
            if settings.SMTP_TLS:
                smtp.starttls()
            smtp.login(settings.SMTP_USERNAME, settings.SMTP_PASSWORD)
            smtp.send_message(message)
        logger.info("Email sent to %s with subject %s", to_email, subject)
        return True
    except Exception as exc:
        logger.warning("Email send failed for %s: %s", to_email, exc)
        return False


def send_email_async(to_email, subject, body):
    thread = Thread(
        target=send_email,
        args=(to_email, subject, body),
        daemon=True,
    )
    thread.start()
    return True
