import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";
import { containsProfanity } from "@/lib/profanity";
import type { Stroke, StrokePoint } from "@/lib/rainbow-detector";

const MAX_STROKES = 64;
const MAX_POINTS_PER_STROKE = 4000;
const MAX_CANVAS = 2400;

function isValidStrokePoint(p: unknown): p is StrokePoint {
  if (!p || typeof p !== "object") return false;
  const o = p as Record<string, unknown>;
  return (
    typeof o.x === "number" &&
    typeof o.y === "number" &&
    typeof o.t === "number" &&
    Number.isFinite(o.x) &&
    Number.isFinite(o.y) &&
    Number.isFinite(o.t) &&
    (o.hue === undefined ||
      (typeof o.hue === "number" && Number.isFinite(o.hue)))
  );
}

function isValidStrokes(data: unknown): data is Stroke[] {
  if (!Array.isArray(data) || data.length === 0 || data.length > MAX_STROKES) {
    return false;
  }
  for (const s of data) {
    if (!s || typeof s !== "object") return false;
    const o = s as Record<string, unknown>;
    if (typeof o.hueBand !== "number" || !Number.isFinite(o.hueBand)) {
      return false;
    }
    if (!Array.isArray(o.points)) return false;
    if (
      o.points.length < 2 ||
      o.points.length > MAX_POINTS_PER_STROKE
    ) {
      return false;
    }
    if (!o.points.every(isValidStrokePoint)) return false;
  }
  return true;
}

export async function GET() {
  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return NextResponse.json({ items: [] as unknown[] });
  }
  const { data, error } = await supabase
    .from("rainbow_gallery")
    .select("id, strokes, canvas_w, canvas_h, display_name, created_at")
    .order("created_at", { ascending: false })
    .limit(48);
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ items: data ?? [] });
}

export async function POST(req: NextRequest) {
  let body: {
    strokes?: unknown;
    canvasW?: unknown;
    canvasH?: unknown;
    displayName?: unknown;
  };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (!isValidStrokes(body.strokes)) {
    return NextResponse.json({ error: "Invalid strokes" }, { status: 400 });
  }
  const canvasW = Number(body.canvasW);
  const canvasH = Number(body.canvasH);
  if (
    !Number.isFinite(canvasW) ||
    !Number.isFinite(canvasH) ||
    canvasW < 10 ||
    canvasH < 10 ||
    canvasW > MAX_CANVAS ||
    canvasH > MAX_CANVAS
  ) {
    return NextResponse.json({ error: "Invalid canvas size" }, { status: 400 });
  }

  let displayName: string | null = null;
  if (body.displayName !== undefined && body.displayName !== null) {
    if (typeof body.displayName !== "string") {
      return NextResponse.json({ error: "Invalid displayName" }, { status: 400 });
    }
    const trimmed = body.displayName.trim();
    if (trimmed.length === 0) {
      displayName = null;
    } else if (trimmed.length > 40) {
      return NextResponse.json({ error: "Name too long" }, { status: 400 });
    } else if (containsProfanity(trimmed)) {
      return NextResponse.json(
        { error: "Please choose a different name." },
        { status: 422 }
      );
    } else {
      displayName = trimmed;
    }
  }

  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return NextResponse.json(
      {
        ok: true,
        warning: "Supabase not configured — rainbow not stored server-side.",
      },
      { status: 200 }
    );
  }

  const { error } = await supabase.from("rainbow_gallery").insert({
    strokes: body.strokes,
    canvas_w: canvasW,
    canvas_h: canvasH,
    display_name: displayName,
  });
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
