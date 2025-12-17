# Services Lifecycle Documentation

## Overview

This document outlines the complete lifecycle of services in the SportologyPlus platform, covering both application-based services (nutrition, psychology, training) and payment-based services. The platform supports two primary service models:

1. **Application-based services** - Require detailed application forms and specialist review
2. **Payment services** - Direct purchase model with immediate access upon payment

## Service Models Comparison

| Aspect | Application-based Services | Payment-based Services |
|--------|---------------------------|------------------------|
| User Journey | Form submission → Review → Specialist Contact | Service selection → Payment → Immediate Access |
| Required Input | Comprehensive application forms | Service tier and duration selection |
| Approval Process | Manual review by admin/specialist | Automated upon payment |
| Specialist Assignment | Yes (nutritionist, psychologist, trainer) | No (content-based access) |
| Service Delivery | Personalized consultation/support | Self-paced learning content |

## Complete Services Lifecycle

### 1. User Discovery Phase
- Users navigate to `/services` to view available offerings
- Users can access specific service pages:
  - `/nutrition` - Nutrition programs
  - `/psychology` - Psychology consultations
  - `/training` - Training programs
- Each service page provides detailed information, packages, and application/purchase options

### 2. Application/Purchase Phase
- **Application-based**: User fills out comprehensive form (nutrition, psychology, or training)
- **Payment-based**: User selects service tier and duration at `/pay/service/[serviceSlug]`

### 3. Processing Phase
- **Application-based**: Form data stored in respective tables (NutritionApplication, PsychologyApplication, TrainingApplication)
- **Payment-based**: Payment processed via PayMob, enrollment created upon successful payment

### 4. Review/Admin Phase
- **Application-based**: Admin reviews and approves applications at `/admin/applications`
- **Payment-based**: Automatic processing via payment webhook

### 5. Service Delivery Phase
- **Application-based**: Specialist contacts user directly to provide personalized service
- **Payment-based**: User gains access to content through student dashboard

## Inconsistencies Identified

1. **Professor Dashboard Missing**: The `/professor` route exists but has no actual implementation. The platform lacks a dedicated professor dashboard for managing their assigned applications or delivering services.

2. **File Upload Handling**: The training application requires body photos, but the backend implementation for handling these uploads appears to be missing from the server code.

3. **Notification System**: No automated notification system exists to inform users about application status changes or service availability.

4. **Service Tracking**: Limited tracking of service delivery progress for application-based services (no clear metrics on how well the service is being delivered).

## MVP Critical Missing Features

### 1. Professor Dashboard (Critical)
- [ ] Professor login and authentication system
- [ ] Professor-specific dashboard showing assigned applications
- [ ] Tools for delivering personalized services (e.g., creating nutrition plans, training programs)
- [ ] Communication tools for interacting with clients

### 2. File Upload System (Critical)
- [ ] Backend implementation for training application photo uploads
- [ ] Secure storage and retrieval of client photos
- [ ] File validation and security measures

### 3. Notification System (Important)
- [ ] Automated email/SMS notifications for application status changes
- [ ] Payment confirmation notifications
- [ ] Service delivery reminders

### 4. Basic Reporting (MVP)
- [ ] Simple analytics dashboard for service utilization
- [ ] Application conversion rates
- [ ] Revenue reporting by service type

### 5. Service Completion Tracking (MVP)
- [ ] Mechanism for specialists to mark services as completed
- [ ] Client feedback collection system
- [ ] Service quality metrics

### 6. User Service History (MVP)
- [ ] Dashboard section showing user's service history
- [ ] Access to past consultations/programs
- [ ] Renewal reminders

## Recommendations for MVP Implementation

### Priority 1: Professor Dashboard
- Create basic professor routes at `/professor/dashboard`
- Implement professor-specific authentication
- Build interface for managing assigned applications

### Priority 2: File Upload System
- Implement secure file upload endpoint for training photos
- Ensure proper validation and storage management

### Priority 3: Notification Foundation
- Set up basic email notification system
- Implement triggers for key events (application approval, payment success)

### Priority 4: Basic Analytics
- Add simple counters for application volume
- Track service revenue by type
- Create basic admin dashboard with these metrics

This documentation should serve as a foundation for developing the complete service lifecycle in the SportologyPlus platform, addressing both current functionality and critical missing features needed for a fully operational MVP.