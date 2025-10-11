import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Formats a number as a currency string with two decimal places.
 * @param amount The number to format.
 * @returns A string representing the formatted currency.
 */
export function formatCurrency(amount: number | string): string {
  const number = typeof amount === 'string' ? parseFloat(amount) : amount;
  if (isNaN(number)) {
    return '0.00';
  }
  return number.toFixed(2);
}