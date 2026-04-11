"use client";

import { useEffect, useRef, useState } from "react";
import { MinigameWrapper } from "../MinigameWrapper";
import { useTapReaderMinigame } from "@/components/reader/TapReaderContext";
import { CRT, RETRO_H, RETRO_W } from "./constants";
import {
  playCatchBad,
  playCatchGood,
  playMiss,
  playReset,
  playWin,
} from "@/lib/chiptune";

const BASKET_W = 40;
const WIN = 14;
const BAD_LIMIT = 4;

type Drop = { x: number; y: number; vy: number; good: boolean };

export function RetroCatch() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { completeMinigame } = useTapReaderMinigame();
  const rafRef = useRef<number | undefined>(undefined);
  const wonRef = useRef(false);
  const keysRef = useRef({ left: false, right: false });
  const pointerXRef = useRef<number | null>(null);
  const [stats, setStats] = useState({ good: 0, bad: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.imageSmoothingEnabled = false;

    let px = RETRO_W / 2;
    const drops: Drop[] = [];
    let frame = 0;
    let good = 0;
    let bad = 0;

    const loop = () => {
      if (wonRef.current) return;
      frame++;

      if (pointerXRef.current != null) {
        px = pointerXRef.current;
      } else {
        if (keysRef.current.left) px = Math.max(BASKET_W / 2, px - 2.8);
        if (keysRef.current.right) px = Math.min(RETRO_W - BASKET_W / 2, px + 2.8);
      }

      const interval = Math.max(26, 46 - Math.floor(good * 0.8));
      if (frame % interval === 0) {
        drops.push({
          x: 10 + Math.random() * (RETRO_W - 20),
          y: -6,
          vy: 1.1 + Math.random() * 0.6,
          good: Math.random() > 0.38,
        });
      }

      const by = RETRO_H - 14;
      for (let i = drops.length - 1; i >= 0; i--) {
        const d = drops[i];
        d.y += d.vy;
        if (d.y > by - 4 && d.y < by + 8 && Math.abs(d.x - px) < BASKET_W / 2 + 6) {
          if (d.good) {
            good++;
            setStats({ good, bad });
            playCatchGood();
            if (good >= WIN && !wonRef.current) {
              wonRef.current = true;
              playWin();
              completeMinigame();
              return;
            }
          } else {
            bad++;
            setStats({ good, bad });
            playCatchBad();
            if (bad >= BAD_LIMIT) {
              good = 0;
              bad = 0;
              drops.length = 0;
              setStats({ good: 0, bad: 0 });
              playReset();
            }
          }
          drops.splice(i, 1);
          continue;
        }
        if (d.y > RETRO_H + 4) {
          if (d.good) {
            bad++;
            setStats({ good, bad });
            playMiss();
            if (bad >= BAD_LIMIT) {
              good = 0;
              bad = 0;
              drops.length = 0;
              setStats({ good: 0, bad: 0 });
              playReset();
            }
          }
          drops.splice(i, 1);
        }
      }

      ctx.fillStyle = CRT.screenBg;
      ctx.fillRect(0, 0, RETRO_W, RETRO_H);

      drops.forEach((d) => {
        ctx.fillStyle = d.good ? CRT.phosphor : CRT.danger;
        ctx.fillRect(d.x - 4, d.y, 8, 8);
      });

      ctx.fillStyle = CRT.amber;
      ctx.fillRect(px - BASKET_W / 2, by, BASKET_W, 7);

      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [completeMinigame]);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement)
        return;
      if (e.code === "ArrowLeft" || e.code === "KeyA") keysRef.current.left = true;
      if (e.code === "ArrowRight" || e.code === "KeyD") keysRef.current.right = true;
    };
    const up = (e: KeyboardEvent) => {
      if (e.code === "ArrowLeft" || e.code === "KeyA") keysRef.current.left = false;
      if (e.code === "ArrowRight" || e.code === "KeyD") keysRef.current.right = false;
    };
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
    };
  }, []);

  const syncPointer = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const c = canvasRef.current;
    if (!c) return;
    const r = c.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width) * RETRO_W;
    pointerXRef.current = Math.max(
      BASKET_W / 2,
      Math.min(RETRO_W - BASKET_W / 2, x)
    );
  };

  return (
    <MinigameWrapper title="Kaboom Catch" era="1981">
      <p className="font-pixel mb-2 text-[9px] text-[#a8c4a8]">
        Catch green pixels · dodge red · drop {WIN} good ones. Four mistakes
        reset the run.
      </p>
      <div className="font-pixel mb-2 flex justify-between text-[8px] text-[#f4d03f]">
        <span>GOOD {stats.good}</span>
        <span className="text-[#ff6b6b]">BAD {stats.bad}</span>
      </div>
      <canvas
        ref={canvasRef}
        width={RETRO_W}
        height={RETRO_H}
        className="mx-auto w-full max-w-[min(100%,400px)] cursor-pointer touch-none [image-rendering:pixelated]"
        onPointerMove={syncPointer}
        onPointerDown={syncPointer}
        onPointerLeave={() => {
          pointerXRef.current = null;
        }}
      />
    </MinigameWrapper>
  );
}
