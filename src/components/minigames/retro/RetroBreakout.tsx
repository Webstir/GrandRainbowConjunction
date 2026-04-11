"use client";

import { useEffect, useRef, useState } from "react";
import { MinigameWrapper } from "../MinigameWrapper";
import { useTapReaderMinigame } from "@/components/reader/TapReaderContext";
import { CRT, RETRO_H, RETRO_W } from "./constants";
import {
  playBrick,
  playLose,
  playMiss,
  playPaddle,
  playWall,
  playWin,
} from "@/lib/chiptune";

type Props = { brickRows?: number };

export function RetroBreakout({ brickRows = 5 }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { completeMinigame } = useTapReaderMinigame();
  const rafRef = useRef<number | undefined>(undefined);
  const wonRef = useRef(false);
  const keysRef = useRef({ left: false, right: false });
  const pointerXRef = useRef<number | null>(null);

  const [hud, setHud] = useState({ lives: 3, left: brickRows * 8 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.imageSmoothingEnabled = false;

    const cols = 8;
    const rows = brickRows;
    const bw = Math.floor((RETRO_W - 16) / cols);
    const bh = 7;
    const top = 14;
    const paddleW = 36;
    const paddleH = 5;
    const py = RETRO_H - 12;

    let bricks = rows * cols;
    let alive = Array<boolean>(rows * cols).fill(true);
    let px = RETRO_W / 2;
    let bx = RETRO_W / 2;
    let by = RETRO_H - 28;
    let bvx = 1.4;
    let bvy = -1.8;
    let lives = 3;
    let paddleCd = 0;

    const resetWave = () => {
      alive = Array(rows * cols).fill(true);
      bricks = rows * cols;
      bx = RETRO_W / 2;
      by = RETRO_H - 28;
      bvx = Math.random() > 0.5 ? 1.4 : -1.4;
      bvy = -1.8;
      setHud({ lives, left: bricks });
    };

    const resetBall = () => {
      bx = RETRO_W / 2;
      by = RETRO_H - 28;
      bvx = Math.random() > 0.5 ? 1.4 : -1.4;
      bvy = -1.8;
    };

    const brickHit = (cx: number, cy: number) => {
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const i = r * cols + c;
          if (!alive[i]) continue;
          const x = 8 + c * bw;
          const y = top + r * (bh + 1);
          if (
            cx + 2 > x &&
            cx - 2 < x + bw &&
            cy + 2 > y &&
            cy - 2 < y + bh
          ) {
            alive[i] = false;
            bricks--;
            setHud((h) => ({ ...h, left: bricks }));
            playBrick();
            return true;
          }
        }
      }
      return false;
    };

    const loop = () => {
      if (wonRef.current) return;
      if (paddleCd > 0) paddleCd--;

      if (pointerXRef.current != null) {
        px = pointerXRef.current;
      } else {
        if (keysRef.current.left) px = Math.max(paddleW / 2, px - 2.4);
        if (keysRef.current.right) px = Math.min(RETRO_W - paddleW / 2, px + 2.4);
      }

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
      if (by < 8 && bvy < 0) {
        bvy = Math.abs(bvy);
        playWall();
      }

      if (
        by > py - 4 &&
        by < py + 4 &&
        bx > px - paddleW / 2 - 2 &&
        bx < px + paddleW / 2 + 2 &&
        bvy > 0
      ) {
        bvy = -Math.abs(bvy);
        bvx += (bx - px) * 0.08;
        bvx = Math.max(-2.4, Math.min(2.4, bvx));
        if (paddleCd <= 0) {
          playPaddle();
          paddleCd = 10;
        }
      }

      if (brickHit(bx, by)) {
        bvy *= -1;
      }

      if (by > RETRO_H + 6) {
        lives--;
        setHud((h) => ({ ...h, lives }));
        if (lives <= 0) {
          playLose();
          lives = 3;
          resetWave();
        } else {
          playMiss();
          resetBall();
        }
      }

      if (bricks <= 0 && !wonRef.current) {
        wonRef.current = true;
        playWin();
        completeMinigame();
        return;
      }

      ctx.fillStyle = CRT.screenBg;
      ctx.fillRect(0, 0, RETRO_W, RETRO_H);

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const i = r * cols + c;
          if (!alive[i]) continue;
          const x = 8 + c * bw;
          const y = top + r * (bh + 1);
          const colors = ["#c94c4c", "#e6b422", "#4c8cc9", "#7bc96f"];
          ctx.fillStyle = colors[(r + c) % 4] ?? CRT.phosphor;
          ctx.fillRect(x, y, bw - 1, bh);
        }
      }

      ctx.fillStyle = CRT.amber;
      ctx.fillRect(px - paddleW / 2, py, paddleW, paddleH);

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
  }, [brickRows, completeMinigame]);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement)
        return;
      if (e.code === "ArrowLeft" || e.code === "KeyA") keysRef.current.left = true;
      if (e.code === "ArrowRight" || e.code === "KeyD")
        keysRef.current.right = true;
    };
    const up = (e: KeyboardEvent) => {
      if (e.code === "ArrowLeft" || e.code === "KeyA") keysRef.current.left = false;
      if (e.code === "ArrowRight" || e.code === "KeyD")
        keysRef.current.right = false;
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
    const paddleW = 36;
    pointerXRef.current = Math.max(
      paddleW / 2,
      Math.min(RETRO_W - paddleW / 2, x)
    );
  };

  return (
    <MinigameWrapper title="Brick Basher" era="1986">
      <p className="font-pixel mb-3 text-[9px] leading-relaxed text-[#a8c4a8]">
        ← → or drag · Clear every brick. Miss three — new wave.
      </p>
      <div className="font-pixel mb-2 flex justify-between text-[8px] text-[#f4d03f]">
        <span>LIVES {hud.lives}</span>
        <span>BRICKS {hud.left}</span>
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
