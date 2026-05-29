import logging
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, Field

from app.db import get_connection, get_cursor
from app.auth.jwt_handler import get_current_user
from app.routes.auth import get_current_user as get_current_admin
from app.responses import success_response
from app.services.notification_service import create_notification

logger = logging.getLogger(__name__)

router = APIRouter()


class ReviewCreate(BaseModel):
    package_id: Optional[int] = None
    trip_id: Optional[int] = None
    vendor_id: Optional[int] = None
    rating: int = Field(..., ge=1, le=5)
    review_text: str = Field(..., min_length=3, max_length=2000)
    image_url: Optional[str] = None


class ReviewUpdate(BaseModel):
    rating: Optional[int] = Field(default=None, ge=1, le=5)
    review_text: Optional[str] = Field(default=None, max_length=2000)
    image_url: Optional[str] = None


class ModerationRequest(BaseModel):
    moderation_status: str = Field(..., pattern="^(approved|hidden|pending)$")
    is_featured: Optional[bool] = None


def _get_user_id(cursor, user_id):
    cursor.execute(
        "SELECT id FROM users WHERE id = %s",
        (user_id,),
    )
    row = cursor.fetchone()
    if not row:
        raise HTTPException(status_code=404, detail="User not found")
    return row["id"] if hasattr(row, "keys") else row[0]


def _recalculate_package_rating(cursor, package_id):
    if not package_id:
        return

    cursor.execute(
        """
        UPDATE packages
        SET
            rating = COALESCE(stats.avg_rating, 0),
            total_reviews = COALESCE(stats.review_count, 0),
            updated_at = CURRENT_TIMESTAMP
        FROM (
            SELECT
                ROUND(AVG(rating)::numeric, 2) AS avg_rating,
                COUNT(*) AS review_count
            FROM reviews
            WHERE package_id = %s
            AND is_deleted = FALSE
            AND moderation_status = 'approved'
        ) stats
        WHERE packages.id = %s
        """,
        (package_id, package_id),
    )


@router.get("/reviews")
def list_reviews(
    package_id: Optional[int] = None,
    vendor_id: Optional[int] = None,
):
    conn = get_connection()
    cursor = get_cursor(conn)

    try:
        query = """
            SELECT
                r.review_id, r.user_id, r.package_id, r.trip_id,
                r.vendor_id, r.rating, r.review_text, r.image_url,
                r.moderation_status, r.is_featured, r.created_at,
                u.name, u.full_name
            FROM reviews r
            LEFT JOIN users u ON u.id = r.user_id
            WHERE r.is_deleted = FALSE
            AND r.moderation_status = 'approved'
        """
        params = []

        if package_id:
            query += " AND r.package_id = %s"
            params.append(package_id)
        if vendor_id:
            query += " AND r.vendor_id = %s"
            params.append(vendor_id)

        query += " ORDER BY r.is_featured DESC, r.created_at DESC LIMIT 50"

        cursor.execute(query, tuple(params))
        rows = cursor.fetchall()

        reviews = []
        for row in rows:
            item = dict(row) if hasattr(row, "keys") else {}
            if not item:
                continue
            item["author_name"] = item.pop("name", None) or item.pop(
                "full_name", None
            )
            if item.get("created_at"):
                item["created_at"] = str(item["created_at"])
            reviews.append(item)

        cursor.execute(
            """
            SELECT
                ROUND(AVG(rating)::numeric, 2) AS average_rating,
                COUNT(*) AS review_count
            FROM reviews
            WHERE is_deleted = FALSE
            AND moderation_status = 'approved'
            AND (%s IS NULL OR package_id = %s)
            AND (%s IS NULL OR vendor_id = %s)
            """,
            (package_id, package_id, vendor_id, vendor_id),
        )
        stats = dict(cursor.fetchone())
        avg_rating = float(stats["average_rating"] or 0)
        review_count = int(stats["review_count"] or 0)

        return success_response(
            message="Reviews fetched",
            data={"reviews": reviews, "average_rating": avg_rating, "count": review_count},
        )
    finally:
        cursor.close()
        conn.close()


@router.post("/reviews")
def create_review(
    data: ReviewCreate,
    user=Depends(get_current_user),
):
    conn = get_connection()
    cursor = get_cursor(conn)

    try:
        user_id = _get_user_id(cursor, user["uid"])

        cursor.execute(
            """
            INSERT INTO reviews (
                user_id, package_id, trip_id, vendor_id,
                rating, review_text, image_url, moderation_status
            )
            VALUES (%s, %s, %s, %s, %s, %s, %s, 'pending')
            RETURNING review_id
            """,
            (
                user_id,
                data.package_id,
                data.trip_id,
                data.vendor_id,
                data.rating,
                data.review_text,
                data.image_url,
            ),
        )

        row = cursor.fetchone()
        if data.package_id:
            _recalculate_package_rating(cursor, data.package_id)

        create_notification(
            cursor,
            user_id,
            "Review submitted",
            "Your review was submitted and is awaiting moderation.",
            "review_submitted",
            metadata={
                "package_id": data.package_id,
                "trip_id": data.trip_id,
            },
        )

        conn.commit()
        review_id = row["review_id"] if hasattr(row, "keys") else row[0]

        return success_response(
            message="Review submitted for moderation",
            data={"review_id": review_id},
        )
    except HTTPException:
        conn.rollback()
        raise
    except Exception as exc:
        conn.rollback()
        logger.error("Create review failed: %s", exc)
        raise HTTPException(status_code=400, detail=str(exc)) from exc
    finally:
        cursor.close()
        conn.close()


