'use server';

import { processPaymentReturn } from './payment-return-processor';

export async function processPaymentReturnAction(searchParams: { [key: string]: string | string[] | undefined }) {
  try {
    const result = await processPaymentReturn(searchParams);
    return { success: true, data: result };
  } catch (error) {
    console.error('Payment return processing error:', error);
    return { success: false, error: 'Failed to process payment return' };
  }
}