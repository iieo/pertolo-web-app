export type GamePhase = 'word' | 'secret';

export type SecretType = 'truth' | 'bluff';

export type Word = {
  word: string;
  pronunciation: string;
  definition: string;
};
