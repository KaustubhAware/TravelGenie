# TravelGenie

TravelGenie is a full-stack AI-powered Maharashtra travel and trekking platform built for package discovery, AI trip planning, booking, vendor operations, admin analytics, reviews, notifications, and payment tracking.

The project is designed as an MCA major project and interview-ready SaaS MVP. It combines a React customer/vendor/admin frontend with a FastAPI backend, PostgreSQL database, JWT authentication, Gemini AI itinerary generation, and Razorpay payment integration.

## Core Features

- Customer package discovery with Maharashtra trek and camping packages.
- AI Planner for destination, duration, budget, difficulty, season, hotels, restaurants, map, tips, packing, and safety information.
- Saved AI trips with itinerary, recommendations, map, and budget data.
- Package detail pages with overview, highlights, itinerary, map, batches, reviews, and booking sidebar.
- Booking workflow with package, traveler, batch, and payment status data.
- Vendor dashboard for package creation, image upload, batch management, and booking visibility.
- Admin panel for dashboard analytics, bookings, packages, vendors, customers, reviews, guides, and operational views.
- Review and rating workflow with moderation-ready data.
- Notification and activity data for demo readiness.
- Production deployment support through Render backend and Vercel frontend configuration.

## Tech Stack

Frontend:

- React 18
- Vite
- React Router
- Tailwind CSS
- Lucide React and React Icons
- Chart.js / React Chart.js
- Leaflet / React Leaflet
- jsPDF and html2canvas

Backend:

- FastAPI
- PostgreSQL
- psycopg2
- JWT authentication
- Razorpay payment service
- Gemini AI itinerary/chat services
- SMTP notification support
- Local upload storage mounted at `/uploads`

## Project Structure

```text
TravelGenie/
  backend/
    app/
      main.py                 FastAPI entry point and router registration
      config.py               Environment configuration
      db.py                   Database connection and startup initialization
      auth/                   JWT and password utilities
      routes/                 API route modules
      services/               Payment, email, and notification services
      ml/                     AI itinerary, chat, recommendation, and cost modules
    migrations/               SQL migration files
    scripts/                  Seed, QA, smoke, and utility scripts
    uploads/                  Package, review, and vendor upload storage
    schema.sql                PostgreSQL schema
  frontend/
    src/
      routes/                 Public, dashboard, and admin route definitions
      layouts/                Landing, app, dashboard, and admin shells
      pages/                  Auth, public, dashboard, vendor, and admin pages
      components/             Shared UI, AI, admin, review, and layout components
      services/               API service wrappers
      utils/                  Auth token, validators, image, export, and analytics helpers
      styles/                 Global theme styles
    public/                   Static public assets
  docs/                       Architecture, API, deployment, SDLC, and final reports
  render.yaml                 Render deployment configuration
```

## Main Modules

### Authentication

TravelGenie supports customer, vendor, and admin access. Customer/vendor access uses JWT-backed frontend guards. Admin access has a separate protected admin branch. Route guards validate the session using backend APIs and redirect users to the correct login area when required.

Important files:

- `backend/app/auth/jwt_handler.py`
- `backend/app/auth/password_utils.py`
- `backend/app/auth/auth_routes.py`
- `frontend/src/routes/guards/UserProtectedRoute.jsx`
- `frontend/src/routes/guards/AdminProtectedRoute.jsx`
- `frontend/src/utils/authToken.js`

### Customer Module

Customer users can browse packages, open package details, book packages, view booking history, use the AI Planner, save AI trips, and manage profile data.

Main routes:

- `/dashboard`
- `/dashboard/packages`
- `/dashboard/packages/:slug`
- `/dashboard/bookings`
- `/dashboard/saved-trips`
- `/dashboard/ai-planner`
- `/dashboard/ai-chat`
- `/dashboard/profile`

### Vendor Module

Vendors use a dedicated protected dashboard. They can complete profile data, create packages, upload package images, create trip batches, and inspect bookings connected to their packages.

Main routes:

- `/vendor/dashboard`
- `/vendor/profile`

Main files:

- `frontend/src/pages/dashboard/VendorDashboard.jsx`
- `backend/app/routes/vendors.py`
- `frontend/src/services/vendorService.js`
- `frontend/src/services/uploadService.js`

### Admin Module

