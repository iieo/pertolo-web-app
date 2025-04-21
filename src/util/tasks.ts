export function replaceNames(text: string, players: string[]): string {
  const playerRegex = /\{\{player\}\}/g;

  // Create a copy of the players array to avoid modifying the original
  const availablePlayers = [...players];

  // Create a simple hash of the text to use as seed
  const textHash =
    text.split('').reduce((hash, char) => {
      return (hash << 5) - hash + char.charCodeAt(0);
    }, 0) >>> 0; // Convert to unsigned 32-bit integer

  // Counter for deterministic selection
  let counter = textHash;

  return text.replace(playerRegex, () => {
    // If we've used all players, refill the available players
    if (availablePlayers.length === 0) {
      availablePlayers.push(...players);
    }

    // Use counter to get deterministic index
    const index = counter % availablePlayers.length;
    counter = (counter * 31 + 7) >>> 0; // Simple PRNG formula

    // Remove and return the player at the index
    const name = availablePlayers.splice(index, 1)[0];

    return name || '{{player}}'; // Fallback to {{player}} if no name is available
  });
}
