# Diagram Support

## ER Diagram Entities

Use these as ER diagram boxes:

- users
- admins
- agents
- vendors
- packages
- vendor_packages
- package_images
- trip_batches
- bookings
- payment_transactions
- ai_chat_history
- notifications
- invoices
- saved_itineraries
- booking_notes
- activity_logs
- analytics_events

## DFD Level 0

External entities:

- Customer
- Vendor
- Travel Agent/Admin
- Admin
- JWT Auth Service
- Gemini AI
- Razorpay
- PostgreSQL Database

Main process:

- TravelGenie AI Travel Agency Platform

## DFD Level 1 Processes

- Authentication Management
- AI Itinerary Generation
- Booking Request Management
- Agent/Admin Review
- Razorpay Payment Processing
- Invoice Generation
- Package Management
- Vendor Marketplace Management
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
5. Backend creates or reuses an idempotent Razorpay order.
6. Customer pays through Razorpay.
7. Backend verifies Razorpay signature and updates payment status to `paid`.
8. Customer downloads invoice.
9. Admin analytics update from booking records.
