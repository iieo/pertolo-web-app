import type { Locale } from '@/components/game/locale';

import { CategoryKey, LoadError, StartError } from './types';

type Labelled = { name: string; description: string };

export type Dictionary = {
  title: string;
  playersSubtitle: string;
  withPlayers: (names: string) => string;
  rules: string;
  rulesTitle: string;
  rulesList: string[];
  rulesConfirm: string;
  language: string;
  nameLabel: string;
  namePlaceholder: string;
  addPlayer: string;
  emptyName: string;
  duplicateName: (name: string) => string;
  playersLabel: string;
  noPlayers: string;
  removePlayer: (name: string) => string;
  oneMorePlayer: string;
  minPlayers: (count: number) => string;
  playerCount: (count: number) => string;
  next: string;
  editPlayers: string;
  categoriesLabel: string;
  mixed: Labelled;
  categories: Record<CategoryKey, Labelled>;
  chooseIndividually: string;
  taskCount: (count: number) => string;
  tasksPerRound: (count: number) => string;
  selectAtLeastOne: string;
  start: string;
  loading: string;
  loadErrors: Record<LoadError, string>;
  startErrors: Record<StartError, string>;
  nextTaskHint: string;
  lastTaskHint: string;
  quit: string;
  quitTitle: string;
  quitDescription: string;
  keepPlaying: string;
  cards: {
    versus: string;
    vs: string;
    vote: string;
    voteInstruction: string;
    never: string;
    group: string;
    groupHero: string;
    question: string;
    rule: string;
    ruleEnd: string;
    curse: string;
    curseEnd: string;
    durationUnit: (rounds: number) => string;
    durationLabel: string;
    endedLabel: string;
    category: string;
    timer: string;
    seconds: (seconds: number) => string;
    timeUp: string;
    roulette: string;
    rouletteSpinning: string;
    rouletteResult: (name: string) => string;
    double: string;
    doubleHero: string;
  };
  endTitle: string;
  tasksPlayed: (count: number) => string;
  playAgain: string;
  backHome: string;
};

const de: Dictionary = {
  title: 'Drink',
  playersSubtitle: 'Wer spielt mit?',
  withPlayers: (names) => `Mit ${names}`,
  rules: 'Regeln',
  rulesTitle: 'Spielregeln',
  rulesList: [
    'Tragt alle ein, die mitspielen, und wählt eine oder mehrere Kategorien.',
    'Lest jede Aufgabe laut vor und macht, was dort steht.',
    'Schlucke verteilen heißt: Du bestimmst, wer trinkt. Du kannst sie auch auf mehrere aufteilen.',
    'Regeln und Flüche gelten für so viele Karten, wie darauf steht. Danach zeigt das Spiel an, dass sie vorbei sind.',
    'Tippt irgendwo auf den Bildschirm für die nächste Aufgabe.',
    'Niemand muss trinken. Wer nicht mehr will, nimmt Wasser.',
  ],
  rulesConfirm: 'Verstanden',
  language: 'Sprache',
  nameLabel: 'Name',
  namePlaceholder: 'Name',
  addPlayer: 'Hinzufügen',
  emptyName: 'Bitte gib einen Namen ein.',
  duplicateName: (name) => `${name} ist schon dabei.`,
  playersLabel: 'Spieler',
  noPlayers: 'Noch keine Spieler.',
  removePlayer: (name) => `${name} entfernen`,
  oneMorePlayer: 'Noch ein Spieler fehlt.',
  minPlayers: (count) => `Mindestens ${count} Spieler`,
  playerCount: (count) => `${count} Spieler`,
  next: 'Weiter',
  editPlayers: 'Spieler ändern',
  categoriesLabel: 'Kategorien',
  mixed: { name: 'Gemischt', description: 'Alles gemischt, ohne Sexual' },
  categories: {
    Normal: { name: 'Normal', description: 'Der Klassiker für jede Runde' },
    Party: { name: 'Party', description: 'Laut, schnell und mit der ganzen Runde' },
    Duell: { name: 'Duell', description: 'Spieler treten gegeneinander an' },
    Wahrheit: { name: 'Wahrheit', description: 'Geständnisse und unangenehme Fragen' },
    Chaos: { name: 'Chaos', description: 'Regeln, Rollen und Flüche, die hängen bleiben' },
    Wild: { name: 'Wild', description: 'Frecher, mutiger, mehr Schlucke' },
    Sexual: { name: 'Sexual', description: 'Dating, Flirt und Sex' },
  },
  chooseIndividually: 'Oder einzeln wählen',
  taskCount: (count) => `${count} ${count === 1 ? 'Aufgabe' : 'Aufgaben'}`,
  tasksPerRound: (count) => `${count} ${count === 1 ? 'Aufgabe' : 'Aufgaben'} pro Runde`,
  selectAtLeastOne: 'Wähle mindestens eine Kategorie.',
  start: 'Starten',
  loading: 'Wird geladen …',
  loadErrors: {
    failed: 'Die Kategorien konnten nicht geladen werden.',
    empty: 'Keine Kategorien gefunden. Bitte zuerst das Seed-Script ausführen.',
  },
  startErrors: {
    loadFailed: 'Die Aufgaben konnten nicht geladen werden.',
    offline: 'Keine Verbindung. Bitte versuche es noch einmal.',
    noTasks: 'Für eure Runde gibt es hier keine passenden Aufgaben.',
  },
  nextTaskHint: 'Tippen für die nächste Aufgabe',
  lastTaskHint: 'Tippen zum Beenden',
  quit: 'Beenden',
  quitTitle: 'Spiel beenden?',
  quitDescription: 'Ihr landet wieder in der Auswahl. Der Fortschritt dieser Runde geht verloren.',
  keepPlaying: 'Weiterspielen',
  cards: {
    versus: 'Duell',
    vs: 'vs',
    vote: 'Abstimmung',
    voteInstruction: 'Auf drei stimmen alle gleichzeitig ab.',
    never: 'Ich hab noch nie',
    group: 'Alle',
    groupHero: 'Alle',
    question: 'Frage an',
    rule: 'Neue Regel',
    ruleEnd: 'Regel vorbei',
    curse: 'Fluch',
    curseEnd: 'Fluch aufgehoben',
    durationUnit: (rounds) => (rounds === 1 ? 'Karte' : 'Karten'),
    durationLabel: 'Gilt für',
    endedLabel: 'Ab jetzt nicht mehr',
    category: 'Kategorie',
    timer: 'Auf Zeit',
    seconds: (seconds) => `${seconds} ${seconds === 1 ? 'Sekunde' : 'Sekunden'}`,
    timeUp: 'Zeit ist um',
    roulette: 'Roulette',
    rouletteSpinning: 'Das Los wird gezogen',
    rouletteResult: (name) => `Das Los fällt auf ${name}.`,
    double: 'Doppelt oder nichts',
    doubleHero: '×2 / 0',
  },
  endTitle: 'Alle Aufgaben durch.',
  tasksPlayed: (count) => `${count} ${count === 1 ? 'Aufgabe' : 'Aufgaben'} gespielt`,
  playAgain: 'Nochmal',
  backHome: 'Zur Startseite',
};

