"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type ClipboardEvent,
  type KeyboardEvent,
} from "react";
import { useTapReaderMinigame } from "@/components/reader/TapReaderContext";

const STORAGE_KEY = "tap-essay-arcade-initials";

function sanitizeLetter(c: string): string {
  return c.toUpperCase().replace(/[^A-Z]/g, "").slice(-1);
}

export function HighScoreInitials() {
  const { completeMinigame } = useTapReaderMinigame();
  const [chars, setChars] = useState<[string, string, string]>(["", "", ""]);
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  const maybeAdvanceWhenFilled = useCallback(
    (prev: [string, string, string], next: [string, string, string]) => {
      const wasFull = Boolean(prev[0] && prev[1] && prev[2]);
      const nowFull = Boolean(next[0] && next[1] && next[2]);
      if (nowFull && !wasFull) {
        window.setTimeout(() => completeMinigame(), 450);
      }
    },
    [completeMinigame]
  );

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const u = raw.toUpperCase().replace(/[^A-Z]/g, "").slice(0, 3);
      setChars([
        u[0] ?? "",
        u[1] ?? "",
        u[2] ?? "",
      ]);
    } catch {
      /* ignore */
    }
  }, []);

  const persist = useCallback((next: [string, string, string]) => {
    try {
      localStorage.setItem(STORAGE_KEY, next.join(""));
    } catch {
      /* ignore */
    }
  }, []);

  const setAt = (i: number, letter: string) => {
    setChars((prev) => {
      const next: [string, string, string] = [...prev];
      next[i] = letter;
      maybeAdvanceWhenFilled(prev, next);
      persist(next);
      return next;
    });
  };

  const onChange = (i: number, e: ChangeEvent<HTMLInputElement>) => {
    const last = sanitizeLetter(e.target.value);
    setAt(i, last);
    if (last && i < 2) {
      inputsRef.current[i + 1]?.focus();
    }
  };

  const onKeyDown = (i: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace") {
      if (chars[i]) {
        setAt(i, "");
      } else if (i > 0) {
        inputsRef.current[i - 1]?.focus();
        setAt(i - 1, "");
      }
    }
  };

  const onPaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const text = e.clipboardData.getData("text").toUpperCase().replace(/[^A-Z]/g, "").slice(0, 3);
    if (!text) return;
    setChars((prev) => {
      const next: [string, string, string] = [
        text[0] ?? "",
        text[1] ?? "",
        text[2] ?? "",
      ];
      maybeAdvanceWhenFilled(prev, next);
      persist(next);
      return next;
    });
    const focusI = Math.min(text.length, 2);
    inputsRef.current[focusI]?.focus();
  };

  return (
    <div
      className="not-prose my-8 rounded-2xl border border-violet-500/35 bg-violet-950/40 px-4 py-6 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.06)] sm:px-6"
      role="region"
      aria-label="High score initials"
    >
      <p className="font-pixel text-[10px] leading-relaxed tracking-widest text-amber-200/95 sm:text-xs">
        CONGRATS — NEW HIGH SCORE
      </p>
      <p className="mt-3 text-sm text-white/80">
        You earned a spot on the leaderboard only you can see. Enter your
        initials below — three letters, arcade rules.
      </p>

      <p
        id="arcade-initials-label"
        className="font-pixel mt-5 text-[9px] tracking-[0.2em] text-violet-200/90 sm:text-[10px]"
      >
        ENTER INITIALS
      </p>

      <div
        className="mt-3 flex flex-wrap items-end justify-center gap-2 sm:gap-3"
        aria-labelledby="arcade-initials-label"
      >
        {[0, 1, 2].map((i) => (
          <input
            key={i}
            ref={(el) => {
              inputsRef.current[i] = el;
            }}
            type="text"
            inputMode="text"
            autoComplete="off"
            spellCheck={false}
            maxLength={1}
            value={chars[i]}
            onChange={(e) => onChange(i, e)}
            onKeyDown={(e) => onKeyDown(i, e)}
            onPaste={i === 0 ? onPaste : undefined}
            aria-label={`Initial letter ${i + 1} of 3`}
            className="font-pixel h-14 w-14 rounded-lg border-2 border-cyan-400/50 bg-black/50 text-center text-xl uppercase tracking-tight text-cyan-100 shadow-[0_0_20px_rgba(34,211,238,0.15)] outline-none ring-0 transition-[border-color,box-shadow] placeholder:text-white/20 focus:border-amber-300 focus:shadow-[0_0_24px_rgba(251,191,36,0.25)] sm:h-16 sm:w-16 sm:text-2xl"
          />
        ))}
      </div>

      <div className="mt-6 border-t border-white/10 pt-5 text-center">
        <p className="font-pixel text-[8px] uppercase tracking-[0.35em] text-white/45 sm:text-[9px]">
          Leaderboard preview
        </p>
        <p
          className="font-pixel mt-3 text-[clamp(1.5rem,6vw,2.25rem)] leading-none tracking-[0.4em] text-amber-200 drop-shadow-[0_0_12px_rgba(251,191,36,0.35)]"
          aria-live="polite"
        >
          {(chars[0] || "·") + (chars[1] || "·") + (chars[2] || "·")}
        </p>
      </div>
    </div>
  );
}
