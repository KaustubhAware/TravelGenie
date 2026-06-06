# Final Project Audit

Date: 2026-06-01

## Issues Found

- Gemini requests had model fallback but no retry/backoff per model. Transient `503 UNAVAILABLE` failures could still collapse AI trip generation and chat.
- AI routes returned `502 Bad Gateway` for temporary Gemini unavailability, which made transient model pressure look like an application failure.
- Gemini logs did not include attempt-level latency, model, and error information.
- Notification unread count was calculated only from the first 50 fetched notification rows.
- Notification mark-read was not idempotent for already-read notifications.
- Frontend notification polling could happen too frequently through interval plus focus refreshes.
- Concurrent notification list calls could duplicate requests.
- Uploaded SVG paths could still be rendered by `resolveImageUrl` if already present in data.
- Frontend upload service did not block SVG before sending the request.
- Vendor application password hashing did not normalize input the same way login verification does.
- Existing vendor user flags could drift from the vendor application status in legacy/local data.
- AI trip planner hotel cards and map popups displayed invented fallback hotel rating/price values when Gemini did not return those fields.
- AI weather and budget cards did not handle partial AI data gracefully.

## Root Causes

- Gemini integration used a single SDK call per candidate model with no transient retry loop.
- Error mapping treated all non-quota AI runtime failures as `502`.
- Notification list response used the current page result to calculate unread counts instead of querying all unread rows.
- Frontend polling was independently triggered by interval and focus without a minimum refresh gap.
- Image resolution trusted any `/uploads/...` path extension.
- Vendor registration and login used different password normalization points.
- Runtime schema healing only handled missing/null vendor columns, not status drift from `vendors`.

## Fixes Applied

- Added Gemini retry/backoff and model fallback for itinerary and chat generation.
- Added Gemini logs for model name, attempt number, latency in milliseconds, and error details.
- Changed AI trip and chat route failures from `502` to user-friendly `503` unavailable responses, while preserving `429` for quota.
- Updated Gemini defaults to current Flash model names.
- Fixed notification unread counts with a dedicated `COUNT(*) WHERE is_read = FALSE` query.
- Made notification mark-read idempotent when the notification already belongs to the user and is already read.
- Added frontend notification request de-duplication.
- Raised auto-refresh default interval to 60 seconds, enforced a 15 second minimum interval, and throttled focus refreshes.
- Reduced dashboard topbar notification polling to 60 seconds.
- Blocked uploaded SVG rendering in `resolveImageUrl`.
- Added frontend upload validation for JPG/JPEG, PNG, and WEBP only.
- Normalized vendor application passwords before hashing.
- Added vendor status alignment healing and a migration that aligns `users.role`, `users.is_vendor`, and `users.vendor_status` from `vendors.verification_status`.
- Removed fake hotel fallback values from AI trip result cards and map popups.
- Improved weather and budget rendering for partial AI output.
- Added repeatable smoke-test scripts for vendor login and final project flows.

## Files Changed

- `backend/app/config.py`
- `backend/app/db.py`
- `backend/app/ml/ai_itinerary_generator.py`
- `backend/app/ml/chat_assistant.py`
- `backend/app/routes/chat.py`
- `backend/app/routes/notifications.py`
- `backend/app/routes/trips.py`
- `backend/app/routes/vendors.py`
- `backend/migrations/20260601_vendor_login_status_alignment.sql`
- `backend/scripts/debug_vendor_login.py`
- `backend/scripts/final_smoke_tests.py`
- `backend/scripts/qa_vendor_login_flow.py`
- `frontend/src/components/ai/BudgetBreakdownCard.jsx`
- `frontend/src/components/ai/HotelRecommendationCard.jsx`
- `frontend/src/components/ai/TravelMap.jsx`
- `frontend/src/components/ai/WeatherCard.jsx`
- `frontend/src/components/layout/DashboardTopbar.jsx`
- `frontend/src/hooks/useAutoRefresh.js`
- `frontend/src/services/notificationService.js`
- `frontend/src/services/uploadService.js`
- `frontend/src/utils/imageUrl.js`
- `docs/VENDOR_LOGIN_ROOT_CAUSE_REPORT.md`
- `docs/FINAL_PROJECT_AUDIT.md`

## Database Changes

- Added `backend/migrations/20260601_vendor_login_status_alignment.sql`.
- Added matching runtime schema-heal alignment for existing databases.
- No new columns were required.
- Verified smoke coverage for auth, admin, packages, bookings, reviews, notifications, saved AI itineraries, vendor approval/login, vendor uploads, and payments.

## API Changes

- `/api/generate-trip`
  - Temporary AI failures now return `503` with a user-friendly unavailable message.
  - Quota failures still return `429`.
- `/api/chat`
  - Temporary AI failures now return `503` with a user-friendly unavailable message.
  - Quota failures still return `429`.
- `/api/notifications`
  - `unread_count` now reflects all unread notifications for the user, not just the current list page.
- `/api/notifications/{id}/read`
  - Already-read notifications are accepted idempotently.

## Testing Evidence

Backend compile:

```powershell
python -m compileall -q backend/app backend/scripts
```

Result: passed.

Frontend lint:

```powershell
npm run lint
```

Result: passed.

Frontend build:

```powershell
npm run build
```

Result: passed.

Full smoke suite:

```powershell
python backend\scripts\final_smoke_tests.py
```

Passed areas:

- admin auth
- admin dashboard stats
- admin analytics
- admin clients
- admin vendors
- admin packages
- admin reviews
- admin bookings
- package list and detail
- customer register and JWT
- notification list, unread count, mark-read, mark-all-read
- booking creation and customer bookings
- review creation and admin review visibility
- AI itinerary save and saved AI trips
- AI planner generate
- AI chat
- payment order creation
- vendor register, approval, login
- vendor dashboard profile
- vendor analytics
- vendor bookings
- vendor packages
- vendor image upload
- vendor package creation
- SVG upload blocking

Vendor login diagnostic:

```powershell
python backend\scripts\debug_vendor_login.py --vendor-id 8
python backend\scripts\debug_vendor_login.py --email qa.vendor.1780303700@travelgenie.in --password Vendor123
```

Result: approved vendor state and JWT generation verified; QA vendor password verification passed.

## Remaining Recommendations

- Move smoke-test-created records and upload artifacts into a dedicated test database or cleanup fixture before production use.
- Add CI jobs for `compileall`, `npm run lint`, `npm run build`, and `backend/scripts/final_smoke_tests.py`.
- Consider Alembic for migration ordering and repeatability.
- Add explicit automated tests for expired JWTs and suspended vendor route guards.
- Configure Razorpay test keys and SMTP in staging to validate the third-party success paths, not only graceful optional behavior.
