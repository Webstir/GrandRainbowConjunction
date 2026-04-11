"use client";

import { useEffect, useRef, useState } from "react";
import { MinigameWrapper } from "../MinigameWrapper";
import { useTapReaderMinigame } from "@/components/reader/TapReaderContext";
import { CRT, RETRO_H, RETRO_W } from "./constants";
import {
  playExplodeThrottled,
  playReset,
  playShoot,
  playWin,
} from "@/lib/chiptune";

const COLS = 6;
const ROWS = 4;
const ALIEN_W = 14;
const ALIEN_H = 10;
const WIN_KILL = COLS * ROWS;

export function RetroInvaders() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { completeMinigame } = useTapReaderMinigame();
  const rafRef = useRef<number | undefined>(undefined);
  const wonRef = useRef(false);
  const keysRef = useRef({ left: false, right: false, fire: false });
  const pointerRef = useRef<{ x: number; fire: boolean } | null>(null);
  const [killed, setKilled] = useState(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.imageSmoothingEnabled = false;

    type Alien = { gx: number; gy: number; alive: boolean };
    const aliens: Alien[] = [];
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        aliens.push({ gx: c, gy: r, alive: true });
      }
    }

    let originX = 20;
    let originY = 18;
    let dir = 1;
    let stepDown = false;
    let px = RETRO_W / 2;
    let bullet: { x: number; y: number; vy: number } | null = null;
    let cooldown = 0;
    let dead = 0;

    const fire = () => {
      if (bullet || cooldown > 0) return;
      bullet = { x: px, y: RETRO_H - 22, vy: -3.2 };
      cooldown = 28;
      playShoot();
    };

    const loop = () => {
      if (wonRef.current) return;
      cooldown = Math.max(0, cooldown - 1);

      const p = pointerRef.current;
      if (p) {
        px = p.x;
        if (p.fire) {
          fire();
          p.fire = false;
        }
      } else {
        if (keysRef.current.left) px = Math.max(12, px - 2.4);
        if (keysRef.current.right) px = Math.min(RETRO_W - 12, px + 2.4);
        if (keysRef.current.fire) {
          fire();
          keysRef.current.fire = false;
        }
      }

      let maxX = 0;
      let minX = RETRO_W;
      let any = false;
      aliens.forEach((a) => {
        if (!a.alive) return;
        any = true;
        const ax = originX + a.gx * (ALIEN_W + 4);
        maxX = Math.max(maxX, ax + ALIEN_W);
        minX = Math.min(minX, ax);
      });

      if (any) {
        if (maxX > RETRO_W - 8 || minX < 8) {
          dir *= -1;
          stepDown = true;
        }
        originX += dir * 0.55;
        if (stepDown) {
          originY += 6;
          stepDown = false;
        }
        if (originY > 72) {
          originX = 20;
          originY = 18;
          dir = 1;
          aliens.forEach((a) => {
            a.alive = true;
          });
          dead = 0;
          setKilled(0);
          playReset();
        }
      }

      if (bullet) {
        bullet.y += bullet.vy;
        if (bullet.y < 4) bullet = null;
        else {
          aliens.forEach((a) => {
            if (!a.alive || !bullet) return;
            const ax = originX + a.gx * (ALIEN_W + 4);
            const ay = originY + a.gy * (ALIEN_H + 4);
            if (
              bullet.x > ax - 2 &&
              bullet.x < ax + ALIEN_W + 2 &&
              bullet.y > ay &&
              bullet.y < ay + ALIEN_H
            ) {
              a.alive = false;
              bullet = null;
              dead++;
              setKilled(dead);
              playExplodeThrottled();
              if (dead >= WIN_KILL && !wonRef.current) {
                wonRef.current = true;
                playWin();
                completeMinigame();
              }
            }
          });
        }
      }

      ctx.fillStyle = CRT.screenBg;
      ctx.fillRect(0, 0, RETRO_W, RETRO_H);

      aliens.forEach((a) => {
        if (!a.alive) return;
        const ax = originX + a.gx * (ALIEN_W + 4);
        const ay = originY + a.gy * (ALIEN_H + 4);
        const pal = ["#e74c3c", "#f39c12", "#9b59b6", "#3498db"];
        ctx.fillStyle = pal[(a.gx + a.gy) % 4] ?? CRT.phosphor;
        ctx.fillRect(ax, ay, ALIEN_W, ALIEN_H);
        ctx.fillStyle = CRT.screenBg;
        ctx.fillRect(ax + 3, ay + 3, 3, 3);
        ctx.fillRect(ax + 8, ay + 3, 3, 3);
      });

      ctx.fillStyle = CRT.amber;
      ctx.fillRect(px - 14, RETRO_H - 16, 28, 6);

      if (bullet) {
        ctx.fillStyle = CRT.hud;
        ctx.fillRect(bullet.x - 1, bullet.y, 2, 6);
      }

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
      if (e.code === "Space" || e.code === "KeyK") keysRef.current.fire = true;
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

  const onPointer = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const c = canvasRef.current;
    if (!c) return;
    const r = c.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width) * RETRO_W;
    pointerRef.current = { x: Math.max(14, Math.min(RETRO_W - 14, x)), fire: false };
  };

  const onTap = (e: React.PointerEvent<HTMLCanvasElement>) => {
    onPointer(e);
    if (pointerRef.current) pointerRef.current.fire = true;
  };

  return (
    <MinigameWrapper title="Pixel Invaders" era="1978">
      <p className="font-pixel mb-2 text-[9px] text-[#a8c4a8]">
        Move · Space or tap to zap · Clear the formation.
      </p>
      <div className="font-pixel mb-2 text-[8px] text-[#f4d03f]">
        DOWNED {killed}/{WIN_KILL}
      </div>
      <canvas
        ref={canvasRef}
        width={RETRO_W}
        height={RETRO_H}
        className="mx-auto w-full max-w-[min(100%,400px)] touch-none [image-rendering:pixelated]"
        onPointerMove={onPointer}
        onPointerDown={onTap}
        onPointerLeave={() => {
          pointerRef.current = null;
        }}
      />
    </MinigameWrapper>
  );
}
