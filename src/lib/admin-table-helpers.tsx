/**
 * Reusable column definition helpers for admin data tables
 */

import React from "react";
import { StatusBadge } from "@/components/admin/shared/status-badge";
import { CourseVisibility, PaymentStatus } from "@prisma/client";
import { formatCurrency, formatDate, safeObjectAccess } from "./data-transform";

/**
 * Creates a text column with safe rendering
 */
export function createTextColumn<T>(
  key: keyof T,
  title: string,
  fallback = "N/A"
) {
  return {
    key,
    title,
    render: (value: unknown) => String(value ?? fallback)
  };
}

/**
 * Creates a currency column with proper formatting
 */
export function createCurrencyColumn<T>(
  key: keyof T,
  title: string,
  currency = "EGP"
) {
  return {
    key,
    title,
    render: (value: unknown) => formatCurrency(value, currency)
  };
}

/**
 * Creates a date column with proper formatting
 */
export function createDateColumn<T>(
  key: keyof T,
  title: string,
  format: "date" | "datetime" = "date"
) {
  return {
    key,
    title,
    render: (value: unknown) => {
      if (format === "datetime") {
        return new Date(value as string).toLocaleString();
      }
      return formatDate(value);
    }
  };
}

/**
 * Creates a nested object column (e.g., user.firstName + user.lastName)
 */
export function createNestedTextColumn<T>(
  key: keyof T,
  title: string,
  nestedPath: string[],
  separator = " ",
  fallback = "N/A"
) {
  return {
    key,
    title,
    render: (value: unknown) => {
      return safeObjectAccess(
        value,
        (obj) => {
          const parts = nestedPath.map(path => obj[path]).filter(Boolean);
          return parts.length > 0 ? parts.join(separator) : fallback;
        },
        fallback
      );
    }
  };
}

/**
 * Creates a status badge column for course visibility
 */
export function createCourseStatusColumn<T>(key: keyof T = "visibility" as keyof T) {
  return {
    key,
    title: "Status",
    render: (value: unknown) => {
      const status = value as CourseVisibility;
      const variant = status === "PUBLISHED" ? "success" :
                    status === "DRAFT" ? "warning" : "secondary";
      return <StatusBadge variant={variant}>{status}</StatusBadge>;
    }
  };
}

/**
 * Creates a status badge column for payment status
 */
export function createPaymentStatusColumn<T>(key: keyof T = "status" as keyof T) {
  return {
    key,
    title: "Status",
    render: (value: unknown) => {
      const status = value as PaymentStatus;
      const variant = getPaymentStatusVariant(status);
      return <StatusBadge variant={variant}>{status}</StatusBadge>;
    }
  };
}

/**
 * Helper function to get payment status variant
 */
function getPaymentStatusVariant(status: PaymentStatus) {
  switch (status) {
    case 'COMPLETED': return 'success';
    case 'PENDING': return 'warning';
    case 'FAILED': return 'destructive';
    case 'REFUNDED': return 'secondary';
    default: return 'default';
  }
}

/**
 * Creates a user display column (firstName + lastName)
 */
export function createUserColumn<T>(key: keyof T = "user" as keyof T) {
  return createNestedTextColumn(
    key,
    "User",
    ["firstName", "lastName"],
    " ",
    "N/A"
  );
}

/**
 * Creates a course display column (course.title)
 */
export function createCourseColumn<T>(key: keyof T = "course" as keyof T) {
  return createNestedTextColumn(
    key,
    "Course",
    ["title"],
    "",
    "N/A"
  );
}

/**
 * Common column presets for different entity types
 */
export const courseColumns = [
  createTextColumn("title", "Title"),
  createUserColumn("professor"),
  createCurrencyColumn("price", "Price"),
  createTextColumn("language", "Language"),
  createCourseStatusColumn("visibility"),
  createDateColumn("createdAt", "Created")
];

export const paymentColumns = [
  createUserColumn("user"),
  createCourseColumn("course"),
  createCurrencyColumn("amount", "Amount"),
  createPaymentStatusColumn("status"),
  createDateColumn("createdAt", "Date", "datetime")
];

export const couponColumns = [
  createTextColumn("code", "Code"),
  createTextColumn("type", "Type"),
  createCurrencyColumn("amount", "Amount"),
  createTextColumn("maxUses", "Max Uses"),
  createDateColumn("startDate", "Start Date"),
  createDateColumn("endDate", "End Date"),
  createTextColumn("isActive", "Active")
];