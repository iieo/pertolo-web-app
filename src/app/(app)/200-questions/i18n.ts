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
  drinkTitle: string;
  drinkDescription: string;
  readPrompt: string;
  readHint: string;
  handoverText: string;
  handoverHint: string;
  revealPrompt: string;
  revealDrink: string;
  revealHintNext: string;
  revealHintLast: string;
  quit: string;
  quitTitle: string;
  quitDescription: string;
  keepPlaying: string;
  fullscreenEnter: string;
  fullscreenExit: string;
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
    'Tippe auf den Bildschirm und gib das Handy verdeckt an diese Person.',
    'Die Person tippt, deckt auf und liest die Frage laut vor. Mit Strafschluck trinkt sie einen Schluck.',
    'Danach liest sie still die nächste Frage und das Spiel geht weiter.',
  ],
  rulesConfirm: 'Verstanden',
  language: 'Sprache',
  categoriesLabel: 'Kategorien',
  mixed: { name: 'Mixed', description: 'Alles gemischt, ohne 18+' },
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
    sexual: { name: 'Sexual 18+', description: 'Dating, Flirt und Sex' },
  },
  chooseIndividually: 'Oder einzeln wählen',
  questionCount: (count) => `${count} ${count === 1 ? 'Frage' : 'Fragen'}`,
  questionsPerRound: (count) => `${count} ${count === 1 ? 'Frage' : 'Fragen'} pro Runde`,
  selectAtLeastOne: 'Wähle mindestens eine Kategorie.',
  start: 'Starten',
  drinkTitle: 'Strafschluck',
  drinkDescription: 'Wer die Frage bekommt, trinkt einen Schluck.',
  readPrompt: 'Lies still. Auf wen trifft das am meisten zu?',
  readHint: 'Tippen zum Weitergeben',
  handoverText: 'Gib das Handy verdeckt an die Person, auf die die Frage zutrifft.',
  handoverHint: 'Tippen zum Aufdecken',
  revealPrompt: 'Lies die Frage laut vor.',
  revealDrink: 'Trink einen Schluck.',
  revealHintNext: 'Tippen für die nächste Frage',
  revealHintLast: 'Tippen zum Beenden',
  quit: 'Beenden',
  quitTitle: 'Spiel beenden?',
  quitDescription: 'Ihr landet wieder in der Auswahl. Der Fortschritt dieser Runde geht verloren.',
  keepPlaying: 'Weiterspielen',
  fullscreenEnter: 'Vollbild',
  fullscreenExit: 'Vollbild verlassen',
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
    'Tap the screen and hand the phone face down to that person.',
    'They tap to reveal and read the question out loud. With the drink option on, they take a sip.',
    'Then they silently read the next question and the game goes on.',
  ],
  rulesConfirm: 'Got it',
  language: 'Language',
  categoriesLabel: 'Categories',
  mixed: { name: 'Mixed', description: 'A bit of everything, no 18+' },
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
    sexual: { name: 'Sexual 18+', description: 'Dating, flirting and sex' },
  },
  chooseIndividually: 'Or pick your own',
  questionCount: (count) => `${count} ${count === 1 ? 'question' : 'questions'}`,
  questionsPerRound: (count) => `${count} ${count === 1 ? 'question' : 'questions'} per round`,
  selectAtLeastOne: 'Pick at least one category.',
  start: 'Start',
  drinkTitle: 'Drinking',
  drinkDescription: 'Whoever gets the question takes a sip.',
  readPrompt: 'Read it silently. Who does it fit best?',
  readHint: 'Tap to pass on',
  handoverText: 'Hand the phone face down to the person it fits best.',
  handoverHint: 'Tap to reveal',
  revealPrompt: 'Read the question out loud.',
  revealDrink: 'Take a sip.',
  revealHintNext: 'Tap for the next question',
  revealHintLast: 'Tap to finish',
  quit: 'Quit',
  quitTitle: 'Quit game?',
  quitDescription: "You'll go back to the setup. Progress from this round will be lost.",
  keepPlaying: 'Keep playing',
  fullscreenEnter: 'Fullscreen',
  fullscreenExit: 'Exit fullscreen',
  endTitle: 'All questions done.',
  questionsPlayed: (count) => `${count} ${count === 1 ? 'question' : 'questions'} played`,
  playAgain: 'Play again',
  backHome: 'Back to home',
};

export const DICTIONARIES: Record<Locale, Dictionary> = { de, en };
