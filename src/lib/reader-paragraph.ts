import type { ReactElement } from "react";

export type ReaderParagraph =
  | { type: "prose"; fragments: ReactElement[] }
  | { type: "atomic"; fragment: ReactElement }
  | { type: "wisdomProgressive"; steps: number; fragment: ReactElement };

export function tapStepsForParagraph(p: ReaderParagraph): number {
  if (p.type === "prose") return p.fragments.length;
  if (p.type === "wisdomProgressive") return p.steps;
  return 1;
}

export function totalTapSteps(paragraphs: ReaderParagraph[]): number {
  return paragraphs.reduce((n, p) => n + tapStepsForParagraph(p), 0);
}

/** Global tap index → stacked fragments for the current paragraph. */
export function visibleFragmentsAtTapStep(
  paragraphs: ReaderParagraph[],
  globalStep: number
): { paragraphIndex: number; fragments: ReactElement[] } {
  const total = totalTapSteps(paragraphs);
  if (total === 0) return { paragraphIndex: 0, fragments: [] };
  const bounded = Math.max(0, Math.min(globalStep, total - 1));
  let step = bounded;
  for (let p = 0; p < paragraphs.length; p++) {
    const len = tapStepsForParagraph(paragraphs[p]);
    if (step < len) {
      const para = paragraphs[p];
      const count = step + 1;
      if (para.type === "prose") {
        return { paragraphIndex: p, fragments: para.fragments.slice(0, count) };
      }
      return { paragraphIndex: p, fragments: [para.fragment] };
    }
    step -= len;
  }
  const last = paragraphs.length - 1;
  const lastPara = paragraphs[last];
  if (lastPara.type === "prose") {
    return { paragraphIndex: last, fragments: lastPara.fragments };
  }
  return { paragraphIndex: last, fragments: [lastPara.fragment] };
}
