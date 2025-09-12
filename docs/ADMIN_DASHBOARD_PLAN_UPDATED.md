# Updated Admin Dashboard Implementation Plan

## Overview
This document outlines the implementation plan for the Edrak admin dashboard, following the project's established patterns and your specific preferences.

## Design Principles
- **shadcn/ui Integration**: Use existing shadcn/ui components with the Edrak theme
- **No Hardcoded Colors**: All styling will use CSS variables from globals.css
- **No Dead Code**: Every component and feature must be justified by existing backend APIs
- **Full Page Flows**: Avoid modal forms; use dedicated pages for all operations
- **LMS Best Practices**: Follow established patterns for course/lesson management
- **Modern UX**: Clean, intuitive interface with clear information hierarchy

## Component Architecture

### Layout Components (src/components/admin/layout/)
- `AdminLayout.tsx` - Main layout with header and sidebar
- `Header.tsx` - Top navigation bar
- `Sidebar.tsx` - Navigation sidebar with menu items
- `Breadcrumb.tsx` - Navigation breadcrumb component

### Shared Components (src/components/shared/ or src/components/admin/shared/)
- `DataTable.tsx` - Reusable data table with sorting/filtering
- `SearchFilter.tsx` - Search and filter component
- `StatusBadge.tsx` - Status indicator badges
- `MetricCard.tsx` - Summary metric cards
- `PageHeader.tsx` - Consistent page header with title and actions

### Feature Components (src/components/admin/[feature]/)

#### Dashboard Components (src/components/admin/dashboard/)
- `MetricsOverview.tsx` - Key metrics cards
- `RecentActivity.tsx` - Recent user/course activity
- `QuickActions.tsx` - Shortcut buttons for common tasks

#### User Management Components (src/components/admin/users/)
- `UserTable.tsx` - User listing with search/filter
- `UserDetail.tsx` - User profile view
- `UserEditPage.tsx` - Dedicated page for editing users
- `UserCreatePage.tsx` - Dedicated page for creating users

#### Course Management Components (src/components/admin/courses/)
- `CourseTable.tsx` - Course listing with search/filter
- `CourseDetail.tsx` - Course overview page
- `CourseEditPage.tsx` - Dedicated page for editing courses
- `CourseCreatePage.tsx` - Dedicated page for creating courses
- `LessonList.tsx` - List of lessons within a course
- `LessonDetail.tsx` - Lesson view page
- `LessonEditPage.tsx` - Dedicated page for editing lessons
- `LessonCreatePage.tsx` - Dedicated page for creating lessons

#### Commerce Management Components (src/components/admin/commerce/)
- `PaymentTable.tsx` - Payment listing with reconciliation
- `CouponTable.tsx` - Coupon listing with status
- `CouponDetail.tsx` - Coupon details view
- `CouponEditPage.tsx` - Dedicated page for editing coupons
- `CouponCreatePage.tsx` - Dedicated page for creating coupons
- `FinancialSummary.tsx` - Financial metrics overview

## Page Structure (src/app/admin/)

### Main Dashboard
- Route: `/admin`
- Components: MetricsOverview, RecentActivity, QuickActions

### User Management
- Route: `/admin/users`
- Components: PageHeader, SearchFilter, UserTable
- Actions: Create User button linking to `/admin/users/new`

- Route: `/admin/users/new`
- Components: PageHeader, UserCreatePage

- Route: `/admin/users/[id]`
- Components: PageHeader, UserDetail
- Actions: Edit button linking to `/admin/users/[id]/edit`

- Route: `/admin/users/[id]/edit`
- Components: PageHeader, UserEditPage

### Course Management
- Route: `/admin/courses`
- Components: PageHeader, SearchFilter, CourseTable
- Actions: Create Course button linking to `/admin/courses/new`

- Route: `/admin/courses/new`
- Components: PageHeader, CourseCreatePage

- Route: `/admin/courses/[id]`
- Components: PageHeader, CourseDetail
- Actions: Edit button linking to `/admin/courses/[id]/edit`
- Actions: Manage Lessons button linking to `/admin/courses/[id]/lessons`

- Route: `/admin/courses/[id]/edit`
- Components: PageHeader, CourseEditPage

