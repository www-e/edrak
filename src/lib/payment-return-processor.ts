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

  if (!paymobOrderId) return;

  return PayMobService.processPaymentUpdate(paymobOrderId, success);
}