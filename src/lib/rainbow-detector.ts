/**
 * Playful rainbow validation: arcs, multiple hues, generally left-to-right motion.
 * Intentionally lenient — vibe over gatekeeping.
 */

export type StrokePoint = { x: number; y: number; t: number; hue?: number };

export type Stroke = {
  points: StrokePoint[];
  hueBand: number;
};

const HUE_BANDS = 6;

export function hueToBand(h: number): number {
  return Math.floor(((h % 360) + 360) % 360 / (360 / HUE_BANDS));
}

/** Estimate curvature: ratio of path length to straight-line distance ( > ~1.2 suggests arc ) */
function strokeCurvature(points: StrokePoint[]): number {
  if (points.length < 4) return 1;
  let path = 0;
  for (let i = 1; i < points.length; i++) {
    const dx = points[i].x - points[i - 1].x;
    const dy = points[i].y - points[i - 1].y;
    path += Math.hypot(dx, dy);
  }
  const first = points[0];
  const last = points[points.length - 1];
  const chord = Math.hypot(last.x - first.x, last.y - first.y) || 1;
  return path / chord;
}

/** Net horizontal direction: positive = mostly L→R */
function horizontalBias(points: StrokePoint[]): number {
  if (points.length < 2) return 0;
  let sum = 0;
  for (let i = 1; i < points.length; i++) {
    sum += points[i].x - points[i - 1].x;
  }
  return sum;
}

export function analyzeStrokes(strokes: Stroke[]): {
  distinctHueBands: number;
  arcLikeStrokes: number;
  leftToRight: boolean;
} {
  const bands = new Set<number>();
  let arcLike = 0;
  let lrScore = 0;

  for (const s of strokes) {
    bands.add(s.hueBand);
    if (strokeCurvature(s.points) >= 1.15) arcLike += 1;
    if (horizontalBias(s.points) > 2) lrScore += 1;
    else if (horizontalBias(s.points) < -2) lrScore -= 1;
  }

  return {
    distinctHueBands: bands.size,
    arcLikeStrokes: arcLike,
    leftToRight: lrScore >= 0,
  };
}

export function looksLikeRainbow(strokes: Stroke[]): {
  pass: boolean;
  reason: string;
} {
  if (strokes.length < 1) {
    return { pass: false, reason: "empty" };
  }

  const { distinctHueBands, arcLikeStrokes, leftToRight } = analyzeStrokes(strokes);

  const enoughColors = distinctHueBands >= 3;
  const someCurves = arcLikeStrokes >= 1 || strokes.length >= 4;
  const directionOk = leftToRight || strokes.length >= 5;

  if (enoughColors && someCurves && directionOk) {
    return { pass: true, reason: "ok" };
  }

  if (!enoughColors) {
    return { pass: false, reason: "colors" };
  }
  if (!someCurves) {
    return { pass: false, reason: "curves" };
  }
  return { pass: false, reason: "direction" };
}

export function colorFromHue(h: number): string {
  return `hsl(${h % 360} 85% 55%)`;
}

export function nextHue(current: number, step: number): number {
  return (current + step) % 360;
}
