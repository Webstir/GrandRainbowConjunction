"use client";

import { useEffect, useState } from "react";

type Row = { id: string; answer: string; created_at: string };

export function CommunityAnswers({ chapterId }: { chapterId: string }) {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(
          `/api/answers?chapterId=${encodeURIComponent(chapterId)}`
        );
        const j = await res.json();
        if (!cancelled && Array.isArray(j.answers)) {
          setRows(j.answers);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [chapterId]);

  return (
    <div
      className="not-prose my-8 max-h-64 overflow-y-auto rounded-2xl border border-(--chapter-muted)/50 bg-(--background)/40 p-4"
      onClick={(e) => e.stopPropagation()}
    >
      <h4 className="mb-3 text-xs uppercase tracking-widest text-(--chapter-muted-fg)">
        From other readers
      </h4>
      {loading ? (
        <p className="text-sm text-(--chapter-muted-fg)">Loading…</p>
      ) : rows.length === 0 ? (
        <p className="text-sm text-(--chapter-muted-fg)">
          Be the first to leave a ripple.
        </p>
      ) : (
        <ul className="space-y-3">
          {rows.map((r) => (
            <li
              key={r.id}
              className="border-b border-(--chapter-muted)/30 pb-2 text-sm last:border-0"
            >
              {r.answer}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
