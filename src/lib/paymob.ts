import { env } from "@/env";
import { db } from "@/server/db";
import { Course, User } from "@prisma/client";
import crypto from "crypto";

const PAYMOB_API_URL = env.PAYMOB_BASE_URL;

interface AuthTokenResponse { token: string; }
interface OrderRegistrationResponse { id: number; }
interface PaymentKeyResponse { token: string; }
interface WalletPaymentResponse { redirect_url: string; }

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
          email: user.username,
          first_name: user.firstName,
          last_name: user.lastName,
          phone_number: user.phoneNumber,
          apartment: "NA", floor: "NA", street: "NA", building: "NA", shipping_method: "NA",
          postal_code: "NA", city: "NA", country: "NA", state: "NA",
        },
        currency: "EGP",
        integration_id: integrationId,
      }),
    });
    if (!response.ok) throw new Error("Failed to get PayMob payment key.");
    return ((await response.json()) as PaymentKeyResponse).token;
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

    await db.payment.update({ where: { id: paymentId }, data: { paymobOrderId } });

    if (paymentMethod === 'card') {
      const paymentKey = await this.getPaymentKey(authToken, amountCents, paymobOrderId, user, env.PAYMOB_INTEGRATION_ID_ONLINE_CARD);
      return { type: 'iframe', token: paymentKey };
    }
    
    if (paymentMethod === 'wallet') {
      if (!walletNumber) throw new Error("Wallet number is required.");
      // CRITICAL FIX: Generate a payment key for the wallet integration first
      const paymentKey = await this.getPaymentKey(authToken, amountCents, paymobOrderId, user, env.PAYMOB_INTEGRATION_ID_MOBILE_WALLET);
      const redirectUrl = await this.getWalletRedirectUrl(paymentKey, walletNumber);
      return { type: 'redirect', url: redirectUrl };
    }

    throw new Error("Invalid payment method.");
  }

  public static verifyHmac(hmac: string, data: Record<string, any>): boolean {
    // This string must be ordered alphabetically by key
    const orderedData = {
        amount_cents: data.amount_cents, created_at: data.created_at, currency: data.currency, error_occured: data.error_occured,
        has_parent_transaction: data.has_parent_transaction, id: data.id, integration_id: data.integration_id, is_3d_secure: data.is_3d_secure,
        is_auth: data.is_auth, is_capture: data.is_capture, is_refunded: data.is_refunded, is_standalone_payment: data.is_standalone_payment,
        is_voided: data.is_voided, 'order.id': data.order.id, owner: data.owner, pending: data.pending,
        'source_data.pan': data.source_data.pan, 'source_data.sub_type': data.source_data.sub_type, 'source_data.type': data.source_data.type,
        success: data.success
    };
    const concatenatedString = Object.values(orderedData).join('');
    const calculatedHmac = crypto.createHmac('sha512', env.PAYMOB_HMAC_SECRET).update(concatenatedString).digest('hex');
    try {
        return crypto.timingSafeEqual(Buffer.from(calculatedHmac), Buffer.from(hmac));
    } catch (e) {
        return false;
    }
  }
}