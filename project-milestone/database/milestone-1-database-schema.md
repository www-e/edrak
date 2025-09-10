# Milestone 1: Database Schema Design

## Overview

Design and implement the complete database schema for the Edrak platform supporting Admin, Professor, and Student roles with courses, lessons, payments, and file attachments.

## Tasks

### 1. User Management Schema

- [ ] Create User model with fields:
  - id (UUID, primary key)
  - email (string, unique)
  - password (string, hashed)
  - firstName (string)
  - lastName (string)
  - role (enum: ADMIN, PROFESSOR, STUDENT)
  - isActive (boolean, default: true)
  - createdAt (datetime)
  - updatedAt (datetime)
  - lastLoginAt (datetime, nullable)

### 2. Course Management Schema

- [ ] Create Category model with fields:

  - id (UUID, primary key)
  - name (string)
  - slug (string, unique)
  - description (text, optional)
  - createdAt (datetime)
  - updatedAt (datetime)

- [ ] Create Course model with fields:
  - id (UUID, primary key)
  - title (string)
  - slug (string, unique)
  - description (text)
  - price (decimal, default: 0.00)
  - language (string)
  - visibility (enum: DRAFT, PUBLISHED, ARCHIVED)
  - professorId (foreign key to User)
  - categoryId (foreign key to Category, nullable)
  - createdAt (datetime)
  - updatedAt (datetime)
  - publishedAt (datetime, nullable)

### 3. Lesson Management Schema

- [ ] Create Lesson model with fields:
  - id (UUID, primary key)
  - courseId (foreign key to Course)
  - title (string)
  - order (integer)
  - content (text)
  - videoUrl (string, nullable)
  - isVisible (boolean, default: true)
  - isDeleted (boolean, default: false)
  - createdAt (datetime)
  - updatedAt (datetime)
  - deletedAt (datetime, nullable)

### 4. Attachment Management Schema

- [ ] Create Attachment model with fields:
  - id (UUID, primary key)
  - lessonId (foreign key to Lesson)
  - name (string)
  - fileName (string)
  - mimeType (string)
  - fileSize (integer)
  - bunnyCdnPath (string)
  - bunnyCdnUrl (string)
  - createdAt (datetime)
  - updatedAt (datetime)

### 5. Enrollment and Progress Schema

- [ ] Create Enrollment model with fields:

  - id (UUID, primary key)
  - userId (foreign key to User)
  - courseId (foreign key to Course)
  - enrolledAt (datetime)
  - status (enum: ACTIVE, COMPLETED, CANCELLED)
  - completionPercentage (integer, default: 0)

- [ ] Create LessonProgress model with fields:
  - id (UUID, primary key)
  - enrollmentId (foreign key to Enrollment)
  - lessonId (foreign key to Lesson)
  - isCompleted (boolean, default: false)
  - videoWatchedPercentage (integer, default: 0)
  - completedAt (datetime, nullable)
  - createdAt (datetime)
  - updatedAt (datetime)

### 6. Commerce Schema

- [ ] Create Coupon model with fields:

  - id (UUID, primary key)
  - code (string, unique)
  - type (enum: PERCENTAGE, FIXED)
  - amount (decimal)
  - maxUses (integer, nullable)
  - usedCount (integer, default: 0)
  - maxUsesPerUser (integer, default: 1)
  - startDate (datetime)
  - endDate (datetime, nullable)
  - isActive (boolean, default: true)
  - createdAt (datetime)
  - updatedAt (datetime)

- [ ] Create Payment model with fields:
  - id (UUID, primary key)
  - userId (foreign key to User)
  - courseId (foreign key to Course)
  - amount (decimal)
  - currency (string, default: "EGP")
  - status (enum: PENDING, COMPLETED, FAILED, REFUNDED)
  - paymentGateway (enum: PAYMOB, OTHER)
  - gatewayReference (string, nullable)
  - gatewayResponse (json, nullable)
  - couponId (foreign key to Coupon, nullable)
  - enrolledAt (datetime, nullable)
  - createdAt (datetime)
  - updatedAt (datetime)

### 7. Relationships and Indexes

- [ ] Define proper foreign key relationships
- [ ] Create necessary database indexes for performance
- [ ] Add constraints for data integrity

## Acceptance Criteria

- [ ] All models defined in Prisma schema
- [ ] Relationships properly established
- [ ] Migrations created and tested
- [ ] Seed data for initial setup
