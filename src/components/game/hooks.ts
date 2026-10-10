import { type RefObject, useCallback, useEffect, useRef } from 'react';

const TAP_LOCK_MS = 300;

/**
 * Ignores taps for a short moment whenever `resetKey` changes, so a double tap never skips a
 * screen. Wrap each tap handler with the returned `guard`.
 */
export function useTapGuard(
  resetKey: string | number,
  {
    focusRef,
    lockMs = TAP_LOCK_MS,
    enabled = true,
  }: { focusRef?: RefObject<HTMLElement | null>; lockMs?: number; enabled?: boolean } = {},
) {
  const lockedUntil = useRef(Infinity);

  useEffect(() => {
    if (!enabled) return;
    lockedUntil.current = performance.now() + lockMs;
    focusRef?.current?.focus({ preventScroll: true });
  }, [resetKey, lockMs, enabled, focusRef]);

  return useCallback(
    (action: () => void) => () => {
      if (performance.now() < lockedUntil.current) return;
      lockedUntil.current = Infinity;
      action();
    },
    [],
  );
}

export function useThemeColor(color: string) {
  useEffect(() => {
    const meta = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]');
    if (!meta) return;
    const prev = meta.content;
    meta.content = color;
    return () => {
      meta.content = prev;
    };
  }, [color]);
}

export function useScrollLock() {
  useEffect(() => {
    const html = document.documentElement;
    const prevOverflow = html.style.overflow;
    const prevOverscroll = html.style.overscrollBehavior;
    html.style.overflow = 'hidden';
    html.style.overscrollBehavior = 'none';
    return () => {
      html.style.overflow = prevOverflow;
      html.style.overscrollBehavior = prevOverscroll;
    };
  }, []);
}
