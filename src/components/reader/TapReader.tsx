"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type MouseEvent,
  type PointerEvent,
  type ReactElement,
} from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Section } from "./Section";
import { ProgressBar } from "./ProgressBar";
import { TapReaderProvider } from "./TapReaderContext";
import { useEssayStore } from "@/lib/store";
import { chapterMap, getNextChapterId } from "@/content/meta";

type Props = {
  /** Slug for reading progress (trunk or branch file id). */
  chapterId: string;
  /** Trunk chapter id for sequential “next chapter” navigation. */
  trunkChapterId: string;
  sectionElements: ReactElement[];
};

export function TapReader({
  chapterId,
  trunkChapterId,
  sectionElements,
}: Props) {
  const total = sectionElements.length;
  const saved = useEssayStore((s) => s.chapterProgress[chapterId] ?? -1);
  const setChapterProgress = useEssayStore((s) => s.setChapterProgress);

  const [activeIndex, setActiveIndex] = useState(() =>
    Math.min(Math.max(0, saved), Math.max(0, total - 1))
  );
  const containerRef = useRef<HTMLDivElement>(null);
  const touchStart = useRef<{ y: number; x: number } | null>(null);
  const suppressReaderKeyboardRef = useRef(0);

  const advance = useCallback(() => {
    setActiveIndex((i) => Math.min(i + 1, total - 1));
  }, [total]);

  const goBack = useCallback(() => {
    setActiveIndex((i) => Math.max(0, i - 1));
  }, []);

  const completeMinigame = useCallback(() => {
    advance();
  }, [advance]);

  useEffect(() => {
    setChapterProgress(chapterId, activeIndex);
  }, [chapterId, activeIndex, setChapterProgress]);

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
          <Section key={activeIndex} index={activeIndex} activeIndex={activeIndex}>
            {sectionElements[activeIndex]}
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
