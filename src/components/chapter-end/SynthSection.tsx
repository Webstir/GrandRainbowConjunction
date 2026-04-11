"use client";

import Link from "next/link";

export function SynthSection() {
  return (
    <aside
      className="not-prose my-10 rounded-2xl border border-(--chapter-muted) bg-(--chapter-card)/60 px-6 py-6"
      onClick={(e) => e.stopPropagation()}
    >
      <h3 className="font-display text-lg text-(--chapter-accent)">
        {"Web synth \u{1F3B5}\u{1F308}"}
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-(--chapter-muted-fg)">
        Compose your own boss theme in the browser — oscilloscope, keys, and a
        little ceremony. Step out of the page for a minute; the hallway will
        wait.
      </p>
      <Link
        href="/synth"
        className="mt-4 inline-flex rounded-full border border-(--chapter-accent) px-5 py-2 text-sm font-medium text-(--chapter-accent) hover:bg-(--chapter-accent)/10"
      >
        Open the synth →
      </Link>
    </aside>
  );
}
