/**
 * PayPal.me handle (no @). Override with NEXT_PUBLIC_PAYPAL_ME_USERNAME.
 */
export function getPayPalMeUsername(): string {
  const raw = process.env.NEXT_PUBLIC_PAYPAL_ME_USERNAME ?? "PayPalSimmons";
  return raw.replace(/^@/, "").trim();
}

export function getPayPalMeUrl(): string {
  return `https://paypal.me/${encodeURIComponent(getPayPalMeUsername())}`;
}
