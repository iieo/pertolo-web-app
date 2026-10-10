const PLAYER_PLACEHOLDER = /\{\{player\}\}/g;

export function shuffle<T>(items: readonly T[]): T[] {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j]!, result[i]!];
  }
  return result;
}

export function countPlayerSlots(text: string): number {
  return text.match(PLAYER_PLACEHOLDER)?.length ?? 0;
}

// Every {{player}} in a task stands for a different person, so names are drawn without
// repetition. Only when a task has more slots than players do names start to repeat.
export function replaceNames(text: string, players: readonly string[]): string {
  if (players.length === 0) return text;
  let pool: string[] = [];
  return text.replace(PLAYER_PLACEHOLDER, () => {
    if (pool.length === 0) pool = shuffle(players);
    return pool.pop()!;
  });
}
