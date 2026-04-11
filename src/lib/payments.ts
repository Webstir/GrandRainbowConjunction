export function getPaypalClientId(): string | undefined {
  return process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
}

export function getStripePublishableKey(): string | undefined {
  return process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
}

export function getCashAppTag(): string | undefined {
  return process.env.NEXT_PUBLIC_CASH_APP_TAG;
}