- Route: `/admin/courses/[id]/lessons`
- Components: PageHeader, LessonList
- Actions: Create Lesson button linking to `/admin/courses/[id]/lessons/new`

- Route: `/admin/courses/[id]/lessons/new`
- Components: PageHeader, LessonCreatePage

- Route: `/admin/courses/[id]/lessons/[lessonId]`
- Components: PageHeader, LessonDetail
- Actions: Edit button linking to `/admin/courses/[id]/lessons/[lessonId]/edit`

- Route: `/admin/courses/[id]/lessons/[lessonId]/edit`
- Components: PageHeader, LessonEditPage

### Commerce Management
- Route: `/admin/commerce`
- Components: PageHeader, FinancialSummary, PaymentTable, CouponTable
- Actions: Create Coupon button linking to `/admin/commerce/coupons/new`

- Route: `/admin/commerce/coupons/new`
- Components: PageHeader, CouponCreatePage

- Route: `/admin/commerce/coupons/[id]`
- Components: PageHeader, CouponDetail
- Actions: Edit button linking to `/admin/commerce/coupons/[id]/edit`

- Route: `/admin/commerce/coupons/[id]/edit`
- Components: PageHeader, CouponEditPage

## Styling Guidelines

### Color Palette Usage
All components must use CSS variables from globals.css:
- `--background` / `--foreground` for main colors
- `--primary` / `--primary-foreground` for primary actions
- `--secondary` / `--secondary-foreground` for secondary actions
- `--muted` / `--muted-foreground` for subtle elements
- `--accent` / `--accent-foreground` for highlights
- `--destructive` for danger actions
- `--border` for borders
- `--ring` for focus states

### Component Patterns
- Use `cn()` utility for class merging
- Follow shadcn/ui component structure
- Use Tailwind classes exclusively (no hardcoded colors)
- Implement dark mode support with `.dark` class

## LMS Course Structure Implementation

### Course Organization
1. **Course** - Top-level container with:
   - Title, description, price
   - Language, visibility status
   - Professor assignment
   - Category association

2. **Lesson** - Content units within courses with:
   - Title, content (rich text)
   - Order/sequence number
   - Video URL (optional)
   - Visibility status
   - Soft delete capability

3. **Attachments** - Future implementation for:
   - File resources linked to lessons
   - Downloadable materials
   - External resource links

### User Experience Patterns
- **Progressive Disclosure**: Show only relevant actions based on context
- **Clear Navigation**: Breadcrumb trails showing current location
- **Consistent Actions**: Primary actions on the right, secondary on the left
- **Visual Hierarchy**: Use spacing, typography, and color to guide attention
- **Responsive Design**: Mobile-first approach with touch-friendly targets

## Implementation Priorities

### Phase 1: Core Infrastructure
1. Admin layout with navigation
2. Dashboard overview page
3. Authentication protection
4. Basic data fetching with TRPC

### Phase 2: User Management
1. User listing page
2. User detail page
3. User creation page
4. User editing page
5. Password reset functionality

### Phase 3: Course Management
1. Course listing page
2. Course detail page
3. Course creation page
4. Course editing page
5. Lesson management within courses

### Phase 4: Lesson Management
1. Lesson listing page
2. Lesson detail page
3. Lesson creation page
4. Lesson editing page
5. Soft delete/restore functionality

### Phase 5: Commerce Management
1. Payment listing page
2. Coupon management
3. Financial reporting
4. Coupon creation/editing pages

### Phase 6: Polish & Optimization
1. Performance optimization
2. Accessibility improvements
3. Mobile responsiveness
4. Loading states and error handling
5. User experience refinements

## Quality Assurance

### Code Standards
- Follow existing component patterns in the codebase
- Use TypeScript for all components with proper typing
- Implement React best practices (hooks, memoization)
- Maintain consistent naming conventions
- Write clean, self-documenting code

### Testing Strategy
- Component testing with React Testing Library
- Integration testing for data flows
- End-to-end testing for key user journeys
- Accessibility testing with axe-core

### Performance Goals
- First meaningful paint under 2 seconds
- Sub-100ms response times for interactions
- Efficient data loading with pagination
- Proper caching strategies