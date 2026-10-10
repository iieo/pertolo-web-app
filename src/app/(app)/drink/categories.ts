import { questionColor, type QuestionColor } from '@/app/(app)/200-questions/palette';

export type DrinkCategory = {
  id: string;
  name: string;
  description: string | null;
};

// Index into the shared palette, so every category keeps its own color.
const CATEGORY_ORDER: { name: string; color: number }[] = [
  { name: 'Normal', color: 8 },
  { name: 'Party', color: 5 },
  { name: 'Duell', color: 2 },
  { name: 'Wahrheit', color: 3 },
  { name: 'Chaos', color: 4 },
  { name: 'Wild', color: 0 },
  { name: 'Spicy', color: 7 },
];

function orderIndex(name: string) {
  const index = CATEGORY_ORDER.findIndex((entry) => entry.name === name);
  return index === -1 ? CATEGORY_ORDER.length : index;
}

export function sortCategories<T extends { name: string }>(categories: T[]): T[] {
  return [...categories].sort(
    (a, b) => orderIndex(a.name) - orderIndex(b.name) || a.name.localeCompare(b.name, 'de'),
  );
}

export function categoryColorIndex(name: string, fallback: number) {
  return CATEGORY_ORDER.find((entry) => entry.name === name)?.color ?? fallback;
}

export function categoryColor(name: string, fallback: number): QuestionColor {
  return questionColor(categoryColorIndex(name, fallback));
}
