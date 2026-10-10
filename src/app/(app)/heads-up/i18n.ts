import type { Locale } from '@/components/game/locale';
import { CategoryKey } from './types';

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
  roundLength: string;
  secondsShort: (seconds: number) => string;
  selectAtLeastOne: string;
  start: string;
  readyTitle: string;
  readyHold: string;
  readyTiltDown: string;
  readyTiltUp: string;
  readyTap: string;
  readyTapOnly: string;
  go: string;
  holdToForehead: string;
  turnSideways: string;
  rotationLockHint: string;
  correct: string;
  pass: string;
  markCorrect: string;
  markPass: string;
  timeUp: string;
  secondsLeft: (seconds: number) => string;
  quit: string;
  quitTitle: string;
  quitDescription: string;
  keepPlaying: string;
  score: (count: number) => string;
  outOf: (total: number) => string;
  roundWords: string;
  passed: string;
  noWords: string;
  nextRound: string;
  backToSetup: string;
};

const de: Dictionary = {
  title: 'Heads Up',
  subtitle: 'Errate das Wort auf deiner Stirn',
  rules: 'Regeln',
  rulesTitle: 'Spielregeln',
  rulesList: [
    'Eine Person hält das Handy quer an die Stirn. Der Bildschirm zeigt zu den anderen.',
    'Die anderen erklären das Wort, ohne es selbst zu sagen.',
    'Erraten? Kipp das Handy nach unten. Zu schwer? Kipp es nach oben und das nächste Wort kommt.',
    'Ohne Kippen geht es auch: rechts tippen heißt richtig, links tippen heißt weiter.',
    'Ist die Zeit um, seht ihr alle Wörter der Runde. Dann ist die nächste Person dran.',
    'Die Sperre für die Bildschirmdrehung muss aus sein.',
  ],
  rulesConfirm: 'Verstanden',
  language: 'Sprache',
  categoriesLabel: 'Kategorien',
  mixed: { name: 'Mixed', description: 'Alles gemischt, ohne Sexual' },
  categories: {
    everyday: { name: 'Alltag', description: 'Dinge, die jeder kennt' },
    animals: { name: 'Tiere', description: 'Vom Hamster bis zum Wal' },
    food: { name: 'Essen', description: 'Gerichte, Snacks und Getränke' },
    movies: { name: 'Filme & Serien', description: 'Klassiker und aktuelle Hits' },
    celebrities: { name: 'Promis', description: 'Berühmte Leute aus aller Welt' },
    music: { name: 'Musik', description: 'Bands, Stars und Songs' },
    sports: { name: 'Sport', description: 'Sportarten, Teams und Legenden' },
    places: { name: 'Orte', description: 'Städte, Länder und Sehenswürdigkeiten' },
    jobs: { name: 'Berufe', description: 'Jobs aus allen Bereichen' },
    brands: { name: 'Marken', description: 'Logos und Produkte, die jeder kennt' },
    sexual: { name: 'Sexual', description: 'Dating, Flirt und Sex' },
  },
  chooseIndividually: 'Oder einzeln wählen',
  wordCount: (count) => `${count} ${count === 1 ? 'Wort' : 'Wörter'}`,
  roundLength: 'Rundenlänge',
  secondsShort: (seconds) => `${seconds} Sek.`,
  selectAtLeastOne: 'Wähle mindestens eine Kategorie.',
  start: 'Starten',
  readyTitle: 'Bereit?',
  readyHold: 'Halte das Handy quer an die Stirn. Der Bildschirm zeigt zu den anderen.',
  readyTiltDown: 'Nach unten kippen: richtig.',
  readyTiltUp: 'Nach oben kippen: weiter.',
  readyTap: 'Tippen geht auch: rechts richtig, links weiter.',
  readyTapOnly: 'Tippe rechts für richtig und links für weiter.',
  go: 'Los',
  holdToForehead: 'An die Stirn halten',
  turnSideways: 'Dreh dein Handy quer',
  rotationLockHint: 'Die Sperre für die Bildschirmdrehung muss aus sein.',
  correct: 'Richtig',
  pass: 'Weiter',
  markCorrect: 'Richtig, nächstes Wort',
  markPass: 'Weiter, nächstes Wort',
  timeUp: 'Zeit um',
  secondsLeft: (seconds) => `Noch ${seconds} ${seconds === 1 ? 'Sekunde' : 'Sekunden'}`,
  quit: 'Beenden',
  quitTitle: 'Spiel beenden?',
  quitDescription: 'Ihr landet wieder in der Auswahl. Die Punkte dieser Runde gehen verloren.',
  keepPlaying: 'Weiterspielen',
  score: (count) => `${count} richtig`,
  outOf: (total) => `von ${total} ${total === 1 ? 'Wort' : 'Wörtern'}`,
  roundWords: 'Wörter dieser Runde',
  passed: 'weiter',
  noWords: 'In dieser Runde kam kein Wort dran.',
  nextRound: 'Nächste Runde',
  backToSetup: 'Zur Auswahl',
};

