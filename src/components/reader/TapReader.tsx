"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  type MouseEvent,
  type PointerEvent,
} from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Section } from "./Section";
import { ProgressBar } from "./ProgressBar";
import { TapReaderProvider } from "./TapReaderContext";
import { useEssayStore } from "@/lib/store";
import { chapterMap, getNextChapterId } from "@/content/meta";
import {
  type ReaderParagraph,
  totalTapSteps,
  visibleFragmentsAtTapStep,
} from "@/lib/reader-paragraph";

type Props = {
  /** Slug for reading progress (trunk or branch file id). */
  chapterId: string;
  /** Trunk chapter id for sequential “next chapter” navigation. */
  trunkChapterId: string;
  paragraphs: ReaderParagraph[];
};

export function TapReader({
  chapterId,
  trunkChapterId,
  paragraphs,
}: Props) {
  const total = totalTapSteps(paragraphs);
  const rawIndex = useEssayStore((s) => s.chapterProgress[chapterId] ?? 0);
  const setChapterProgress = useEssayStore((s) => s.setChapterProgress);
  const activeIndex = useMemo(
    () => Math.min(Math.max(0, rawIndex), Math.max(0, total - 1)),
    [rawIndex, total]
  );

  const containerRef = useRef<HTMLDivElement>(null);
  const touchStart = useRef<{ y: number; x: number } | null>(null);
  const suppressReaderKeyboardRef = useRef(0);

  const advance = useCallback(() => {
    const raw = useEssayStore.getState().chapterProgress[chapterId] ?? 0;
    const cur = Math.min(Math.max(0, raw), Math.max(0, total - 1));
    setChapterProgress(chapterId, Math.min(cur + 1, total - 1));
  }, [chapterId, total, setChapterProgress]);

  const goBack = useCallback(() => {
    const raw = useEssayStore.getState().chapterProgress[chapterId] ?? 0;
    const cur = Math.min(Math.max(0, raw), Math.max(0, total - 1));
    setChapterProgress(chapterId, Math.max(0, cur - 1));
  }, [chapterId, total, setChapterProgress]);

  const completeMinigame = useCallback(() => {
    advance();
  }, [advance]);

  /**
   * Each time you open this chapter (including from another), start at tap 0 —
   * unless the URL hash is #faqs on chapter 5, in which case jump to the FAQ
   * block at the final tap step.
   */
  useLayoutEffect(() => {
    const hash =
      typeof window !== "undefined" ? window.location.hash.slice(1) : "";
    const jumpToFaqs =
      hash === "faqs" && chapterId === "05-fifth" && total > 0;
    setChapterProgress(chapterId, jumpToFaqs ? total - 1 : 0);
  }, [chapterId, setChapterProgress, total]);

  useEffect(() => {
    if (rawIndex !== activeIndex) {
      setChapterProgress(chapterId, activeIndex);
    }
  }, [chapterId, rawIndex, activeIndex, setChapterProgress]);

  useEffect(() => {
    const el = containerRef.current?.querySelector(
      `[data-section="${activeIndex}"]`
    );
    el?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [activeIndex]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement)
        return;
      if (suppressReaderKeyboardRef.current > 0) {
        if (
          e.code === "Space" ||
          e.code === "ArrowLeft" ||
          e.code === "ArrowRight" ||
          e.code === "ArrowUp" ||
          e.code === "ArrowDown" ||
          e.code === "KeyW" ||
          e.code === "KeyA" ||
          e.code === "KeyS" ||
          e.code === "KeyD"
        ) {
          return;
        }
      }
      if (e.code === "Space" || e.code === "ArrowRight") {
        e.preventDefault();
        advance();
      }
      if (e.code === "ArrowLeft") {
        e.preventDefault();
        goBack();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [advance, goBack]);

  const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    if (
      (e.target as HTMLElement).closest("button, a, input, textarea, canvas")
    ) {
      return;
    }
    touchStart.current = { y: e.clientY, x: e.clientX };
  };

  const onPointerUp = (e: PointerEvent<HTMLDivElement>) => {
    if (!touchStart.current) return;
    const dy = e.clientY - touchStart.current.y;
    const dx = e.clientX - touchStart.current.x;
    touchStart.current = null;
    if (Math.abs(dy) > 48 && Math.abs(dy) > Math.abs(dx)) {
      if (dy < 0) advance();
      else goBack();
    }
  };

  const onClickMain = (e: MouseEvent<HTMLDivElement>) => {
    if (
      (e.target as HTMLElement).closest("button, a, input, textarea, canvas")
    ) {
      return;
    }
    advance();
  };

  if (total === 0) {
    return (
      <p className="px-4 py-12 text-center text-(--chapter-muted-fg)">
        This chapter is empty.
      </p>
    );
  }

  const nextId = getNextChapterId(trunkChapterId);
  const atLastBeat = activeIndex >= total - 1;
  const showNextChapter = atLastBeat && Boolean(nextId);
  const { paragraphIndex, fragments } = visibleFragmentsAtTapStep(
    paragraphs,
    activeIndex
  );
  const stackCount = fragments.length;

  return (
    <TapReaderProvider
      completeMinigame={completeMinigame}
      suppressReaderKeyboardRef={suppressReaderKeyboardRef}
    >
      <ProgressBar current={activeIndex} total={total} />
      <div
        ref={containerRef}
        className="min-h-[70vh] cursor-pointer select-none pb-32 pt-8"
        onClick={onClickMain}
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
        role="application"
        aria-label="Tap or press space to advance"
      >
        <AnimatePresence mode="wait">
          <Section key={paragraphIndex} tapStep={activeIndex}>
            {fragments.map((el, i) => (
              <motion.div
                key={i}
                className="[&:not(:first-child)]:mt-4"
                initial={i === stackCount - 1 ? { opacity: 0, y: 10 } : false}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.35,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                {el}
              </motion.div>
            ))}
          </Section>
        </AnimatePresence>
        {showNextChapter && nextId && (
          <div className="mx-auto mt-6 max-w-160 px-4 text-center">
            <Link
              href={`/chapters/${nextId}`}
              className="inline-block rounded-full border border-(--chapter-accent) px-6 py-2 text-sm font-medium text-(--chapter-accent) hover:bg-(--chapter-accent)/10"
              onClick={(e) => e.stopPropagation()}
              onPointerDown={(e) => e.stopPropagation()}
            >
              Next: {chapterMap[nextId]?.title ?? nextId}
            </Link>
          </div>
        )}
        <motion.p
          className="mx-auto mt-6 max-w-160 px-4 text-center text-sm text-(--chapter-muted-fg)"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.7 }}
        >
          {activeIndex >= total - 1 ? (
            <>
              End of this chapter — ← to go back, or use the nav above to choose
              another. {"\u{2728}\u{1F308}"}
            </>
          ) : (
            <>
              Tap, click, or space to continue · ← to go back · Swipe up / down
              on mobile {"\u{2728}\u{1F308}"}
            </>
          )}
        </motion.p>
      </div>
    </TapReaderProvider>
  );
}
