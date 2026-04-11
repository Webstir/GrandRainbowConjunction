export type BranchMeta = {
  label: string;
  file: string;
};

export type ChapterMeta = {
  title: string;
  file: string;
  branches?: Record<string, BranchMeta>;
  /** Trunk chapter id to continue after optional branch convergence */
  next?: string;
};

export const chapterOrder: string[] = [
  "01-intro",
  "02-second",
  "03-third",
  "04-fourth",
  "05-fifth",
];

export const chapterMap: Record<string, ChapterMeta> = {
  "01-intro": {
    title: "The Beginning",
    file: "01-intro",
    next: "02-second",
    branches: {
      "branch-a": { label: "The red door 🟥", file: "01-intro--branch-a" },
      "branch-b": { label: "The blue door 🟦", file: "01-intro--branch-b" },
    },
  },
  "02-second": {
    title: "Insert Coin",
    file: "02-second",
    next: "03-third",
  },
  "03-third": {
    title: "High Score",
    file: "03-third",
    next: "04-fourth",
  },
  "04-fourth": {
    title: "Continue?",
    file: "04-fourth",
    next: "05-fifth",
  },
  "05-fifth": {
    title: "Game Over (Not)",
    file: "05-fifth",
  },
};

export function getChapterEntry(id: string): ChapterMeta | undefined {
  return chapterMap[id];
}

export function getNextChapterId(currentId: string): string | null {
  const meta = chapterMap[currentId];
  if (!meta?.next) return null;
  return meta.next;
}
