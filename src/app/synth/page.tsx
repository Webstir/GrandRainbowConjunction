import Link from "next/link";
import type { Metadata } from "next";
import { ChapterTheme } from "@/components/chapters/ChapterTheme";
import { SynthLoader } from "./SynthLoader";

export const metadata: Metadata = {
  title: "Synth",
  description: "Web Audio playground · The Grand Rainbow Conjunction.",
};

export default function SynthPage() {
  return (
    <ChapterTheme theme="violet">
      <div className="min-h-screen">
        <header className="flex items-center justify-between px-4 py-4">
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
            Gate
          </Link>
        </header>
        <SynthLoader />
      </div>
    </ChapterTheme>
  );
}
