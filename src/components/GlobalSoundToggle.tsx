"use client";

import { useEffect } from "react";
import { applySoundMute } from "@/lib/chiptune";
import { useEssayStore } from "@/lib/store";

export function GlobalSoundToggle() {
  const soundMuted = useEssayStore((s) => s.soundMuted);
  const setSoundMuted = useEssayStore((s) => s.setSoundMuted);

  useEffect(() => {
    applySoundMute(soundMuted);
  }, [soundMuted]);

  return (
    <button
      type="button"
      onClick={() => setSoundMuted(!soundMuted)}
      className="fixed bottom-4 right-4 z-50 flex items-center gap-2 rounded-full border border-white/15 bg-black/50 px-3 py-2 text-xs font-medium text-white/90 shadow-lg backdrop-blur-md transition-colors hover:bg-black/60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--chapter-accent,#94d4b8)]"
      aria-pressed={soundMuted}
      aria-label={soundMuted ? "Unmute sound" : "Mute sound"}
    >
      {soundMuted ? (
        <>
          <SpeakerOffIcon className="h-4 w-4 shrink-0 opacity-90" />
          <span className="hidden sm:inline">Sound off</span>
        </>
      ) : (
        <>
          <SpeakerOnIcon className="h-4 w-4 shrink-0 opacity-90" />
          <span className="hidden sm:inline">Sound</span>
        </>
      )}
    </button>
  );
}

function SpeakerOnIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M11 5 6 9H2v6h4l5 4V5Z" />
      <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
      <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
    </svg>
  );
}

function SpeakerOffIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M11 5 6 9H2v6h4l5 4V5Z" />
      <line x1="22" x2="16" y1="9" y2="15" />
      <line x1="16" x2="22" y1="9" y2="15" />
    </svg>
  );
}
