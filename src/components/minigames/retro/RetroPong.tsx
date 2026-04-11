"use client";

import { useEffect, useRef, useState } from "react";
import { MinigameWrapper } from "../MinigameWrapper";
import { useTapReaderMinigame } from "@/components/reader/TapReaderContext";
import { CRT, RETRO_H, RETRO_W } from "./constants";
import { playMiss, playPaddle, playWall, playWin } from "@/lib/chiptune";

const PADDLE_W = 34;
const PADDLE_H = 5;
const WIN_RALLY = 14;

export function RetroPong() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { completeMinigame } = useTapReaderMinigame();
  const rafRef = useRef<number | undefined>(undefined);
  const wonRef = useRef(false);
  const keysRef = useRef({ left: false, right: false });
  const pointerXRef = useRef<number | null>(null);
  const [rally, setRally] = useState(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.imageSmoothingEnabled = false;

    let px = RETRO_W / 2;
    let aiX = RETRO_W / 2;
    let bx = RETRO_W / 2;
    let by = RETRO_H / 2;
    let bvx = 1.6 * (Math.random() > 0.5 ? 1 : -1);
    let bvy = 1.9 * (Math.random() > 0.5 ? 1 : -1);
    let count = 0;
    let paddleCd = 0;

    const resetBall = () => {
      bx = RETRO_W / 2;
      by = RETRO_H / 2;
      bvx = 1.6 * (Math.random() > 0.5 ? 1 : -1);
      bvy = 1.9 * (Math.random() > 0.5 ? 1 : -1);
    };

    const loop = () => {
      if (wonRef.current) return;
      if (paddleCd > 0) paddleCd--;

      if (pointerXRef.current != null) {
        px = pointerXRef.current;
      } else {
        if (keysRef.current.left) px = Math.max(PADDLE_W / 2, px - 2.6);
        if (keysRef.current.right) px = Math.min(RETRO_W - PADDLE_W / 2, px + 2.6);
      }

      aiX += (bx - aiX) * 0.08;
      aiX = Math.max(PADDLE_W / 2, Math.min(RETRO_W - PADDLE_W / 2, aiX));

      bx += bvx;
      by += bvy;

      if (bx < 4) {
        bx = 4;
        bvx *= -1;
        playWall();
      } else if (bx > RETRO_W - 4) {
        bx = RETRO_W - 4;
        bvx *= -1;
        playWall();
      }

      const pyBottom = RETRO_H - 10;
      const pyTop = 10;

      if (
        by > pyBottom - 8 &&
        by < pyBottom &&
        bx > px - PADDLE_W / 2 - 2 &&
        bx < px + PADDLE_W / 2 + 2 &&
        bvy > 0
      ) {
        bvy = -Math.abs(bvy);
        count++;
        setRally(count);
        bvx += (bx - px) * 0.06;
        bvx = Math.max(-2.6, Math.min(2.6, bvx));
        if (paddleCd <= 0) {
          playPaddle();
          paddleCd = 8;
        }
        if (count >= WIN_RALLY && !wonRef.current) {
          wonRef.current = true;
          playWin();
          completeMinigame();
          return;
        }
      }

      if (
        by < pyTop + PADDLE_H + 4 &&
        by > pyTop - 2 &&
        bx > aiX - PADDLE_W / 2 - 2 &&
        bx < aiX + PADDLE_W / 2 + 2 &&
        bvy < 0
      ) {
        bvy = Math.abs(bvy);
        if (paddleCd <= 0) {
          playPaddle();
          paddleCd = 8;
        }
      }

      if (by > RETRO_H + 6 || by < -6) {
        playMiss();
        resetBall();
        count = 0;
        setRally(0);
      }

      ctx.fillStyle = CRT.screenBg;
      ctx.fillRect(0, 0, RETRO_W, RETRO_H);

      ctx.strokeStyle = CRT.phosphorDim;
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(0, RETRO_H / 2);
      ctx.lineTo(RETRO_W, RETRO_H / 2);
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.fillStyle = CRT.amber;
      ctx.fillRect(aiX - PADDLE_W / 2, pyTop, PADDLE_W, PADDLE_H);
      ctx.fillRect(px - PADDLE_W / 2, pyBottom, PADDLE_W, PADDLE_H);

      ctx.fillStyle = CRT.hud;
      ctx.beginPath();
      ctx.arc(bx, by, 3, 0, Math.PI * 2);
      ctx.fill();

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
      PADDLE_W / 2,
      Math.min(RETRO_W - PADDLE_W / 2, x)
    );
  };

  return (
    <MinigameWrapper title="Vector Rally" era="1985">
      <p className="font-pixel mb-2 text-[9px] text-[#a8c4a8]">
        Bottom paddle: you. Bounce {WIN_RALLY} times without missing — CPU guards
        the ceiling.
      </p>
      <div className="font-pixel mb-2 text-[8px] text-[#f4d03f]">RALLY {rally}</div>
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
