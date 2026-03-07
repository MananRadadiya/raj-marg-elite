/**
 * Generate fake Razorpay-style payment & order IDs
 */

function randomString(length) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export function generatePaymentId() {
  return `pay_${randomString(14)}`;
}

export function generateOrderId() {
  return `order_${randomString(14)}`;
}
