import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";
import { containsProfanity } from "@/lib/profanity";

export async function GET(req: NextRequest) {
  const chapterId = req.nextUrl.searchParams.get("chapterId");
  if (!chapterId) {
    return NextResponse.json({ error: "chapterId required" }, { status: 400 });
  }
  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return NextResponse.json({ answers: [] });
  }
  const { data, error } = await supabase
    .from("answers")
    .select("id, answer, created_at")
    .eq("chapter_id", chapterId)
    .order("created_at", { ascending: false })
    .limit(40);
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ answers: data ?? [] });
}

export async function POST(req: NextRequest) {
  let body: { chapterId?: string; answer?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const chapterId = body.chapterId?.trim();
  const answer = body.answer?.trim();
  if (!chapterId || !answer || answer.length < 2) {
    return NextResponse.json(
      { error: "chapterId and answer (2+ chars) required" },
      { status: 400 }
    );
  }
  if (answer.length > 2000) {
    return NextResponse.json({ error: "Answer too long" }, { status: 400 });
  }
  if (containsProfanity(answer)) {
    return NextResponse.json(
      { error: "Please rephrase — some words aren’t allowed." },
      { status: 422 }
    );
  }

  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return NextResponse.json(
      {
        ok: true,
        warning: "Supabase not configured — answer not stored server-side.",
      },
      { status: 200 }
    );
  }

  const { error } = await supabase.from("answers").insert({
    chapter_id: chapterId,
    answer,
  });
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
