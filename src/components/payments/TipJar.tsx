"use client";

import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js";
import {
  getPaypalClientId,
  getCashAppTag,
  getStripePublishableKey,
} from "@/lib/payments";

const PRESETS = [3, 5, 10];

export function TipJar() {
  const paypalId = getPaypalClientId();
  const cashTag = getCashAppTag();
  const stripePk = getStripePublishableKey();

  const paypalOptions = {
    clientId: paypalId ?? "",
    intent: "capture" as const,
    currency: "USD",
    enableFunding: "venmo" as const,
  };

  return (
    <div className="mx-auto max-w-lg space-y-8 rounded-3xl border border-(--chapter-muted) bg-(--chapter-card) p-8">
      <div>
        <h2 className="font-display text-2xl text-(--chapter-accent)">
          Tip jar
        </h2>
        <p className="mt-2 text-sm text-(--chapter-muted-fg)">
          If Grand Rainbow Conjunction held something for you — medicine, a laugh,
          a minute of breath — you can leave a small thank-you. No account
          needed for most options.
        </p>
      </div>

      {paypalId ? (
        <div>
          <p className="mb-3 text-xs uppercase tracking-widest text-(--chapter-muted-fg)">
            PayPal / Venmo
          </p>
          <PayPalScriptProvider options={paypalOptions}>
            <PayPalButtons
              style={{ layout: "vertical", shape: "pill" }}
              createOrder={(_, actions) =>
                actions.order.create({
                  intent: "CAPTURE",
                  purchase_units: [
                    { amount: { currency_code: "USD", value: "5.00" } },
                  ],
                })
              }
              onApprove={async (_, actions) => {
                await actions.order?.capture();
              }}
            />
          </PayPalScriptProvider>
        </div>
      ) : (
        <p className="text-sm text-(--chapter-muted-fg)">
          Set{" "}
          <code className="rounded-sm bg-black/30 px-1">NEXT_PUBLIC_PAYPAL_CLIENT_ID</code>{" "}
          to enable PayPal and Venmo buttons.
        </p>
      )}

      <div>
        <p className="mb-3 text-xs uppercase tracking-widest text-(--chapter-muted-fg)">
          Preset amounts (Cash App)
        </p>
        <div className="flex flex-wrap gap-2">
          {PRESETS.map((n) => {
            const tag = cashTag
              ? cashTag.startsWith("$")
                ? cashTag
                : `$${cashTag}`
              : "";
            return (
            <a
              key={n}
              href={tag ? `https://cash.app/${tag}/${n}` : "#"}
              className="rounded-full border border-(--chapter-accent)/50 px-4 py-2 text-sm hover:bg-(--chapter-accent)/10"
            >
              ${n}
            </a>
          );
          })}
        </div>
        {!cashTag && (
          <p className="mt-2 text-xs text-(--chapter-muted-fg)">
            Set{" "}
            <code className="rounded-sm bg-black/30 px-1">NEXT_PUBLIC_CASH_APP_TAG</code>{" "}
            (e.g. $yourname) for Cash App links.
          </p>
        )}
      </div>

      <div className="rounded-xl border border-dashed border-(--chapter-muted) p-4 text-sm text-(--chapter-muted-fg)">
        <strong className="text-(--foreground)">Apple Pay / Google Pay:</strong>{" "}
        wire{" "}
        <code className="rounded-sm bg-black/30 px-1">Stripe Payment Request Button</code>{" "}
        via a small{" "}
        <code className="rounded-sm bg-black/30 px-1">/api/tip/intent</code> route when
        you&apos;re ready.{" "}
        {stripePk ? (
          <span>
            Stripe publishable key is set — you can add Elements next.
          </span>
        ) : (
          <span>
            Add{" "}
            <code className="rounded-sm bg-black/30 px-1">
              NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
            </code>{" "}
            when configuring Stripe.
          </span>
        )}
      </div>
    </div>
  );
}
