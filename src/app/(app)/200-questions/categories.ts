import { CategoryKey, CategoryMeta } from './types';

export const MAX_QUESTIONS = 200;

export const CATEGORIES: CategoryMeta[] = [
  { key: 'normal', name: 'Normal', emoji: '😄', description: 'Harmlos, passt in jede Gruppe' },
  { key: 'friendly', name: 'Friendly', emoji: '🤗', description: 'Nette Fragen und Komplimente' },
  {
    key: 'coworkers',
    name: 'Coworkers',
    emoji: '💼',
    description: 'Büro, Kollegen, Arbeitsalltag',
  },
  {
    key: 'interactive',
    name: 'Interactive',
    emoji: '🎭',
    description: 'Die Person muss etwas vormachen oder tun',
  },
  { key: 'crazy', name: 'Crazy', emoji: '🤪', description: 'Absurd und völlig verrückt' },
  { key: 'party', name: 'Party', emoji: '🍻', description: 'Feiern, Alkohol und Ausgehen' },
  { key: 'roast', name: 'Roast', emoji: '🔥', description: 'Frech, Macken und Angewohnheiten' },
  {
    key: 'exposed',
    name: 'Exposed',
    emoji: '🙈',
    description: 'Peinliche Geschichten und Geständnisse',
  },
  {
    key: 'future',
    name: 'Zukunft',
    emoji: '🔮',
    description: 'Wer heiratet zuerst, wird reich oder berühmt?',
  },
  { key: 'deep', name: 'Deep', emoji: '💭', description: 'Persönlich und nachdenklich' },
  { key: 'sexual', name: 'Sexual 18+', emoji: '🌶️', description: 'Dating, Flirt und Sex' },
];

export const CATEGORY_BY_KEY = Object.fromEntries(CATEGORIES.map((c) => [c.key, c])) as Record<
  CategoryKey,
  CategoryMeta
>;

export const MIXED = {
  name: 'Mixed',
  emoji: '🎲',
  description: 'Alles gemischt, ohne 18+',
};

export const MIXED_CATEGORIES: CategoryKey[] = CATEGORIES.map((c) => c.key).filter(
  (key) => key !== 'sexual',
);
