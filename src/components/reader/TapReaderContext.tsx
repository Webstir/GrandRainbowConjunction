"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  type MutableRefObject,
  type ReactNode,
} from "react";

type Ctx = {
  completeMinigame: () => void;
  /** Increment while mounted so TapReader does not steal game keys (arrows, space, WASD). */
  claimReaderKeyboard: () => () => void;
};

const TapReaderContext = createContext<Ctx>({
  completeMinigame: () => {},
  claimReaderKeyboard: () => () => {},
});

export function TapReaderProvider({
  children,
  completeMinigame,
  suppressReaderKeyboardRef,
}: {
  children: ReactNode;
  completeMinigame: () => void;
  suppressReaderKeyboardRef: MutableRefObject<number>;
}) {
  const claimReaderKeyboard = useCallback(() => {
    suppressReaderKeyboardRef.current += 1;
    return () => {
      suppressReaderKeyboardRef.current -= 1;
    };
  }, [suppressReaderKeyboardRef]);

  const value = useMemo(
    () => ({ completeMinigame, claimReaderKeyboard }),
    [completeMinigame, claimReaderKeyboard]
  );
  return (
    <TapReaderContext.Provider value={value}>
      {children}
    </TapReaderContext.Provider>
  );
}

export function useTapReaderMinigame() {
  return useContext(TapReaderContext);
}
