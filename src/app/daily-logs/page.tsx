import Link from "next/link";
import type { Metadata } from "next";
import { ChapterTheme } from "@/components/chapters/ChapterTheme";
import { DailyLogsContent } from "@/components/daily-logs/DailyLogsContent";

export const metadata: Metadata = {
  title: "Daily logs",
  description:
    "Stewardship, food budgeting on the road, and lived community — daily logs at The Grand Rainbow Conjunction.",
};

export default function DailyLogsPage() {
  return (
    <ChapterTheme theme="warm">
      <div className="mx-auto max-w-3xl px-4 py-10 sm:py-14">
        <Link
          href="/chapters/01-intro"
          className="mb-8 inline-block text-sm text-(--chapter-muted-fg) hover:text-(--chapter-accent)"
        >
          ← Back to chapter 1
        </Link>
        <DailyLogsContent />
      </div>
    </ChapterTheme>
  );
}
