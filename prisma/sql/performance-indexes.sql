-- Performance indexes for admin dashboard optimization
-- These indexes will significantly improve query performance

-- Index for user queries (role-based filtering)
CREATE INDEX IF NOT EXISTS idx_users_role_active_created
ON "User" (role, "isActive", "createdAt");

-- Index for course queries (visibility and professor filtering)
CREATE INDEX IF NOT EXISTS idx_courses_visibility_professor
ON "Course" (visibility, "professorId", "createdAt");

-- Index for course slug lookups (critical for course detail pages)
CREATE INDEX IF NOT EXISTS idx_courses_slug_visibility
ON "Course" (slug, visibility);

-- Index for category-based course filtering
CREATE INDEX IF NOT EXISTS idx_courses_category_visibility_created
ON "Course" ("categoryId", visibility, "createdAt");

-- Index for enrollment queries (status-based filtering)
CREATE INDEX IF NOT EXISTS idx_enrollments_status_user
ON "Enrollment" (status, "userId", "enrolledAt");

-- Index for enrollment verification (user + course)
CREATE INDEX IF NOT EXISTS idx_enrollments_user_course
ON "Enrollment" ("userId", "courseId", status);

-- Index for payment queries (status and date filtering)
CREATE INDEX IF NOT EXISTS idx_payments_status_created
ON "Payment" (status, "createdAt", "amount");

-- Index for lesson queries (course and visibility)
CREATE INDEX IF NOT EXISTS idx_lessons_course_visible
ON "Lesson" ("courseId", "isVisible", "order");

-- Compound index for dashboard metrics queries
CREATE INDEX IF NOT EXISTS idx_users_active_created
ON "User" ("isActive", "createdAt");

CREATE INDEX IF NOT EXISTS idx_courses_published_created
ON "Course" (visibility, "createdAt");

CREATE INDEX IF NOT EXISTS idx_enrollments_active_created
ON "Enrollment" (status, "enrolledAt");

CREATE INDEX IF NOT EXISTS idx_payments_completed_created
ON "Payment" (status, "createdAt");

-- Index for search functionality
CREATE INDEX IF NOT EXISTS idx_users_search
ON "User" USING gin (to_tsvector('english', "firstName" || ' ' || "lastName" || ' ' || username));

CREATE INDEX IF NOT EXISTS idx_courses_search
ON "Course" USING gin (to_tsvector('english', title || ' ' || description));