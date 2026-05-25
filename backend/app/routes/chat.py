import logging
from typing import List, Optional

from fastapi import APIRouter, Depends
from pydantic import BaseModel, Field

from app.db import get_connection, get_cursor
from app.firebase_auth import verify_firebase_token
from app.ml.chat_assistant import generate_chat_reply, sanitize_prompt
from app.responses import success_response

logger = logging.getLogger(__name__)

router = APIRouter()


class ChatMessage(BaseModel):
    role: str = Field(..., pattern="^(user|assistant)$")
    content: str = Field(..., max_length=2000)


class ChatRequest(BaseModel):
    message: str = Field(..., min_length=1, max_length=2000)
    history: Optional[List[ChatMessage]] = []


def _fetch_active_packages(cursor):
    try:
        cursor.execute(
            """
            SELECT title, location, price
            FROM packages
            WHERE COALESCE(status, 'active') = 'active'
            ORDER BY id DESC
            LIMIT 20
            """
        )
        rows = cursor.fetchall()
        if rows and hasattr(rows[0], "keys"):
            return [dict(row) for row in rows]
        return [
            {
                "title": r[0],
                "destination": r[1],
                "price": r[2],
            }
            for r in rows
        ]
    except Exception as exc:
        logger.warning("Could not load packages for chat context: %s", exc)
        return []


@router.post("/chat")
def travel_chat(
    data: ChatRequest,
    user=Depends(verify_firebase_token),
):
    message = sanitize_prompt(data.message)
    history = [
        {"role": m.role, "content": sanitize_prompt(m.content)}
        for m in (data.history or [])
    ]

    conn = get_connection()
    cursor = get_cursor(conn)

    try:
        packages = _fetch_active_packages(cursor)
    finally:
        cursor.close()
        conn.close()

    try:
        reply = generate_chat_reply(message, history, packages)
    except ValueError as exc:
        from fastapi.responses import JSONResponse
        from app.responses import error_response
        return JSONResponse(
            status_code=400,
            content=error_response(
                message=str(exc),
                error="ConfigError",
                detail=str(exc),
            )
        )
    except RuntimeError as exc:
        from fastapi.responses import JSONResponse
        from app.responses import error_response
        status_code = 429 if "quota" in str(exc).lower() else 502
        return JSONResponse(
            status_code=status_code,
            content=error_response(
                message=str(exc),
                error="AIServiceError",
                detail=str(exc),
            )
        )

    return success_response(
        message="Chat response generated",
        data={"reply": reply, "role": "assistant"},
    )
