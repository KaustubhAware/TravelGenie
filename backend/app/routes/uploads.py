from pathlib import Path
from uuid import uuid4

from fastapi import APIRouter, Depends, File, Header, HTTPException, UploadFile

from app.auth.jwt_handler import verify_access_token
from app.config import get_settings
from app.routes.auth import verify_token as verify_admin_token
from app.responses import success_response

router = APIRouter(prefix="/uploads", tags=["Uploads"])

ALLOWED_IMAGE_TYPES = {
    "image/jpeg": ".jpg",
    "image/png": ".png",
    "image/webp": ".webp",
    "image/svg+xml": ".svg",
}

MAX_IMAGE_SIZE = 5 * 1024 * 1024


def _upload_root() -> Path:
    root = Path(get_settings().UPLOAD_DIR).resolve()
    root.mkdir(parents=True, exist_ok=True)
    return root


def get_upload_user(authorization: str = Header(None)):
    if not authorization:
        raise HTTPException(status_code=401, detail="Authorization header missing")

    scheme, _, token = authorization.partition(" ")
    if scheme.lower() != "bearer" or not token:
        raise HTTPException(status_code=401, detail="Invalid token format")

    try:
        user = verify_access_token(token)
    except HTTPException:
        user = verify_admin_token(token)

    role = user.get("role")
    if role not in {"admin", "vendor"}:
        raise HTTPException(status_code=403, detail="Insufficient permissions")

    return user


@router.post("/package-image")
def upload_package_image(
    file: UploadFile = File(...),
    user=Depends(get_upload_user),
):
    content_type = file.content_type or ""
    if content_type not in ALLOWED_IMAGE_TYPES:
        raise HTTPException(
            status_code=400,
            detail="Only JPG, PNG, WEBP, and SVG images are allowed",
        )

    package_dir = _upload_root() / "packages"
    package_dir.mkdir(parents=True, exist_ok=True)

    suffix = ALLOWED_IMAGE_TYPES[content_type]
    filename = f"{uuid4().hex}{suffix}"
    target = package_dir / filename

    size = 0
    try:
        with target.open("wb") as buffer:
            while chunk := file.file.read(1024 * 1024):
                size += len(chunk)
                if size > MAX_IMAGE_SIZE:
                    target.unlink(missing_ok=True)
                    raise HTTPException(
                        status_code=413,
                        detail="Image size must be 5 MB or less",
                    )
                buffer.write(chunk)
    finally:
        file.file.close()

    return success_response(
        message="Package image uploaded",
        data={
            "path": f"/uploads/packages/{filename}",
            "content_type": content_type,
            "size": size,
        },
    )
