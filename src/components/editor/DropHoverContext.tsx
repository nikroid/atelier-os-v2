import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';

export interface DropHoverTarget {
  parentId: string;
  index: number;
}

const DropHoverContext = createContext<{
  hover: DropHoverTarget | null;
  setHover: (target: DropHoverTarget | null) => void;
} | null>(null);

const HOVER_THROTTLE_MS = 16;

export function DropHoverProvider({ children }: { children: ReactNode }) {
  const [hover, setHoverState] = useState<DropHoverTarget | null>(null);
  const pendingRef = useRef<DropHoverTarget | null | undefined>(undefined);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastRef = useRef<DropHoverTarget | null>(null);

  const applyHover = useCallback((target: DropHoverTarget | null) => {
    const prev = lastRef.current;
    if (
      prev?.parentId === target?.parentId &&
      prev?.index === target?.index &&
      (target !== null || prev === null)
    ) {
      return;
    }
    lastRef.current = target;
    setHoverState(target);
  }, []);

  const setHover = useCallback(
    (target: DropHoverTarget | null) => {
      pendingRef.current = target;
      if (timerRef.current) return;
      timerRef.current = setTimeout(() => {
        timerRef.current = null;
        if (pendingRef.current !== undefined) {
          applyHover(pendingRef.current);
          pendingRef.current = undefined;
        }
      }, HOVER_THROTTLE_MS);
    },
    [applyHover],
  );

  useEffect(() => {
    const clear = () => {
      pendingRef.current = null;
      lastRef.current = null;
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = null;
      setHoverState(null);
    };
    window.addEventListener('dragend', clear);
    return () => {
      window.removeEventListener('dragend', clear);
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const value = useMemo(() => ({ hover, setHover }), [hover, setHover]);

  return <DropHoverContext.Provider value={value}>{children}</DropHoverContext.Provider>;
}

export function useDropHover() {
  const ctx = useContext(DropHoverContext);
  return ctx ?? { hover: null, setHover: () => {} };
}
