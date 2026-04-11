import fs from "fs";
import path from "path";
import React, { type ReactElement } from "react";
import matter from "gray-matter";
import type { MDXComponents } from "mdx/types";
import { compileMdxSection } from "@/lib/compile-mdx-section";
import { getChapterEntry } from "@/content/meta";

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
  components: MDXComponents
): Promise<{
  frontmatter: ChapterFrontmatter;
  nodes: ReactElement[];
}> {
  const { frontmatter, sections } = loadChapterRaw(slug);
  const nodes: ReactElement[] = [];
  for (let i = 0; i < sections.length; i++) {
    const content = await compileMdxSection(sections[i], components);
    nodes.push(
      React.createElement(React.Fragment, { key: `tap-section-${i}` }, content)
    );
  }
  return { frontmatter, nodes };
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
