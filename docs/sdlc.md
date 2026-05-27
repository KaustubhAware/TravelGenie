# SDLC Support

## Requirement Analysis

TravelGenie addresses customer trip planning, travel agency booking operations, package management, analytics, invoices, and AI itinerary generation.

## Design

- Modular frontend pages, layouts, components, and services
- Modular FastAPI routers
- PostgreSQL normalized schema
- JWT + PostgreSQL authentication for customer, vendor, admin, and agent access
- Razorpay order creation and payment verification

## Implementation

Implementation is divided into modules:

- Customer portal
- Admin dashboard
- Agent workspace
- Booking lifecycle
- Package management
- AI itinerary engine
- Analytics and activity logs
- PDF invoices and itineraries

## Testing Strategy

- Backend syntax validation with `python -m py_compile`
- Frontend production build with `npm run build`
- Manual workflow tests:
  - Register/login
  - Generate AI trip
  - Submit booking request
  - Review/approve booking
  - Create Razorpay order and verify payment callback
  - Download invoice
  - View analytics

## Risk Management

- External AI failures: show fallback errors
- JWT secret exposure: store keys only in deployment secrets
- Razorpay/Gemini credential exposure: store keys only in deployment secrets
- Database migration drift: maintain `schema.sql`
- Bundle size: route-level lazy loading

## Future Scope

- Email/SMS notifications
- Durable cloud object storage for uploaded package/profile media
- Real-time agent/customer chat
- Automated test suite
