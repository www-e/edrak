# Edrak Coding Structure

## Overview

This document outlines the directory structure and organization for the Edrak platform implementation, following the feature-based architecture principles.

## Directory Structure

```
src/
├── app/                    # Next.js App Router pages and layouts
│   ├── (marketing)/        # Marketing pages (existing)
│   ├── admin/              # Admin dashboard pages
│   │   ├── dashboard/
│   │   ├── users/
│   │   ├── courses/
│   │   ├── coupons/
│   │   ├── payments/
│   │   └── layout.tsx
│   ├── professor/          # Professor dashboard pages
│   │   ├── dashboard/
│   │   ├── courses/
│   │   └── layout.tsx
│   ├── student/            # Student dashboard pages
│   │   ├── dashboard/
│   │   ├── catalog/
│   │   ├── courses/
│   │   └── layout.tsx
│   ├── auth/               # Authentication pages
│   │   ├── admin/
│   │   ├── professor/
│   │   ├── student/
│   │   └── layout.tsx
│   ├── api/                # API routes
│   │   ├── auth/
│   │   ├── trpc/
│   │   ├── paymob/
│   │   └── bunny/
│   ├── globals.css
│   └── layout.tsx
├── components/             # Shared UI components
│   ├── ui/                 # shadcn/ui components (existing)
│   ├── aceternity/         # Custom animated components (existing)
│   ├── theme-provider.tsx  # Theme management (existing)
│   ├── admin/              # Admin-specific components
│   ├── professor/          # Professor-specific components
│   ├── student/            # Student-specific components
│   └── shared/             # Cross-role components
├── features/               # Feature modules
│   ├── landing/            # Marketing components (existing)
│   ├── auth/               # Authentication features
│   ├── admin/              # Admin features
│   ├── professor/          # Professor features
│   ├── student/            # Student features
│   └── catalog/            # Public catalog features
├── lib/                    # Utility functions
│   ├── utils.ts            # General utilities (existing)
│   ├── auth.ts             # Authentication utilities
│   ├── db.ts               # Database utilities
│   ├── trpc.ts             # tRPC client setup
│   ├── paymob.ts           # Paymob integration
│   └── bunny.ts            # Bunny CDN integration
├── server/                 # Server-side code
│   ├── api/                # tRPC routers and procedures
│   ├── auth/               # Authentication logic
│   ├── db/                 # Database access layer
│   └── services/           # Business logic services
├── hooks/                  # Custom React hooks
│   ├── useAuth.ts
│   ├── useCourses.ts
│   └── useEnrollments.ts
├── types/                  # TypeScript types and interfaces
│   ├── auth.ts
│   ├── courses.ts
│   ├── users.ts
│   └── payments.ts
└── constants/              # Application constants
    ├── roles.ts
    ├── routes.ts
    └── paymob.ts
```

## Implementation Guidelines

### 1. Feature-Based Organization

Each major feature will have its own directory within the appropriate section:

- `features/` for business logic
- `components/` for UI components
- `app/` for pages and routes

### 2. Separation of Concerns

- **Presentational Components**: In `components/` directories
- **Business Logic**: In `features/` and `server/` directories
- **Data Access**: In `server/db/` directory
- **API Layer**: In `server/api/` directory

### 3. Type Safety

- All components and functions will have proper TypeScript typing
- Shared types will be defined in `types/` directory
- Zod schemas for input validation

### 4. Reusability

- Common components in `components/shared/`
- Utility functions in `lib/`
- Custom hooks in `hooks/`

### 5. Performance Optimization

- Code splitting with dynamic imports
- Proper caching strategies
- Optimized database queries
- Lazy loading where appropriate

## File Naming Conventions

### Component Files

- PascalCase for component files: `UserProfile.tsx`
- kebab-case for utility files: `user-utils.ts`

### Route Files

- Follow Next.js App Router conventions
- Use descriptive names: `page.tsx`, `loading.tsx`, `error.tsx`

### Test Files

- Colocated with implementation files
- Suffix with `.test.ts` or `.test.tsx`

## Code Quality Standards

### TypeScript

- Strict mode enabled
- No `any` types
- Explicit return types for functions
- Proper generic usage

### React

- Functional components with hooks
- Proper useEffect dependencies
- Memoization where appropriate
- Component composition over inheritance

### Styling

- Tailwind CSS utility classes
- Consistent design system
- Responsive design patterns
- Accessibility considerations

This structure ensures clean separation of concerns while maintaining the feature-based architecture that makes the codebase maintainable and scalable.
