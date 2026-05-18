# Diagram Support

## ER Diagram Entities

Use these as ER diagram boxes:

- users
- admins
- agents
- packages
- bookings
- payments
- invoices
- saved_itineraries
- booking_notes
- activity_logs
- analytics_events

## DFD Level 0

External entities:

- Customer
- Travel Agent
- Admin
- Firebase Auth
- Gemini AI
- PostgreSQL Database

Main process:

- TravelGenie AI Travel Agency Platform

## DFD Level 1 Processes

- Authentication Management
- AI Itinerary Generation
- Booking Request Management
- Agent/Admin Review
- Payment Simulation
- Invoice Generation
- Package Management
- Analytics Reporting

## Use Cases

- Customer registers/logs in
- Customer generates itinerary
- Customer submits booking request
- Agent reviews booking
- Admin approves/rejects booking
- Customer pays approved booking
- Customer downloads invoice
- Admin manages packages
- Admin views analytics

## Sequence Diagram: Booking Workflow

1. Customer submits booking request.
2. Backend stores request as `pending`.
3. Admin/agent reviews request.
4. Backend updates status to `under_review` or `payment_pending`.
5. Customer pays.
6. Backend updates payment status to `paid`.
7. Customer downloads invoice.
8. Admin analytics update from booking records.
