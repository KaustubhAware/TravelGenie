# API Documentation

Base path: `/api`

## Response Convention

New production endpoints should use:

```json
{
  "success": true,
  "message": "Request completed",
  "data": {}
}
```

Legacy-compatible endpoints may also expose top-level fields such as `bookings`, `packages`, or `access_token` so existing frontend flows remain stable.

## Authentication

- Customer and vendor routes use JWT bearer tokens from `/api/auth/login`.
- Admin/agent routes use JWT bearer tokens from `/api/admin/login`.
- Authenticated JWT payloads expose `id`, `uid`, `email`, and `role`.

## Core Route Groups

- Auth: `/auth/register`, `/auth/login`, `/auth/me`, `/admin/login`
- AI Trips: `/generate-trip`, `/save-itinerary`, `/my-itineraries`
- Bookings: `/save-booking`, `/my-bookings`, `/bookings/{booking_id}`, `/update-payment`
- Razorpay Payments: `/create-order`, `/verify-payment`, `/payment-failed`
- Admin Operations: `/admin/stats`, `/admin/review-booking`, `/admin/update-status`, `/admin/cancel-booking`
- Analytics: `/admin/revenue-by-date`, `/admin/top-destinations`, `/admin/advanced-analytics`, `/admin/activity-logs`
- Packages: `/packages`, `/packages/{id}`
- Uploads: `/uploads/package-image`
- Vendors: `/vendors/me`, `/vendors/packages`, `/vendors/batches`, `/vendors/bookings`, `/vendors/analytics`
- Clients: `/admin/clients`

## Booking Lifecycle

`pending -> under_review -> payment_pending -> paid -> completed`

Alternative states: `rejected`, `cancelled`.

## Payment Lifecycle

TravelGenie uses Razorpay order creation and signature verification. Payment creation is idempotent: one booking can have only one active pending order, retries reuse that order, and duplicate callbacks are handled safely.
