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
  columns: {
    key: keyof T;
    title: string;
    render?: (value: T[keyof T], row: T) => React.ReactNode;
  }[];
  loading?: boolean;
  pagination?: {
    page: number;
    pageSize: number;
    total: number;
    onPageChange: (page: number) => void;
  };
  sorting?: {
    sortBy: keyof T;
    sortOrder: 'asc' | 'desc';
    onSortChange: (sortBy: keyof T, sortOrder: 'asc' | 'desc') => void;
  };
  onRowClick?: (row: T) => void;
  emptyState?: React.ReactNode;
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
  className?: string;
}
// Uses Input and Button components
// Follows existing form patterns but as full page elements
```

#### StatusBadge
```tsx
// Status indicator badge using existing color system
props: {
  variant: 'default' | 'secondary' | 'destructive' | 'success' | 'warning' | 'outline';
  className?: string;
  children: ReactNode;
}
// Uses variant patterns from Button component for consistent styling
```

#### MetricCard
```tsx
// Summary metric card
props: {
  title: string;
  value: string | number;
  description?: string;
  icon?: ReactNode;
  className?: string;
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
  className?: string;
}
// Uses existing typography classes from globals.css
// Maintains consistent spacing and layout
```

### Media Components

#### AttachmentList
```tsx
// Component for displaying and managing file attachments
props: {
  attachments: Attachment[];
  onAttachmentDelete?: (attachmentId: string) => void;
}
// Allows users to download or delete attachments
// Uses File, Video, Image, and FileText icons for different file types
```

#### FileUpload
```tsx
// Component for uploading files with drag-and-drop support
props: {
  courseId: string;
  lessonId?: string;
  onUploadComplete?: (attachment: Attachment) => void;
  onUploadError?: (error: string) => void;
}
// Supports drag-and-drop and file selection
// Shows file previews for images
// Uses Upload and X icons for UI actions
```

### Feature Components

#### User Management

##### UserTable
```tsx
// User listing table (implemented as part of UsersPage)
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
// User profile view (implemented in /admin/users/[id]/page.tsx)
props: {
  user: User;
}
// Displays user information in a clean, organized layout
// Uses Card components for grouping related information
// Shows user details like username, role, status, contact info
```

##### UserCreatePage
```tsx
// Dedicated page for creating users (implemented in /admin/users/new/page.tsx)
props: {
  onCreate: (data: CreateUserInput) => Promise<void>;
  onCancel: () => void;
}
// Full page form with clear navigation
// Uses react-hook-form and zod validation
```

#### Course Management

##### CourseTable
```tsx
// Course listing table (implemented as part of CoursesPage)
props: {
  courses: Course[];
  loading: boolean;
  onSortChange: (sortBy: string, order: 'asc' | 'desc') => void;
  onFilterChange: (filters: Record<string, any>) => void;
}
// Uses DataTable component with course-specific columns
```

#### Commerce Management

##### FinancialSummary
```tsx
// Financial metrics overview (implemented in CommercePage)
props: {
  metrics: FinancialMetrics;
}
// Uses MetricCard components for key financial data
// Shows total revenue, pending payments, active coupons, conversion rate
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
        admin-layout.tsx
        header.tsx
        sidebar.tsx
      shared/
        data-table.tsx
        search-filter.tsx
        status-badge.tsx
        metric-card.tsx
        page-header.tsx
      media/
        attachment-list.tsx
        file-upload.tsx
  app/
    admin/
      layout.tsx
      page.tsx                    # Dashboard overview
      users/
        page.tsx                  # User listing
        [id]/
          page.tsx                # User detail
        new/
          page.tsx                # Create user page
      courses/
        page.tsx                  # Course listing
        [id]/
          lessons/
      commerce/
        page.tsx                  # Commerce overview

## Implemented Components Summary

### ✅ Fully Implemented
1. **Layout Components**: AdminLayout, Header, Sidebar
2. **Shared Components**: DataTable, SearchFilter, StatusBadge, MetricCard, PageHeader
3. **Media Components**: AttachmentList, FileUpload
4. **Pages**: Admin Dashboard, User Listing, User Creation, User Detail
5. **API Services**: Complete backend API for users, courses, and commerce

### ⚠️ Partially Implemented
1. **Course Management**: Course listing page exists but detail, edit, and create pages are missing
2. **Lesson Management**: Directory structure exists but no pages implemented
3. **Commerce Management**: Overview page exists but payment and coupon management pages are missing

### ❌ Not Implemented
1. **User Management**: User edit page
2. **Course Management**: Course detail, edit, and create pages
3. **Lesson Management**: All lesson management pages
4. **Commerce Management**: Payment listing, coupon management pages

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