"use client";

import { motion } from "framer-motion";
import { useEffect, type ReactNode } from "react";
import { bootChiptune } from "@/lib/chiptune";
import { useTapReaderMinigame } from "@/components/reader/TapReaderContext";

type Props = {
  title: string;
  /** e.g. "1984" for cabinet subtitle */
  era?: string;
  children: ReactNode;
};

export function MinigameWrapper({ title, era = "ARCADE", children }: Props) {
  const { claimReaderKeyboard } = useTapReaderMinigame();

  useEffect(() => {
    return claimReaderKeyboard();
  }, [claimReaderKeyboard]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="not-prose relative my-10 overflow-hidden rounded border-4 border-[#5a4528] bg-[#0a0a0f] p-4 shadow-[inset_0_0_60px_rgba(0,0,0,0.65),0_12px_40px_rgba(0,0,0,0.55)]"
      onClick={(e) => e.stopPropagation()}
      onPointerDown={(e) => e.stopPropagation()}
      onPointerDownCapture={() => {
        void bootChiptune();
      }}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.07]"
        style={{
          background:
            "repeating-linear-gradient(0deg, transparent, transparent 2px, #000 2px, #000 3px)",
        }}
      />
      <div className="relative">
        <div className="mb-3 flex flex-wrap items-end justify-between gap-2 border-b-2 border-[#2d2418] pb-2">
          <h3 className="font-pixel text-[10px] uppercase leading-tight tracking-wide text-[#f4d03f] sm:text-xs">
            {title}
          </h3>
          <span className="font-pixel text-[7px] text-[#6bcf7f] sm:text-[8px]">
            {`${era} · INSERT COIN \u{2B50}`}
          </span>
        </div>
        {children}
      </div>
    </motion.div>
  );
}
