import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  let body: { email?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const email = body.email?.trim().toLowerCase();
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Valid email required" }, { status: 400 });
  }

  const key = process.env.BUTTONDOWN_API_KEY;
  if (!key) {
    return NextResponse.json(
      {
        ok: true,
        warning:
          "BUTTONDOWN_API_KEY not set — configure Buttondown to capture emails.",
      },
      { status: 200 }
    );
  }

  const res = await fetch("https://api.buttondown.email/v1/subscribers", {
    method: "POST",
    headers: {
      Authorization: `Token ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, tags: ["grand-rainbow-conjunction"] }),
  });

  if (!res.ok) {
    const t = await res.text();
    return NextResponse.json(
      { error: t || "Buttondown error" },
      { status: 502 }
    );
  }

  return NextResponse.json({ ok: true });
}
