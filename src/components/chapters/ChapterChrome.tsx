import Link from "next/link";
import { chapterOrder, chapterMap, getNextChapterId } from "@/content/meta";
import { SignupForm } from "@/components/newsletter/SignupForm";

export function ChapterChrome({
  chapterId,
  title,
  children,
}: {
  chapterId: string;
  title: string;
  children: React.ReactNode;
}) {
  const nextId = getNextChapterId(chapterId);
  const idx = chapterOrder.indexOf(chapterId);

  return (
    <>
      <header className="sticky top-0 z-30 border-b border-(--chapter-muted) bg-(--chapter-card)">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-4 px-4 py-3 text-sm">
          <Link
            href="/"
            className="text-(--chapter-muted-fg) hover:text-(--chapter-accent)"
          >
            The Grand Rainbow Conjunction
          </Link>
          <span className="font-display text-(--chapter-accent)">
            {title}
          </span>
          <nav className="flex flex-wrap gap-3 text-(--chapter-muted-fg)">
            <Link
              href="/rainbow-gallery"
              className="hover:text-(--chapter-accent)"
            >
              Rainbow wall
            </Link>
            <Link href="/tip" className="hover:text-(--chapter-accent)">
              Tip
            </Link>
            <Link href="/subscribe" className="hover:text-(--chapter-accent)">
              Subscribe
            </Link>
          </nav>
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
        {nextId && (
          <Link
            href={`/chapters/${nextId}`}
            className="inline-block rounded-full border border-(--chapter-accent) px-6 py-2 text-sm font-medium text-(--chapter-accent) hover:bg-(--chapter-accent)/10"
          >
            Next: {chapterMap[nextId]?.title ?? nextId}
          </Link>
        )}
        <div className="border-t border-(--chapter-muted) pt-8">
          <p className="mb-3 text-xs uppercase tracking-widest text-(--chapter-muted-fg)">
            {"Newsletter \u{1F4E8}\u{2728}"}
          </p>
          <SignupForm compact />
        </div>
        <p className="text-xs text-(--chapter-muted-fg)">
          Chapter {idx >= 0 ? idx + 1 : "—"} of {chapterOrder.length}
        </p>
      </footer>
    </>
  );
}
