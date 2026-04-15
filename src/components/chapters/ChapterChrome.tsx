import Link from "next/link";
import { chapterOrder, chapterMap } from "@/content/meta";
import { SignupForm } from "@/components/newsletter/SignupForm";
import { GOFUNDME_SAVE_RICO_URL } from "@/lib/support";

export function ChapterChrome({
  chapterId,
  title,
  children,
}: {
  chapterId: string;
  title: string;
  children: React.ReactNode;
}) {
  const idx = chapterOrder.indexOf(chapterId);

  return (
    <>
      <header className="sticky top-0 z-30 border-b border-(--chapter-muted) bg-(--chapter-card)">
        <div className="mx-auto max-w-3xl px-4 py-3">
          <div className="flex flex-col gap-3">
            <p className="font-display text-center text-[0.95rem] leading-snug text-(--chapter-accent) sm:text-lg">
              {title}
            </p>
            <nav
              className="grid grid-cols-2 gap-2 text-center text-xs text-(--chapter-muted-fg) sm:grid-cols-4 sm:text-sm"
              aria-label="Chapter utilities"
            >
              <Link
                href="/rainbow-gallery"
                className="min-w-0 hyphens-auto break-words hover:text-(--chapter-accent)"
              >
                Rainbow wall
              </Link>
              <Link
                href={GOFUNDME_SAVE_RICO_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="min-w-0 hover:text-(--chapter-accent)"
              >
                Tip
              </Link>
              <Link
                href="/subscribe"
                className="min-w-0 hover:text-(--chapter-accent)"
              >
                Subscribe
              </Link>
              <Link
                href="/chapters/05-fifth#faqs"
                className="min-w-0 text-violet-300/95 hover:text-violet-200"
              >
                FAQs
              </Link>
            </nav>
          </div>
        </div>
      </header>
      <main>{children}</main>
      <footer className="mx-auto max-w-3xl space-y-6 px-4 py-16 text-center">
        <div className="flex flex-wrap justify-center gap-4 text-sm text-(--chapter-muted-fg)">
          {chapterOrder.map((id) => (
            <Link
              key={id}
              href={`/chapters/${id}`}
              className={
                id === chapterId
                  ? "text-(--chapter-accent)"
                  : "hover:text-(--foreground)"
              }
            >
              {chapterMap[id]?.title ?? id}
            </Link>
          ))}
        </div>
        <div className="border-t border-(--chapter-muted) pt-8">
          <p className="mb-3 text-xs uppercase tracking-widest text-(--chapter-muted-fg)">
            {"Newsletter \u{1F4E8}\u{2728}"}
          </p>
          <SignupForm compact />
        </div>
        <p className="text-xs text-(--chapter-muted-fg)">
          Chapter {idx >= 0 ? idx + 1 : "—"} of {chapterOrder.length}
        </p>
        <p className="text-xs text-(--chapter-muted-fg)">
          This site was made with{" "}
          <span className="heart-pulsate" aria-label="love">
            {"\u{1F49C}"}
          </span>{" "}
          by{" "}
          <Link
            href="https://NuancedDesign.com"
            className="text-(--chapter-accent) underline decoration-(--chapter-muted) underline-offset-2 hover:decoration-(--chapter-accent)"
            rel="noopener noreferrer"
          >
            Nuanced Design
          </Link>
          .
        </p>
      </footer>
    </>
  );
}