Admin users can monitor analytics, bookings, packages, customers, vendors, reviews, guides, and operational metrics. Admin pages use a consistent orange/slate palette, table layouts, cards, charts, and empty states.

Main routes:

- `/admin`
- `/admin/dashboard`
- `/admin/bookings`
- `/admin/analytics`
- `/admin/packages`
- `/admin/clients`
- `/admin/guides`
- `/admin/vendors`
- `/admin/reviews`

Main files:

- `frontend/src/layouts/AdminLayout.jsx`
- `frontend/src/components/admin/Sidebar.jsx`
- `frontend/src/pages/admin/AdminDashboard.jsx`
- `frontend/src/pages/admin/AdminPackages.jsx`
- `frontend/src/pages/admin/AdminClients.jsx`
- `frontend/src/pages/admin/AdminVendors.jsx`
- `frontend/src/pages/admin/AdminReviews.jsx`
- `backend/app/routes/admin.py`

### AI Planner Module

The AI Planner generates structured trip results from destination, budget, duration, traveler type, trip type, and preferences. The result is presented as clean cards:

- Compact summary
- Trip overview
- Day-wise timeline
- Budget breakdown
- Hotels
- Restaurants
- Map
- Weather
- Travel tips
- Packing checklist
- Safety information
- Transport and nearby attractions when available

Main files:

- `frontend/src/pages/NextPage.jsx`
- `frontend/src/components/ai/AITripResult.jsx`
- `backend/app/routes/trips.py`
- `backend/app/ml/ai_itinerary_generator.py`
- `backend/app/ml/prompt_builder.py`
- `backend/app/ml/chat_assistant.py`

### Booking And Payments

Bookings store package, traveler, status, payment status, amount, dates, and related package data. Razorpay integration creates and verifies payment transactions while keeping payment records attached to bookings.

Main files:

- `backend/app/routes/booking.py`
- `backend/app/routes/payment.py`
- `backend/app/services/payment_service.py`
- `frontend/src/pages/public/Booking.jsx`
- `frontend/src/pages/public/BookingSuccess.jsx`
- `frontend/src/pages/dashboard/MyBookings.jsx`
- `frontend/src/services/bookingService.js`

### Package Marketplace

Packages include title, location, duration, price, difficulty, best season, altitude, category, images, highlights, included/excluded items, pickup points, batches, and reviews.

Main files:

- `backend/app/routes/packages.py`
- `frontend/src/pages/dashboard/DashboardPackages.jsx`
- `frontend/src/pages/dashboard/DashboardPackageDetail.jsx`
- `frontend/src/services/packageService.js`

### Reviews

Customers can submit reviews for package experiences. Admin can view review data and presentation seed data includes approved realistic reviews.

Main files:

- `backend/app/routes/reviews.py`
- `frontend/src/components/reviews/ReviewSection.jsx`
- `frontend/src/components/reviews/ReviewForm.jsx`
- `frontend/src/pages/admin/AdminReviews.jsx`

### Notifications

Notifications support customer/vendor/admin presentation flows and are seeded for demo dashboards.

Main files:

- `backend/app/routes/notifications.py`
- `backend/app/services/notification_service.py`
- `frontend/src/services/notificationService.js`

## Environment Variables

Backend environment variables:

```env
APP_NAME=TravelGenie API
APP_VERSION=1.0.0
ENVIRONMENT=development
FRONTEND_URL=http://localhost:5173
CORS_ORIGINS=http://localhost:5173,http://127.0.0.1:5173

DB_HOST=localhost
DB_NAME=travelgenie
DB_USER=postgres
DB_PASSWORD=your_password
DB_PORT=5432
DATABASE_URL=

JWT_SECRET_KEY=replace_with_secure_key
ADMIN_SECRET_KEY=replace_with_secure_key
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin123

GEMINI_API_KEY=your_gemini_key
GEMINI_ITINERARY_API_KEY=your_gemini_key
GEMINI_CHAT_API_KEY=your_gemini_key
GEMINI_MODEL=gemini-2.5-flash
GEMINI_FALLBACK_MODEL=gemini-2.5-flash-lite

RAZORPAY_KEY_ID=your_key
RAZORPAY_KEY_SECRET=your_secret

SMTP_HOST=
SMTP_PORT=587
SMTP_USERNAME=
SMTP_PASSWORD=
SMTP_FROM_EMAIL=
SMTP_TLS=true
```

