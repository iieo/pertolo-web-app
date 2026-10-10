import { useCallback, useState } from 'react';

// Mixed is exclusive: a single pick leaves Mixed, picking Mixed clears all single picks.
export function useCategorySelection<K extends string>(mixedKeys: readonly K[]) {
  const [mixed, setMixed] = useState(true);
  const [selected, setSelected] = useState<K[]>([]);

  const selectMixed = useCallback(() => {
    setMixed(true);
    setSelected([]);
  }, []);

  const toggle = useCallback(
    (key: K) => {
      if (mixed) {
        setMixed(false);
        setSelected([key]);
        return;
      }
      setSelected((prev) => (prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]));
    },
    [mixed],
  );

  return { mixed, selected, active: mixed ? mixedKeys : selected, selectMixed, toggle };
}

export function countByCategory<K extends string>(
  items: readonly { category: K }[],
): Record<K, number> {
  const counts = {} as Record<K, number>;
  for (const item of items) counts[item.category] = (counts[item.category] ?? 0) + 1;
  return counts;
}

export function sumCounts<K extends string>(counts: Record<K, number>, keys: readonly K[]) {
  return keys.reduce((sum, key) => sum + (counts[key] ?? 0), 0);
}
