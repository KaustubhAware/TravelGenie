from passlib.context import CryptContext

pwd_context = CryptContext(
    schemes=["bcrypt"],
    deprecated="auto"
)

MAX_PASSWORD_LENGTH = 72


def _bcrypt_safe_password(password: str) -> str:
    encoded = (password or "").encode("utf-8")
    if len(encoded) <= MAX_PASSWORD_LENGTH:
        return password or ""
    return encoded[:MAX_PASSWORD_LENGTH].decode("utf-8", errors="ignore")

def hash_password(password: str):

    safe_password = _bcrypt_safe_password(password)

    return pwd_context.hash(safe_password)

def verify_password(
    plain_password: str,
    hashed_password: str
):

    safe_password = _bcrypt_safe_password(plain_password)

    return pwd_context.verify(
        safe_password,
        hashed_password
    )
