# Edraak E-Learning Platform - Developer Guide

## Project Overview

Edraak (also called "sportschool") is a Next.js 15 e-learning platform built with modern technologies to provide an online learning experience. The platform enables users to sign up, enroll in courses, access course content, and earn certificates upon completion. It includes payment integration via PayMob for course purchases and uses a PostgreSQL database for data storage.

## Key Technologies

- **Framework**: Next.js 15 (with Turbopack)
- **Language**: TypeScript with strict mode
- **Database**: PostgreSQL via Prisma ORM
- **Authentication**: NextAuth.js with Prisma adapter
- **UI Components**: Radix UI primitives with Tailwind CSS
- **API**: tRPC for type-safe API calls
- **State Management**: React Query (TanStack Query)
- **Payment Gateway**: PayMob integration
- **File Storage**: Bunny.net for assets and content
- **Styling**: Tailwind CSS with custom components

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── (auth)/             # Authentication routes
│   ├── (protected)/        # Protected routes
│   ├── api/                # API routes
│   ├── student/            # Student-specific pages
│   └── ...                 # Other pages
├── components/            # Reusable UI components
├── features/              # Feature-specific components
├── lib/                   # Utility functions and libraries
├── server/                # Server-side logic and API routes
├── services/              # Business logic services
├── trpc/                  # tRPC configuration and routers
├── types/                 # TypeScript type definitions
├── env.ts                 # Environment variable validation
├── middleware.ts          # Next.js middleware
```

## Database Schema

The platform uses a PostgreSQL database with the following key entities:

- **User**: Student, Professor, or Admin accounts with profile information
- **Course**: Educational content organized by professors
- **Lesson**: Individual course content items (videos, text, etc.)
- **Enrollment**: Links users to courses they're enrolled in
- **Payment**: Records payment transactions via PayMob
- **Certificate**: Completion certificates for courses
- **LessonProgress**: Tracks student progress through lessons
- **Category**: Course categorization system
- **Coupon**: Discount codes for courses

## Building and Running

### Prerequisites
- Node.js 18+ 
- PostgreSQL database
- Environment variables configured

### Setup Commands
```bash
# Install dependencies
npm install

# Set up environment variables (copy from .env.example)
cp .env.example .env

# Initialize database
npm run db:init

# Run development server
npm run dev

# Build for production
npm run build

# Run production server
npm run start
```

### Additional Scripts
```bash
# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma migrate dev

# View database in Prisma Studio
npm run db:studio

# Create admin user
npm run admin:create

# Setup environment variables
npm run env:setup
```

## Development Conventions

### Code Quality
- TypeScript strict mode is enforced
- ESLint and Prettier for consistent formatting
- All code must pass type checking before committing
- Component reusability and minimal duplication prioritized

### File Organization
- Use the `@/*` alias for absolute imports (e.g., `@/components/ui/button`)
- Feature components in the `features/` directory
- Shared UI components in the `components/ui/` directory
- Server logic in the `server/` directory
- Type definitions in the `types/` directory

### API Design
- tRPC for type-safe API calls between client and server
- React Query for client-side state management and caching
- Security headers and validation on all endpoints
- Authentication and authorization checks on protected routes

## Authentication Flow

The platform implements a comprehensive authentication system:

### Sign-up Process
- Multi-step form with validation (personal info → interests → credentials)
- Auto-login after successful account creation
- Redirects to the `/welcome` page after sign-up completion

### Login Process
- Role-based authentication (STUDENT, PROFESSOR, ADMIN)
- Protected routes using NextAuth middleware
- Session management with role-based access control

### Current Authentication Routes
- `/auth/signup` - Multi-step sign-up form with validation
- `/auth/student/signin` - Student login page
- `/auth/professor/signin` - Professor login page
- `/auth/admin/signin` - Admin login page
- `/welcome` - Post-signup welcome page

## Student Experience

### Student Dashboard (`/student`)
- Overview of user's learning journey
- Statistics including active courses, completed courses, and payment history
- Quick access to continue learning or discover new courses

### My Courses (`/student/courses`)
- Displays all enrolled courses with progress tracking
- Shows completion percentage for each course
- Cards with progress bars and action buttons to continue learning
- Statistics for active courses, completed courses, and total progress

### Course Access
- The curriculum is split into preview (first 3 lessons) and premium content
- Premium content requires enrollment to access
- Middleware protects student routes (`/student`) requiring `STUDENT` role
- Admin routes (`/admin`) require `ADMIN` role

## Payment Integration

The platform integrates with PayMob for payment processing with:
- Online card payments
- Mobile wallet payments
- Webhook verification for payment status updates
- HMAC signature validation for security
- Payment return handling with success/failure redirects

## Current Implementation Status

### Critical Issues Being Addressed
Per the implementation roadmap in `new-implants/`, the platform is currently focused on:

1. **Fixing Authentication Flow** - Signup should auto-login users (this appears to already be implemented)
2. **Creating Student Dashboard** - `/student/courses` page to see enrolled courses (this appears to be implemented)
3. **Implementing Course Access** - Lesson viewing pages for students (needs implementation)
4. **Adding Access Control** - Middleware to protect course content (partially implemented)

### Course Access Implementation
- The curriculum page shows free preview lessons and locked premium content
- Enrollment is required to access premium content
- Students are redirected to sign-in if not authenticated when trying to access premium content

## Environment Variables

The application requires the following environment variables (see `.env.example`):

- **Database**: `DATABASE_URL` - PostgreSQL connection string
- **Authentication**: `NEXTAUTH_SECRET`, `NEXTAUTH_URL` - NextAuth configuration
- **PayMob**: Multiple variables for payment processing
- **Bunny.net**: Variables for file storage and CDN
- **Public URLs**: `NEXT_PUBLIC_APP_URL` and others

## API Structure

The platform uses tRPC for server-side API endpoints with a well-organized router structure:
- Student-specific endpoints are in `src/server/api/routers/student/`
- The `studentCoursesRouter` handles enrolled course queries
- Protected procedures ensure authentication before accessing data
- Input validation using Zod schemas

## Testing Strategy

The project follows a comprehensive testing approach across multiple phases:
1. Unit testing for components and utilities
2. Integration testing for API routes and database operations
3. End-to-end testing for complete user journeys
4. Performance testing for load times and responsiveness

## Deployment

- Standalone output configured for Vercel deployment
- Production environment variables must be configured in deployment platform
- Database migrations need to be run in production environment
- CDN patterns defined for image optimization

## Important Files and Components

### Authentication
- `src/services/auth-service.ts` - Handles sign-in, sign-up, and sign-out logic
- `src/components/auth/signup-form.tsx` - Multi-step registration form
- `src/app/api/signup/route.ts` - API route for user registration
- `src/lib/signup.ts` - Server-side user creation logic

### Student Dashboard
- `src/app/student/page.tsx` - Main dashboard with statistics
- `src/app/student/courses/page.tsx` - Courses list with progress indicators
- `src/server/api/routers/student/courses.ts` - TRPC router for course-related queries

### Course Structure
- `src/app/courses/[slug]/page.tsx` - Main course detail page
- `src/app/courses/[slug]/CourseCurriculum.tsx` - Displays course lessons with preview/locked sections

### Security
- `src/middleware.ts` - Route protection middleware with role-based access control
- API endpoints include authentication checks via `protectedProcedure`

## Known Issues & Current Focus

Based on the roadmap files in `new-implants/`:
1. The authentication flow has been improved to auto-login users after signup
2. Student dashboard and course access pages are implemented
3. Still needs proper lesson viewing functionality for enrolled students
4. Need to ensure proper access control to course content based on enrollment status