# Psychology Service Lifecycle

## Overview

The psychology service in SportologyPlus follows an application-based model for sports psychology consultations. Users submit detailed assessments for personalized mental performance support from certified psychologists.

## User Journey

### 1. Discovery Phase
- User visits `/psychology` page
- User learns about psychology consultations, packages, and benefits
- User sees FAQ section addressing common concerns

### 2. Application Phase
- User fills out psychology form (src/components/psychology/psychology-form.tsx)
- Form collects:
  - Personal information (name, contact details, age, gender)
  - Sports data (primary sport, training age, competition prep)
  - Mental state assessment (performance issues, stress levels, sleep difficulties)
  - Goals (primary goal, session preference, package selection)

### 3. Processing Phase
- Form data validated and submitted to `api.public.applications.createPsychologyApplication`
- Application stored in `PsychologyApplication` table with PENDING status
- Required fields validated on both frontend and backend

### 4. Admin Review Phase
- Admin accesses `/admin/applications` to view all applications
- Admin clicks on psychology application to view details at `/admin/applications/psychology/[id]`
- Admin can update status, add notes, or assign psychologist
- Updates processed via `api.admin.applications.updatePsychologyApplication`

### 5. Specialist Assignment
- Admin assigns psychologist to approved applications
- Status updated to IN_PROGRESS or APPROVED as appropriate

### 6. Service Delivery
- Assigned psychologist contacts the applicant directly
- Assessment and session planning based on application data
- Ongoing psychological support provided according to selected package

## Technical Implementation

### Frontend Components
- `src/components/psychology/psychology-form.tsx` - Comprehensive application form
- `src/app/psychology/page.tsx` - Landing page with service information
- `src/app/admin/applications/psychology/[id]/page.tsx` - Admin application detail view

### Backend Services
- `src/server/api/routers/public/applications.ts` - Public application creation
- `src/server/api/routers/admin/applications.ts` - Admin application management
- Database model in `prisma/schema.prisma` (PsychologyApplication)

### Data Validation
- Frontend validation using form schemas
- Backend validation with proper error handling
- Required field validation across all form steps

## Current Inconsistencies

1. **No Specialist Dashboard**: No interface for assigned psychologists to manage their clients
2. **Limited Session Tracking**: No system to track session completion or effectiveness
3. **No Crisis Management**: No protocol for handling critical mental health issues identified in applications
4. **Missing Notifications**: No automated notifications for status changes or session scheduling

## MVP Critical Missing Features

### 1. Specialist Dashboard
- [ ] Interface for psychologists to view assigned applications
- [ ] Tools for creating and delivering psychological support plans
- [ ] Client session tracking system
- [ ] Communication tools with clients

### 2. Session Management
- [ ] Scheduling system for psychology sessions
- [ ] Session notes and progress tracking
- [ ] Crisis intervention protocols

### 3. Application Follow-up System
- [ ] Mechanism for clients to submit mental state updates
- [ ] Psychologist ability to adjust support plans based on progress
- [ ] Scheduled assessment reminders

### 4. Confidentiality Management
- [ ] Secure handling of sensitive psychological data
- [ ] Client consent management system
- [ ] Data privacy compliance tools

### 5. Plan Delivery Interface
- [ ] Portal for clients to access their psychological support plans
- [ ] Mental exercises and resources library
- [ ] Progress tracking tools for clients

### 6. Basic Reporting
- [ ] Psychologist activity reporting
- [ ] Client satisfaction metrics
- [ ] Mental performance improvement tracking

## Recommendations for MVP Implementation

### Priority 1: Specialist Dashboard
- Create `/professor/psychology-clients` route for psychologists
- Implement client list view with status tracking
- Add tools for plan creation and session management

### Priority 2: Session Management System
- Develop appointment scheduling functionality
- Implement secure session note storage
- Add progress tracking tools

### Priority 3: Crisis Management Protocol
- Add automated flagging for critical mental health indicators
- Create escalation protocol for high-risk applications
- Implement emergency contact system

### Priority 4: Communication System
- Add secure messaging functionality between psychologists and clients
- Implement notification system for session scheduling
- Create secure document sharing for psychological resources

This lifecycle documentation provides a clear roadmap for developing the complete psychology service functionality in the SportologyPlus platform.