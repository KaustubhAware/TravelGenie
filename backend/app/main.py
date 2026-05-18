    
# =====================================================
# app/main.py
# =====================================================

from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse

from fastapi.middleware.cors import (
    CORSMiddleware
)

from dotenv import load_dotenv
from app.config import get_settings
from app.responses import error_response, success_response

# =====================================================
# LOAD ENV
# =====================================================

load_dotenv()

settings = get_settings()

# =====================================================
# IMPORT ROUTES
# =====================================================

from app.routes import (

    cost,

    trips,

    booking,

    admin,

    auth,

    profile,

    itinerary,

    clients,

    packages
)

# =====================================================
# CREATE APP
# =====================================================

app = FastAPI(

    title=settings.APP_NAME,

    version=settings.APP_VERSION
)

missing_config = settings.validate()

if missing_config:

    print(
        "TravelGenie config warning. Missing/unsafe production keys:",
        ", ".join(missing_config)
    )

# =====================================================
# CORS
# =====================================================

app.add_middleware(

    CORSMiddleware,

    allow_origins=settings.cors_origin_list,

    allow_credentials=True,

    allow_methods=["*"],

    allow_headers=["*"],
)


@app.exception_handler(Exception)
async def global_exception_handler(
    request: Request,
    exc: Exception
):

    return JSONResponse(
        status_code=500,
        content=error_response(
            message="Internal server error",
            error=str(exc)
        )
    )

# =====================================================
# COST ROUTES
# =====================================================

app.include_router(

    cost.router,

    prefix="/api",

    tags=["Cost"]
)

# =====================================================
# TRIP ROUTES
# =====================================================

app.include_router(

    trips.router,

    prefix="/api",

    tags=["Trips"]
)

# =====================================================
# BOOKING ROUTES
# =====================================================

app.include_router(

    booking.router,

    prefix="/api",

    tags=["Bookings"]
)

# =====================================================
# ADMIN ROUTES
# =====================================================

app.include_router(

    admin.router,

    prefix="/api",

    tags=["Admin"]
)

# =====================================================
# AUTH ROUTES
# =====================================================

app.include_router(

    auth.router,

    prefix="/api",

    tags=["Authentication"]
)

# =====================================================
# PROFILE ROUTES
# =====================================================

app.include_router(

    profile.router,

    prefix="/api",

    tags=["Profile"]
)

# =====================================================
# ITINERARY ROUTES
# =====================================================

app.include_router(

    itinerary.router,

    prefix="/api",

    tags=["Itinerary"]
)

# =====================================================
# CLIENT ROUTES
# =====================================================

app.include_router(

    clients.router,

    prefix="/api",

    tags=["Clients"]
)

# =====================================================
# PACKAGE ROUTES
# =====================================================

app.include_router(

    packages.router,

    prefix="/api",

    tags=["Packages"]
)

# =====================================================
# ROOT
# =====================================================

@app.get("/")
def home():

    return success_response(
        message="TravelGenie API Running Successfully",
        data={
            "service": settings.APP_NAME,
            "version": settings.APP_VERSION,
            "environment": settings.ENVIRONMENT
        }
    )

# =====================================================
# HEALTH CHECK
# =====================================================

@app.get("/health")
def health_check():

    return success_response(
        message="TravelGenie Backend healthy",
        data={
            "status": "healthy",
            "service": "TravelGenie Backend"
        },
        status="healthy",
        service="TravelGenie Backend"
    )
