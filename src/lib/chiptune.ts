import type { NoiseSynth, Synth } from "tone";
import { useEssayStore } from "@/lib/store";

let toneMod: typeof import("tone") | null = null;
let square: Synth | null = null;
let noise: NoiseSynth | null = null;
let bootPromise: Promise<void> | null = null;

/** Sync Tone master output with the global mute preference (minigames + /synth). */
export function applySoundMute(muted: boolean): void {
  const apply = (Tone: typeof import("tone")) => {
    try {
      Tone.getDestination().mute = muted;
    } catch {
      /* no audio context yet */
    }
  };
  if (toneMod) {
    apply(toneMod);
    return;
  }
  void import("tone")
    .then(apply)
    .catch(() => {});
}

/**
 * Start Web Audio + build one-shot synths. Safe to call many times;
 * must run after a user gesture for browsers to allow audio.
 */
export function bootChiptune(): Promise<void> {
  if (bootPromise) return bootPromise;
  bootPromise = (async () => {
    if (toneMod && square && noise) return;
    const Tone = await import("tone");
    await Tone.start();
    toneMod = Tone;

    square = new Tone.Synth({
      oscillator: { type: "square" },
      envelope: {
        attack: 0.001,
        decay: 0.07,
        sustain: 0.04,
        release: 0.06,
      },
    }).toDestination();
    square.volume.value = -13;

    noise = new Tone.NoiseSynth({
      noise: { type: "white" },
      envelope: {
        attack: 0.001,
        decay: 0.1,
        sustain: 0,
        release: 0.04,
      },
    }).toDestination();
    noise.volume.value = -24;

    squareScheduleHead = 0;

    applySoundMute(useEssayStore.getState().soundMuted);
  })();
  return bootPromise;
}

function ok(): boolean {
  return Boolean(square && toneMod);
}

/** Tone requires each `triggerAttackRelease` start time on a synth to be strictly after the last. */
let squareScheduleHead = 0;
const SQUARE_TIME_GAP = 0.003;

function sqNextStart(): number {
  if (!toneMod) return 0;
  const t = Math.max(toneMod.now(), squareScheduleHead + SQUARE_TIME_GAP);
  squareScheduleHead = t;
  return t;
}

function sqBumpHead(lastStart: number) {
  squareScheduleHead = Math.max(squareScheduleHead, lastStart);
}

function tNow(): number {
  return toneMod?.now() ?? 0;
}

/** Short victory fanfare */
export function playWin(): void {
  if (!ok() || !square) return;
  const t0 = sqNextStart();
  const notes: string[] = ["C5", "E5", "G5", "C6"];
  notes.forEach((n, i) => {
    square!.triggerAttackRelease(n, "16n", t0 + i * 0.065);
  });
  sqBumpHead(t0 + (notes.length - 1) * 0.065);
}

/** Game over / lost life */
export function playLose(): void {
  if (!ok() || !square) return;
  const t0 = sqNextStart();
  square.triggerAttackRelease("A3", "16n", t0);
  square.triggerAttackRelease("F3", "16n", t0 + 0.1);
  square.triggerAttackRelease("C3", "8n", t0 + 0.2);
  sqBumpHead(t0 + 0.2);
}

/** Softer penalty (wave reset, snake crash) */
export function playReset(): void {
  if (!ok() || !square) return;
  const t0 = sqNextStart();
  square.triggerAttackRelease("D3", "16n", t0);
  const t1 = t0 + 0.08;
  square.triggerAttackRelease("A2", "16n", t1);
  sqBumpHead(t1);
}

let lastBrick = 0;
export function playBrick(): void {
  if (!ok() || !square) return;
  const nowMs = performance.now();
  if (nowMs - lastBrick < 45) return;
  lastBrick = nowMs;
  square.triggerAttackRelease("G5", "32n", sqNextStart());
}

export function playPaddle(): void {
  if (!ok() || !square) return;
  square.triggerAttackRelease("E4", "32n", sqNextStart());
}

export function playWall(): void {
  if (!ok() || !square) return;
  square.triggerAttackRelease("C4", "32n", sqNextStart(), 0.35);
}

let lastShoot = 0;
export function playShoot(): void {
  if (!ok() || !square) return;
  const nowMs = performance.now();
  if (nowMs - lastShoot < 55) return;
  lastShoot = nowMs;
  square.triggerAttackRelease("D6", "32n", sqNextStart(), 0.45);
}

export function playExplode(): void {
  if (!noise) return;
  noise.triggerAttackRelease("16n", tNow());
}

let lastExplode = 0;
export function playExplodeThrottled(): void {
  const nowMs = performance.now();
  if (nowMs - lastExplode < 35) return;
  lastExplode = nowMs;
  playExplode();
}

export function playEat(): void {
  if (!ok() || !square) return;
  const t0 = sqNextStart();
  square.triggerAttackRelease("B5", "32n", t0);
  const t1 = t0 + 0.04;
  square.triggerAttackRelease("E6", "32n", t1);
  sqBumpHead(t1);
}

export function playCatchGood(): void {
  if (!ok() || !square) return;
  square.triggerAttackRelease("A5", "16n", sqNextStart());
}

export function playCatchBad(): void {
  if (!ok() || !square) return;
  square.triggerAttackRelease("F3", "16n", sqNextStart());
}

export function playMiss(): void {
  if (!ok() || !square) return;
  square.triggerAttackRelease("G3", "16n", sqNextStart(), 0.4);
}
