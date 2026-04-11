"use client";

import { useState } from "react";
import { useEssayStore } from "@/lib/store";

type Props = {
  chapterId: string;
  question: string;
};

export function ReflectionQuestion({ chapterId, question }: Props) {
  const [text, setText] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "err">(
    "idle"
  );
  const [err, setErr] = useState("");
  const markAnswerSubmitted = useEssayStore((s) => s.markAnswerSubmitted);
  const already = useEssayStore((s) => s.answersSubmitted[chapterId]);

  const submit = async () => {
    if (!text.trim()) return;
    setStatus("sending");
    setErr("");
    try {
      const res = await fetch("/api/answers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chapterId, answer: text.trim() }),
      });
      const j = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(j.error ?? "Could not save");
      }
      markAnswerSubmitted(chapterId);
      setStatus("done");
    } catch (e) {
      setStatus("err");
      setErr(e instanceof Error ? e.message : "Error");
    }
  };

  return (
    <div
      className="not-prose my-10 space-y-3 rounded-2xl border border-(--chapter-muted) bg-(--chapter-card)/60 p-6"
      onClick={(e) => e.stopPropagation()}
    >
      <p className="font-medium text-(--foreground)">{question}</p>
      {already || status === "done" ? (
        <p className="text-sm text-(--chapter-accent)">
          Thanks — your note is in the river for the next readers.
        </p>
      ) : (
        <>
          <textarea
            className="min-h-24 w-full rounded-xl border border-(--chapter-muted) bg-(--background) p-3 text-(--foreground)"
            placeholder="A sentence or two…"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <div className="flex flex-col items-center gap-2">
            <button
              type="button"
              disabled={status === "sending" || !text.trim()}
              onClick={submit}
              className="rounded-full bg-(--chapter-accent) px-5 py-2 font-medium text-(--background) disabled:opacity-40"
            >
              {status === "sending" ? "Sending…" : "Share anonymously"}
            </button>
            {status === "err" && (
              <p className="text-center text-sm text-red-400">{err}</p>
            )}
          </div>
        </>
      )}
    </div>
  );
}
