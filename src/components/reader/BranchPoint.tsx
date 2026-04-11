"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useEssayStore } from "@/lib/store";

export type BranchOption = {
  label: string;
  branch: string;
};

type Props = {
  chapterId: string;
  prompt: string;
  options: BranchOption[];
};

export function BranchPoint({ chapterId, prompt, options }: Props) {
  const setBranchChoice = useEssayStore((s) => s.setBranchChoice);

  return (
    <div
      className="not-prose my-10 space-y-6"
      onClick={(e) => e.stopPropagation()}
    >
      <p className="text-center font-display text-xl text-(--chapter-accent)">
        {prompt}
      </p>
      <div className="grid gap-3 sm:grid-cols-2">
        {options.map((opt) => (
          <motion.div
            key={opt.branch}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Link
              href={`/chapters/${chapterId}/${opt.branch}`}
              onClick={() => setBranchChoice(chapterId, opt.branch)}
              className="block rounded-2xl border-2 border-(--chapter-accent)/40 bg-(--chapter-card) px-5 py-6 text-center font-medium text-(--foreground) shadow-lg transition-colors hover:border-(--chapter-accent) hover:bg-(--chapter-accent)/10"
            >
              {opt.label}
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
