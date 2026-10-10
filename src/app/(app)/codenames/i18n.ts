import type { Locale } from '@/components/game/locale';

import type { CategoryKey, EndReason, Role, Team } from './types';

type Labelled = { name: string; description: string };

export type Dictionary = {
  title: string;
  subtitle: string;
  rules: string;
  rulesTitle: string;
  rulesList: string[];
  rulesConfirm: string;
  language: string;
  categoriesLabel: string;
  mixed: Labelled;
  categories: Record<CategoryKey, Labelled>;
  chooseIndividually: string;
  wordCount: (count: number) => string;
  wordsPerRound: (count: number) => string;
  selectAtLeastOne: string;
  notEnoughWords: (needed: number) => string;
  start: string;
  boardLabel: string;
  teams: Record<Team, string>;
  roles: Record<Role, string>;
  turnAnnouncement: (team: string) => string;
  cardLabel: (word: string) => string;
  armedCardLabel: (word: string) => string;
  revealedCardLabel: (word: string, role: string) => string;
  key: string;
  keyLabel: string;
  endTurn: string;
  quit: string;
  quitTitle: string;
  quitDescription: string;
  keepPlaying: string;
  winTitle: (team: string) => string;
  endDetail: Record<EndReason, (winner: string, loser: string) => string>;
  playAgain: string;
  backToSetup: string;
};

const de: Dictionary = {
  title: 'Codenames',
  subtitle: 'Findet eure Wörter, meidet den Attentäter.',
  rules: 'Regeln',
  rulesTitle: 'Spielregeln',
  rulesList: [
    'Bildet zwei Teams, Rot und Blau. Jedes Team wählt eine Person als Geheimdienstchef.',
    'Die Farbe oben zeigt, welches Team dran ist. Das Team, das anfängt, muss neun Wörter finden, das andere acht.',
    'Die Geheimdienstchefs halten Schlüssel gedrückt und sehen, welches Wort zu wem gehört. Alle anderen schauen weg.',
    'Der Geheimdienstchef des aktiven Teams nennt einen Hinweis: ein Wort und eine Zahl, wie viele Karten dazu passen.',
    'Das Team tippt ein Wort an und tippt zum Aufdecken nochmal. Bei einem eigenen Wort dürft ihr weiterraten, ein fremdes oder neutrales Wort beendet den Zug. Mit Zug beenden hört ihr freiwillig auf.',
    'Wer den Attentäter aufdeckt, verliert sofort. Wer zuerst alle eigenen Wörter findet, gewinnt.',
  ],
  rulesConfirm: 'Verstanden',
  language: 'Sprache',
  categoriesLabel: 'Kategorien',
  mixed: { name: 'Mixed', description: 'Alles gemischt, ohne Sexual' },
  categories: {
    classic: { name: 'Klassisch', description: 'Begriffe aus dem Alltag' },
    places: { name: 'Orte', description: 'Städte, Länder und Gebäude' },
    food: { name: 'Essen', description: 'Gerichte, Zutaten und Getränke' },
    popculture: { name: 'Popkultur', description: 'Filme, Serien, Musik und Stars' },
    nature: { name: 'Natur', description: 'Tiere, Pflanzen und Wetter' },
    sexual: { name: 'Sexual', description: 'Flirt, Dating und Sex' },
  },
  chooseIndividually: 'Oder einzeln wählen',
  wordCount: (count) => `${count} ${count === 1 ? 'Wort' : 'Wörter'}`,
  wordsPerRound: (count) => `${count} Wörter pro Runde`,
  selectAtLeastOne: 'Wähle mindestens eine Kategorie.',
  notEnoughWords: (needed) => `Mindestens ${needed} Wörter nötig`,
  start: 'Starten',
  boardLabel: 'Spielfeld',
  teams: { red: 'Rot', blue: 'Blau' },
  roles: { red: 'Team Rot', blue: 'Team Blau', neutral: 'Neutral', assassin: 'Attentäter' },
  turnAnnouncement: (team) => `Team ${team} ist dran.`,
  cardLabel: (word) => `${word}, antippen zum Auswählen`,
  armedCardLabel: (word) => `${word}, ausgewählt, nochmal tippen zum Aufdecken`,
  revealedCardLabel: (word, role) => `${word}, aufgedeckt: ${role}`,
  key: 'Schlüssel',
  keyLabel: 'Gedrückt halten, um den Schlüssel zu zeigen',
  endTurn: 'Zug beenden',
  quit: 'Beenden',
  quitTitle: 'Spiel beenden?',
  quitDescription: 'Ihr landet wieder in der Auswahl. Diese Runde geht verloren.',
  keepPlaying: 'Weiterspielen',
  winTitle: (team) => `Team ${team} gewinnt.`,
  endDetail: {
    allFound: (winner) => `Team ${winner} hat alle eigenen Wörter gefunden.`,
    assassin: (_winner, loser) => `Team ${loser} hat den Attentäter aufgedeckt.`,
  },
  playAgain: 'Nochmal',
  backToSetup: 'Zur Auswahl',
};

