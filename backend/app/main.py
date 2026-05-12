# app/main.py

from fastapi import FastAPI

from fastapi.middleware.cors import CORSMiddleware

from dotenv import load_dotenv

load_dotenv()

from app.routes import (
    recommend,
    cost,
    trips,
    booking,
    admin,
    auth,
    profile,
    itinerary
)

app = FastAPI()

# ============================================
# ================= CORS =====================
# ============================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ============================================
# ================= ROUTES ===================
# ============================================

app.include_router(
    recommend.router,
    prefix="/api"
)

app.include_router(
    cost.router,
    prefix="/api"
)

app.include_router(
    trips.router,
    prefix="/api"
)

app.include_router(
    booking.router,
    prefix="/api"
)

app.include_router(
    admin.router,
    prefix="/api"
)

app.include_router(
    auth.router,
    prefix="/api"
)

app.include_router(
    profile.router,
    prefix="/api"
)

# ============================================
# ============= ITINERARY ROUTES =============
# ============================================

app.include_router(
    itinerary.router,
    prefix="/api"
)

# ============================================
# ================= HEALTH ===================
# ============================================

@app.get("/")
def home():

    return {
        "message": "API Running"
    }