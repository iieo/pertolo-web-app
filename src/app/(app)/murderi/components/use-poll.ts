import { useEffect, useRef } from 'react';

// Polls while the page is visible and refreshes right away when it becomes visible again.
export function usePoll(poll: () => Promise<void>, enabled = true, intervalMs = 5000) {
  const pollRef = useRef(poll);

  useEffect(() => {
    pollRef.current = poll;
  });

  useEffect(() => {
    if (!enabled) return;
    let running = false;

    const tick = async () => {
      if (running || document.visibilityState === 'hidden') return;
      running = true;
      try {
        await pollRef.current();
      } catch {
        // A failed poll is retried on the next tick.
      } finally {
        running = false;
      }
    };

    const id = setInterval(tick, intervalMs);
    const onVisibilityChange = () => {
      if (document.visibilityState === 'visible') void tick();
    };
    document.addEventListener('visibilitychange', onVisibilityChange);

    return () => {
      clearInterval(id);
      document.removeEventListener('visibilitychange', onVisibilityChange);
    };
  }, [enabled, intervalMs]);
}
