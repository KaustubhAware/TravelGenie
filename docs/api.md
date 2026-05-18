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

- Customer routes use Firebase bearer tokens.
- Admin/agent routes use JWT bearer tokens from `/api/admin/login`.

## Core Route Groups

- Auth: `/admin/login`, `/admin/save-user`
- AI Trips: `/generate-trip`, `/save-itinerary`, `/my-itineraries`
- Bookings: `/save-booking`, `/my-bookings`, `/bookings/{booking_id}`, `/update-payment`
- Admin Operations: `/admin/stats`, `/admin/review-booking`, `/admin/update-status`, `/admin/cancel-booking`
- Analytics: `/admin/revenue-by-date`, `/admin/top-destinations`, `/admin/advanced-analytics`, `/admin/activity-logs`
- Packages: `/packages`, `/packages/{id}`
- Clients: `/admin/clients`

## Booking Lifecycle

`pending -> under_review -> payment_pending -> paid -> completed`

Alternative states: `rejected`, `cancelled`.
