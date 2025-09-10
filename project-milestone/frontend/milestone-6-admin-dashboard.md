# Milestone 6: Admin Dashboard

## Overview

Implement the Admin dashboard with full management capabilities for users, courses, lessons, coupons, and payments.

## Tasks

### 1. Dashboard Layout

- [ ] Create responsive dashboard layout
- [ ] Implement navigation sidebar
- [ ] Add user profile section
- [ ] Create dashboard overview/stats page

### 2. User Management

- [ ] User listing page with filters
- [ ] User creation form
- [ ] User edit form
- [ ] User deactivation/reactivation
- [ ] Password reset functionality
- [ ] Role assignment interface

### 3. Course Management

- [ ] Course listing page
- [ ] Course creation form
- [ ] Course edit form
- [ ] Course publishing controls
- [ ] Professor assignment interface

### 4. Lesson Management

- [ ] Lesson listing by course
- [ ] Lesson creation form
- [ ] Lesson edit form
- [ ] Lesson reordering interface
- [ ] Lesson visibility controls

### 5. Commerce Management

- [ ] Coupon listing page
- [ ] Coupon creation form
- [ ] Coupon edit form
- [ ] Payment listing page
- [ ] Payment details view
- [ ] Manual reconciliation interface

### 6. Analytics and Reporting

- [ ] User registration stats
- [ ] Course enrollment stats
- [ ] Revenue reporting
- [ ] Payment status overview

### 7. Security Features

- [ ] Role-based access control
- [ ] Activity logging
- [ ] Audit trail for changes

## Pages

- /admin/dashboard
- /admin/users
- /admin/users/[id]
- /admin/courses
- /admin/courses/[id]
- /admin/courses/[id]/lessons
- /admin/coupons
- /admin/payments
- /admin/settings

## Components

- AdminLayout
- SidebarNavigation
- UserTable
- CourseTable
- LessonTable
- CouponForm
- PaymentTable

## Acceptance Criteria

- [ ] All admin functionalities implemented
- [ ] Responsive design works on all devices
- [ ] Role-based access control enforced
- [ ] Data validation and error handling
- [ ] Clean, intuitive user interface
