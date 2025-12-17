# Training Service Lifecycle

## Overview

The training service in SportologyPlus follows an application-based model for personalized training programs. Users submit detailed physical assessments to receive custom training plans from certified trainers.

## User Journey

### 1. Discovery Phase
- User visits `/training` page
- User learns about training programs, packages, and benefits
- User sees FAQ section addressing common concerns

### 2. Application Phase
- User fills out training form (src/components/training/subscription-form.tsx)
- Form collects:
  - Personal information (name, contact details, age, gender)
  - Training data (training age, weekly days, exercise types, primary sport)
  - Body measurements (weight, height, circumferences)
  - Fitness tests (squat test, pushup test, endurance, flexibility)
  - Required body photos (front, side, back)
  - Goals (primary goal, timeframe, package selection)

### 3. Processing Phase
- Form data validated and submitted to `api.public.applications.createTrainingApplication`
- Application stored in `TrainingApplication` table with PENDING status
- Required fields validated on both frontend and backend
- **Missing Implementation**: Backend handling for body photo uploads

### 4. Admin Review Phase
- Admin accesses `/admin/applications` to view all applications
- Admin clicks on training application to view details at `/admin/applications/training/[id]`
- Admin can update status, add notes, assign trainer, or set preferred program
- Updates processed via `api.admin.applications.updateTrainingApplication`

### 5. Specialist Assignment
- Admin assigns trainer to approved applications
- Preferred program (Home, Gym, Sport-Specific) set based on application
- Status updated to IN_PROGRESS or APPROVED as appropriate

### 6. Service Delivery
- Assigned trainer contacts the applicant directly
- Personalized training program created based on application data
- Ongoing training support provided according to selected package

## Technical Implementation

### Frontend Components
- `src/components/training/subscription-form.tsx` - Comprehensive application form with file uploads
- `src/app/training/page.tsx` - Landing page with service information
- `src/app/admin/applications/training/[id]/page.tsx` - Admin application detail view

### Backend Services
- `src/server/api/routers/public/applications.ts` - Public application creation
- `src/server/api/routers/admin/applications.ts` - Admin application management
- Database model in `prisma/schema.prisma` (TrainingApplication)

### Data Validation
- Frontend validation using form schemas
- Backend validation with proper error handling
- Required field validation across all form steps
- **Missing**: File upload validation and storage handling

## Current Inconsistencies

1. **Missing File Upload Implementation**: The training form requires body photos, but backend implementation for handling these uploads is missing
2. **No Specialist Dashboard**: No interface for assigned trainers to manage their clients
3. **Limited Program Tracking**: No system to track exercise completion or physical progress
4. **Missing Exercise Library**: No standardized exercise database for creating plans
5. **No Progress Photos**: No system for users to submit progress photos after starting their program
6. **Missing Notifications**: No automated notifications for status changes or program updates

## MVP Critical Missing Features

### 1. File Upload System (Critical)
- [ ] Backend implementation for body photo uploads
- [ ] Secure storage and retrieval system for client photos
- [ ] File validation and security measures
- [ ] Image processing for standardized photo assessment

### 2. Specialist Dashboard
- [ ] Interface for trainers to view assigned applications
- [ ] Tools for creating and delivering training programs
- [ ] Client progress tracking system
- [ ] Communication tools with clients

### 3. Exercise Database
- [ ] Standardized exercise library with descriptions and videos
- [ ] Equipment-based exercise categorization
- [ ] Difficulty level classification

### 4. Program Creation Tools
- [ ] Template system for common training programs
- [ ] Customizable workout schedule builder
- [ ] Progression tracking tools for trainers

### 5. Progress Tracking Interface
- [ ] Portal for clients to log workout completion
- [ ] Progress photo upload system
- [ ] Physical measurement tracking tools

### 6. Plan Delivery Interface
- [ ] Portal for clients to access their training programs
- [ ] Workout schedule display system
- [ ] Video exercise library access

### 7. Basic Reporting
- [ ] Trainer activity reporting
- [ ] Client satisfaction metrics
- [ ] Physical improvement tracking

## Recommendations for MVP Implementation

### Priority 1: File Upload System
- Implement secure file upload endpoint for training photos
- Ensure proper validation and storage management
- Add image processing functionality

### Priority 2: Specialist Dashboard
- Create `/professor/training-clients` route for trainers
- Implement client list view with status tracking
- Add tools for program creation and delivery

### Priority 3: Exercise Database
- Create basic exercise library with common movements
- Add categorization by equipment and difficulty
- Include exercise demonstration videos

### Priority 4: Progress Tracking Tools
- Develop client dashboard for logging workouts
- Add progress photo upload functionality
- Create measurement tracking system

### Priority 5: Communication System
- Add messaging functionality between trainers and clients
- Implement notification system for status changes
- Create appointment scheduling (if needed)

This lifecycle documentation provides a clear roadmap for developing the complete training service functionality in the SportologyPlus platform.