def success_response(
    message="Request completed successfully",
    data=None,
    **legacy_fields
):
    payload = {
        "success": True,
        "message": message,
        "data": data or {},
    }

    payload.update(legacy_fields)

    return payload


def error_response(
    message="Request failed",
    error=None,
    data=None,
    detail=None,
):
    return {
        "success": False,
        "message": message,
        "error": error or message,
        "detail": detail if detail is not None else error or message,
        "data": data or {},
    }
