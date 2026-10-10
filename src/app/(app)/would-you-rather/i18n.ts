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
  questionCount: (count: number) => string;
  questionsPerRound: (count: number) => string;
  selectAtLeastOne: string;
  start: string;
  or: string;
  choose: (option: string) => string;
  votes: (formatted: string, count: number) => string;
  resultsAnnouncement: (percentA: number, percentB: number) => string;
  yourChoice: string;
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
  title: 'Would You Rather',
  subtitle: 'Was würdest du eher wählen?',
  rules: 'Regeln',
  rulesTitle: 'Spielregeln',
  rulesList: [
    'Wer das Handy hat, liest beide Möglichkeiten laut vor.',
    'Entscheidet euch für eine Seite und erklärt, warum.',
    'Tippt auf die Möglichkeit, die die Person mit dem Handy wählt.',
    'Danach seht ihr, wie alle anderen bisher abgestimmt haben.',
    'Tippt nochmal für die nächste Frage und gebt das Handy weiter.',
  ],
  rulesConfirm: 'Verstanden',
  language: 'Sprache',
  categoriesLabel: 'Kategorien',
  mixed: { name: 'Mixed', description: 'Alles gemischt, ohne Sexual' },
  categories: {
    normal: { name: 'Normal', description: 'Alltägliche Entscheidungen für jede Runde' },
    funny: { name: 'Funny', description: 'Albern und zum Lachen' },
    gross: { name: 'Eklig', description: 'Nichts für schwache Mägen' },
    deep: { name: 'Deep', description: 'Persönlich und nachdenklich' },
    crazy: { name: 'Crazy', description: 'Absurd und völlig verrückt' },
    party: { name: 'Party', description: 'Feiern, Alkohol und Ausgehen' },
    coworkers: { name: 'Coworkers', description: 'Büro, Kollegen, Arbeitsalltag' },
    dilemma: { name: 'Dilemma', description: 'Schwere Entscheidungen ohne richtige Antwort' },
    sexual: { name: 'Sexual', description: 'Dating, Flirt und Sex' },
  },
  chooseIndividually: 'Oder einzeln wählen',
  questionCount: (count) => `${count} ${count === 1 ? 'Frage' : 'Fragen'}`,
  questionsPerRound: (count) => `${count} ${count === 1 ? 'Frage' : 'Fragen'} pro Runde`,
  selectAtLeastOne: 'Wähle mindestens eine Kategorie.',
  start: 'Starten',
  or: 'oder',
  choose: (option) => `Wählen: ${option}`,
  votes: (formatted, count) => `${formatted} ${count === 1 ? 'Stimme' : 'Stimmen'}`,
  resultsAnnouncement: (percentA, percentB) =>
    `Oben ${percentA} Prozent, unten ${percentB} Prozent.`,
  yourChoice: 'Deine Wahl',
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
  title: 'Would You Rather',
  subtitle: 'Which one would you pick?',
  rules: 'Rules',
  rulesTitle: 'Rules',
  rulesList: [
    'Whoever holds the phone reads both options out loud.',
    'Everyone picks a side and explains why.',
    'Tap the option the person holding the phone picks.',
    'Then you see how everyone else has voted so far.',
    'Tap again for the next question and pass the phone on.',
  ],
  rulesConfirm: 'Got it',
  language: 'Language',
  categoriesLabel: 'Categories',
  mixed: { name: 'Mixed', description: 'Everything mixed, except Sexual' },
  categories: {
    normal: { name: 'Normal', description: 'Everyday choices for any group' },
    funny: { name: 'Funny', description: 'Silly and made for laughs' },
    gross: { name: 'Gross', description: 'Not for weak stomachs' },
    deep: { name: 'Deep', description: 'Personal and thoughtful' },
    crazy: { name: 'Crazy', description: 'Absurd and completely wild' },
    party: { name: 'Party', description: 'Partying, drinking and going out' },
    coworkers: { name: 'Coworkers', description: 'Office, colleagues, work life' },
    dilemma: { name: 'Dilemma', description: 'Hard choices with no right answer' },
    sexual: { name: 'Sexual', description: 'Dating, flirting and sex' },
  },
  chooseIndividually: 'Or pick your own',
  questionCount: (count) => `${count} ${count === 1 ? 'question' : 'questions'}`,
  questionsPerRound: (count) => `${count} ${count === 1 ? 'question' : 'questions'} per round`,
  selectAtLeastOne: 'Pick at least one category.',
  start: 'Start',
  or: 'or',
  choose: (option) => `Choose: ${option}`,
  votes: (formatted, count) => `${formatted} ${count === 1 ? 'vote' : 'votes'}`,
  resultsAnnouncement: (percentA, percentB) =>
    `Top ${percentA} percent, bottom ${percentB} percent.`,
  yourChoice: 'Your choice',
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
