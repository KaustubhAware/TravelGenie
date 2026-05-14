# =====================================================
# app/main.py
# =====================================================

from fastapi import FastAPI

from fastapi.middleware.cors import CORSMiddleware

from dotenv import load_dotenv

load_dotenv()

# =====================================================
# IMPORT ROUTES
# =====================================================

from app.routes import (
    recommend,
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
    title="TravelGenie API",
    version="1.0.0"
)

# =====================================================
# CORS
# =====================================================

app.add_middleware(
    CORSMiddleware,

    allow_origins=["*"],

    allow_credentials=True,

    allow_methods=["*"],

    allow_headers=["*"],
)

# =====================================================
# API ROUTES
# =====================================================

# RECOMMENDATION ROUTES

app.include_router(
    recommend.router,
    prefix="/api",
    tags=["Recommendations"]
)

# COST ROUTES

app.include_router(
    cost.router,
    prefix="/api",
    tags=["Cost"]
)

# TRIP ROUTES

app.include_router(
    trips.router,
    prefix="/api",
    tags=["Trips"]
)

# BOOKING ROUTES

app.include_router(
    booking.router,
    prefix="/api",
    tags=["Bookings"]
)

# ADMIN ROUTES

app.include_router(
    admin.router,
    prefix="/api",
    tags=["Admin"]
)

# AUTH ROUTES

app.include_router(
    auth.router,
    prefix="/api",
    tags=["Authentication"]
)

# PROFILE ROUTES

app.include_router(
    profile.router,
    prefix="/api",
    tags=["Profile"]
)

# ITINERARY ROUTES

app.include_router(
    itinerary.router,
    prefix="/api",
    tags=["Itinerary"]
)

# CLIENT ROUTES

app.include_router(
    clients.router,
    prefix="/api",
    tags=["Clients"]
)

# PACKAGE ROUTES

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

    return {
        "message": "TravelGenie API Running Successfully"
    }

# =====================================================
# HEALTH CHECK
# =====================================================

@app.get("/health")
def health_check():

    return {
        "status": "healthy",
        "service": "TravelGenie Backend"
    }