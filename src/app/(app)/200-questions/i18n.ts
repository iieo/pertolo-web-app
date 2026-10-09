import { CategoryKey } from './types';

export type Locale = 'de' | 'en';

export const LOCALES: Locale[] = ['de', 'en'];

type Labelled = { name: string; description: string };

export type Dictionary = {
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
  questionCount: (count: number) => string;
  questionsPerRound: (count: number) => string;
  selectAtLeastOne: string;
  start: string;
  nextQuestionHint: string;
  lastQuestionHint: string;
  quit: string;
  quitTitle: string;
  quitDescription: string;
  keepPlaying: string;
  endTitle: string;
  questionsPlayed: (count: number) => string;
  playAgain: string;
  backHome: string;
};

const de: Dictionary = {
  subtitle: 'Auf wen trifft es am meisten zu?',
  rules: 'Regeln',
  rulesTitle: 'Spielregeln',
  rulesList: [
    'Wer das Handy hat, liest die Frage still. Niemand sonst darf mitlesen.',
    'Überleg dir, auf wen in der Gruppe die Frage am besten zutrifft.',
    'Gib das Handy an diese Person.',
    'Die Person liest die Frage laut vor.',
    'Dann tippt sie für die nächste Frage, liest sie still und das Spiel geht weiter.',
  ],
  rulesConfirm: 'Verstanden',
  language: 'Sprache',
  categoriesLabel: 'Kategorien',
  mixed: { name: 'Mixed', description: 'Alles gemischt, ohne Sexual' },
  categories: {
    normal: { name: 'Normal', description: 'Harmlos, passt in jede Gruppe' },
    friendly: { name: 'Friendly', description: 'Nette Fragen und Komplimente' },
    coworkers: { name: 'Coworkers', description: 'Büro, Kollegen, Arbeitsalltag' },
    interactive: { name: 'Interactive', description: 'Die Person muss etwas vormachen oder tun' },
    crazy: { name: 'Crazy', description: 'Absurd und völlig verrückt' },
    party: { name: 'Party', description: 'Feiern, Alkohol und Ausgehen' },
    roast: { name: 'Roast', description: 'Frech, Macken und Angewohnheiten' },
    exposed: { name: 'Exposed', description: 'Peinliche Geschichten und Geständnisse' },
    future: { name: 'Zukunft', description: 'Wer heiratet zuerst, wird reich oder berühmt?' },
    deep: { name: 'Deep', description: 'Persönlich und nachdenklich' },
    sexual: { name: 'Sexual', description: 'Dating, Flirt und Sex' },
  },
  chooseIndividually: 'Oder einzeln wählen',
  questionCount: (count) => `${count} ${count === 1 ? 'Frage' : 'Fragen'}`,
  questionsPerRound: (count) => `${count} ${count === 1 ? 'Frage' : 'Fragen'} pro Runde`,
  selectAtLeastOne: 'Wähle mindestens eine Kategorie.',
  start: 'Starten',
  nextQuestionHint: 'Tippen für die nächste Frage',
  lastQuestionHint: 'Tippen zum Beenden',
  quit: 'Beenden',
  quitTitle: 'Spiel beenden?',
  quitDescription: 'Ihr landet wieder in der Auswahl. Der Fortschritt dieser Runde geht verloren.',
  keepPlaying: 'Weiterspielen',
  endTitle: 'Alle Fragen durch.',
  questionsPlayed: (count) => `${count} ${count === 1 ? 'Frage' : 'Fragen'} gespielt`,
  playAgain: 'Nochmal',
  backHome: 'Zur Startseite',
};

const en: Dictionary = {
  subtitle: 'Who does it fit best?',
  rules: 'Rules',
  rulesTitle: 'Rules',
  rulesList: [
    'Whoever holds the phone reads the question silently. Nobody else gets to look.',
    'Think about who in the group it fits best.',
    'Hand the phone to that person.',
    'They read the question out loud.',
    'Then they tap for the next question, read it silently and the game goes on.',
  ],
  rulesConfirm: 'Got it',
  language: 'Language',
  categoriesLabel: 'Categories',
  mixed: { name: 'Mixed', description: 'Everything mixed, except Sexual' },
  categories: {
    normal: { name: 'Normal', description: 'Harmless, works with any group' },
    friendly: { name: 'Friendly', description: 'Kind questions and compliments' },
    coworkers: { name: 'Coworkers', description: 'Office, colleagues, work life' },
    interactive: { name: 'Interactive', description: 'The person has to act something out' },
    crazy: { name: 'Crazy', description: 'Absurd and completely wild' },
    party: { name: 'Party', description: 'Partying, drinking and going out' },
    roast: { name: 'Roast', description: 'Cheeky, quirks and habits' },
    exposed: { name: 'Exposed', description: 'Embarrassing stories and confessions' },
    future: { name: 'Future', description: 'Who marries first, gets rich or famous?' },
    deep: { name: 'Deep', description: 'Personal and thoughtful' },
    sexual: { name: 'Sexual', description: 'Dating, flirting and sex' },
  },
  chooseIndividually: 'Or pick your own',
  questionCount: (count) => `${count} ${count === 1 ? 'question' : 'questions'}`,
  questionsPerRound: (count) => `${count} ${count === 1 ? 'question' : 'questions'} per round`,
  selectAtLeastOne: 'Pick at least one category.',
  start: 'Start',
  nextQuestionHint: 'Tap for the next question',
  lastQuestionHint: 'Tap to finish',
  quit: 'Quit',
  quitTitle: 'Quit game?',
  quitDescription: "You'll go back to the setup. Progress from this round will be lost.",
  keepPlaying: 'Keep playing',
  endTitle: 'All questions done.',
  questionsPlayed: (count) => `${count} ${count === 1 ? 'question' : 'questions'} played`,
  playAgain: 'Play again',
  backHome: 'Back to home',
};

export const DICTIONARIES: Record<Locale, Dictionary> = { de, en };
