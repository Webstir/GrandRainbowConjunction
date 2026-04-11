import type { MDXComponents } from "mdx/types";
import { BranchPoint } from "@/components/reader/BranchPoint";
import { Minigame } from "@/components/minigames/Minigame";
import { WisdomSummary } from "@/components/chapter-end/WisdomSummary";
import { ReflectionQuestion } from "@/components/chapter-end/ReflectionQuestion";
import { CommunityAnswers } from "@/components/chapter-end/CommunityAnswers";
import { HighScoreInitials } from "@/components/chapter-end/HighScoreInitials";
import { SynthSection } from "@/components/chapter-end/SynthSection";

/** `trunkChapterId` = URL segment (e.g. 01-intro). `contentId` = MDX slug for answers (includes branch file names). */
export function getMdxComponents(
  trunkChapterId: string,
  contentId: string
): MDXComponents {
  return {
    BranchPoint: (props) => (
      <BranchPoint chapterId={trunkChapterId} {...props} />
    ),
    Minigame,
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
