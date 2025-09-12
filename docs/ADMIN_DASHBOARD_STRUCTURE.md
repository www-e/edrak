# Admin Dashboard Structure Visualization

```
ADMIN DASHBOARD
├── Layout Components
│   ├── AdminLayout (wrapper)
│   ├── Header (top navigation)
│   └── Sidebar (side navigation)
│
├── Dashboard Overview (/admin)
│   ├── MetricsOverview (key stats)
│   ├── RecentActivity (activity feed)
│   └── QuickActions (shortcuts)
│
├── User Management
│   ├── User Listing (/admin/users)
│   ├── User Detail (/admin/users/[id])
│   ├── User Edit (/admin/users/[id]/edit)
│   └── User Create (/admin/users/new)
│
├── Course Management
│   ├── Course Listing (/admin/courses)
│   ├── Course Detail (/admin/courses/[id])
│   ├── Course Edit (/admin/courses/[id]/edit)
│   └── Course Create (/admin/courses/new)
│
├── Lesson Management
│   ├── Lesson Listing (/admin/courses/[id]/lessons)
│   ├── Lesson Detail (/admin/courses/[id]/lessons/[lessonId])
│   ├── Lesson Edit (/admin/courses/[id]/lessons/[lessonId]/edit)
│   └── Lesson Create (/admin/courses/[id]/lessons/new)
│
└── Commerce Management
    ├── Commerce Overview (/admin/commerce)
    ├── Payment Listing (/admin/commerce/payments)
    ├── Coupon Management (/admin/commerce/coupons)
    ├── Coupon Detail (/admin/commerce/coupons/[id])
    ├── Coupon Edit (/admin/commerce/coupons/[id]/edit)
    └── Coupon Create (/admin/commerce/coupons/new)
```

## Component Relationships

```
PAGE COMPONENTS (dedicated routes)
├── UserCreatePage (/admin/users/new)
├── UserEditPage (/admin/users/[id]/edit)
├── CourseCreatePage (/admin/courses/new)
├── CourseEditPage (/admin/courses/[id]/edit)
├── LessonCreatePage (/admin/courses/[id]/lessons/new)
├── LessonEditPage (/admin/courses/[id]/lessons/[lessonId]/edit)
├── CouponCreatePage (/admin/commerce/coupons/new)
└── CouponEditPage (/admin/commerce/coupons/[id]/edit)

SHARED COMPONENTS (reusable)
├── DataTable (used in listings)
├── SearchFilter (used in listings)
├── StatusBadge (used throughout)
├── MetricCard (used in dashboard)
└── PageHeader (used on all pages)

LAYOUT COMPONENTS (structural)
├── AdminLayout (wraps all admin pages)
├── Header (top navigation)
└── Sidebar (side navigation)
```

## Data Flow

```
BACKEND APIs (tRPC)
├── admin.user
│   ├── getAll (user listing)
│   ├── create (user creation)
│   ├── update (user editing)
│   └── resetPassword (password reset)
│
├── admin.course
│   ├── createCourse (course creation)
│   ├── createLesson (lesson creation)
│   ├── softDeleteLesson (lesson deletion)
│   └── restoreLesson (lesson restoration)
│
└── admin.commerce
    ├── getAllPayments (payment listing)
    ├── createCoupon (coupon creation)
    └── updateCoupon (coupon editing)

FRONTEND INTEGRATION
├── React Query (caching, background updates)
├── TRPC Hooks (type-safe API calls)
├── Context API (global state - theme, layout)
└── URL State (pagination, sorting, filtering)
```

This structure ensures:
1. **No modal forms** - All operations use dedicated pages
2. **Clear navigation** - Breadcrumb trails and consistent routing
3. **Reusable components** - Shared components reduce code duplication
4. **Performance optimized** - Pagination, caching, and lazy loading
5. **Type safety** - Full TypeScript integration throughout