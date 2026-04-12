"use client";

import { useState } from "react";
import { useEssayStore } from "@/lib/store";

type Props = {
  compact?: boolean;
};

export function SignupForm({ compact }: Props) {
  const hasSubscribed = useEssayStore((s) => s.hasSubscribed);
  const setHasSubscribed = useEssayStore((s) => s.setHasSubscribed);
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "err">("idle");
  const [err, setErr] = useState("");

  if (hasSubscribed) {
    return (
      <p className="text-sm text-(--chapter-muted-fg)">
        You&apos;re on the list. Thanks for sticking around.
      </p>
    );
  }

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setStatus("loading");
    setErr("");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });
      const j = await res.json().catch(() => ({}));
      if (!res.ok) {
        const msg =
          typeof j.error === "string" && j.error
            ? j.error
            : res.status === 503
              ? "Newsletter isn’t connected on the server yet."
              : "Signup failed";
        throw new Error(msg);
      }
      setHasSubscribed(true);
    } catch (e) {
      setStatus("err");
      setErr(e instanceof Error ? e.message : "Error");
    } finally {
      setStatus("idle");
    }
  };

  return (
    <form
      onSubmit={submit}
      className={compact ? "flex flex-wrap gap-2" : "mx-auto max-w-md space-y-3"}
      onClick={(e) => e.stopPropagation()}
    >
      <label className={compact ? "sr-only" : "block text-sm"}>
        Email for new chapters
      </label>
      <input
        type="email"
        required
        placeholder="you@email.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="min-w-48 flex-1 rounded-full border border-(--chapter-muted) bg-(--background) px-4 py-2 text-(--foreground)"
      />
      <button
        type="submit"
        disabled={status === "loading"}
        className="rounded-full bg-(--chapter-accent) px-5 py-2 text-sm font-medium text-(--background) disabled:opacity-50"
      >
        {status === "loading" ? "…" : "Subscribe"}
      </button>
      {status === "err" && (
        <p className="w-full text-xs text-red-400">{err}</p>
      )}
    </form>
  );
}