@router.put("/reviews/{review_id}")
def update_review(
    review_id: int,
    data: ReviewUpdate,
    user=Depends(get_current_user),
):
    conn = get_connection()
    cursor = get_cursor(conn)

    try:
        user_id = _get_user_id(cursor, user["uid"])

        cursor.execute(
            """
            UPDATE reviews
            SET
                rating = COALESCE(%s, rating),
                review_text = COALESCE(%s, review_text),
                image_url = COALESCE(%s, image_url),
                moderation_status = 'pending',
                updated_at = CURRENT_TIMESTAMP
            WHERE review_id = %s AND user_id = %s AND is_deleted = FALSE
            RETURNING package_id
            """,
            (
                data.rating,
                data.review_text,
                data.image_url,
                review_id,
                user_id,
            ),
        )

        if cursor.rowcount == 0:
            raise HTTPException(status_code=404, detail="Review not found")

        row = cursor.fetchone()
        package_id = row["package_id"] if hasattr(row, "keys") else row[0]
        _recalculate_package_rating(cursor, package_id)

        conn.commit()
        return success_response(message="Review updated and sent for moderation")
    except HTTPException:
        conn.rollback()
        raise
    finally:
        cursor.close()
        conn.close()


@router.delete("/reviews/{review_id}")
def delete_review(
    review_id: int,
    user=Depends(get_current_user),
):
    conn = get_connection()
    cursor = get_cursor(conn)

    try:
        user_id = _get_user_id(cursor, user["uid"])

        cursor.execute(
            """
            UPDATE reviews
            SET is_deleted = TRUE, updated_at = CURRENT_TIMESTAMP
            WHERE review_id = %s AND user_id = %s
            RETURNING package_id
            """,
            (review_id, user_id),
        )

        if cursor.rowcount == 0:
            raise HTTPException(status_code=404, detail="Review not found")

        row = cursor.fetchone()
        package_id = row["package_id"] if hasattr(row, "keys") else row[0]
        _recalculate_package_rating(cursor, package_id)

        conn.commit()
        return success_response(message="Review deleted")
    except HTTPException:
        conn.rollback()
        raise
    finally:
        cursor.close()
        conn.close()


@router.get("/admin/reviews/analytics")
def admin_review_analytics(admin=Depends(get_current_admin)):
    conn = get_connection()
    cursor = get_cursor(conn)

    try:
        cursor.execute(
            """
            SELECT
                COUNT(*) AS total,
                COUNT(*) FILTER (
                    WHERE moderation_status = 'pending'
                ) AS pending,
                COUNT(*) FILTER (
                    WHERE moderation_status = 'approved'
                ) AS approved,
                ROUND(AVG(rating)::numeric, 2) AS avg_rating
            FROM reviews
            WHERE is_deleted = FALSE
            """
        )
        stats = dict(cursor.fetchone())
        return success_response(message="Review analytics", data=stats)
    finally:
        cursor.close()
        conn.close()


@router.get("/admin/reviews")
def admin_list_reviews(admin=Depends(get_current_admin)):
    conn = get_connection()
    cursor = get_cursor(conn)

    try:
        cursor.execute(
            """
            SELECT
                r.review_id, r.user_id, r.package_id, r.rating,
                r.review_text, r.moderation_status, r.is_featured,
                r.created_at, u.email
            FROM reviews r
            LEFT JOIN users u ON u.id = r.user_id
            WHERE r.is_deleted = FALSE
            ORDER BY r.created_at DESC
            LIMIT 100
            """
        )
        rows = [dict(r) for r in cursor.fetchall()]
        for row in rows:
            if row.get("created_at"):
                row["created_at"] = str(row["created_at"])
        return success_response(message="Admin reviews", data={"reviews": rows})
    finally:
        cursor.close()
        conn.close()


@router.post("/admin/reviews/{review_id}/moderate")
def moderate_review(
    review_id: int,
    data: ModerationRequest,
    admin=Depends(get_current_admin),
):
    conn = get_connection()
    cursor = get_cursor(conn)

    try:
        cursor.execute(
            """
            UPDATE reviews
            SET
                moderation_status = %s,
                is_featured = COALESCE(%s, is_featured),
                updated_at = CURRENT_TIMESTAMP
            WHERE review_id = %s AND is_deleted = FALSE
            RETURNING package_id
            """,
            (
                data.moderation_status,
                data.is_featured,
                review_id,
            ),
        )

        if cursor.rowcount == 0:
            raise HTTPException(status_code=404, detail="Review not found")

        row = cursor.fetchone()
        package_id = row["package_id"] if hasattr(row, "keys") else row[0]
        _recalculate_package_rating(cursor, package_id)

        conn.commit()
        return success_response(message="Review moderation updated")
    except HTTPException:
        conn.rollback()
        raise
    finally:
        cursor.close()
        conn.close()


@router.delete("/admin/reviews/{review_id}")
def admin_remove_review(
    review_id: int,
    admin=Depends(get_current_admin),
):
    conn = get_connection()
    cursor = get_cursor(conn)

    try:
        cursor.execute(
            """
            UPDATE reviews
            SET is_deleted = TRUE, updated_at = CURRENT_TIMESTAMP
            WHERE review_id = %s
            RETURNING package_id
            """,
            (review_id,),
        )

        if cursor.rowcount == 0:
            raise HTTPException(status_code=404, detail="Review not found")

        row = cursor.fetchone()
        package_id = row["package_id"] if hasattr(row, "keys") else row[0]
        _recalculate_package_rating(cursor, package_id)
        conn.commit()
        return success_response(message="Review removed")
    except HTTPException:
        conn.rollback()
        raise
    finally:
        cursor.close()
        conn.close()
