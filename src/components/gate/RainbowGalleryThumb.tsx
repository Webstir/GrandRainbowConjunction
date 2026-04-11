"use client";

import { useEffect, useRef } from "react";
import type { Stroke } from "@/lib/rainbow-detector";
import { drawRainbowBackground, drawRainbowStrokes } from "@/lib/rainbow-canvas";

type Props = {
  strokes: Stroke[];
  canvasW: number;
  canvasH: number;
  label: string | null;
  className?: string;
};

export function RainbowGalleryThumb({
  strokes,
  canvasW,
  canvasH,
  label,
  className = "",
}: Props) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const c = ref.current;
    if (!c) return;
    const paint = () => {
      const dpr = Math.min(window.devicePixelRatio ?? 1, 2);
      const w = c.clientWidth;
      const h = c.clientHeight;
      if (w < 2 || h < 2) return;
      c.width = w * dpr;
      c.height = h * dpr;
      const ctx = c.getContext("2d");
      if (!ctx) return;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      drawRainbowBackground(ctx, w, h);
      drawRainbowStrokes(ctx, strokes, canvasW, canvasH, w, h);
    };
    paint();
    const ro = new ResizeObserver(paint);
    ro.observe(c);
    return () => ro.disconnect();
  }, [strokes, canvasW, canvasH]);

  return (
    <figure
      className={`overflow-hidden rounded-2xl border border-white/10 bg-black/20 ${className}`}
    >
      <canvas ref={ref} className="aspect-[5/4] w-full touch-none" />
      <figcaption className="border-t border-white/10 px-2 py-1.5 text-center text-[10px] text-white/55 sm:text-xs">
        {label ?? "Anonymous"}
      </figcaption>
    </figure>
  );
}
