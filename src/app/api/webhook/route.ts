import { NextRequest, NextResponse } from "next/server";

/**
 * PayPal / Stripe webhooks — verify signatures in production.
 */
export async function POST(req: NextRequest) {
  const stripeSig = req.headers.get("stripe-signature");
  const paypalTransmission = req.headers.get("paypal-transmission-id");

  if (stripeSig) {
    // const raw = await req.text();
    // stripe.webhooks.constructEvent(raw, stripeSig, secret)
    return NextResponse.json({ received: true, provider: "stripe" });
  }

  if (paypalTransmission) {
    return NextResponse.json({ received: true, provider: "paypal" });
  }

  return NextResponse.json({ received: true, provider: "unknown" });
}