const en: Dictionary = {
  title: 'Codenames',
  subtitle: 'Find your words, avoid the assassin.',
  rules: 'Rules',
  rulesTitle: 'Rules',
  rulesList: [
    'Split into two teams, red and blue. Each team picks one person as spymaster.',
    'The color at the top shows whose turn it is. The team that starts has nine words to find, the other eight.',
    'The spymasters hold Key to see which word belongs to whom. Everyone else looks away.',
    'The active spymaster gives a clue: one word and a number saying how many cards it fits.',
    'The team taps a word, then taps it again to reveal it. Their own word means they may guess again, an opposing or neutral word ends the turn. End turn stops guessing early.',
    'Whoever reveals the assassin loses at once. The first team to find all its words wins.',
  ],
  rulesConfirm: 'Got it',
  language: 'Language',
  categoriesLabel: 'Categories',
  mixed: { name: 'Mixed', description: 'Everything mixed, except Sexual' },
  categories: {
    classic: { name: 'Classic', description: 'Everyday words' },
    places: { name: 'Places', description: 'Cities, countries and buildings' },
    food: { name: 'Food', description: 'Dishes, ingredients and drinks' },
    popculture: { name: 'Pop Culture', description: 'Movies, shows, music and stars' },
    nature: { name: 'Nature', description: 'Animals, plants and weather' },
    sexual: { name: 'Sexual', description: 'Flirting, dating and sex' },
  },
  chooseIndividually: 'Or pick your own',
  wordCount: (count) => `${count} ${count === 1 ? 'word' : 'words'}`,
  wordsPerRound: (count) => `${count} words per round`,
  selectAtLeastOne: 'Pick at least one category.',
  notEnoughWords: (needed) => `At least ${needed} words needed`,
  start: 'Start',
  boardLabel: 'Board',
  teams: { red: 'Red', blue: 'Blue' },
  roles: { red: 'Red team', blue: 'Blue team', neutral: 'Neutral', assassin: 'Assassin' },
  turnAnnouncement: (team) => `${team} team's turn.`,
  cardLabel: (word) => `${word}, tap to select`,
  armedCardLabel: (word) => `${word}, selected, tap again to reveal`,
  revealedCardLabel: (word, role) => `${word}, revealed: ${role}`,
  key: 'Key',
  keyLabel: 'Hold to show the key',
  endTurn: 'End turn',
  quit: 'Quit',
  quitTitle: 'Quit game?',
  quitDescription: "You'll go back to the setup. This round will be lost.",
  keepPlaying: 'Keep playing',
  winTitle: (team) => `${team} team wins.`,
  endDetail: {
    allFound: (winner) => `${winner} team found all of its words.`,
    assassin: (_winner, loser) => `${loser} team revealed the assassin.`,
  },
  playAgain: 'Play again',
  backToSetup: 'Back to setup',
};

export const DICTIONARIES: Record<Locale, Dictionary> = { de, en };
