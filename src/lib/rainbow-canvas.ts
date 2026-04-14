import type { Stroke, StrokePoint } from "@/lib/rainbow-detector";

export function drawRainbowBackground(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number
) {
  const g = ctx.createLinearGradient(0, 0, w, h);
  g.addColorStop(0, "#1a0a2e");
  g.addColorStop(0.5, "#2d1b4e");
  g.addColorStop(1, "#0f172a");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, w, h);
}

function pointHue(p: StrokePoint): number {
  return p.hue ?? 0;
}

/** Replay strokes from gate coordinates into a target canvas size. */
export function drawRainbowStrokes(
  ctx: CanvasRenderingContext2D,
  strokes: Stroke[],
  sourceW: number,
  sourceH: number,
  targetW: number,
  targetH: number
) {
  const sx = targetW / Math.max(sourceW, 1);
  const sy = targetH / Math.max(sourceH, 1);
  for (const stroke of strokes) {
    const pts = stroke.points;
    if (pts.length < 2) continue;
    for (let i = 1; i < pts.length; i++) {
      const a = pts[i - 1];
      const b = pts[i];
      const hue = pointHue(b);
      ctx.strokeStyle = `hsl(${hue}, 90%, 60%)`;
      ctx.lineWidth = Math.max(1.5, 2 * Math.min(sx, sy));
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.beginPath();
      ctx.moveTo(a.x * sx, a.y * sy);
      ctx.lineTo(b.x * sx, b.y * sy);
      ctx.stroke();
    }
  }
}
