import argparse
import json
import sys
from pathlib import Path

from psycopg2.extras import RealDictCursor

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))

from app.auth.jwt_handler import create_access_token  # noqa: E402
from app.auth.password_utils import verify_password  # noqa: E402
from app.db import get_connection  # noqa: E402


USER_COLUMNS = [
    "id",
    "email",
    "role",
    "is_vendor",
    "vendor_status",
    "approved_by",
    "approved_at",
    "rejection_reason",
    "deleted_at",
    "is_deleted",
    "password_hash",
]


def _print(title, value):
    print(f"\n== {title} ==")
    print(json.dumps(value, default=str, indent=2))


def _column_audit(cursor):
    cursor.execute(
        """
        SELECT column_name
        FROM information_schema.columns
        WHERE table_name = 'users'
        ORDER BY ordinal_position
        """
    )
    columns = {row["column_name"] for row in cursor.fetchall()}
    expected = set(USER_COLUMNS)
    return {
        "present": sorted(columns & expected),
        "missing": sorted(expected - columns),
    }


def _status_audit(cursor):
    cursor.execute(
        """
        SELECT
            COALESCE(role, '') AS role,
            COALESCE(is_vendor, FALSE) AS is_vendor,
            COALESCE(vendor_status, 'NULL') AS vendor_status,
            COUNT(*) AS count
        FROM users
        GROUP BY role, is_vendor, vendor_status
        ORDER BY role, is_vendor, vendor_status
        """
    )
    return [dict(row) for row in cursor.fetchall()]


def _find_vendor(cursor, email, vendor_id):
    where = []
    params = []

    if email:
        where.append("LOWER(u.email) = LOWER(%s)")
        params.append(email.strip())

    if vendor_id:
        where.append("v.vendor_id = %s")
        params.append(vendor_id)

    if not where:
        where.append("v.vendor_id IS NOT NULL")

    cursor.execute(
        f"""
        SELECT
            u.id,
            u.email,
            u.full_name,
            u.role,
            COALESCE(u.is_vendor, FALSE) AS is_vendor,
            COALESCE(u.vendor_status, 'none') AS vendor_status,
            u.approved_by,
            u.approved_at,
            u.rejection_reason,
            u.deleted_at,
            COALESCE(u.is_deleted, FALSE) AS is_deleted,
            u.password_hash,
            v.vendor_id,
            v.contact_email,
            v.verification_status,
            COALESCE(v.is_active, FALSE) AS vendor_is_active,
            COALESCE(v.is_deleted, FALSE) AS vendor_is_deleted
        FROM users u
        LEFT JOIN vendors v ON v.user_id = u.id
        WHERE {' AND '.join(where)}
        ORDER BY v.vendor_id DESC NULLS LAST, u.id DESC
        LIMIT 1
        """,
        params,
    )
    row = cursor.fetchone()
    return dict(row) if row else None


def _public_vendor(row):
    if not row:
        return None

    public = dict(row)
    public["password_hash_present"] = bool(public.pop("password_hash", None))
    return public


def _login_gate_result(row, password):
    if not row:
        return {
            "would_login": False,
            "failed_at": "user_lookup",
            "http_status": 401,
            "detail": "Invalid email or password",
        }

    if row["is_deleted"]:
        return {
            "would_login": False,
            "failed_at": "deleted_user",
            "http_status": 403,
            "detail": "Account is deactivated",
        }

    if (row["role"] == "vendor" or row["is_vendor"]) and row["vendor_status"] != "approved":
        return {
            "would_login": False,
            "failed_at": "vendor_status",
            "http_status": 403,
            "detail": "Vendor account is not approved",
        }

    if not row["password_hash"]:
        return {
            "would_login": False,
            "failed_at": "password_hash_missing",
            "http_status": 500,
            "detail": "User password hash missing",
        }

    if password is None:
        return {
            "would_login": None,
            "failed_at": "password_not_supplied",
            "http_status": None,
            "detail": "Pass --password to validate the final login check",
        }

    password_valid = verify_password(password.strip(), row["password_hash"])
    return {
        "would_login": password_valid,
        "failed_at": None if password_valid else "password_check",
        "http_status": 200 if password_valid else 401,
        "password_valid": password_valid,
    }


def _jwt_result(row):
    if not row:
        return {"generated": False, "reason": "No user row"}

    payload = {
        "sub": str(row["id"]),
        "id": row["id"],
        "uid": str(row["id"]),
        "email": row["email"],
        "role": row["role"] or "customer",
        "is_vendor": bool(row["is_vendor"]),
        "vendor_status": row["vendor_status"] or "none",
    }
    token = create_access_token(payload)
    return {
        "generated": bool(token),
        "payload": payload,
        "token_length": len(token),
    }


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--email")
    parser.add_argument("--vendor-id", type=int)
    parser.add_argument("--password")
    args = parser.parse_args()

    conn = get_connection()
    cursor = conn.cursor(cursor_factory=RealDictCursor)

    try:
        _print("Users Table Column Audit", _column_audit(cursor))
        _print("Users Vendor Status Audit", _status_audit(cursor))

        row = _find_vendor(cursor, args.email, args.vendor_id)
        _print("Vendor Record", _public_vendor(row))
        _print("Login Gate Result", _login_gate_result(row, args.password))
        _print("JWT Generation Result", _jwt_result(row))
    finally:
        cursor.close()
        conn.close()


if __name__ == "__main__":
    main()
