import Link from "next/link";
import type { Metadata } from "next";
import { ChapterTheme } from "@/components/chapters/ChapterTheme";
import { TipJar } from "@/components/payments/TipJar";

export const metadata: Metadata = {
  title: "Tip jar",
  description: "Support The Grand Rainbow Conjunction.",
};

export default function TipPage() {
  return (
    <ChapterTheme theme="default">
      <div className="min-h-screen px-4 py-8">
        <header className="mb-8 flex justify-between">
          <Link
            href="/chapters/01-intro"
            className="text-sm text-(--chapter-muted-fg) hover:text-(--chapter-accent)"
          >
            ← Chapters
          </Link>
          <Link
            href="/"
            className="text-sm text-(--chapter-muted-fg) hover:text-(--chapter-accent)"
          >
            Home
          </Link>
        </header>
        <TipJar />
      </div>
    </ChapterTheme>
  );
}
