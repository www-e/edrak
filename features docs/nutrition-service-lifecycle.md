# Nutrition Service Lifecycle

## Overview

The nutrition service in SportologyPlus follows an application-based model where users submit detailed forms for personalized nutrition planning. This service requires comprehensive user information to create customized nutrition plans.

## User Journey

### 1. Discovery Phase
- User visits `/nutrition` page
- User learns about nutrition programs, packages, and benefits
- User sees FAQ section addressing common concerns

### 2. Application Phase
- User fills out nutrition form (src/components/nutrition/nutrition-form.tsx)
- Form collects:
  - Personal information (name, contact details, age, gender)
  - Health data (injuries, medications, allergies, medical conditions)
  - Nutrition data (current weight, height, target weight, eating habits)
  - Goals (primary goal, timeframe, package selection)

### 3. Processing Phase
- Form data validated and submitted to `api.public.applications.createNutritionApplication`
- Application stored in `NutritionApplication` table with PENDING status
- Required fields validated on both frontend and backend

### 4. Admin Review Phase
- Admin accesses `/admin/applications` to view all applications
- Admin clicks on nutrition application to view details at `/admin/applications/nutrition/[id]`
- Admin can update status, add notes, or assign nutritionist
- Updates processed via `api.admin.applications.updateNutritionApplication`

### 5. Specialist Assignment
- Admin assigns nutritionist to approved applications
- Status updated to IN_PROGRESS or APPROVED as appropriate

### 6. Service Delivery
- Assigned nutritionist contacts the applicant directly
- Personalized nutrition plan created based on application data
- Ongoing support provided according to selected package

## Technical Implementation

### Frontend Components
- `src/components/nutrition/nutrition-form.tsx` - Application form with multi-step validation
- `src/app/nutrition/page.tsx` - Landing page with service information
- `src/app/admin/applications/nutrition/[id]/page.tsx` - Admin application detail view

### Backend Services
- `src/server/api/routers/public/applications.ts` - Public application creation
- `src/server/api/routers/admin/applications.ts` - Admin application management
- Database model in `prisma/schema.prisma` (NutritionApplication)

### Data Validation
- Frontend validation using form schemas
- Backend validation with proper error handling
- Required field validation across all form steps

## Current Inconsistencies

1. **No Specialist Dashboard**: No interface for assigned nutritionists to manage their clients
2. **Limited Tracking**: No system to track the progress or effectiveness of nutrition plans
3. **No Renewal Process**: No clear process for users to renew or modify their nutrition plans
4. **Missing Notifications**: No automated notifications for status changes

## MVP Critical Missing Features

### 1. Specialist Dashboard
- [ ] Interface for nutritionists to view assigned applications
- [ ] Tools for creating and delivering nutrition plans
- [ ] Client progress tracking system
- [ ] Communication tools with clients

### 2. Application Follow-up System
- [ ] Mechanism for clients to submit progress updates
- [ ] Nutritionist ability to adjust plans based on progress
- [ ] Scheduled check-in reminders

### 3. Plan Delivery Interface
- [ ] Portal for clients to access their nutrition plans
- [ ] Meal plan display system
- [ ] Progress tracking tools for clients

### 4. Plan Renewal/Modification
- [ ] Process for clients to request plan modifications
- [ ] System for renewing nutrition plans
- [ ] Upgrade/downgrade options

### 5. Basic Reporting
- [ ] Nutritionist activity reporting
- [ ] Client satisfaction metrics
- [ ] Plan completion rates

## Recommendations for MVP Implementation

### Priority 1: Specialist Dashboard
- Create `/professor/nutrition-clients` route for nutritionists
- Implement client list view with status tracking
- Add tools for plan creation and delivery

### Priority 2: Plan Delivery System
- Develop client portal for accessing nutrition plans
- Implement secure document sharing for meal plans
- Add progress tracking tools

### Priority 3: Communication System
- Add messaging functionality between nutritionists and clients
- Implement notification system for status changes
- Create appointment scheduling (if needed)

This lifecycle documentation provides a clear roadmap for developing the complete nutrition service functionality in the SportologyPlus platform.