# Database Documentation

Schema baseline: `backend/schema.sql`

## Main Tables

- `users`: JWT-authenticated customer, vendor, and admin-linked profiles
- `agents`: operational staff records
- `admins`: administrative users
- `vendors`: marketplace vendors and verification state
- `packages`: agency travel packages, categories, pricing, gallery, ratings
- `package_images`: normalized package gallery images
- `trip_batches`: package departures, seat inventory, pickup, and guide details
- `bookings`: booking lifecycle and agency review workflow
- `payment_transactions`: Razorpay orders, payment ids, statuses, failure reason, and retry metadata
- `ai_chat_history`: prompt/response history for AI interactions
- `notifications`: customer and vendor notification feed
- `saved_itineraries`: customer AI itineraries
- `invoices`: invoice issue tracking
- `booking_notes`: internal or customer-visible notes
- `activity_logs`: admin/agent action audit trail
- `analytics_events`: event stream for future analytics

## Key Relationships

- `users.id -> bookings.user_id`
- `users.id -> vendors.user_id`
- `packages.id -> bookings.package_id`
- `packages.id -> package_images.package_id`
- `packages.id -> trip_batches.package_id`
- `agents.id -> bookings.agent_id`
- `bookings.booking_id -> payment_transactions.booking_id`
- `bookings.id -> invoices.booking_id`
- `bookings.id -> booking_notes.booking_id`
- `trips.id -> saved_itineraries.trip_id`

## Normalization Notes

The schema separates users, vendors, bookings, packages, payment transactions, invoices, AI records, and logs so SaaS operations can scale without duplicating customer, operator, or package data.
