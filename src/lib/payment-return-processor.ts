import { PayMobService } from './paymob';

interface PaymentReturnData {
  id: string;
  success: string;
  order: string;
  amount_cents: string;
  merchant_order_id: string;
  hmac: string;
  [key: string]: string | string[] | undefined;
}

export async function processPaymentReturn(searchParams: { [key: string]: string | string[] | undefined }) {
  const data = searchParams as PaymentReturnData;
  const paymobOrderId = data.order;
  const success = data.success === 'true';

  if (!paymobOrderId) return null;

  try {
    return await PayMobService.processPaymentUpdate(paymobOrderId, success);
  } catch (err) {
    console.error('Error processing payment return:', err);
    return null;
  }
}