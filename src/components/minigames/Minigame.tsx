"use client";

import { RetroBreakout } from "./retro/RetroBreakout";
import { RetroSnake } from "./retro/RetroSnake";
import { RetroInvaders } from "./retro/RetroInvaders";
import { RetroPong } from "./retro/RetroPong";
import { RetroCatch } from "./retro/RetroCatch";
import { ReflectionSlider } from "./ReflectionSlider";

type Props = {
  name: string;
  data?: Record<string, unknown>;
};

export function Minigame({ name, data = {} }: Props) {
  switch (name) {
    case "retro-breakout":
      return (
        <RetroBreakout brickRows={Number(data.rows ?? data.brickRows ?? 5)} />
      );
    case "retro-snake":
      return <RetroSnake />;
    case "retro-invaders":
      return <RetroInvaders />;
    case "retro-pong":
      return <RetroPong />;
    case "retro-catch":
      return <RetroCatch />;
    case "reflection-slider":
      return (
        <ReflectionSlider
          question={String(
            data.question ?? "How much does this chapter resonate?"
          )}
        />
      );
    default:
      return (
        <p className="not-prose rounded-xl border border-dashed border-(--chapter-muted) p-4 text-sm">
          Unknown minigame: {name}
        </p>
      );
  }
}
