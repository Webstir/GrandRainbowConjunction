"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { RainbowCaptcha } from "@/components/gate/RainbowCaptcha";
import { useEssayStore } from "@/lib/store";

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
          {"Entering Grand Rainbow Conjunction\u{2026} \u{1F308}\u{2728}"}
        </p>
      </div>
    );
  }

  return <RainbowCaptcha />;
}
