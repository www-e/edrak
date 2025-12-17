# Payment-based Services Lifecycle

## Overview

Payment-based services in SportologyPlus follow a direct purchase model where users select service tiers and durations, complete payment processing, and gain immediate access to service content. This model is distinct from the application-based services (nutrition, psychology, training) that require form submissions and specialist reviews.

## User Journey

### 1. Discovery Phase
- User visits `/services` page to browse all available offerings
- User clicks on service card (Training, Nutrition, Psychology) for detailed view
- User selects "Buy Now" option to proceed to payment

### 2. Service Selection Phase
- User lands on `/pay/service/[serviceSlug]` page
- User selects service tier (Silver, Gold, Diamond packages) and duration (monthly, 3 months, 6 months)
- User reviews pricing and service features
- User selects payment method (card or wallet)

### 3. Payment Processing Phase
- User submits payment data to `api.student.payment.initiatePayment`
- System validates payment information and creates pending payment record
- PayMob service processes payment (either via iframe or redirect)

### 4. Payment Verification Phase
- PayMob sends webhook to update payment status
- `processPaymentReturnAction` processes webhook and updates database
- For successful payments, enrollment/service access is created
- User redirected to `/payments/return` with success/failure status

### 5. Service Access Phase
- User gains access to service content through student dashboard
- For course-like services, content is available in `/student/courses`

## Technical Implementation

### Frontend Components
- `src/app/pay/service/[serviceSlug]/page.tsx` - Service payment selection interface
- `src/app/pay/[paymentToken]/page.tsx` - Secure payment iframe
- `src/app/payments/return/page.tsx` - Payment result handling
- `src/components/ui/payment` - Payment-related UI components

### Backend Services
- `src/server/api/routers/student/payment.ts` - Payment processing
- `src/lib/paymob.ts` - PayMob integration
- `src/lib/payment-return-processor.ts` - Payment webhook handling
- Database models in `prisma/schema.prisma` (Payment, Service, ServiceTier, ServicePrice)

### Payment Flow Integration
- PayMob iframe or redirect payment processing
- HMAC verification for security
- Payment status tracking and updates

## Current Inconsistencies

1. **Service Type Confusion**: The platform uses both application-based and payment-based models for similar services (e.g., training can be both application-based and payment-based)
2. **Limited Service Content**: Payment-based services currently lack actual service content/lessons compared to traditional course structures
3. **Missing Service Tiers**: Unlike courses, payment-based services don't have structured content with lessons and progress tracking
4. **Incomplete Integration**: The relationship between application-based and payment-based services isn't clearly defined

## MVP Critical Missing Features

### 1. Service Content Structure
- [ ] Content management for payment-based services (similar to course lessons)
- [ ] Progress tracking for payment-based service users
- [ ] Service delivery timeline and milestones

### 2. Service Catalog Management
- [ ] Administrative interface for managing service tiers and pricing
- [ ] Service content creation tools
- [ ] Service availability and scheduling

### 3. Enhanced Payment Integration
- [ ] Support for recurring payments for subscription-based services
- [ ] Payment failure handling and retry mechanisms
- [ ] Refund processing system

### 4. Service Access Control
- [ ] Proper access verification for payment-based services
- [ ] Session-based or time-limited access for certain service types
- [ ] Integration with existing enrollment verification system

### 5. Service Delivery Interface
- [ ] Dedicated section for payment-based service content
- [ ] Service progress tracking dashboard
- [ ] Content delivery tools for service providers

## Recommendations for MVP Implementation

### Priority 1: Define Service Model Boundary
- Clearly distinguish which services should be application-based vs. payment-based
- Avoid duplicating service models for the same offering
- Create decision framework for choosing service model

### Priority 2: Service Content Structure
- Develop content management system for payment-based services
- Create progress tracking similar to course system
- Implement service completion certificates if applicable

### Priority 3: Enhanced Payment Management
- Add recurring payment support for subscription-based services
- Improve payment failure handling and retry logic
- Add comprehensive payment history tracking

### Priority 4: Service Administration
- Create admin interface for managing service tiers and pricing
- Add tools for service content creation and management
- Implement service availability controls

This documentation clarifies the payment-based service lifecycle in SportologyPlus and identifies critical gaps that should be addressed for a complete MVP implementation.