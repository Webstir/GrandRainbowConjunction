import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: NextRequest) {
  let body: { email?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const email = body.email?.trim().toLowerCase();
  if (!email || !EMAIL_RE.test(email)) {
    return NextResponse.json({ error: "Valid email required" }, { status: 400 });
  }

  const supabase = getSupabaseAdmin();
  const buttondownKey = process.env.BUTTONDOWN_API_KEY;

  if (!supabase && !buttondownKey) {
    return NextResponse.json(
      {
        error:
          "Newsletter signup isn’t connected yet. Add Supabase credentials or BUTTONDOWN_API_KEY.",
      },
      { status: 503 }
    );
  }

  let savedToDb = false;
  if (supabase) {
    const { error } = await supabase.from("newsletter_signups").insert({ email });
    if (error && error.code !== "23505") {
      return NextResponse.json(
        { error: error.message || "Could not save signup" },
        { status: 500 }
      );
    }
    savedToDb = true;
  }

  if (buttondownKey) {
    const res = await fetch("https://api.buttondown.email/v1/subscribers", {
      method: "POST",
      headers: {
        Authorization: `Token ${buttondownKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, tags: ["grand-rainbow-conjunction"] }),
    });

    if (!res.ok) {
      const t = await res.text();
      if (savedToDb) {
        return NextResponse.json({
          ok: true,
          warning: t || "Buttondown could not be reached; your email was saved locally.",
        });
      }
      return NextResponse.json(
        { error: t || "Buttondown error" },
        { status: 502 }
      );
    }
  }

  return NextResponse.json({ ok: true });
}
