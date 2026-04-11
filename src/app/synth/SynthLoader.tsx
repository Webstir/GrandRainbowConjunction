"use client";

import dynamic from "next/dynamic";

const Synthesizer = dynamic(
  () =>
    import("@/components/synth/Synthesizer").then((m) => ({
      default: m.Synthesizer,
    })),
  {
    ssr: false,
    loading: () => (
      <p className="p-8 text-center text-white/60">Loading synth…</p>
    ),
  }
);

export function SynthLoader() {
  return (
    <div className="px-4 pb-20">
      <Synthesizer />
    </div>
  );
}
