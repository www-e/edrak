// src/app/api/payments/initiate/route.ts
import { NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { db } from "@/server/db";
import { PayMobService } from "@/lib/paymob";
import { createSuccessResponse, createErrorResponse, ApiErrors } from "@/lib/api-response";
import { z } from "zod";
import { authOptions } from "@/lib/auth";
import { User } from "@prisma/client";

interface AuthenticatedUser { id: string; role: string; email?: string; name?: string; }
interface PaymentInitiationRequest { courseId: string; paymentMethod: 'card' | 'wallet'; walletNumber?: string; }

const paymentInitiateSchema = z.object({
  courseId: z.string().min(1, "معرف الدورة مطلوب"),
  paymentMethod: z.enum(["card", "wallet"]).default("card"),
  walletNumber: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    // Check authentication
    if (!session?.user || !('id' in session.user)) {
      return createErrorResponse(
        ApiErrors.UNAUTHORIZED.code,
        ApiErrors.UNAUTHORIZED.message,
        ApiErrors.UNAUTHORIZED.status
      );
    }

    // Only students can make payments (admins can for testing)
    const sessionUser = session.user as AuthenticatedUser;
    if (!["STUDENT", "ADMIN"].includes(sessionUser.role)) {
      return createErrorResponse(
        ApiErrors.FORBIDDEN.code,
        "غير مصرح لك بإجراء عمليات الدفع",
        ApiErrors.FORBIDDEN.status
      );
    }

    // Parse and validate request body
    const body = await request.json();
    const validationResult = paymentInitiateSchema.safeParse(body);

    if (!validationResult.success) {
      return createErrorResponse(
        ApiErrors.VALIDATION_ERROR.code,
        ApiErrors.VALIDATION_ERROR.message,
        ApiErrors.VALIDATION_ERROR.status,
        validationResult.error.issues
      );
    }

    const { courseId, paymentMethod, walletNumber } = validationResult.data;

    // Validate wallet number for wallet payments
    if (paymentMethod === 'wallet' && !walletNumber) {
      return createErrorResponse(
        ApiErrors.VALIDATION_ERROR.code,
        "رقم الهاتف مطلوب للدفع بالمحفظة الإلكترونية",
        ApiErrors.VALIDATION_ERROR.status
      );
    }

    // Check if course exists and is published
    const course = await db.course.findFirst({
      where: {
        id: courseId,
        visibility: "PUBLISHED",
      },
      include: {
        professor: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    if (!course) {
      return createErrorResponse(
        ApiErrors.NOT_FOUND.code,
        "الدورة غير موجودة أو غير منشورة",
        ApiErrors.NOT_FOUND.status
      );
    }

    // Check if course is paid
    if (!course.price || Number(course.price) <= 0) {
      return createErrorResponse(
        "FREE_COURSE",
        "هذه الدورة مجانية ولا تحتاج لدفع",
        400
      );
    }

    // Check if user is already enrolled
    const existingEnrollment = await db.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId: sessionUser.id,
          courseId,
        },
      },
    });

    if (existingEnrollment) {
      return createErrorResponse(
        ApiErrors.DUPLICATE_ERROR.code,
        "أنت مسجل في هذه الدورة بالفعل",
        ApiErrors.DUPLICATE_ERROR.status
      );
    }

    // Check if there's already a pending payment
    const existingPayment = await db.payment.findFirst({
      where: {
        userId: sessionUser.id,
        courseId,
        status: "PENDING",
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    if (existingPayment) {
      return createErrorResponse(
        "PENDING_PAYMENT",
        "لديك عملية دفع معلقة لهذه الدورة",
        400
      );
    }

    // Prevent professors from buying their own courses
    if (course.professorId === sessionUser.id) {
      return createErrorResponse(
        "INVALID_PURCHASE",
        "لا يمكنك شراء دورتك الخاصة",
        400
      );
    }

    // Get user information for billing
    const dbUser = await db.user.findUnique({
      where: { id: sessionUser.id },
      select: {
        firstName: true,
        lastName: true,
        email: true,
        phoneNumber: true,
      },
    });

    if (!dbUser) {
      return createErrorResponse(
        ApiErrors.NOT_FOUND.code,
        "بيانات المستخدم غير موجودة",
        ApiErrors.NOT_FOUND.status
      );
    }

    // Create payment record in database
    const merchantOrderId = `course_${courseId}_${sessionUser.id}_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;

    const payment = await db.payment.create({
      data: {
        userId: sessionUser.id,
        courseId,
        amount: course.price,
        currency: course.language === 'ar' ? 'EGP' : 'EGP', // Default to EGP for now
        status: "PENDING",
        paymentMethod: paymentMethod,
        paymobOrderId: merchantOrderId,
      },
    });

    try {
      // Initiate payment with PayMob
      const paymentResult = await PayMobService.initiateCoursePayment(
        dbUser as unknown as User,
        course,
        payment.id,
        paymentMethod,
        walletNumber
      );

      // Update payment record with PayMob data
      if (paymentMethod === 'wallet') {
        await db.payment.update({
          where: { id: payment.id },
          data: {
            paymobResponse: {
              paymentMethod,
              initiatedAt: new Date().toISOString(),
              otpUrl: paymentResult.type === 'redirect' ? paymentResult.url : undefined,
            },
          },
        });
      } else {
        await db.payment.update({
          where: { id: payment.id },
          data: {
            paymobResponse: {
              paymentMethod,
              initiatedAt: new Date().toISOString(),
              paymentKey: paymentResult.type === 'iframe' ? paymentResult.token : undefined,
            },
          },
        });
      }

      // Build the complete iframe URL for credit card payments (matching working project)
      let iframeUrl = null;
      if (paymentResult.type === 'iframe' && paymentResult.token) {
        const baseUrl = process.env.PAYMOB_BASE_URL || "https://accept.paymob.com/api";
        const iframeId = process.env.PAYMOB_IFRAME_ID || process.env.NEXT_PUBLIC_PAYMOB_IFRAME_ID;

        if (iframeId) {
          iframeUrl = `${baseUrl.replace('/api', '')}/api/acceptance/iframes/${iframeId}?payment_token=${paymentResult.token}`;
        }
      }

      return createSuccessResponse(
        {
          paymentId: payment.id,
          type: paymentResult.type,
          ...(paymentResult.type === 'iframe' && { iframeUrl }),
          ...(paymentResult.type === 'redirect' && { redirectUrl: paymentResult.url }),
          paymentMethod: paymentResult.type === 'redirect' ? 'wallet' : 'card',
          amount: Number(course.price),
          currency: course.language === 'ar' ? 'EGP' : 'EGP',
          course: {
            id: course.id,
            title: course.title,
            professor: `${course.professor.firstName} ${course.professor.lastName}`,
          },
        },
        "Payment initiated successfully",
        201
      );
    } catch (error) {
      await db.payment.update({
        where: { id: payment.id },
        data: { status: "FAILED" }
      });

      return createErrorResponse(
        ApiErrors.INTERNAL_ERROR.code,
        "فشل في بدء عملية الدفع. يرجى المحاولة مرة أخرى",
        ApiErrors.INTERNAL_ERROR.status,
        error
      );
    }
  } catch (error) {
    return createErrorResponse(
      ApiErrors.INTERNAL_ERROR.code,
      ApiErrors.INTERNAL_ERROR.message,
      ApiErrors.INTERNAL_ERROR.status,
      error
    );
  }
}