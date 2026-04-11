import Link from "next/link";
import type { Metadata } from "next";
import { ChapterTheme } from "@/components/chapters/ChapterTheme";
import { SignupForm } from "@/components/newsletter/SignupForm";

export const metadata: Metadata = {
  title: "Subscribe",
  description: "Dispatches from The Grand Rainbow Conjunction.",
};

export default function SubscribePage() {
  return (
    <ChapterTheme theme="cool">
      <div className="mx-auto max-w-lg px-4 py-16 text-center">
        <Link
          href="/chapters/01-intro"
          className="mb-8 inline-block text-sm text-(--chapter-muted-fg) hover:text-(--chapter-accent)"
        >
          ← Back to reading
        </Link>
        <h1 className="font-display text-3xl text-(--chapter-accent)">
          {"\u{1F4E8}\u{2728} Letters from The Grand Rainbow Conjunction \u{1F308}"}
        </h1>
        <p className="mt-4 text-(--chapter-muted-fg)">
          New beats when there&apos;s more road behind the story{" "}
          {"\u{1F69A}\u{1F308}"}. No spam — just the next dispatch, when
          it&apos;s honest enough to send. {"\u{2764}\u{FE0F}\u{2B50}"}
        </p>
        <div className="mt-10">
          <SignupForm />
        </div>
      </div>
    </ChapterTheme>
  );
}
