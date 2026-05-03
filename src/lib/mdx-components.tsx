import type { MDXComponents } from "mdx/types";
import { WisdomSummary } from "@/components/chapter-end/WisdomSummary";
import { ReflectionQuestion } from "@/components/chapter-end/ReflectionQuestion";
import { CommunityAnswers } from "@/components/chapter-end/CommunityAnswers";
import { HighScoreInitials } from "@/components/chapter-end/HighScoreInitials";
import { SynthSection } from "@/components/chapter-end/SynthSection";
/** `contentId` = MDX slug used for community answers (chapter file id). */
export function getMdxComponents(contentId: string): MDXComponents {
  return {
    SynthSection,
    HighScoreInitials,
    WisdomSummary,
    ReflectionQuestion: (props) => (
      <ReflectionQuestion chapterId={contentId} {...props} />
    ),
    CommunityAnswers: (props) => (
      <CommunityAnswers chapterId={contentId} {...props} />
    ),
  };
}
