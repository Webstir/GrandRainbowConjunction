import Link from "next/link";
import type { Metadata } from "next";
import { ChapterTheme } from "@/components/chapters/ChapterTheme";
import { FaqsAccordion } from "@/components/chapter-end/FaqsAccordion";

export const metadata: Metadata = {
  title: "FAQs",
  description:
    "The Homelessness Catch 22 — questions and answers at The Grand Rainbow Conjunction.",
};

export default function FaqsPage() {
  return (
    <ChapterTheme theme="violet">
      <div className="mx-auto max-w-3xl px-4 py-10 sm:py-14">
        <Link
          href="/chapters/05-fifth"
          className="mb-8 inline-block text-sm text-(--chapter-muted-fg) hover:text-(--chapter-accent)"
        >
          ← Back to chapter 5
        </Link>
        <FaqsAccordion />
      </div>
    </ChapterTheme>
  );
}
