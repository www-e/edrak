import { env } from "@/env";
import { db } from "@/server/db";
import { Course, User } from "@prisma/client";
import crypto from "crypto";

const PAYMOB_API_URL = env.PAYMOB_BASE_URL;

interface AuthTokenResponse { token: string; }
interface OrderRegistrationResponse { id: number; }
interface PaymentKeyResponse { token: string; }
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
  source_data: {
    pan: string;
    sub_type: string;
    type: string;
  };
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
      body: JSON.stringify({ api_key: env.PAYMOB_API_KEY }),
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
          country: 'EG',
          state: 'Cairo',
          city: 'Cairo',
          street: 'N/A',
          building: 'N/A',
          floor: 'N/A',
          apartment: 'N/A',
        },
        currency: "EGP",
        integration_id: integrationId,
        lock_order_when_paid: true,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("PayMob payment key request failed:", {
        status: response.status,
        statusText: response.statusText,
        body: errorText,
        authToken: authToken.substring(0, 10) + "...",
        integrationId,
        orderId,
        amountCents
      });
      throw new Error(`Failed to get PayMob payment key. Status: ${response.status}, Error: ${errorText}`);
    }

    const responseData = await response.json();
    if (!responseData.token) {
      throw new Error("PayMob payment key response missing token field");
    }

    return responseData.token;
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

  public static async initiateCoursePayment(user: User, course: Course, paymentId: string, paymentMethod: PaymentMethod, walletNumber?: string): Promise<PaymentInitiationResult> {
    const amountCents = Math.round(course.price * 100);
    const authToken = await this.getAuthToken();
    const paymobOrderId = await this.registerOrder(authToken, amountCents, paymentId);

    await db.payment.update({
      where: { id: paymentId },
      data: {
        paymobOrderId: paymobOrderId.toString(),
        paymobResponse: {
          orderId: paymobOrderId,
          initiatedAt: new Date().toISOString()
        }
      } as Record<string, unknown>
    });

    if (paymentMethod === 'card') {
      const paymentKey = await this.getPaymentKey(authToken, amountCents, paymobOrderId, user, env.PAYMOB_INTEGRATION_ID_ONLINE_CARD);

      // Store payment key in database for later retrieval
      await db.payment.update({
        where: { id: paymentId },
        data: {
          paymobResponse: {
            orderId: paymobOrderId,
            paymentKey: paymentKey,
            initiatedAt: new Date().toISOString()
          }
        } as Record<string, unknown>
      });

      return { type: 'iframe', token: paymentKey };
    }
    
    if (paymentMethod === 'wallet') {
      if (!walletNumber) throw new Error("Wallet number is required.");
      // CRITICAL FIX: Generate a payment key for the wallet integration first
      const paymentKey = await this.getPaymentKey(authToken, amountCents, paymobOrderId, user, env.PAYMOB_INTEGRATION_ID_MOBILE_WALLET);

      // Store payment key in database for wallet payments too
      await db.payment.update({
        where: { id: paymentId },
        data: {
          paymobResponse: {
            orderId: paymobOrderId,
            paymentKey: paymentKey,
            walletNumber: walletNumber,
            initiatedAt: new Date().toISOString()
          }
        } as Record<string, unknown>
      });

      const redirectUrl = await this.getWalletRedirectUrl(paymentKey, walletNumber);
      return { type: 'redirect', url: redirectUrl };
    }

    throw new Error("Invalid payment method.");
  }

  public static verifyHmac(hmac: string, data: PayMobWebhookData): boolean {
    try {
      const { hmac: receivedHmac, ...dataWithoutHmac } = data;

      // The fields must be ordered alphabetically by key.
      const orderedKeys = [
        "amount_cents",
        "created_at",
        "currency",
        "error_occured",
        "has_parent_transaction",
        "id",
        "integration_id",
        "is_3d_secure",
        "is_auth",
        "is_capture",
        "is_refunded",
        "is_standalone_payment",
        "is_voided",
        "order",
        "owner",
        "pending",
        "source_data.pan",
        "source_data.sub_type",
        "source_data.type",
        "success",
      ];

      // Build the concatenated string from the data object
      const concatenatedString = orderedKeys
        .map((key) => {
          if (key.startsWith("source_data.")) {
            const subKey = key.split(".")[1];
            return (
              dataWithoutHmac.source_data?.[subKey as keyof typeof dataWithoutHmac.source_data] ??
              "false"
            );
          }
          if (key === "order") {
            return dataWithoutHmac.order?.id;
          }
          return dataWithoutHmac[key as keyof typeof dataWithoutHmac];
        })
        .join("");

      // Generate our own HMAC
      const calculatedHmac = crypto
        .createHmac("sha512", env.PAYMOB_HMAC_SECRET)
        .update(concatenatedString, "utf8")
        .digest();

      // Compare safely using timingSafeEqual
      return crypto.timingSafeEqual(calculatedHmac, Buffer.from(hmac, 'hex'));
    } catch (error) {
      console.error("HMAC verification error:", error);
      return false;
    }
  }
}