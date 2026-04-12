import fs from "fs";
import path from "path";
import React, { type ReactElement } from "react";
import matter from "gray-matter";
import type { MDXComponents } from "mdx/types";
import { compileMdxSection } from "@/lib/compile-mdx-section";
import type { ReaderParagraph } from "@/lib/reader-paragraph";
import { WisdomSummaryTap } from "@/components/chapter-end/WisdomSummaryTap";
import { expandTapSectionToRawParagraphs } from "@/lib/tap-beats";
import { getChapterEntry } from "@/content/meta";

export type { ReaderParagraph } from "@/lib/reader-paragraph";

const TAP_SPLIT = /\n\s*\{\/\*\s*TAP\s*\*\/\}\s*\n/;

export type ChapterFrontmatter = {
  title?: string;
  theme?: string;
  [key: string]: unknown;
};

const chaptersDir = path.join(process.cwd(), "src/content/chapters");

export function chapterFileExists(slug: string): boolean {
  return fs.existsSync(path.join(chaptersDir, `${slug}.mdx`));
}

export function loadChapterRaw(slug: string): {
  frontmatter: ChapterFrontmatter;
  sections: string[];
} {
  const file = path.join(chaptersDir, `${slug}.mdx`);
  if (!fs.existsSync(file)) {
    throw new Error(`Chapter not found: ${slug}`);
  }
  const raw = fs.readFileSync(file, "utf8");
  const { data, content } = matter(raw);
  const sections = content
    .split(TAP_SPLIT)
    .map((s) => s.trim())
    .filter(Boolean);
  return { frontmatter: data as ChapterFrontmatter, sections };
}

export async function compileChapterSections(
  slug: string,
  components: MDXComponents,
  contentId: string
): Promise<{
  frontmatter: ChapterFrontmatter;
  paragraphs: ReaderParagraph[];
}> {
  const { frontmatter, sections } = loadChapterRaw(slug);
  const paragraphs: ReaderParagraph[] = [];
  let keyCounter = 0;
  let runningGlobalStep = 0;
  for (let i = 0; i < sections.length; i++) {
    for (const raw of expandTapSectionToRawParagraphs(sections[i])) {
      if (raw.kind === "atomic") {
        const content = await compileMdxSection(raw.source, components);
        paragraphs.push({
          type: "atomic",
          fragment: React.createElement(
            React.Fragment,
            { key: `tap-${keyCounter++}` },
            content
          ),
        });
        runningGlobalStep += 1;
      } else if (raw.kind === "wisdomStack") {
        const steps = raw.items.length;
        const fragment = React.createElement(WisdomSummaryTap, {
          items: raw.items,
          startStep: runningGlobalStep,
          chapterId: contentId,
        });
        paragraphs.push({
          type: "wisdomProgressive",
          steps,
          fragment: React.createElement(
            React.Fragment,
            { key: `tap-${keyCounter++}` },
            fragment
          ),
        });
        runningGlobalStep += steps;
      } else {
        const fragments: ReactElement[] = [];
        for (const sentence of raw.sentences) {
          const content = await compileMdxSection(sentence, components);
          fragments.push(
            React.createElement(React.Fragment, { key: `tap-${keyCounter++}` }, content)
          );
        }
        paragraphs.push({ type: "prose", fragments });
        runningGlobalStep += raw.sentences.length;
      }
    }
  }
  return { frontmatter, paragraphs };
}

export function resolveChapterSlug(
  chapterId: string,
  branchId?: string
): {
  slug: string;
  entry: NonNullable<ReturnType<typeof getChapterEntry>>;
  contentId: string;
} {
  const entry = getChapterEntry(chapterId);
  if (!entry) {
    throw new Error(`Unknown chapter: ${chapterId}`);
  }
  if (!branchId) {
    return { slug: entry.file, entry, contentId: entry.file };
  }
  const b = entry.branches?.[branchId];
  if (!b) {
    throw new Error(`Unknown branch: ${chapterId}/${branchId}`);
  }
  return { slug: b.file, entry, contentId: b.file };
}