const en: Dictionary = {
  title: 'Drink',
  playersSubtitle: "Who's playing?",
  withPlayers: (names) => `With ${names}`,
  rules: 'Rules',
  rulesTitle: 'Rules',
  rulesList: [
    'Add everyone who is playing and pick one or more categories.',
    'Read each task out loud and do what it says.',
    'Handing out sips means you decide who drinks. You can split them between several people.',
    'Rules and curses last for as many cards as they say. The game tells you when they are over.',
    'Tap anywhere on the screen for the next task.',
    'Nobody has to drink. If you have had enough, switch to water.',
  ],
  rulesConfirm: 'Got it',
  language: 'Language',
  nameLabel: 'Name',
  namePlaceholder: 'Name',
  addPlayer: 'Add',
  emptyName: 'Please enter a name.',
  duplicateName: (name) => `${name} is already in.`,
  playersLabel: 'Players',
  noPlayers: 'No players yet.',
  removePlayer: (name) => `Remove ${name}`,
  oneMorePlayer: 'One more player needed.',
  minPlayers: (count) => `At least ${count} players`,
  playerCount: (count) => `${count} ${count === 1 ? 'player' : 'players'}`,
  next: 'Next',
  editPlayers: 'Edit players',
  categoriesLabel: 'Categories',
  mixed: { name: 'Mixed', description: 'Everything mixed, except Sexual' },
  categories: {
    Normal: { name: 'Normal', description: 'The classic for any group' },
    Party: { name: 'Party', description: 'Loud, fast and with the whole group' },
    Duell: { name: 'Duel', description: 'Players go head to head' },
    Wahrheit: { name: 'Truth', description: 'Confessions and awkward questions' },
    Chaos: { name: 'Chaos', description: 'Rules, roles and curses that stick' },
    Wild: { name: 'Wild', description: 'Bolder, cheekier, more sips' },
    Sexual: { name: 'Sexual', description: 'Dating, flirting and sex' },
  },
  chooseIndividually: 'Or pick your own',
  taskCount: (count) => `${count} ${count === 1 ? 'task' : 'tasks'}`,
  tasksPerRound: (count) => `${count} ${count === 1 ? 'task' : 'tasks'} per round`,
  selectAtLeastOne: 'Pick at least one category.',
  start: 'Start',
  loading: 'Loading …',
  loadErrors: {
    failed: 'The categories could not be loaded.',
    empty: 'No categories found. Run the seed script first.',
  },
  startErrors: {
    loadFailed: 'The tasks could not be loaded.',
    offline: 'No connection. Please try again.',
    noTasks: 'There are no tasks here that fit your group.',
  },
  nextTaskHint: 'Tap for the next task',
  lastTaskHint: 'Tap to finish',
  quit: 'Quit',
  quitTitle: 'Quit game?',
  quitDescription: "You'll go back to the setup. Progress from this round will be lost.",
  keepPlaying: 'Keep playing',
  cards: {
    versus: 'Duel',
    vs: 'vs',
    vote: 'Vote',
    voteInstruction: 'On three, everyone votes at once.',
    never: 'Never have I ever',
    group: 'Everyone',
    groupHero: 'All',
    question: 'Question for',
    rule: 'New rule',
    ruleEnd: 'Rule over',
    curse: 'Curse',
    curseEnd: 'Curse lifted',
    durationUnit: (rounds) => (rounds === 1 ? 'card' : 'cards'),
    durationLabel: 'Lasts',
    endedLabel: 'No longer applies',
    category: 'Category',
    timer: 'Against the clock',
    seconds: (seconds) => `${seconds} ${seconds === 1 ? 'second' : 'seconds'}`,
    timeUp: "Time's up",
    roulette: 'Roulette',
    rouletteSpinning: 'Picking a player',
    rouletteResult: (name) => `It's ${name}.`,
    double: 'Double or nothing',
    doubleHero: '×2 / 0',
  },
  endTitle: 'All tasks done.',
  tasksPlayed: (count) => `${count} ${count === 1 ? 'task' : 'tasks'} played`,
  playAgain: 'Play again',
  backHome: 'Back to home',
};

export const DICTIONARIES: Record<Locale, Dictionary> = { de, en };
