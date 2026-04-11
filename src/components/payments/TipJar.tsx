import { getPayPalMeUrl, getPayPalMeUsername } from "@/lib/payments";

export function TipJar() {
  const url = getPayPalMeUrl();
  const handle = getPayPalMeUsername();

  return (
    <div className="mx-auto max-w-lg space-y-8 rounded-3xl border border-(--chapter-muted) bg-(--chapter-card) p-8">
      <div>
        <h2 className="font-display text-2xl text-(--chapter-accent)">
          Tip jar
        </h2>
        <p className="mt-2 text-sm text-(--chapter-muted-fg)">
          If Grand Rainbow Conjunction held something for you — medicine, a laugh,
          a minute of breath — you can leave a small thank-you via PayPal.
        </p>
      </div>

      <div>
        <p className="mb-3 text-xs uppercase tracking-widest text-(--chapter-muted-fg)">
          PayPal
        </p>
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex w-full items-center justify-center rounded-full border border-(--chapter-accent)/50 bg-(--chapter-accent)/15 px-6 py-3 text-center text-sm font-medium text-(--chapter-accent) hover:bg-(--chapter-accent)/25"
        >
          Send a tip on PayPal (@{handle})
        </a>
        <p className="mt-3 text-xs text-(--chapter-muted-fg)">
          Opens{" "}
          <span className="font-mono text-[0.85em] text-(--foreground)/80">
            paypal.me/{handle}
          </span>{" "}
          in a new tab. You choose the amount there — no extra setup on this site.
        </p>
      </div>
    </div>
  );
}
