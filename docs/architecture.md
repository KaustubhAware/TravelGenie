# System Architecture

TravelGenie follows a modular SaaS architecture.

## Frontend Layer

- React + Vite single page application
- Route-level lazy loading for production bundle optimization
- Tailwind CSS enterprise dashboard UI
- Service layer in `frontend/src/services`
- Reusable layouts, protected routes, error boundaries, loading states

## Backend Layer

- FastAPI REST API
- Modular routers in `backend/app/routes`
- Centralized database access in `backend/app/db.py`
- Centralized configuration in `backend/app/config.py`
- Standard response helpers in `backend/app/responses.py`

## Authentication Layer

- JWT + PostgreSQL authentication for customers, vendors, admins, and agents
- Compatibility JWT payload includes both `id` and `uid` for older route compatibility
- Protected frontend routes and protected backend dependencies

## AI Layer

- Gemini itinerary generation
- Recommendation, sentiment, budget, hotel, restaurant, weather, and crowd insight modules
- AI outputs feed booking requests and PDF itinerary generation

## Database Layer

- PostgreSQL normalized business tables
- Users, vendors, packages, trip batches, bookings, Razorpay payment transactions, invoices, saved itineraries, notifications, AI history, and activity logs
- Schema baseline in `backend/schema.sql`

## Analytics Layer

- Admin dashboard metrics
- Revenue and booking trend endpoints
- Advanced analytics for retention, conversion, destinations, and activity logs
