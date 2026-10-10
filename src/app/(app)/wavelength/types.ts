import type { WavelengthCategory } from '@/db/schema';

export type GamePhase = 'setup' | 'clue' | 'guess' | 'reveal' | 'end';

export type CategoryKey = WavelengthCategory;

export type Spectrum = {
  id: string;
  left: string;
  right: string;
  leftEn: string;
  rightEn: string;
  category: CategoryKey;
};

export type TeamIndex = 0 | 1;

export type Round = { spectrum: Spectrum; target: number; team: TeamIndex };
