# Milestone 3: tRPC API Layer

## Overview

Implement a type-safe API layer using tRPC for all backend functionality including user management, course management, and payments.

## Tasks

### 1. tRPC Setup

- [ ] Configure tRPC server with Next.js
- [ ] Set up context with user session
- [ ] Implement error handling
- [ ] Add input validation with Zod

### 2. User Management Procedures

- [ ] getUsers - List all users (Admin only)
- [ ] getUserById - Get user details
- [ ] createUser - Create new user (Admin only)
- [ ] updateUser - Update user details
- [ ] deleteUser - Deactivate user (Admin only)
- [ ] changePassword - Change user password
- [ ] assignRole - Assign role to user (Admin only)

### 3. Course Management Procedures

- [ ] getCourses - List courses with filters
- [ ] getCourseBySlug - Get course details
- [ ] createCourse - Create new course (Admin/Professor)
- [ ] updateCourse - Update course details
- [ ] deleteCourse - Soft delete course
- [ ] publishCourse - Publish/unpublish course
- [ ] assignProfessor - Assign professor to course (Admin only)

### 4. Lesson Management Procedures

- [ ] getLessonsByCourse - List lessons for a course
- [ ] getLessonById - Get lesson details
- [ ] createLesson - Create new lesson (Professor)
- [ ] updateLesson - Update lesson details
- [ ] deleteLesson - Soft delete lesson
- [ ] reorderLessons - Change lesson order

### 5. Enrollment Procedures

- [ ] getEnrollments - List user enrollments
- [ ] getEnrollmentById - Get enrollment details
- [ ] enrollInCourse - Enroll in a course
- [ ] updateProgress - Update lesson progress
- [ ] getCourseProgress - Get overall course progress

### 6. Commerce Procedures

- [ ] getCoupons - List coupons (Admin only)
- [ ] getCouponByCode - Get coupon by code
- [ ] createCoupon - Create new coupon (Admin only)
- [ ] updateCoupon - Update coupon details (Admin only)
- [ ] deleteCoupon - Delete coupon (Admin only)
- [ ] getPayments - List payments (Admin only)
- [ ] getPaymentById - Get payment details
- [ ] createPayment - Create new payment record

### 7. File Management Procedures

- [ ] getAttachmentsByLesson - List attachments for lesson
- [ ] uploadAttachment - Upload file to Bunny CDN
- [ ] deleteAttachment - Remove attachment

## Middleware

- [ ] Authentication middleware
- [ ] Role-based access control middleware
- [ ] Input validation middleware
- [ ] Rate limiting middleware

## Acceptance Criteria

- [ ] All procedures implemented with proper validation
- [ ] Role-based access control enforced
- [ ] Type safety maintained throughout
- [ ] Error handling implemented
- [ ] Performance optimized
