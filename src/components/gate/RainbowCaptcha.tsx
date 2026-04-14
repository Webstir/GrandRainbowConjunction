"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  looksLikeRainbow,
  type Stroke,
  type StrokePoint,
  hueToBand,
  nextHue,
} from "@/lib/rainbow-detector";
import { drawRainbowBackground, drawRainbowStrokes } from "@/lib/rainbow-canvas";
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

type RainbowCaptchaVariant = "gate" | "gallery";

export function RainbowCaptcha({
  variant = "gate",
}: {
  variant?: RainbowCaptchaVariant;
}) {
  const router = useRouter();
  const setGateCleared = useEssayStore((s) => s.setGateCleared);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  /** Draw surface: native listeners attach here (capture) so iOS WebKit / DDG always see input. */
  const drawSurfaceRef = useRef<HTMLDivElement>(null);
  const strokesRef = useRef<Stroke[]>([]);
  const currentRef = useRef<StrokePoint[]>([]);
  /** Active stroke: pointer id, or touch-only path uses a sentinel. */
  const strokePointerIdRef = useRef<number | null>(null);
  const removeDocPointerRef = useRef<(() => void) | null>(null);
  const removeDocTouchRef = useRef<(() => void) | null>(null);
  /** touchstart runs before pointerdown; skip duplicate pointer handling for the same gesture. */
  const lockTouchGestureRef = useRef(false);
  const hueRef = useRef(0);
  const [hue, setHue] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [msg, setMsg] = useState<string | null>(null);
  const [passing, setPassing] = useState(false);
  const [phase, setPhase] = useState<Phase>(() =>
    variant === "gallery" ? "browse" : "draw"
  );
  const [mySnapshot, setMySnapshot] = useState<MySnapshot | null>(null);
  const [signAsNamed, setSignAsNamed] = useState(false);
  const [signerName, setSignerName] = useState("");
  const [galleryItems, setGalleryItems] = useState<GalleryRow[]>([]);
  const [galleryLoading, setGalleryLoading] = useState(false);
  const [postBusy, setPostBusy] = useState(false);
  const [postError, setPostError] = useState<string | null>(null);
  const phaseRef = useRef(phase);
  const passingRef = useRef(passing);
  phaseRef.current = phase;
  passingRef.current = passing;

  /**
   * iOS WebKit may report 0×0 canvas until layout settles. Input handlers used to
   * attach in useLayoutEffect before bitmap sync (previously in useEffect), so
   * strokes drew to a wrong/default buffer. Sync bitmap here + ResizeObserver.
   */
  const syncCanvasFromState = useCallback((): boolean => {
    const c = canvasRef.current;
    if (!c) return false;
    const dpr = Math.min(window.devicePixelRatio ?? 1, 2);
    const w = c.clientWidth;
    const h = c.clientHeight;
    if (w <= 0 || h <= 0) return false;
    c.width = Math.max(1, Math.floor(w * dpr));
    c.height = Math.max(1, Math.floor(h * dpr));
    const ctx = c.getContext("2d");
    if (!ctx) return false;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(dpr, dpr);
    drawRainbowBackground(ctx, w, h);
    drawRainbowStrokes(ctx, strokesRef.current, w, h, w, h);
    return true;
  }, []);

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

  const detachDocPointer = useCallback(() => {
    removeDocPointerRef.current?.();
    removeDocPointerRef.current = null;
  }, []);

  const detachDocTouch = useCallback(() => {
    removeDocTouchRef.current?.();
    removeDocTouchRef.current = null;
  }, []);

  useEffect(() => {
    return () => {
      detachDocPointer();
      detachDocTouch();
    };
  }, [detachDocPointer, detachDocTouch]);

  useEffect(() => {
    if (phase !== "draw") {
      detachDocPointer();
      detachDocTouch();
    }
  }, [phase, detachDocPointer, detachDocTouch]);

  const clearCanvas = () => {
    strokesRef.current = [];
    currentRef.current = [];
    strokePointerIdRef.current = null;
    lockTouchGestureRef.current = false;
    detachDocPointer();
    detachDocTouch();
    syncCanvasFromState();
  };

  const canvasCoordsClient = (clientX: number, clientY: number, c: HTMLCanvasElement) => {
    const r = c.getBoundingClientRect();
    return { x: clientX - r.left, y: clientY - r.top };
  };

  const paintSegment = useCallback((x: number, y: number, pressure: number) => {
    if (phaseRef.current !== "draw" || !currentRef.current.length || passingRef.current) return;
    const c = canvasRef.current;
    if (!c) return;
    const ctx = c.getContext("2d");
    if (!ctx) return;
    const prev = currentRef.current[currentRef.current.length - 1];
    currentRef.current.push({ x, y, t: Date.now(), hue: hueRef.current });
    ctx.strokeStyle = `hsl(${hueRef.current} 90% 60%)`;
    ctx.lineWidth = Math.max(2, 2 + (pressure || 0.5) * 6);
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.beginPath();
    ctx.moveTo(prev.x, prev.y);
    ctx.lineTo(x, y);
    ctx.stroke();
  }, []);

  const commitStrokeIfAny = useCallback(() => {
    if (currentRef.current.length < 2) {
      currentRef.current = [];
      return;
    }
    strokesRef.current.push({
      points: [...currentRef.current],
      hueBand: hueToBand(hueRef.current),
    });
    currentRef.current = [];
  }, []);

  useLayoutEffect(() => {
    if (phase !== "draw") {
      detachDocPointer();
      detachDocTouch();
      return;
    }

    const surface = drawSurfaceRef.current;
    const canvas = canvasRef.current;
    if (!surface || !canvas) return;

    let ro: ResizeObserver | null = null;
    let rafBoot = 0;

    const bootSync = () => {
      if (syncCanvasFromState()) return;
      if (rafBoot < 24) {
        rafBoot += 1;
        requestAnimationFrame(bootSync);
      }
    };
    bootSync();

    if (typeof ResizeObserver !== "undefined") {
      ro = new ResizeObserver(() => {
        if (phaseRef.current === "draw") syncCanvasFromState();
      });
      ro.observe(canvas);
    }

    const eventOnSurface = (e: Event) => {
      const path = typeof e.composedPath === "function" ? e.composedPath() : [];
      return path.includes(surface) || surface.contains(e.target as Node);
    };

    const onPointerDownNative = (e: PointerEvent) => {
      if (passingRef.current) return;
      if (!e.isPrimary) return;
      if (e.pointerType === "touch" && lockTouchGestureRef.current) return;
      if (!eventOnSurface(e)) return;

      detachDocPointer();

      strokePointerIdRef.current = e.pointerId;
      try {
        canvas.setPointerCapture(e.pointerId);
      } catch {
        /* Some WebKit builds reject capture for certain pointer types */
      }

      const { x, y } = canvasCoordsClient(e.clientX, e.clientY, canvas);
      currentRef.current = [{ x, y, t: Date.now() }];

      const move = (ev: PointerEvent) => {
        if (!ev.isPrimary) return;
        if (strokePointerIdRef.current !== ev.pointerId) return;
        if (phaseRef.current !== "draw" || passingRef.current) return;
        const cc = canvasRef.current;
        if (!cc) return;
        const p = canvasCoordsClient(ev.clientX, ev.clientY, cc);
        paintSegment(p.x, p.y, ev.pressure || 0.5);
      };

      const end = (ev: PointerEvent) => {
        if (strokePointerIdRef.current !== ev.pointerId) return;
        window.removeEventListener("pointermove", move);
        window.removeEventListener("pointerup", end);
        window.removeEventListener("pointercancel", end);
        removeDocPointerRef.current = null;
        strokePointerIdRef.current = null;
        try {
          if (canvas.hasPointerCapture?.(ev.pointerId))
            canvas.releasePointerCapture(ev.pointerId);
        } catch {
          /* ignore */
        }
        commitStrokeIfAny();
      };

      window.addEventListener("pointermove", move, { passive: false });
      window.addEventListener("pointerup", end);
      window.addEventListener("pointercancel", end);
      removeDocPointerRef.current = () => {
        window.removeEventListener("pointermove", move);
        window.removeEventListener("pointerup", end);
        window.removeEventListener("pointercancel", end);
      };
    };

    const onTouchStartNative = (e: TouchEvent) => {
      if (passingRef.current) return;
      if (e.touches.length !== 1) return;
      if (!eventOnSurface(e)) return;
      e.preventDefault();
      detachDocPointer();
      lockTouchGestureRef.current = true;

      const t = e.touches[0];
      const tid = t.identifier;
      strokePointerIdRef.current = tid;

      const { x, y } = canvasCoordsClient(t.clientX, t.clientY, canvas);
      currentRef.current = [{ x, y, t: Date.now() }];

      const move = (ev: TouchEvent) => {
        const touch = Array.from(ev.touches).find((u) => u.identifier === tid);
        if (!touch) return;
        ev.preventDefault();
        const p = canvasCoordsClient(touch.clientX, touch.clientY, canvas);
        paintSegment(p.x, p.y, 0.5);
      };

      const finish = (ev: TouchEvent) => {
        if (!Array.from(ev.changedTouches).some((u) => u.identifier === tid)) return;
        ev.preventDefault();
        window.removeEventListener("touchmove", move);
        window.removeEventListener("touchend", finish);
        window.removeEventListener("touchcancel", finish);
        removeDocTouchRef.current = null;
        strokePointerIdRef.current = null;
        lockTouchGestureRef.current = false;
        commitStrokeIfAny();
      };

      window.addEventListener("touchmove", move, { passive: false });
      window.addEventListener("touchend", finish, { passive: false });
      window.addEventListener("touchcancel", finish, { passive: false });
      removeDocTouchRef.current = () => {
        window.removeEventListener("touchmove", move);
        window.removeEventListener("touchend", finish);
        window.removeEventListener("touchcancel", finish);
      };
    };

    const cap = { capture: true };
    surface.addEventListener("pointerdown", onPointerDownNative, cap);
    surface.addEventListener("touchstart", onTouchStartNative, {
      capture: true,
      passive: false,
    });

    return () => {
      ro?.disconnect();
      surface.removeEventListener("pointerdown", onPointerDownNative, cap);
      surface.removeEventListener("touchstart", onTouchStartNative, cap);
      detachDocPointer();
      detachDocTouch();
      lockTouchGestureRef.current = false;
    };
  }, [phase, syncCanvasFromState, paintSegment, commitStrokeIfAny, detachDocPointer, detachDocTouch]);

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
    if (variant === "gate") {
      setGateCleared(true);
    }
    router.push("/chapters/01-intro");
  };

  const backToGalleryWall = () => {
    setMsg(null);
    setPassing(false);
    strokesRef.current = [];
    currentRef.current = [];
    strokePointerIdRef.current = null;
    setMySnapshot(null);
    setPhase("browse");
  };

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center bg-[#0c0618] px-4 py-12 text-white">
      <motion.div
        initial={false}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6 max-w-md text-center"
      >
        <h1 className="font-display text-3xl sm:text-4xl">
          {variant === "gallery"
            ? "\u{1F308} Travelers\u{2019} rainbow wall"
            : "\u{1F308}\u{2728} The Grand Rainbow Conjunction"}
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
          ) : variant === "gallery" ? (
            <>
              Add a stroke to the wall: draw a small{"\u{1F308}"}. Curves
              welcome — same energy as the entrance.
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
            ref={drawSurfaceRef}
            className={`relative z-10 isolate w-full max-w-lg touch-none overflow-hidden rounded-3xl border border-white/10 shadow-2xl select-none [-webkit-tap-highlight-color:transparent] ${
              phase === "share" ? "pointer-events-none" : ""
            }`}
            style={{ touchAction: "none" }}
          >
            <canvas
              ref={canvasRef}
              className="block h-[min(50vh,420px)] w-full max-w-full touch-none bg-transparent"
              style={{ touchAction: "none" }}
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
              {variant === "gallery" && (
                <button
                  type="button"
                  onClick={backToGalleryWall}
                  className="mt-4 text-sm text-white/50 underline decoration-white/30 underline-offset-4 hover:text-white/80"
                >
                  ← Back to gallery
                </button>
              )}
            </>
          )}

          {phase === "share" && mySnapshot && (
            <motion.div
              initial={false}
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
          initial={false}
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
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row sm:flex-wrap">
            {variant === "gallery" ? (
              <>
                <button
                  type="button"
                  onClick={() => {
                    setPostError(null);
                    setPhase("draw");
                  }}
                  className="rounded-full border border-white/30 px-8 py-2.5 text-sm font-medium text-white hover:bg-white/10"
                >
                  Draw a rainbow
                </button>
                <Link
                  href="/chapters/01-intro"
                  className="inline-flex rounded-full bg-white px-8 py-2.5 font-medium text-violet-950 hover:opacity-95"
                >
                  Back to reading →
                </Link>
              </>
            ) : (
              <button
                type="button"
                onClick={finishAndEnter}
                className="rounded-full bg-white px-8 py-2.5 font-medium text-violet-950"
              >
                Continue to the essay →
              </button>
            )}
          </div>
        </motion.div>
      )}

      <AnimatePresence>
        {phase === "draw" && msg && (
          <motion.p
            initial={false}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="mt-4 max-w-md text-center text-sm text-amber-200"
          >
            {msg}
          </motion.p>
        )}
      </AnimatePresence>

      {variant === "gate" && phase === "draw" && attempts >= 3 && (
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
