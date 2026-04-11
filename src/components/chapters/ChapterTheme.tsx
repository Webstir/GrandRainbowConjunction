import type { CSSProperties, ReactNode } from "react";

const THEMES: Record<
  string,
  { accent: string; muted: string; card: string; mutedFg: string }
> = {
  warm: {
    accent: "#e07a5f",
    muted: "#3d2f2a",
    card: "#2a1f1c",
    mutedFg: "rgba(255,248,240,0.65)",
  },
  cool: {
    accent: "#7eb6d4",
    muted: "#2a3540",
    card: "#1a222b",
    mutedFg: "rgba(230,240,255,0.65)",
  },
  violet: {
    accent: "#c4a7e7",
    muted: "#352c44",
    card: "#241f30",
    mutedFg: "rgba(245,240,255,0.65)",
  },
  arcade: {
    accent: "#6bcf7f",
    muted: "#1e2a22",
    card: "#121a16",
    mutedFg: "rgba(200,255,210,0.6)",
  },
  crimson: {
    accent: "#ff6b6b",
    muted: "#3a2028",
    card: "#24141a",
    mutedFg: "rgba(255,220,225,0.65)",
  },
  default: {
    accent: "#94d4b8",
    muted: "#2a3530",
    card: "#1c2420",
    mutedFg: "rgba(235,250,245,0.65)",
  },
};

export function ChapterTheme({
  theme,
  children,
}: {
  theme?: string;
  children: ReactNode;
}) {
  const t = THEMES[theme ?? "default"] ?? THEMES.default;
  return (
    <div
      className="min-h-screen bg-(--background) text-(--foreground)"
      style={
        {
          "--chapter-accent": t.accent,
          "--chapter-muted": t.muted,
          "--chapter-card": t.card,
          "--chapter-muted-fg": t.mutedFg,
        } as CSSProperties
      }
    >
      {children}
    </div>
  );
}
