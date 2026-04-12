"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  /** Global tap step for scroll targeting. */
  tapStep: number;
};

export function Section({ children, tapStep }: Props) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 12 }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      exit={{ opacity: 0, y: -8, transition: { duration: 0.22, ease: [0.22, 1, 0.36, 1] } }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className="prose prose-lg prose-invert mx-auto max-w-160 px-4 py-6 [&_p]:leading-relaxed"
      data-section={tapStep}
      aria-current="step"
    >
      {children}
    </motion.article>
  );
}
