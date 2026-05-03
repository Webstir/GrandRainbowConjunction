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
    title: "Homelessness",
    file: "01-intro",
    next: "02-second",
  },
  "02-second": {
    title: "Family",
    file: "02-second",
    next: "03-third",
  },
  "03-third": {
    title: "Society",
    file: "03-third",
    next: "04-fourth",
  },
  "04-fourth": {
    title: "Togetherness",
    file: "04-fourth",
    next: "05-fifth",
  },
  "05-fifth": {
    title: "How To Heal",
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
