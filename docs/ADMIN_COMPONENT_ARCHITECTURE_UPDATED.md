# Admin Dashboard Component Architecture

## Component Hierarchy and Data Flow

### Layout Components

#### AdminLayout
```tsx
// Main layout wrapper for all admin pages
props: {
  children: ReactNode;
}
// Uses existing theme provider and applies admin-specific styling
// Contains Header and Sidebar as children
```

#### Header
```tsx
// Top navigation bar
props: {
  onMenuToggle: () => void; // For mobile sidebar toggle
}
// Uses Button component from @/components/ui/button
// Uses existing theme colors via CSS variables
```

#### Sidebar
```tsx
// Navigation sidebar
props: {
  isOpen: boolean; // For mobile
  onClose: () => void; // For mobile
}
// Navigation items based on user permissions
// Uses consistent styling with existing UI components
```

### Shared UI Components

#### DataTable
```tsx
// Reusable data table component using existing UI patterns
props: {
  data: T[];
  columns: ColumnDef<T>[];
  loading?: boolean;
  pagination?: {
    page: number;
    pageSize: number;
    total: number;
    onPageChange: (page: number) => void;
  };
  sorting?: {
    sortBy: string;
    sortOrder: 'asc' | 'desc';
    onSortChange: (sortBy: string, sortOrder: 'asc' | 'desc') => void;
  };
  filters?: Record<string, any>;
  onFiltersChange?: (filters: Record<string, any>) => void;
}
// Uses Card, Button, and other existing UI components
// No hardcoded colors - uses CSS variables
```

#### SearchFilter
```tsx
// Search and filter component
props: {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  filters?: FilterOption[];
  activeFilters?: Record<string, any>;
  onFiltersChange?: (filters: Record<string, any>) => void;
}
// Uses Input and Button components
// Follows existing form patterns but as full page elements
```

#### StatusBadge
```tsx
// Status indicator badge using existing color system
props: {
  status: 'active' | 'inactive' | 'draft' | 'published' | 'archived' | 'pending' | 'completed' | 'failed';
  label?: string;
}
// Uses variant patterns from Button component for consistent styling
```

#### MetricCard
```tsx
// Summary metric card
props: {
  title: string;
  value: string | number;
  change?: number; // Percentage change
  icon?: ReactNode;
  onClick?: () => void;
}
// Uses Card component with consistent styling
// No hardcoded colors - uses CSS variables
```

#### PageHeader
```tsx
// Consistent page header with title and actions
props: {
  title: string;
  description?: string;
  actions?: ReactNode;
}
// Uses existing typography classes from globals.css
// Maintains consistent spacing and layout
```

### Feature Components

#### User Management

##### UserTable
```tsx
// User listing table
props: {
  users: User[];
  loading: boolean;
  onSortChange: (sortBy: string, order: 'asc' | 'desc') => void;
  onFilterChange: (filters: Record<string, any>) => void;
}
// Uses DataTable component
// Implements user-specific columns and actions
```

##### UserDetail
```tsx
// User profile view
props: {
  user: User;
}
// Displays user information in a clean, organized layout
// Uses Card components for grouping related information
```

##### UserEditPage
```tsx
// Dedicated page for editing users
props: {
  user: User;
  onSave: (data: UpdateUserInput) => Promise<void>;
  onCancel: () => void;
}
// Full page form following LMS best practices
// No modal dialogs - dedicated page flow
```

##### UserCreatePage
```tsx
// Dedicated page for creating users
props: {
  onCreate: (data: CreateUserInput) => Promise<void>;
  onCancel: () => void;
}
// Full page form with clear navigation
```

#### Course Management

##### CourseTable
```tsx
// Course listing table
props: {
  courses: Course[];
  loading: boolean;
  onSortChange: (sortBy: string, order: 'asc' | 'desc') => void;
  onFilterChange: (filters: Record<string, any>) => void;
}
// Uses DataTable component with course-specific columns
```

##### CourseDetail
```tsx
// Course overview page
props: {
  course: Course;
}
// Displays course information with clear sections
// Links to lesson management
```

##### CourseEditPage
```tsx
// Dedicated page for editing courses
props: {
  course: Course;
  onSave: (data: UpdateCourseInput) => Promise<void>;
  onCancel: () => void;
}
// Full page form with all course fields
```

##### CourseCreatePage
```tsx
// Dedicated page for creating courses
props: {
  onCreate: (data: CreateCourseInput) => Promise<void>;
  onCancel: () => void;
}
// Full page form with clear workflow
```

##### LessonList
```tsx
// List of lessons within a course
props: {
  lessons: Lesson[];
  courseId: string;
}
// Table view of lessons with ordering controls
// Actions for editing and managing lessons
```

##### LessonDetail
```tsx
// Lesson view page
props: {
  lesson: Lesson;
  courseId: string;
}
// Displays lesson content with video and text
```

##### LessonEditPage
```tsx
// Dedicated page for editing lessons
props: {
  lesson: Lesson;
  courseId: string;
  onSave: (data: UpdateLessonInput) => Promise<void>;
  onCancel: () => void;
}
// Full page form for lesson editing
```

