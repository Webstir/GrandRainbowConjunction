import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const ua = req.headers.get("user-agent") ?? "unknown";
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    req.headers.get("x-real-ip") ??
    "unknown";

  const info = {
    timestamp: new Date().toISOString(),
    userAgent: ua,
    ip,
    headers: Object.fromEntries(req.headers.entries()),
  };

  // Log server-side for your inspection
  console.log("[debug-probe]", JSON.stringify(info, null, 2));

  return NextResponse.json(info);
}
