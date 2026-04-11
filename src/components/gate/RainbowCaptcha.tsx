"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  looksLikeRainbow,
  type Stroke,
  type StrokePoint,
  hueToBand,
  nextHue,
} from "@/lib/rainbow-detector";
import { useEssayStore } from "@/lib/store";

const REF_HUES = [0, 45, 90, 140, 200, 260, 310];

export function RainbowCaptcha() {
  const router = useRouter();
  const setGateCleared = useEssayStore((s) => s.setGateCleared);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const strokesRef = useRef<Stroke[]>([]);
  const currentRef = useRef<StrokePoint[]>([]);
  const hueRef = useRef(0);
  const [hue, setHue] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [msg, setMsg] = useState<string | null>(null);
  const [passing, setPassing] = useState(false);

  const resize = useCallback(() => {
    const c = canvasRef.current;
    if (!c) return;
    const dpr = Math.min(window.devicePixelRatio ?? 1, 2);
    const w = c.clientWidth;
    const h = c.clientHeight;
    c.width = w * dpr;
    c.height = h * dpr;
    const ctx = c.getContext("2d");
    if (ctx) ctx.scale(dpr, dpr);
  }, []);

  useEffect(() => {
    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, [resize]);

  const drawBg = useCallback(() => {
    const c = canvasRef.current;
    if (!c) return;
    const ctx = c.getContext("2d");
    if (!ctx) return;
    const w = c.clientWidth;
    const h = c.clientHeight;
    const g = ctx.createLinearGradient(0, 0, w, h);
    g.addColorStop(0, "#1a0a2e");
    g.addColorStop(0.5, "#2d1b4e");
    g.addColorStop(1, "#0f172a");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);
  }, []);

  useEffect(() => {
    drawBg();
  }, [drawBg]);

  const validate = useCallback(() => {
    const result = looksLikeRainbow(strokesRef.current);
    if (result.pass) {
      setPassing(true);
      setGateCleared(true);
      setTimeout(() => router.push("/chapters/01-intro"), 900);
      return;
    }
    setAttempts((a) => a + 1);
    const lines = [
      "Hmm, that looks more like a… scribble? Try again!",
      "Close! Robots can't do curves like that. One more try!",
      "Rainbows arc — give those strokes a little bend.",
    ];
    setMsg(lines[Math.min(attempts, lines.length - 1)]);
  }, [attempts, router, setGateCleared]);

  const clearCanvas = () => {
    strokesRef.current = [];
    currentRef.current = [];
    drawBg();
  };

  const canvasCoords = (e: React.PointerEvent, c: HTMLCanvasElement) => {
    const r = c.getBoundingClientRect();
    return { x: e.clientX - r.left, y: e.clientY - r.top };
  };

  const onPointerDown = (e: React.PointerEvent) => {
    if (passing) return;
    const c = canvasRef.current;
    if (!c) return;
    c.setPointerCapture(e.pointerId);
    const { x, y } = canvasCoords(e, c);
    currentRef.current = [{ x, y, t: Date.now() }];
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!currentRef.current.length || passing) return;
    if (e.buttons !== 1 && e.pressure === 0) return;
    const c = canvasRef.current;
    if (!c) return;
    const ctx = c.getContext("2d");
    if (!ctx) return;
    const { x, y } = canvasCoords(e, c);
    const prev = currentRef.current[currentRef.current.length - 1];
    currentRef.current.push({ x, y, t: Date.now(), hue: hueRef.current });
    ctx.strokeStyle = `hsl(${hueRef.current} 90% 60%)`;
    ctx.lineWidth = Math.max(2, 2 + (e.pressure || 0.5) * 6);
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.beginPath();
    ctx.moveTo(prev.x, prev.y);
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const onPointerUp = () => {
    if (passing) return;
    if (currentRef.current.length < 2) {
      currentRef.current = [];
      return;
    }
    strokesRef.current.push({
      points: [...currentRef.current],
      hueBand: hueToBand(hueRef.current),
    });
    currentRef.current = [];
  };

  const cycleHue = () => {
    const nh = nextHue(hueRef.current, 42);
    hueRef.current = nh;
    setHue(nh);
  };

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center bg-[#0c0618] px-4 py-12 text-white">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6 max-w-md text-center"
      >
        <h1 className="font-display text-3xl sm:text-4xl">
          {"\u{1F308}\u{2728} Grand Rainbow Conjunction"}
        </h1>
        <p className="mt-2 text-white/70">
          Cross when you&apos;re ready: draw a small{"\u{1F308}"}. Curves
          welcome. Perfection optional — the medicine starts with showing up.{" "}
          {"\u{2764}\u{FE0F}\u{2B50}"}
        </p>
      </motion.div>

      <div className="relative w-full max-w-lg overflow-hidden rounded-3xl border border-white/10 shadow-2xl">
        <canvas
          ref={canvasRef}
          className="h-[min(50vh,420px)] w-full touch-none bg-transparent"
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
        />
        {passing && (
          <motion.div
            className="pointer-events-none absolute inset-0 bg-linear-to-tr from-fuchsia-500/40 via-yellow-400/30 to-cyan-400/40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
          />
        )}
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
        <span className="text-xs text-white/50">Palette hints:</span>
        {REF_HUES.map((h) => (
          <button
            key={h}
            type="button"
            aria-label={`Hue ${h}`}
            className="h-6 w-6 rounded-full ring-2 ring-white/20"
            style={{ background: `hsl(${h} 90% 55%)` }}
            onClick={() => {
              hueRef.current = h;
              setHue(h);
            }}
          />
        ))}
        <button
          type="button"
          onClick={cycleHue}
          className="ml-2 rounded-full border border-white/30 px-3 py-1 text-xs"
        >
          Cycle hue ({hue}°)
        </button>
      </div>

      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <button
          type="button"
          onClick={validate}
          disabled={passing}
          className="rounded-full bg-white px-6 py-2 font-medium text-violet-950 disabled:opacity-50"
        >
          I drew a rainbow ✨
        </button>
        <button
          type="button"
          onClick={clearCanvas}
          className="rounded-full border border-white/30 px-5 py-2 text-sm"
        >
          Clear
        </button>
      </div>

      <AnimatePresence>
        {msg && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="mt-4 max-w-md text-center text-sm text-amber-200"
          >
            {msg}
          </motion.p>
        )}
      </AnimatePresence>

      {attempts >= 3 && (
        <button
          type="button"
          onClick={() => {
            setGateCleared(true);
            router.push("/chapters/01-intro");
          }}
          className="mt-6 text-xs underline text-white/50"
        >
          Skip gate (accessibility)
        </button>
      )}
    </div>
  );
}
