"use client";

import { useMemo } from "react";
import { WisdomSummary } from "@/components/chapter-end/WisdomSummary";
import { useEssayStore } from "@/lib/store";

type Props = {
  items: string[];
  /** Global tap index of the first bullet in this aside. */
  startStep: number;
  chapterId: string;
};

export function WisdomSummaryTap({ items, startStep, chapterId }: Props) {
  const raw = useEssayStore((s) => s.chapterProgress[chapterId] ?? 0);
  const count = Math.min(items.length, Math.max(0, raw - startStep + 1));
  const visible = useMemo(() => items.slice(0, count), [items, count]);
  return <WisdomSummary items={visible} />;
}
