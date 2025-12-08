import { serverEnv } from "@/lib/env-server";
import { db } from "@/server/db";
import { Prisma, Course, User, EnrollmentStatus } from "@prisma/client";
import crypto from "crypto";
import { WalletService } from "@/lib/wallet-service";

const PAYMOB_API_URL = serverEnv.PAYMOB_BASE_URL;

interface AuthTokenResponse { token: string; }
interface OrderRegistrationResponse { id: number; }
interface WalletPaymentResponse { redirect_url: string; }

export interface PayMobWebhookData {
  amount_cents: number;
  created_at: string;
  currency: string;
  error_occured: boolean;
  has_parent_transaction: boolean;
  id: number;
  integration_id: number;
  is_3d_secure: boolean;
  is_auth: boolean;
  is_capture: boolean;
  is_refunded: boolean;
  is_standalone_payment: boolean;
  is_voided: boolean;
  order: { id: number; merchant_order_id: string };
  owner: number;
  pending: boolean;
  source_data: { pan: string; sub_type: string; type: string };
  success: boolean;
  hmac: string;
}

export type PaymentInitiationResult =
  | { type: 'iframe'; token: string }
  | { type: 'redirect'; url: string };

type PaymentMethod = 'card' | 'wallet';

export class PayMobService {
  private static async getAuthToken(): Promise<string> {
    const response = await fetch(`${PAYMOB_API_URL}/auth/tokens`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ api_key: serverEnv.PAYMOB_API_KEY }),
    });
    if (!response.ok) throw new Error("PayMob authentication failed.");
    return ((await response.json()) as AuthTokenResponse).token;
  }

  private static async registerOrder(authToken: string, amountCents: number, merchantOrderId: string): Promise<number> {
    const response = await fetch(`${PAYMOB_API_URL}/ecommerce/orders`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        auth_token: authToken,
        delivery_needed: "false",
        amount_cents: amountCents,
        currency: "EGP",
        merchant_order_id: merchantOrderId,
      }),
    });
    if (!response.ok) throw new Error("PayMob order registration failed.");
    return ((await response.json()) as OrderRegistrationResponse).id;
  }

  private static async getPaymentKey(authToken: string, amountCents: number, orderId: number, user: User, integrationId: string): Promise<string> {
    const response = await fetch(`${PAYMOB_API_URL}/acceptance/payment_keys`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        auth_token: authToken,
        amount_cents: amountCents,
        expiration: 3600,
        order_id: orderId,
        billing_data: {
          first_name: user.firstName || 'Unknown',
          last_name: user.lastName || 'User',
          email: user.email || 'noemail@example.com',
          phone_number: user.phoneNumber || '+201000000000',
          country: 'EG', state: 'Cairo', city: 'Cairo',
          street: 'N/A', building: 'N/A', floor: 'N/A', apartment: 'N/A'
        },
        currency: "EGP",
        integration_id: integrationId,
        lock_order_when_paid: true
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`PayMob payment key failed: ${response.status} - ${errorText}`);
    }

    const { token } = await response.json();
    if (!token) throw new Error("PayMob payment key response missing token");

    return token;
  }

  private static async getWalletRedirectUrl(paymentKeyToken: string, walletNumber: string): Promise<string> {
    const response = await fetch(`${PAYMOB_API_URL}/acceptance/payments/pay`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        source: {
          identifier: walletNumber,
          subtype: 'WALLET',
        },
        payment_token: paymentKeyToken, // Correctly use the payment key token here
      }),
    });
    if (!response.ok) throw new Error('Failed to get mobile wallet redirect URL.');
    return ((await response.json()) as WalletPaymentResponse).redirect_url;
  }

  public static async initiateCoursePayment(user: User, course: Course, paymentId: string, paymentMethod: PaymentMethod, walletNumber?: string, finalAmount?: number): Promise<PaymentInitiationResult> {
    const amountCents = Math.round((finalAmount || course.price) * 100);
    const authToken = await this.getAuthToken();
    const paymobOrderId = await this.registerOrder(authToken, amountCents, paymentId);

    const baseResponse = {
      orderId: paymobOrderId,
      initiatedAt: new Date().toISOString()
    };

    if (paymentMethod === 'card') {
      const paymentKey = await this.getPaymentKey(authToken, amountCents, paymobOrderId, user, serverEnv.PAYMOB_INTEGRATION_ID_ONLINE_CARD);

      await db.payment.update({
        where: { id: paymentId },
        data: {
          paymobOrderId: paymobOrderId.toString(),
          paymobResponse: { ...baseResponse, paymentKey }
        } as Record<string, unknown>
      });

      return { type: 'iframe', token: paymentKey };
    }

    if (paymentMethod === 'wallet') {
      if (!walletNumber) throw new Error("Wallet number is required.");
      const paymentKey = await this.getPaymentKey(authToken, amountCents, paymobOrderId, user, serverEnv.PAYMOB_INTEGRATION_ID_MOBILE_WALLET);

      await db.payment.update({
        where: { id: paymentId },
        data: {
          paymobOrderId: paymobOrderId.toString(),
          paymobResponse: { ...baseResponse, paymentKey, walletNumber }
        } as Record<string, unknown>
      });

      const redirectUrl = await this.getWalletRedirectUrl(paymentKey, walletNumber);
      return { type: 'redirect', url: redirectUrl };
    }

    throw new Error("Invalid payment method.");
  }

  public static verifyHmac(hmac: string, data: PayMobWebhookData): boolean {
    try {
      const { hmac: _, ...dataWithoutHmac } = data;

      const orderedKeys = [
        "amount_cents", "created_at", "currency", "error_occured", "has_parent_transaction",
        "id", "integration_id", "is_3d_secure", "is_auth", "is_capture", "is_refunded",
        "is_standalone_payment", "is_voided", "order", "owner", "pending",
        "source_data.pan", "source_data.sub_type", "source_data.type", "success"
      ];

      const concatenatedString = orderedKeys
        .map(key => key.startsWith("source_data.")
          ? dataWithoutHmac.source_data?.[key.split(".")[1] as keyof typeof dataWithoutHmac.source_data] ?? "false"
          : key === "order" ? dataWithoutHmac.order?.id : dataWithoutHmac[key as keyof typeof dataWithoutHmac]
        ).join("");

      const calculatedHmac = crypto.createHmac("sha512", serverEnv.PAYMOB_HMAC_SECRET).update(concatenatedString, "utf8").digest();
      return crypto.timingSafeEqual(calculatedHmac, Buffer.from(hmac, 'hex'));
    } catch {
      return false;
    }
  }

  public static async processPaymentUpdate(paymobOrderId: string, success: boolean, transactionId?: number) {
    const payment = await db.payment.findFirst({
      where: { paymobOrderId: paymobOrderId } as Record<string, unknown>,
      include: {
        user: { select: { id: true, firstName: true, lastName: true } },
        course: {
          select: {
            id: true,
            title: true,
            cashbackType: true,
            cashbackValue: true,
            price: true
          }
        }
      }
    });

    if (!payment) return null;

    const newStatus = success ? "COMPLETED" : "FAILED";

    let enrollmentId: string | undefined;
    let enrollmentCreated = false;

    // Use transaction to ensure atomicity of payment update, enrollment, and cashback
    await db.$transaction(async (tx) => {
      // 1. Update Payment Status
      await tx.payment.update({
        where: { id: payment.id },
        data: {
          status: newStatus,
          completedAt: success ? new Date() : null
        }
      });

      if (success) {
        // 2. Create Enrollment (Idempotent check)
        const existingEnrollment = await tx.enrollment.findFirst({
          where: { userId: payment.userId, courseId: payment.courseId }
        });

        if (!existingEnrollment) {
          const enrollment = await tx.enrollment.create({
            data: {
              userId: payment.userId,
              courseId: payment.courseId,
              status: EnrollmentStatus.ACTIVE,
              completionPercentage: 0,
            }
          });
          enrollmentCreated = true;
          enrollmentId = enrollment.id;
        } else {
          enrollmentId = existingEnrollment.id;
        }

        // 3. Credit Cashback (if applicable)
        // Calculate cashback only on the amount actually paid via PayMob (excluding wallet amount used)
        const actualAmountPaidViaPaymob = payment.amount.toNumber() - (payment.walletAmountUsed?.toNumber() || 0);
        const cashbackAmount = WalletService.calculateCashback(payment.course, actualAmountPaidViaPaymob);

        if (cashbackAmount > 0) {
          // Check if cashback already credited for this payment to ensure idempotency
          const existingCashback = await tx.walletTransaction.findFirst({
            where: {
              relatedPaymentId: payment.id,
              type: "CASHBACK_CREDIT"
            }
          });

          if (!existingCashback) {
            await WalletService.creditCashback(
              payment.userId,
              cashbackAmount,
              payment.id,
              payment.course.title,
              tx // Pass the transaction client
            );

            // Update payment record with cashback earned amount
            await tx.payment.update({
              where: { id: payment.id },
              data: { cashbackEarned: new Prisma.Decimal(cashbackAmount) }
            });
          }
        }
      } else {
        // Payment failed - check if cashback was previously credited and needs to be reversed
        // This handles cases where the payment status changes from completed to failed after cashback was already credited

        // Find any cashback transaction for this payment
        const existingCashback = await tx.walletTransaction.findFirst({
          where: {
            relatedPaymentId: payment.id,
            type: "CASHBACK_CREDIT"
          }
        });

        if (existingCashback) {
          // If payment failed, we need to reverse the previously credited cashback
          // This is important for cases where webhook was processed but payment later failed

          // Get the cashback amount to refund
          const cashbackAmount = Number(existingCashback.amount);

          // Create a reversal transaction by debiting the cashback amount
          await tx.walletTransaction.create({
            data: {
              userId: payment.userId,
              type: "CASHBACK_REVERSAL", // New transaction type for reversals
              amount: new Prisma.Decimal(-cashbackAmount), // Negative amount to debit
              balanceBefore: existingCashback.balanceAfter,
              balanceAfter: new Prisma.Decimal(Number(existingCashback.balanceAfter) - cashbackAmount),
              description: `Reversal of cashback for failed payment: ${payment.course.title}`,
              relatedPaymentId: payment.id,
              metadata: {
                courseName: payment.course.title,
                originalCashbackTransactionId: existingCashback.id,
                reversedAt: new Date().toISOString(),
              },
            },
          });

          // Update the user's wallet balance by decrementing the cashback amount
          await tx.user.update({
            where: { id: payment.userId },
            data: {
              walletBalance: {
                decrement: cashbackAmount,
              },
            },
          });

          // Update payment record to reset cashback earned
          await tx.payment.update({
            where: { id: payment.id },
            data: { cashbackEarned: new Prisma.Decimal(0) }
          });
        }
      }
    });

    return {
      paymentId: payment.id,
      status: newStatus,
      transactionId: transactionId,
      enrollment: {
        success: enrollmentCreated,
        enrollmentId: enrollmentId
      }
    };
  }
}