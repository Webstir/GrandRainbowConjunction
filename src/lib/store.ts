import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export type BranchChoices = Record<string, string>;

type EssayStore = {
  gateCleared: boolean;
  setGateCleared: (v: boolean) => void;
  chapterProgress: Record<string, number>;
  setChapterProgress: (chapterId: string, index: number) => void;
  branchChoices: BranchChoices;
  setBranchChoice: (chapterId: string, branchKey: string) => void;
  answersSubmitted: Record<string, boolean>;
  markAnswerSubmitted: (chapterId: string) => void;
  hasSubscribed: boolean;
  setHasSubscribed: (v: boolean) => void;
  /** Mutes all Tone.js output (minigame SFX + /synth). */
  soundMuted: boolean;
  setSoundMuted: (v: boolean) => void;
};

export const useEssayStore = create<EssayStore>()(
  persist(
    (set) => ({
      gateCleared: false,
      setGateCleared: (v) => set({ gateCleared: v }),
      chapterProgress: {},
      /** Current tap index for a chapter (not a high-water mark). */
      setChapterProgress: (chapterId, index) =>
        set((s) => ({
          chapterProgress: {
            ...s.chapterProgress,
            [chapterId]: index,
          },
        })),
      branchChoices: {},
      setBranchChoice: (chapterId, branchKey) =>
        set((s) => ({
          branchChoices: { ...s.branchChoices, [chapterId]: branchKey },
        })),
      answersSubmitted: {},
      markAnswerSubmitted: (chapterId) =>
        set((s) => ({
          answersSubmitted: { ...s.answersSubmitted, [chapterId]: true },
        })),
      hasSubscribed: false,
      setHasSubscribed: (v) => set({ hasSubscribed: v }),
      soundMuted: false,
      setSoundMuted: (v) => set({ soundMuted: v }),
    }),
    {
      name: "tap-essay-store",
      version: 3,
      migrate: (persisted, version) => {
        const p = persisted as Record<string, unknown>;
        if (version < 3) {
          return { ...p, chapterProgress: {} };
        }
        return p;
      },
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => ({
        gateCleared: s.gateCleared,
        branchChoices: s.branchChoices,
        answersSubmitted: s.answersSubmitted,
        hasSubscribed: s.hasSubscribed,
        soundMuted: s.soundMuted,
      }),
    }
  )
);
