import type { HotPotatoCategory } from '@/db/schema';

export type GamePhase = 'setup' | 'prompt' | 'ticking' | 'boom' | 'end';

export type CategoryKey = HotPotatoCategory;

export type FuseLength = 'short' | 'normal' | 'long';

export type Prompt = {
  id: string;
  prompt: string;
  promptEn: string;
  category: CategoryKey;
};
