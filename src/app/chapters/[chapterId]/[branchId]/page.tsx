import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { TapReader } from "@/components/reader/TapReader";
import { ChapterTheme } from "@/components/chapters/ChapterTheme";
import { ChapterChrome } from "@/components/chapters/ChapterChrome";
import {
  compileChapterSections,
  resolveChapterSlug,
  chapterFileExists,
} from "@/lib/load-chapter";
import { getMdxComponents } from "@/lib/mdx-components";
import { getChapterEntry } from "@/content/meta";

type Props = { params: Promise<{ chapterId: string; branchId: string }> };

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params;
  const entry = getChapterEntry(params.chapterId);
  const branch = entry?.branches?.[params.branchId];
  return {
    title: branch?.label ?? "Branch",
    description:
      "The Grand Rainbow Conjunction — a branch of the story, same crossing, different door.",
  };
}

export default async function BranchPage(props: Props) {
  const params = await props.params;
  let resolved;
  try {
    resolved = resolveChapterSlug(params.chapterId, params.branchId);
  } catch {
    notFound();
  }
  const { slug, entry, contentId } = resolved;
  if (!chapterFileExists(slug)) notFound();

  const comps = getMdxComponents(contentId);
  const { frontmatter, paragraphs } = await compileChapterSections(
    slug,
    comps,
    contentId
  );
  const title = (frontmatter.title as string) ?? entry.title;

  return (
    <ChapterTheme theme={frontmatter.theme as string | undefined}>
      <ChapterChrome chapterId={params.chapterId} title={title}>
        <TapReader
          chapterId={contentId}
          trunkChapterId={params.chapterId}
          paragraphs={paragraphs}
        />
      </ChapterChrome>
    </ChapterTheme>
  );
}
