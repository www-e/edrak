// src/app/api/payments/initiate/route.ts
import { NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { db } from "@/server/db";
import { PayMobService } from "@/lib/paymob";
import { createSuccessResponse, createErrorResponse, ApiErrors } from "@/lib/api-response";
import { z } from "zod";
import { authOptions } from "@/lib/auth";
import { User } from "@prisma/client";
import { PaymentType } from "@prisma/client";

interface AuthenticatedUser { id: string; role: string; email?: string; name?: string; }

const paymentInitiateSchema = z.object({
  courseId: z.string().optional(),
  serviceId: z.string().optional(),
  serviceTierId: z.string().optional(),
  servicePriceId: z.string().optional(),
  paymentMethod: z.enum(["card", "wallet"]).default("card"),
  walletNumber: z.string().optional(),
}).refine(data => data.courseId || data.serviceId, {
  message: "Either courseId or serviceId must be provided",
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

    const { courseId, serviceId, serviceTierId, servicePriceId, paymentMethod, walletNumber } = validationResult.data;

    // Validate wallet number for wallet payments
    if (paymentMethod === 'wallet' && !walletNumber) {
      return createErrorResponse(
        ApiErrors.VALIDATION_ERROR.code,
        "رقم الهاتف مطلوب للدفع بالمحفظة الإلكترونية",
        ApiErrors.VALIDATION_ERROR.status
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

    let paymentData: {
      amount: number;
      currency: string;
      paymentType: PaymentType;
      course?: {
        id: string;
        title: string;
        slug: string;
        description: string;
        price: number;
        language: string;
        visibility: string;
        createdAt: Date;
        updatedAt: Date;
        professorId: string;
        categoryId: string | null;
        professor: {
          id: string;
          firstName: string;
          lastName: string;
        };
      };
      service?: {
        id: string;
        name: string;
        tier: string;
      };
      merchantOrderId: string;
    };

    // Process either course or service payment
    if (courseId) {
      // Course payment flow
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

      paymentData = {
        amount: Number(course.price),
        currency: course.language === 'ar' ? 'EGP' : 'EGP',
        paymentType: PaymentType.COURSE,
        course,
        merchantOrderId: `course_${courseId}_${sessionUser.id}_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`,
      };
    } else if (serviceId && serviceTierId && servicePriceId) {
      // Service payment flow
      const service = await db.service.findUnique({
        where: {
          id: serviceId,
          isActive: true,
        },
        include: {
          serviceTiers: {
            where: { id: serviceTierId },
            include: {
              price: {
                where: { id: servicePriceId },
              },
            },
          },
        },
      });

      if (!service || !service.serviceTiers.length) {
        return createErrorResponse(
          ApiErrors.NOT_FOUND.code,
          "الخدمة غير موجودة أو غير نشطة",
          ApiErrors.NOT_FOUND.status
        );
      }

      const serviceTier = service.serviceTiers[0];
      if (!serviceTier.price.length) {
        return createErrorResponse(
          ApiErrors.NOT_FOUND.code,
          "سعر الخدمة غير موجود",
          ApiErrors.NOT_FOUND.status
        );
      }

      const servicePrice = serviceTier.price[0];
      if (servicePrice.price <= 0) {
        return createErrorResponse(
          "FREE_SERVICE",
          "هذه الخدمة مجانية ولا تحتاج لدفع",
          400
        );
      }

      // Additional validation: Ensure service tier belongs to the service
      if (serviceTier.serviceId !== serviceId) {
        return createErrorResponse(
          ApiErrors.VALIDATION_ERROR.code,
          "Tier does not belong to the specified service",
          ApiErrors.VALIDATION_ERROR.status
        );
      }

      // Additional validation: Ensure price belongs to the service tier
      if (servicePrice.tierId !== serviceTierId) {
        return createErrorResponse(
          ApiErrors.VALIDATION_ERROR.code,
          "Price does not belong to the specified service tier",
          ApiErrors.VALIDATION_ERROR.status
        );
      }

      // Check if there's already a pending payment for this service
      const existingPayment = await db.payment.findFirst({
        where: {
          userId: sessionUser.id,
          serviceId,
          status: "PENDING",
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      if (existingPayment) {
        return createErrorResponse(
          "PENDING_SERVICE_PAYMENT",
          "لديك عملية دفع معلقة لهذه الخدمة",
          400
        );
      }

      paymentData = {
        amount: Number(servicePrice.price),
        currency: 'EGP', // Default to EGP for services
        paymentType: PaymentType.SERVICE,
        service: {
          id: service.id,
          name: service.name,
          tier: serviceTier.name,
        },
        merchantOrderId: `service_${serviceId}_${sessionUser.id}_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`,
      };
    } else {
      return createErrorResponse(
        ApiErrors.VALIDATION_ERROR.code,
        "Invalid payment parameters",
        ApiErrors.VALIDATION_ERROR.status
      );
    }

    // Create payment record in database
    const payment = await db.payment.create({
      data: {
        userId: sessionUser.id,
        ...(courseId && { courseId, paymentType: PaymentType.COURSE }),
        ...(serviceId && { serviceId, paymentType: PaymentType.SERVICE }),
        amount: paymentData.amount,
        currency: paymentData.currency,
        status: "PENDING",
        paymentMethod: paymentMethod,
        paymobOrderId: paymentData.merchantOrderId,
      },
    });

    try {
      let paymentResult;
      if (paymentData.paymentType === PaymentType.COURSE) {
        // Fetch the full course data for PayMob service
        const course = await db.course.findUnique({
          where: { id: courseId }
        });

        if (!course) {
          return createErrorResponse(
            ApiErrors.NOT_FOUND.code,
            "Course not found",
            ApiErrors.NOT_FOUND.status
          );
        }

        paymentResult = await PayMobService.initiateCoursePayment(
          dbUser as unknown as User,
          course,
          payment.id,
          paymentMethod,
          walletNumber
        );
      } else {
        // Initiate payment with PayMob for service
        if (!paymentData.service) {
          return createErrorResponse(
            ApiErrors.VALIDATION_ERROR.code,
            "Service data is required for service payments",
            ApiErrors.VALIDATION_ERROR.status
          );
        }
        paymentResult = await PayMobService.initiateServicePayment(
          dbUser as unknown as User,
          paymentData.service,
          payment.id,
          paymentMethod,
          walletNumber
        );
      }

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

      const response: {
        paymentId: string;
        type: string;
        iframeUrl?: string | null;
        redirectUrl?: string;
        paymentMethod: string;
        amount: number;
        currency: string;
        course?: {
          id: string;
          title: string;
          professor: string;
        };
        service?: {
          id: string;
          name: string;
          tier: string;
        };
      } = {
        paymentId: payment.id,
        type: paymentResult.type,
        ...(paymentResult.type === 'iframe' && { iframeUrl }),
        ...(paymentResult.type === 'redirect' && { redirectUrl: paymentResult.url }),
        paymentMethod: paymentResult.type === 'redirect' ? 'wallet' : 'card',
        amount: paymentData.amount,
        currency: paymentData.currency,
      };

      if (paymentData.paymentType === PaymentType.COURSE) {
        if (paymentData.course) {
          response.course = {
            id: paymentData.course.id,
            title: paymentData.course.title,
            professor: `${paymentData.course.professor.firstName} ${paymentData.course.professor.lastName}`,
          };
        }
      } else {
        if (paymentData.service) {
          response.service = {
            id: paymentData.service.id,
            name: paymentData.service.name,
            tier: paymentData.service.tier,
          };
        }
      }

      return createSuccessResponse(
        response,
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