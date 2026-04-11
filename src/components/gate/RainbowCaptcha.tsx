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
import { RainbowGalleryThumb } from "@/components/gate/RainbowGalleryThumb";

const REF_HUES = [0, 45, 90, 140, 200, 260, 310];

type Phase = "draw" | "share" | "browse";

type MySnapshot = { strokes: Stroke[]; w: number; h: number };

type GalleryRow = {
  id: string;
  strokes: Stroke[];
  canvas_w: number;
  canvas_h: number;
  display_name: string | null;
  created_at: string;
};

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
  const [phase, setPhase] = useState<Phase>("draw");
  const [mySnapshot, setMySnapshot] = useState<MySnapshot | null>(null);
  const [signAsNamed, setSignAsNamed] = useState(false);
  const [signerName, setSignerName] = useState("");
  const [galleryItems, setGalleryItems] = useState<GalleryRow[]>([]);
  const [galleryLoading, setGalleryLoading] = useState(false);
  const [postBusy, setPostBusy] = useState(false);
  const [postError, setPostError] = useState<string | null>(null);

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
    if (phase !== "draw") return;
    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, [resize, phase]);

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
    if (phase !== "draw") return;
    drawBg();
  }, [drawBg, phase]);

  const loadGallery = useCallback(async () => {
    setGalleryLoading(true);
    try {
      const res = await fetch("/api/rainbow-gallery");
      const data = (await res.json()) as { items?: GalleryRow[]; error?: string };
      if (!res.ok) {
        setGalleryItems([]);
        return;
      }
      setGalleryItems(data.items ?? []);
    } finally {
      setGalleryLoading(false);
    }
  }, []);

  useEffect(() => {
    if (phase === "browse") {
      void loadGallery();
    }
  }, [phase, loadGallery]);

  const goBrowse = useCallback(() => {
    setPostError(null);
    setPhase("browse");
  }, []);

  const validate = useCallback(() => {
    const result = looksLikeRainbow(strokesRef.current);
    if (result.pass) {
      const c = canvasRef.current;
      const w = c?.clientWidth ?? 400;
      const h = c?.clientHeight ?? 420;
      const snap = structuredClone(strokesRef.current) as Stroke[];
      setMySnapshot({ strokes: snap, w, h });
      setPassing(true);
      window.setTimeout(() => {
        setPassing(false);
        setPhase("share");
      }, 900);
      return;
    }
    setAttempts((a) => a + 1);
    const lines = [
      "Hmm, that looks more like a… scribble? Try again!",
      "Close! Robots can't do curves like that. One more try!",
      "Rainbows arc — give those strokes a little bend.",
    ];
    setMsg(lines[Math.min(attempts, lines.length - 1)]);
  }, [attempts]);

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
    if (phase !== "draw" || passing) return;
    const c = canvasRef.current;
    if (!c) return;
    c.setPointerCapture(e.pointerId);
    const { x, y } = canvasCoords(e, c);
    currentRef.current = [{ x, y, t: Date.now() }];
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (phase !== "draw" || !currentRef.current.length || passing) return;
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
    if (phase !== "draw" || passing) return;
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

  const postToGallery = async () => {
    if (!mySnapshot) return;
    if (signAsNamed && !signerName.trim()) {
      setPostError("Add your name, or choose anonymous.");
      return;
    }
    setPostBusy(true);
    setPostError(null);
    try {
      const displayName = signAsNamed ? signerName.trim() : null;
      const res = await fetch("/api/rainbow-gallery", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          strokes: mySnapshot.strokes,
          canvasW: mySnapshot.w,
          canvasH: mySnapshot.h,
          displayName,
        }),
      });
      const data = (await res.json()) as { error?: string };
      if (!res.ok) {
        setPostError(data.error ?? "Could not save — try again.");
        return;
      }
      goBrowse();
    } finally {
      setPostBusy(false);
    }
  };

  const finishAndEnter = () => {
    setGateCleared(true);
    router.push("/chapters/01-intro");
  };

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center bg-[#0c0618] px-4 py-12 text-white">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6 max-w-md text-center"
      >
        <h1 className="font-display text-3xl sm:text-4xl">
          {"\u{1F308}\u{2728} The Grand Rainbow Conjunction"}
        </h1>
        <p className="mt-2 text-white/70">
          {phase === "browse" ? (
            <>
              Rainbows from travelers who crossed here — then step into the
              essay when you&apos;re ready.
            </>
          ) : phase === "share" ? (
            <>
              Beautiful. Share it on the public wall (signed or anonymous),
              or skip — you&apos;ll still see everyone else&apos;s before you
              go on.
            </>
          ) : (
            <>
              Cross when you&apos;re ready: draw a small{"\u{1F308}"}. Curves
              welcome. Perfection optional — the medicine starts with showing up.{" "}
              {"\u{2764}\u{FE0F}\u{2B50}"}
            </>
          )}
        </p>
      </motion.div>

      {phase !== "browse" && (
        <>
          <div
            className={`relative w-full max-w-lg overflow-hidden rounded-3xl border border-white/10 shadow-2xl ${
              phase === "share" ? "pointer-events-none" : ""
            }`}
          >
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

          {phase === "draw" && (
            <>
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
                  {"I drew a rainbow \u{2728}"}
                </button>
                <button
                  type="button"
                  onClick={clearCanvas}
                  className="rounded-full border border-white/30 px-5 py-2 text-sm"
                >
                  Clear
                </button>
              </div>
            </>
          )}

          {phase === "share" && mySnapshot && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 w-full max-w-lg space-y-4"
            >
              <fieldset className="space-y-3 rounded-2xl border border-white/15 bg-white/5 p-4 text-left">
                <legend className="px-1 text-sm font-medium text-white/90">
                  Public gallery
                </legend>
                <label className="flex cursor-pointer items-start gap-3">
                  <input
                    type="radio"
                    name="gallery-sign"
                    checked={!signAsNamed}
                    onChange={() => {
                      setSignAsNamed(false);
                      setPostError(null);
                    }}
                    className="mt-1"
                  />
                  <span>
                    <span className="font-medium">Post anonymously</span>
                    <span className="mt-0.5 block text-sm text-white/60">
                      Your rainbow shows up without a name.
                    </span>
                  </span>
                </label>
                <label className="flex cursor-pointer items-start gap-3">
                  <input
                    type="radio"
                    name="gallery-sign"
                    checked={signAsNamed}
                    onChange={() => {
                      setSignAsNamed(true);
                      setPostError(null);
                    }}
                    className="mt-1"
                  />
                  <span className="min-w-0 flex-1">
                    <span className="font-medium">Sign my rainbow</span>
                    <input
                      type="text"
                      value={signerName}
                      onChange={(e) => setSignerName(e.target.value)}
                      placeholder="First name or nickname"
                      maxLength={40}
                      disabled={!signAsNamed}
                      className="mt-2 w-full rounded-xl border border-white/20 bg-black/30 px-3 py-2 text-sm text-white placeholder:text-white/35 disabled:opacity-40"
                    />
                  </span>
                </label>
              </fieldset>
              {postError && (
                <p className="text-center text-sm text-amber-200">{postError}</p>
              )}
              <div className="flex flex-col gap-2 sm:flex-row sm:justify-center">
                <button
                  type="button"
                  disabled={postBusy}
                  onClick={() => void postToGallery()}
                  className="rounded-full bg-white px-6 py-2 font-medium text-violet-950 disabled:opacity-50"
                >
                  {postBusy ? "Posting…" : "Add to gallery"}
                </button>
                <button
                  type="button"
                  disabled={postBusy}
                  onClick={goBrowse}
                  className="rounded-full border border-white/30 px-6 py-2 text-sm"
                >
                  Skip — don&apos;t add mine
                </button>
              </div>
            </motion.div>
          )}
        </>
      )}

      {phase === "browse" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="w-full max-w-3xl"
        >
          {galleryLoading ? (
            <p className="text-center text-white/60">Loading gallery…</p>
          ) : galleryItems.length === 0 ? (
            <p className="text-center text-white/60">
              No rainbows here yet — you could be the first once the wall is
              connected (Supabase). Continue whenever you&apos;re ready.
            </p>
          ) : (
            <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:gap-4">
              {galleryItems.map((item) => (
                <li key={item.id}>
                  <RainbowGalleryThumb
                    strokes={item.strokes as Stroke[]}
                    canvasW={item.canvas_w}
                    canvasH={item.canvas_h}
                    label={item.display_name}
                  />
                </li>
              ))}
            </ul>
          )}
          <div className="mt-8 flex justify-center">
            <button
              type="button"
              onClick={finishAndEnter}
              className="rounded-full bg-white px-8 py-2.5 font-medium text-violet-950"
            >
              Continue to the essay →
            </button>
          </div>
        </motion.div>
      )}

      <AnimatePresence>
        {phase === "draw" && msg && (
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

      {phase === "draw" && attempts >= 3 && (
        <button
          type="button"
          onClick={() => {
            setGateCleared(true);
            router.push("/chapters/01-intro");
          }}
          className="mt-6 text-xs text-white/50 underline"
        >
          Skip gate (accessibility)
        </button>
      )}
    </div>
  );
}
