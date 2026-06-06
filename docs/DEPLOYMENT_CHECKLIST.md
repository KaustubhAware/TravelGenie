# TravelGenie Deployment Checklist

Use this checklist before MCA demo, portfolio deployment, or production release.

## 1. Environment Variables

### Backend (`backend/.env`)

| Variable | Required | Notes |
|----------|----------|-------|
| `DB_HOST`, `DB_NAME`, `DB_USER`, `DB_PASSWORD` | Yes | PostgreSQL connection |
| `JWT_SECRET` | Yes | Strong random secret in production |
| `FRONTEND_URL` | Yes | e.g. `https://your-domain.com` |
| `CORS_ORIGINS` | Yes | Comma-separated allowed origins |
| `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET` | For payments | Test keys for staging |
| `GEMINI_API_KEY` | For AI | Google Gemini SDK |
| `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASSWORD` | Optional | App works without SMTP |
| `SMTP_FROM_EMAIL` | Optional | Sender address |

### Frontend (`frontend/.env`)

| Variable | Required | Notes |
|----------|----------|-------|
| `VITE_API_BASE_URL` | Yes | e.g. `https://api.your-domain.com/api` |

## 2. Database

- [ ] PostgreSQL running and reachable
- [ ] Schema applied (`backend/schema.sql` or migrations)
- [ ] Run `backend/migrations/` if upgrading existing DB
- [ ] Admin user exists for admin panel access
- [ ] Indexes on `bookings.user_id`, `notifications.user_id`, `reviews.package_id`

## 3. File Uploads

- [ ] `backend/uploads/` writable by API process
- [ ] Subfolders: `packages/`, `vendors/logos/`, `vendors/documents/`
- [ ] Nginx/reverse proxy serves `/uploads` or API static mount configured
- [ ] Only `jpg`, `jpeg`, `png`, `webp` allowed (SVG blocked)

## 4. CORS & API

- [ ] `CORS_ORIGINS` includes production frontend URL
- [ ] API prefix `/api` matches frontend `VITE_API_BASE_URL`
- [ ] Health check: `GET /api/packages` returns 200 without auth

## 5. Payments (Razorpay)

- [ ] Live/test keys match environment
- [ ] Webhook URL configured (if used)
- [ ] Test: create booking → create order → verify payment
- [ ] Confirm no duplicate orders on callback retry

## 6. AI (Gemini)

- [ ] `GEMINI_API_KEY` valid and quota available
- [ ] AI planner (`/api/ai-itinerary`) responds
- [ ] AI chat (`/api/chat`) responds
- [ ] Save itinerary persists to `saved_itineraries`

## 7. Email (SMTP)

- [ ] Configure SMTP for production emails
- [ ] Without SMTP: booking/payment/vendor emails are skipped (app continues)
- [ ] Test: booking confirmation, vendor approval email

## 8. Frontend Build

```bash
cd frontend
npm ci
npm run lint
npm run build
```

- [ ] Deploy `frontend/dist/` to static host or CDN
- [ ] SPA fallback: all routes → `index.html`

## 9. Backend Run

```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --host 0.0.0.0 --port 8000
```

- [ ] Use gunicorn/uvicorn workers in production
- [ ] HTTPS terminated at reverse proxy

## 10. Smoke Tests

```bash
cd backend
python -m compileall -q app scripts
python scripts/final_smoke_tests.py
```

Expected: all `PASS` lines, exit code 0.

## 11. Manual QA (Pre-Demo)

### Customer
- [ ] Register / login
- [ ] Dashboard stats, notifications, saved trips count
- [ ] Browse packages, book, pay
- [ ] Submit review
- [ ] AI planner + save trip + open Saved Trips

### Vendor
- [ ] Register → admin approve → login
- [ ] Create package with image upload
- [ ] View bookings / analytics

### Admin
- [ ] Login, dashboard stats
- [ ] Approve vendors, moderate reviews
- [ ] Notifications unread count + mark read

### UI
- [ ] Orange/white theme consistent
- [ ] Maps load on package detail, booking, AI planner, saved trips
- [ ] Images from `/uploads` resolve correctly

## 12. Security

- [ ] Change default JWT secret
- [ ] Do not commit `.env`
- [ ] Admin routes protected
- [ ] Vendor portal blocked until `approved`
- [ ] Soft-deleted users cannot authenticate

---

**Last verified:** 2026-06-01 — `compileall`, `npm run lint`, `npm run build`, `final_smoke_tests.py` all passing.
