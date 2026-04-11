"use client";

type Props = { items: string[] };

export function WisdomSummary({ items }: Props) {
  return (
    <aside
      className="not-prose my-10 rounded-2xl border-l-4 border-(--chapter-accent) bg-(--chapter-card)/80 px-6 py-5"
      onClick={(e) => e.stopPropagation()}
    >
      <h3 className="mb-3 font-display text-sm uppercase tracking-widest text-(--chapter-accent)">
        Chapter notes
      </h3>
      <ul className="list-disc space-y-2 pl-4 text-(--foreground)">
        {items.map((t) => (
          <li key={t}>{t}</li>
        ))}
      </ul>
    </aside>
  );
}
