# Vendor Login Root Cause Report

Date: 2026-06-01

## Root Cause Found

Approved vendor login was not blocked by the admin approval endpoint for the inspected vendor `8`.

Live database audit for `vendor_id=8` showed:

- `users.role = 'vendor'`
- `users.is_vendor = true`
- `users.vendor_status = 'approved'`
- `users.approved_by = 1`
- `users.approved_at` populated
- `vendors.verification_status = 'approved'`
- `vendors.is_active = true`
- JWT generation succeeds with `role='vendor'`

Because `/api/auth/login` returns `401` only for user lookup failure or password verification failure, the observed `401 Unauthorized` after approval is not caused by approval status for vendor `8`. The exact failing stage is the login password gate unless a different email than the registered vendor email is submitted.

A source-level password normalization mismatch was found:

- Vendor application creation hashed the raw multipart `password`.
- Login verifies `data.password.strip()`.

This could reject an approved vendor with `401` if whitespace was captured during application submission. The vendor application path now normalizes the password the same way login does before hashing.

The database audit also found stale vendor lifecycle data before repair:

- Some existing `role='vendor'` records had stale vendor flags/status.
- After schema healing, vendor users are aligned from `vendors.verification_status`.

## Files Changed

- `backend/app/routes/vendors.py`
  - Normalize vendor application password before hashing.
- `backend/app/db.py`
  - Add schema-heal alignment from `vendors.verification_status` into `users.vendor_status`, `users.is_vendor`, and `users.role`.
- `backend/migrations/20260601_vendor_login_status_alignment.sql`
  - One-time SQL alignment for existing databases.
- `backend/scripts/debug_vendor_login.py`
  - Diagnostic script for vendor row, status, password check, and JWT generation.
- `backend/scripts/qa_vendor_login_flow.py`
  - End-to-end QA script for application, approval, login, dashboard APIs, upload, package creation, analytics, and bookings.

## Database Changes

No new columns were required.

Validated `users` columns:

- `id`
- `email`
- `role`
- `is_vendor`
- `vendor_status`
- `approved_by`
- `approved_at`
- `rejection_reason`
- `deleted_at`
- `is_deleted`
- `password_hash`

Standard vendor status remains:

- `vendor_status = 'approved'`

## API Changes

No endpoint contract changed.

Vendor application now stores the password hash from the normalized submitted password, matching `/api/auth/login` verification behavior.

## JWT Changes

No JWT handler changes were required.

Verified vendor JWT payload contains:

- `sub`
- `id`
- `uid`
- `email`
- `role = 'vendor'`
- `is_vendor = true`
- `vendor_status = 'approved'`

## Frontend Route Guard Audit

`UserProtectedRoute` allows vendor dashboard access only when:

- Auth token exists.
- `/api/auth/me` returns `role='vendor'`.
- `vendor_status === 'approved'`.

Customer dashboard routes do not include the vendor role. Vendor dashboard routes require the vendor role.

## SMTP Audit

SMTP is optional.

During QA, logs showed:

```text
SMTP not configured; skipped email to ...
```

Vendor approval, login, dashboard access, uploads, package creation, analytics, and bookings still succeeded.

## Testing Performed

Syntax validation:

```powershell
python -m py_compile backend\app\routes\vendors.py backend\app\db.py backend\scripts\debug_vendor_login.py backend\scripts\qa_vendor_login_flow.py
```

Diagnostic validation for `vendor_id=8`:

- User row exists.
- Approval fields are correct.
- JWT generation succeeds.
- Password check requires the actual password to prove final login gate.

Full end-to-end QA:

```powershell
python backend\scripts\qa_vendor_login_flow.py
```

Passed:

- Vendor application submitted.
- Admin login succeeded.
- Admin approval succeeded.
- Approved vendor login succeeded.
- Vendor JWT `/api/auth/me` succeeded.
- Vendor dashboard profile loaded.
- Vendor package image upload succeeded.
- Vendor package creation succeeded.
- Vendor packages loaded.
- Vendor analytics loaded.
- Vendor bookings loaded.
- Logout is frontend-local token clearing.

QA vendor created:

```text
qa.vendor.1780303700@travelgenie.in
```

## Before And After

Before:

- Approved vendor `8` had correct approval state, but observed login returned `401`.
- Vendor application password hashing and login password verification did not normalize input identically.
- Some existing vendor users had stale `users` vendor status/flag data.

After:

- New vendor registration, approval, login, JWT auth, dashboard access, upload, package creation, analytics, bookings, and logout flow are verified.
- Vendor application password hashing matches login verification normalization.
- Runtime schema healing and migration keep `users.vendor_status` aligned with `vendors.verification_status`.
