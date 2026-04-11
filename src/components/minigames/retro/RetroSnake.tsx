"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { MinigameWrapper } from "../MinigameWrapper";
import { useTapReaderMinigame } from "@/components/reader/TapReaderContext";
import { CRT, RETRO_H, RETRO_W } from "./constants";
import { playEat, playReset, playWin } from "@/lib/chiptune";

const CELL = 8;
const COLS = Math.floor(RETRO_W / CELL);
const ROWS = Math.floor(RETRO_H / CELL);
const WIN = 10;

export function RetroSnake() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { completeMinigame } = useTapReaderMinigame();
  const rafRef = useRef<number | undefined>(undefined);
  const wonRef = useRef(false);
  const dirRef = useRef({ x: 1, y: 0 });
  const pendingDirRef = useRef({ x: 1, y: 0 });
  const tickRef = useRef(0);

  const [eaten, setEaten] = useState(0);

  const spawnFood = useCallback((snake: { x: number; y: number }[]) => {
    for (let n = 0; n < 200; n++) {
      const x = Math.floor(Math.random() * COLS);
      const y = Math.floor(Math.random() * ROWS);
      if (!snake.some((s) => s.x === x && s.y === y)) return { x, y };
    }
    return { x: 0, y: 0 };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.imageSmoothingEnabled = false;

    let snake = [
      { x: 4, y: 4 },
      { x: 3, y: 4 },
      { x: 2, y: 4 },
    ];
    let food = spawnFood(snake);
    let eatenLocal = 0;
    dirRef.current = { x: 1, y: 0 };
    pendingDirRef.current = { x: 1, y: 0 };
    tickRef.current = 0;

    const step = () => {
      if (wonRef.current) return;

      const nd = pendingDirRef.current;
      const od = dirRef.current;
      if (!(nd.x === -od.x && nd.y === -od.y)) {
        dirRef.current = nd;
      }
      const d = dirRef.current;
      const head = snake[0];
      const nx = head.x + d.x;
      const ny = head.y + d.y;

      if (nx < 0 || nx >= COLS || ny < 0 || ny >= ROWS) {
        snake = [
          { x: 4, y: 4 },
          { x: 3, y: 4 },
          { x: 2, y: 4 },
        ];
        food = spawnFood(snake);
        eatenLocal = 0;
        setEaten(0);
        dirRef.current = { x: 1, y: 0 };
        pendingDirRef.current = { x: 1, y: 0 };
        playReset();
        return;
      }

      if (snake.some((s) => s.x === nx && s.y === ny)) {
        snake = [
          { x: 4, y: 4 },
          { x: 3, y: 4 },
          { x: 2, y: 4 },
        ];
        food = spawnFood(snake);
        eatenLocal = 0;
        setEaten(0);
        playReset();
        return;
      }

      snake.unshift({ x: nx, y: ny });

      if (nx === food.x && ny === food.y) {
        eatenLocal++;
        setEaten(eatenLocal);
        playEat();
        if (eatenLocal >= WIN && !wonRef.current) {
          wonRef.current = true;
          playWin();
          completeMinigame();
          return;
        }
        food = spawnFood(snake);
      } else {
        snake.pop();
      }
    };

    const loop = (t: number) => {
      if (wonRef.current) return;
      if (!tickRef.current) tickRef.current = t;
      while (t - tickRef.current > 110) {
        tickRef.current += 110;
        step();
      }

      ctx.fillStyle = CRT.screenBg;
      ctx.fillRect(0, 0, RETRO_W, RETRO_H);

      ctx.strokeStyle = CRT.phosphorDim;
      ctx.lineWidth = 1;
      for (let x = 0; x <= COLS; x++) {
        ctx.beginPath();
        ctx.moveTo(x * CELL + 0.5, 0);
        ctx.lineTo(x * CELL + 0.5, ROWS * CELL);
        ctx.stroke();
      }
      for (let y = 0; y <= ROWS; y++) {
        ctx.beginPath();
        ctx.moveTo(0, y * CELL + 0.5);
        ctx.lineTo(COLS * CELL, y * CELL + 0.5);
        ctx.stroke();
      }

      ctx.fillStyle = CRT.danger;
      ctx.fillRect(food.x * CELL + 1, food.y * CELL + 1, CELL - 2, CELL - 2);

      snake.forEach((seg, i) => {
        ctx.fillStyle = i === 0 ? CRT.hud : CRT.phosphor;
        ctx.fillRect(seg.x * CELL + 1, seg.y * CELL + 1, CELL - 2, CELL - 2);
      });

      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [completeMinigame, spawnFood]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement)
        return;
      if (e.code === "ArrowUp" || e.code === "KeyW") pendingDirRef.current = { x: 0, y: -1 };
      if (e.code === "ArrowDown" || e.code === "KeyS") pendingDirRef.current = { x: 0, y: 1 };
      if (e.code === "ArrowLeft" || e.code === "KeyA") pendingDirRef.current = { x: -1, y: 0 };
      if (e.code === "ArrowRight" || e.code === "KeyD") pendingDirRef.current = { x: 1, y: 0 };
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const nudge = (dx: number, dy: number) => {
    const od = dirRef.current;
    if (!(dx === -od.x && dy === -od.y)) pendingDirRef.current = { x: dx, y: dy };
  };

  return (
    <MinigameWrapper title="Neon Viper" era="1982">
      <p className="font-pixel mb-2 text-[9px] text-[#a8c4a8]">
        Arrows / WASD · Eat {WIN} crimson squares. Walls reset the run.
      </p>
      <div className="font-pixel mb-2 text-[8px] text-[#f4d03f]">SCORE {eaten}</div>
      <canvas
        ref={canvasRef}
        width={COLS * CELL}
        height={ROWS * CELL}
        className="mx-auto w-full max-w-[min(100%,400px)] [image-rendering:pixelated]"
      />
      <div className="mt-3 grid max-w-[200px] grid-cols-3 gap-1 sm:hidden">
        <span />
        <button
          type="button"
          className="font-pixel rounded border border-[#5a4528] bg-[#1a1520] py-2 text-[9px] text-[#f4d03f]"
          onClick={() => nudge(0, -1)}
        >
          U
        </button>
        <span />
        <button
          type="button"
          className="font-pixel rounded border border-[#5a4528] bg-[#1a1520] py-2 text-[9px] text-[#f4d03f]"
          onClick={() => nudge(-1, 0)}
        >
          L
        </button>
        <button
          type="button"
          className="font-pixel rounded border border-[#5a4528] bg-[#1a1520] py-2 text-[9px] text-[#f4d03f]"
          onClick={() => nudge(0, 1)}
        >
          D
        </button>
        <button
          type="button"
          className="font-pixel rounded border border-[#5a4528] bg-[#1a1520] py-2 text-[9px] text-[#f4d03f]"
          onClick={() => nudge(1, 0)}
        >
          R
        </button>
      </div>
    </MinigameWrapper>
  );
}