##### LessonCreatePage
```tsx
// Dedicated page for creating lessons
props: {
  courseId: string;
  onCreate: (data: CreateLessonInput) => Promise<void>;
  onCancel: () => void;
}
// Full page form with clear workflow
```

#### Commerce Management

##### PaymentTable
```tsx
// Payment listing table
props: {
  payments: Payment[];
  loading: boolean;
}
// Uses DataTable with payment-specific columns
```

##### CouponTable
```tsx
// Coupon listing table
props: {
  coupons: Coupon[];
  loading: boolean;
}
// Uses DataTable with coupon-specific columns
```

##### CouponDetail
```tsx
// Coupon details view
props: {
  coupon: Coupon;
}
// Displays coupon information and usage statistics
```

##### CouponEditPage
```tsx
// Dedicated page for editing coupons
props: {
  coupon: Coupon;
  onSave: (data: UpdateCouponInput) => Promise<void>;
  onCancel: () => void;
}
// Full page form for coupon editing
```

##### CouponCreatePage
```tsx
// Dedicated page for creating coupons
props: {
  onCreate: (data: CreateCouponInput) => Promise<void>;
  onCancel: () => void;
}
// Full page form with clear workflow
```

##### FinancialSummary
```tsx
// Financial metrics overview
props: {
  metrics: FinancialMetrics;
}
// Uses MetricCard components for key financial data
```

## Data Flow Architecture

### TRPC Integration Patterns

#### Queries
```tsx
// Use existing TRPC hooks with consistent error handling
const { data: users, isLoading, error } = api.admin.user.getAll.useQuery();
const { data: course } = api.admin.course.getCourse.useQuery({ id });
const { data: payments } = api.admin.commerce.getAllPayments.useQuery();
```

#### Mutations
```tsx
// Use mutations with proper loading and success states
const createUser = api.admin.user.create.useMutation({
  onSuccess: () => {
    // Handle success (navigation, notifications, etc.)
  },
  onError: (error) => {
    // Handle error (display to user, logging, etc.)
  }
});
```

### State Management

#### URL State
- Pagination: `/admin/users?page=2&size=20`
- Sorting: `/admin/users?sort=createdAt&order=desc`
- Filtering: `/admin/users?role=STUDENT&status=active`

#### Component State
- Form inputs and validation
- Loading states
- Success/error feedback

#### Context State
```tsx
// AdminContext for global admin state
{
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  // Uses existing theme context, no custom theme management
}
```

## Styling Guidelines

### Component Structure
```tsx
// All components follow this pattern:
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// Other necessary imports

interface ComponentProps {
  // Props interface
}

export function ComponentName({ prop1, prop2 }: ComponentProps) {
  return (
    <div className={cn(
      "base-classes",
      "conditional-classes",
      className
    )}>
      {/* Component content using existing UI components */}
    </div>
  );
}
```

### Color Usage
All components must use CSS variables from globals.css:
```tsx
// Correct usage:
<div className="bg-background text-foreground border border-border">
  Content
</div>

// Incorrect usage (no hardcoded colors):
<div className="bg-blue-500 text-white">
  Content
</div>
```

### Typography
Use existing heading classes from globals.css:
```tsx
<h1 className="heading-1">Main Title</h1>
<h2 className="heading-2">Section Title</h2>
<p className="body-normal">Regular text content</p>
```

## Component Organization

### Directory Structure
```
src/
  components/
    admin/
      layout/
        AdminLayout.tsx
        Header.tsx
        Sidebar.tsx
        Breadcrumb.tsx
      shared/
        DataTable.tsx
        SearchFilter.tsx
        StatusBadge.tsx
        MetricCard.tsx
        PageHeader.tsx
      dashboard/
        MetricsOverview.tsx
        RecentActivity.tsx
        QuickActions.tsx
      users/
        UserTable.tsx
        UserDetail.tsx
        UserEditPage.tsx
        UserCreatePage.tsx
      courses/
        CourseTable.tsx
        CourseDetail.tsx
        CourseEditPage.tsx
        CourseCreatePage.tsx
        LessonList.tsx
        LessonDetail.tsx
        LessonEditPage.tsx
        LessonCreatePage.tsx
      commerce/
        PaymentTable.tsx
        CouponTable.tsx
        CouponDetail.tsx
        CouponEditPage.tsx
        CouponCreatePage.tsx
        FinancialSummary.tsx
```

## Error Handling and User Feedback

### Error Boundaries
- Page-level error boundaries
- Component-level error handling
- Graceful degradation for failed data loads

### User Feedback
- Toast notifications for actions using existing patterns
- Inline validation errors
- Loading skeletons for data
- Success/error indicators

## Performance Optimization

### Data Fetching
- Pagination for large datasets
- Caching with React Query
- Background data refresh
- Suspense for loading states

### Rendering
- Virtualized lists for large tables
- Memoized components
- Code splitting for pages
- Lazy loading for non-critical components

### Bundle Optimization
- Tree-shaking for unused components
- Dynamic imports for modals and dialogs
- Image optimization for any assets
- Minification and compression