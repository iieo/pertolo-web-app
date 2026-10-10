export type OverviewPlayer = {
  name: string;
  alive: boolean;
  claimed: boolean;
};

export type Overview = {
  gameId: string;
  players: OverviewPlayer[];
  you: { name: string; alive: boolean } | null;
  winner: string | null;
};

export type MyState = {
  name: string;
  target: string | null;
  isWinner: boolean;
  winner: string | null;
};