Frontend environment variables:

```env
VITE_API_BASE_URL=http://localhost:8000/api
```

## Local Setup

### Backend

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

Backend runs at:

```text
http://localhost:8000
```

API docs:

```text
http://localhost:8000/docs
```

Health check:

```text
http://localhost:8000/health
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at:

```text
http://localhost:5173
```

## Database Setup

Create a PostgreSQL database named `travelgenie`, configure backend environment variables, then run the master seed:

```bash
cd backend
python scripts/master_seed.py
```

The master seed applies schema setup, clears existing app data, and populates users, vendors, packages, batches, bookings, payments, reviews, notifications, AI history, and activity logs.

## Presentation Accounts

Use these after running `backend/scripts/master_seed.py`:

```text
Admin:
Username: admin
Password: value of ADMIN_PASSWORD in backend .env

Customer:
Email: ananya.patil@example.com
Password: Demo123

Vendor:
Email: vendor1@travelgenie.in
Password: Vendor123
```

Legacy Maharashtra seed script also prints:

```text
Admin email: admin@travelgenie.com
Customer email: traveler1@travelgenie.in
Customer password: Travel123
```

For the MCA demo, prefer `scripts/master_seed.py` because it creates complete linked vendor accounts, packages, bookings, payments, reviews, notifications, and saved AI history.

## Demo Flow

Recommended viva/presentation path:

1. Open landing page and show TravelGenie positioning.
2. Login as customer.
3. Open dashboard and package listing.
4. Open a package detail page and explain overview, highlights, itinerary, map, batches, reviews, and booking sidebar.
5. Start a booking and show booking confirmation/payment readiness.
6. Open AI Planner, generate a trip, explain AI output cards, save trip.
7. Open Saved Trips and show saved AI itinerary details.
8. Logout and login as vendor.
9. Show package creation, batch management, and booking visibility.
10. Logout and login as admin.
11. Show analytics, bookings, packages, vendors, customers, reviews, and operational data.

## Testing And QA

Frontend production build:

```bash
cd frontend
npm run build
```

Backend syntax check:

```bash
cd backend
python -m compileall app
```

Smoke scripts:

```bash
cd backend
python scripts/final_smoke_tests.py
python scripts/qa_vendor_login_flow.py
```

Manual QA checklist:

- Customer login, refresh, dashboard, saved trips, booking history, logout.
- Vendor login, refresh, package create, package edit/management, booking view, batch management, logout.
- Admin login, refresh, dashboard, analytics, vendors, packages, reviews, logout.
- No redirect loops.
- No role mismatch.
- No white screen.
- No user-facing session-expired message.
- No horizontal overflow at 320, 375, 768, 1024, and 1440 px.

## Deployment

Backend:

- Render can use `render.yaml`.
- Configure all backend environment variables in Render.
- Set production `CORS_ORIGINS` to the frontend URL.
- Configure PostgreSQL connection through `DATABASE_URL`.
- Use secure JWT/admin secrets.
- Use real Razorpay and Gemini credentials only in secure environment variables.

Frontend:

- Vercel config exists in `frontend/vercel.json`.
- Configure `VITE_API_BASE_URL` to the deployed backend `/api` URL.
- Run `npm run build` before deployment.

## Security Notes

- Do not commit real API keys.
- Replace default secrets before production.
- Use separate Razorpay test and live keys.
- Keep production CORS restricted to trusted frontend domains.
- Store uploads in a managed object store for production if the app needs persistent cloud files.

## Current Readiness Status

Presentation readiness: Ready for MCA demo after running the seed script and verifying environment variables.

Verified in this audit:

- Frontend production build passes.
- Customer/vendor/admin route branches are statically mapped.
- Vendor profile navigation points to the vendor route.
- AI Planner result uses compact card-based response styling.
- Package detail page now exposes the required cards instead of hiding core sections behind tabs.
- User-facing session-expired wording was removed from frontend helpers.
- Seed output was cleaned to avoid mismatched demo credentials in the legacy seed script.

Remaining risks:

- Full browser-based responsive QA at all requested widths still requires running the app with live backend data.
- Admin bookings and analytics routes currently reuse the dashboard component instead of separate dedicated page components.
- Payment and Gemini behavior depends on valid external service keys in the active environment.

