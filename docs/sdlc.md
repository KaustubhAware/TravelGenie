# SDLC Support

## Requirement Analysis

TravelGenie addresses customer trip planning, travel agency booking operations, package management, analytics, invoices, and AI itinerary generation.

## Design

- Modular frontend pages, layouts, components, and services
- Modular FastAPI routers
- PostgreSQL normalized schema
- Firebase customer authentication
- JWT admin/agent access

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
  - Simulate payment
  - Download invoice
  - View analytics

## Risk Management

- External AI failures: show fallback errors
- Firebase key exposure: use environment and ignored service account files
- Database migration drift: maintain `schema.sql`
- Bundle size: route-level lazy loading

## Future Scope

- Real payment gateway
- Email/SMS notifications
- File upload validation and cloud storage
- Real-time agent/customer chat
- Automated test suite
