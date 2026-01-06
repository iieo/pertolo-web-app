export type GamePhase = 'setup' | 'reveal' | 'playing' | 'finished';

export type Category = {
  id: string;
  name: string;
  description: string | null;
};

export type GameState = {
  phase: GamePhase;
  players: string[];
  imposters: Set<number>;
  selectedCategoryId: string | null;
  imposterCount: number;
  currentPlayerIndex: number;
  selectedWord: string | null;
  showCategoryToImposter?: boolean;
};
