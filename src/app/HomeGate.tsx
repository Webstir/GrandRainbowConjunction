"use client";

import { Component, type ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";
import { RainbowCaptcha } from "@/components/gate/RainbowCaptcha";
import { useEssayStore } from "@/lib/store";

class GateBoundary extends Component<
  { children: ReactNode },
  { error: Error | null }
> {
  state: { error: Error | null } = { error: null };

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  render() {
    if (this.state.error) {
      return (
        <div style={{ background: "#0c0618", color: "#fca5a5", padding: "2rem", minHeight: "100vh", fontFamily: "system-ui" }}>
          <h1 style={{ fontSize: "1.25rem", color: "#fff" }}>Rainbow gate error</h1>
          <pre style={{ whiteSpace: "pre-wrap", wordBreak: "break-all", fontSize: "0.8rem", marginTop: "1rem" }}>
            {this.state.error.message}
            {"\n\n"}
            {this.state.error.stack}
          </pre>
          <p style={{ marginTop: "1rem", color: "#a5b4fc", fontSize: "0.85rem" }}>
            Screenshot this and send it — or visit <code>/debug</code> for full diagnostics.
          </p>
        </div>
      );
    }
    return this.props.children;
  }
}

export function HomeGate() {
  const router = useRouter();
  const gateCleared = useEssayStore((s) => s.gateCleared);

  useEffect(() => {
    if (gateCleared) {
      router.replace("/chapters/01-intro");
    }
  }, [gateCleared, router]);

  if (gateCleared) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0c0618] text-white">
        <p className="text-white/70">
          {"Entering The Grand Rainbow Conjunction\u{2026} \u{1F308}\u{2728}"}
        </p>
      </div>
    );
  }

  return (
    <GateBoundary>
      <RainbowCaptcha />
    </GateBoundary>
  );
}