const en: Dictionary = {
  title: 'Heads Up',
  subtitle: 'Guess the word on your forehead',
  rules: 'Rules',
  rulesTitle: 'Rules',
  rulesList: [
    'One person holds the phone sideways against their forehead, screen facing the others.',
    'Everyone else describes the word without saying it.',
    'Got it? Tilt the phone down. Too hard? Tilt it up and the next word appears.',
    'Tapping works too: tap the right side for correct, the left side to pass.',
    "When time's up, you see every word of the round. Then it's the next person's turn.",
    'Rotation lock needs to be off.',
  ],
  rulesConfirm: 'Got it',
  language: 'Language',
  categoriesLabel: 'Categories',
  mixed: { name: 'Mixed', description: 'Everything mixed, except Sexual' },
  categories: {
    everyday: { name: 'Everyday', description: 'Things everyone knows' },
    animals: { name: 'Animals', description: 'From hamsters to whales' },
    food: { name: 'Food', description: 'Dishes, snacks and drinks' },
    movies: { name: 'Movies & TV', description: 'Classics and current hits' },
    celebrities: { name: 'Celebrities', description: 'Famous people from everywhere' },
    music: { name: 'Music', description: 'Bands, stars and songs' },
    sports: { name: 'Sports', description: 'Sports, teams and legends' },
    places: { name: 'Places', description: 'Cities, countries and landmarks' },
    jobs: { name: 'Jobs', description: 'Jobs from every field' },
    brands: { name: 'Brands', description: 'Logos and products everyone knows' },
    sexual: { name: 'Sexual', description: 'Dating, flirting and sex' },
  },
  chooseIndividually: 'Or pick your own',
  wordCount: (count) => `${count} ${count === 1 ? 'word' : 'words'}`,
  roundLength: 'Round length',
  secondsShort: (seconds) => `${seconds} sec`,
  selectAtLeastOne: 'Pick at least one category.',
  start: 'Start',
  readyTitle: 'Ready?',
  readyHold: 'Hold the phone sideways against your forehead, screen facing the others.',
  readyTiltDown: 'Tilt down: correct.',
  readyTiltUp: 'Tilt up: pass.',
  readyTap: 'Tapping works too: right side correct, left side pass.',
  readyTapOnly: 'Tap the right side for correct and the left side to pass.',
  go: 'Go',
  holdToForehead: 'Hold it to your forehead',
  turnSideways: 'Turn your phone sideways',
  rotationLockHint: 'Rotation lock needs to be off.',
  correct: 'Correct',
  pass: 'Pass',
  markCorrect: 'Correct, next word',
  markPass: 'Pass, next word',
  timeUp: "Time's up",
  secondsLeft: (seconds) => `${seconds} ${seconds === 1 ? 'second' : 'seconds'} left`,
  quit: 'Quit',
  quitTitle: 'Quit game?',
  quitDescription: "You'll go back to the setup. Points from this round will be lost.",
  keepPlaying: 'Keep playing',
  score: (count) => `${count} correct`,
  outOf: (total) => `out of ${total} ${total === 1 ? 'word' : 'words'}`,
  roundWords: 'Words this round',
  passed: 'passed',
  noWords: 'No words came up this round.',
  nextRound: 'Next round',
  backToSetup: 'Back to setup',
};

export const DICTIONARIES: Record<Locale, Dictionary> = { de, en };
