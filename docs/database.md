# Database Documentation

Schema baseline: `backend/schema.sql`

## Main Tables

- `users`: Firebase-linked customer profiles and preferences
- `agents`: operational staff records
- `admins`: administrative users
- `packages`: agency travel packages, categories, pricing, gallery, ratings
- `bookings`: booking lifecycle and agency review workflow
- `saved_itineraries`: customer AI itineraries
- `payments`: simulated payment records
- `invoices`: invoice issue tracking
- `booking_notes`: internal or customer-visible notes
- `activity_logs`: admin/agent action audit trail
- `analytics_events`: event stream for future analytics

## Key Relationships

- `users.id -> bookings.user_id`
- `packages.id -> bookings.package_id`
- `agents.id -> bookings.agent_id`
- `bookings.id -> payments.booking_id`
- `bookings.id -> invoices.booking_id`
- `bookings.id -> booking_notes.booking_id`

## Normalization Notes

The schema separates users, bookings, packages, payments, invoices, and logs so agency operations can scale without duplicating customer or package data.
