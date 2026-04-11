"use client";

type Props = {
  current: number;
  total: number;
};

export function ProgressBar({ current, total }: Props) {
  const pct = total <= 0 ? 0 : Math.min(100, ((current + 1) / total) * 100);
  return (
    <div
      className="fixed left-0 right-0 top-0 z-40 h-1 bg-(--chapter-muted)"
      role="progressbar"
      aria-valuenow={current + 1}
      aria-valuemin={1}
      aria-valuemax={total}
    >
      <div
        className="h-full bg-(--chapter-accent) transition-[width] duration-500 ease-out"
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}
