"use client";

import { useState } from "react";
import { MinigameWrapper } from "./MinigameWrapper";
import { useTapReaderMinigame } from "@/components/reader/TapReaderContext";

type Props = { question: string };

export function ReflectionSlider({ question }: Props) {
  const { completeMinigame } = useTapReaderMinigame();
  const [v, setV] = useState(5);

  return (
    <MinigameWrapper title="Hi-Score Feelings" era="1984">
      <p className="font-pixel mb-4 text-[9px] leading-relaxed text-[#a8c4a8]">
        {question}
      </p>
      <label className="font-pixel mb-1 block text-[8px] text-[#f4d03f]">
        LEVEL {v} / 10
      </label>
      <input
        type="range"
        min={1}
        max={10}
        value={v}
        onChange={(e) => setV(Number(e.target.value))}
        className="mb-4 h-3 w-full cursor-pointer appearance-none rounded-sm border-2 border-[#5a4528] bg-[#0a0a0f] accent-[#6bcf7f] [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-[#f4d03f] [&::-webkit-slider-thumb]:bg-[#e6b422]"
      />
      <button
        type="button"
        onClick={completeMinigame}
        className="font-pixel rounded border-2 border-[#f4d03f] bg-[#2a2418] px-4 py-2 text-[9px] uppercase tracking-wide text-[#f4d03f] hover:bg-[#3d3220]"
      >
        Save & continue
      </button>
    </MinigameWrapper>
  );
}
