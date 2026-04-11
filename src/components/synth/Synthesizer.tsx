"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type Wave = "sine" | "square" | "sawtooth" | "triangle";

const KEYS = ["a", "w", "s", "e", "d", "f", "t", "g", "y", "h", "u", "j", "k"];
const NOTES = [
  "C4", "C#4", "D4", "D#4", "E4", "F4", "F#4", "G4", "G#4", "A4", "A#4", "B4", "C5",
];

export function Synthesizer() {
  const toneRef = useRef<typeof import("tone") | null>(null);
  const synthRef = useRef<import("tone").PolySynth | null>(null);
  const revRef = useRef<import("tone").Reverb | null>(null);
  const delRef = useRef<import("tone").FeedbackDelay | null>(null);
  const filtRef = useRef<import("tone").Filter | null>(null);
  const [ready, setReady] = useState(false);
  const [wave, setWave] = useState<Wave>("triangle");
  const [attack, setAttack] = useState(0.02);
  const [decay, setDecay] = useState(0.1);
  const [sustain, setSustain] = useState(0.4);
  const [release, setRelease] = useState(0.8);
  const [reverb, setReverb] = useState(0.3);
  const [delay, setDelay] = useState(0.15);
  const [filterFreq, setFilterFreq] = useState(3200);
  const scopeRef = useRef<HTMLCanvasElement>(null);
  const analyserRef = useRef<import("tone").Analyser | null>(null);
  const rafRef = useRef<number | undefined>(undefined);

  const boot = useCallback(async () => {
    if (toneRef.current) return;
    const Tone = await import("tone");
    await Tone.start();
    toneRef.current = Tone;

    const reverbNode = new Tone.Reverb({ decay: 2, wet: 0.3 }).toDestination();
    await reverbNode.generate();
    revRef.current = reverbNode;

    const delayNode = new Tone.FeedbackDelay({
      delayTime: "8n",
      feedback: 0.25,
      wet: 0.15,
    });
    delRef.current = delayNode;

    const filter = new Tone.Filter(3200, "lowpass");
    filtRef.current = filter;

    const poly = new Tone.PolySynth({
      voice: Tone.Synth,
      maxPolyphony: 8,
      options: {
        oscillator: { type: "triangle" },
        envelope: {
          attack: 0.02,
          decay: 0.1,
          sustain: 0.4,
          release: 0.8,
        },
      },
    }).connect(filter);
    filter.connect(delayNode);
    delayNode.connect(reverbNode);

    synthRef.current = poly;

    const analyser = new Tone.Analyser("waveform", 256);
    reverbNode.connect(analyser);
    analyserRef.current = analyser;

    setReady(true);
  }, []);

  useEffect(() => {
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      synthRef.current?.dispose();
      revRef.current?.dispose();
      delRef.current?.dispose();
      filtRef.current?.dispose();
      analyserRef.current?.dispose();
    };
  }, []);

  useEffect(() => {
    if (!ready || !analyserRef.current || !scopeRef.current) return;
    const analyser = analyserRef.current;
    const canvas = scopeRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const draw = () => {
      const w = canvas.width;
      const h = canvas.height;
      ctx.fillStyle = "#0f0f12";
      ctx.fillRect(0, 0, w, h);
      const buf = analyser.getValue() as Float32Array;
      if (buf?.length) {
        ctx.strokeStyle = "#c4a7e7";
        ctx.lineWidth = 2;
        ctx.beginPath();
        for (let i = 0; i < buf.length; i++) {
          const x = (i / buf.length) * w;
          const y = h / 2 + buf[i] * (h / 2.2);
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }
      rafRef.current = requestAnimationFrame(draw);
    };
    draw();
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [ready]);

  useEffect(() => {
    const s = synthRef.current;
    if (!s) return;
    s.set({
      oscillator: { type: wave },
      envelope: { attack, decay, sustain, release },
    });
  }, [wave, attack, decay, sustain, release]);

  useEffect(() => {
    revRef.current?.set({ wet: reverb });
  }, [reverb]);

  useEffect(() => {
    delRef.current?.set({ wet: delay });
  }, [delay]);

  useEffect(() => {
    filtRef.current?.frequency.rampTo(filterFreq, 0.05);
  }, [filterFreq]);

  const play = useCallback((note: string) => {
    synthRef.current?.triggerAttack(note);
  }, []);
  const stop = useCallback((note: string) => {
    synthRef.current?.triggerRelease(note);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.repeat) return;
      const i = KEYS.indexOf(e.key.toLowerCase());
      if (i >= 0) {
        e.preventDefault();
        play(NOTES[i]);
      }
    };
    const onUp = (e: KeyboardEvent) => {
      const i = KEYS.indexOf(e.key.toLowerCase());
      if (i >= 0) stop(NOTES[i]);
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("keyup", onUp);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("keyup", onUp);
    };
  }, [play, stop, ready]);

  return (
    <div className="mx-auto max-w-3xl space-y-6 rounded-3xl border border-(--chapter-muted) bg-(--chapter-card) p-6 shadow-2xl">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 className="font-display text-xl text-(--chapter-accent)">
          Rainbow oscillator
        </h2>
        {!ready ? (
          <button
            type="button"
            onClick={boot}
            className="rounded-full bg-(--chapter-accent) px-5 py-2 text-sm font-medium text-(--background)"
          >
            Start audio
          </button>
        ) : (
          <span className="text-xs text-(--chapter-muted-fg)">Ready</span>
        )}
      </div>

      <canvas
        ref={scopeRef}
        width={600}
        height={120}
        className="w-full rounded-xl border border-(--chapter-muted) bg-black/40"
      />

      <div className="flex flex-wrap gap-2">
        {(["sine", "square", "sawtooth", "triangle"] as const).map((w) => (
          <button
            key={w}
            type="button"
            disabled={!ready}
            onClick={() => setWave(w)}
            className={`rounded-full px-3 py-1 text-xs capitalize ${
              wave === w
                ? "bg-(--chapter-accent) text-(--background)"
                : "border border-(--chapter-muted)"
            }`}
          >
            {w}
          </button>
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="text-xs">
          Attack {attack.toFixed(2)}
          <input
            type="range"
            min={0.005}
            max={1}
            step={0.005}
            value={attack}
            onChange={(e) => setAttack(Number(e.target.value))}
            className="w-full accent-(--chapter-accent)"
          />
        </label>
        <label className="text-xs">
          Decay {decay.toFixed(2)}
          <input
            type="range"
            min={0.01}
            max={1}
            step={0.01}
            value={decay}
            onChange={(e) => setDecay(Number(e.target.value))}
            className="w-full accent-(--chapter-accent)"
          />
        </label>
        <label className="text-xs">
          Sustain {sustain.toFixed(2)}
          <input
            type="range"
            min={0}
            max={1}
            step={0.02}
            value={sustain}
            onChange={(e) => setSustain(Number(e.target.value))}
            className="w-full accent-(--chapter-accent)"
          />
        </label>
        <label className="text-xs">
          Release {release.toFixed(2)}
          <input
            type="range"
            min={0.05}
            max={2}
            step={0.05}
            value={release}
            onChange={(e) => setRelease(Number(e.target.value))}
            className="w-full accent-(--chapter-accent)"
          />
        </label>
        <label className="text-xs">
          Reverb wet {reverb.toFixed(2)}
          <input
            type="range"
            min={0}
            max={0.8}
            step={0.02}
            value={reverb}
            onChange={(e) => setReverb(Number(e.target.value))}
            className="w-full accent-(--chapter-accent)"
          />
        </label>
        <label className="text-xs">
          Delay wet {delay.toFixed(2)}
          <input
            type="range"
            min={0}
            max={0.6}
            step={0.02}
            value={delay}
            onChange={(e) => setDelay(Number(e.target.value))}
            className="w-full accent-(--chapter-accent)"
          />
        </label>
        <label className="text-xs sm:col-span-2">
          Filter {filterFreq} Hz
          <input
            type="range"
            min={200}
            max={8000}
            step={50}
            value={filterFreq}
            onChange={(e) => setFilterFreq(Number(e.target.value))}
            className="w-full accent-(--chapter-accent)"
          />
        </label>
      </div>

      <div className="flex flex-wrap gap-1">
        {NOTES.map((n, i) => (
          <button
            key={n}
            type="button"
            disabled={!ready}
            onMouseDown={() => play(n)}
            onMouseUp={() => stop(n)}
            onMouseLeave={() => stop(n)}
            onTouchStart={(e) => {
              e.preventDefault();
              play(n);
            }}
            onTouchEnd={(e) => {
              e.preventDefault();
              stop(n);
            }}
            className="min-w-9 rounded-lg border border-(--chapter-muted) bg-(--background) px-2 py-3 text-xs font-medium disabled:opacity-40"
            title={`Key ${KEYS[i]}`}
          >
            {n.replace(/\d/, "")}
          </button>
        ))}
      </div>
      <p className="text-center text-xs text-(--chapter-muted-fg)">
        Computer keyboard: A–K row maps to notes (after you start audio)
      </p>
    </div>
  );
}
