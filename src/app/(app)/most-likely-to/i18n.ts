import type { Locale } from '@/components/game/locale';
import { CategoryKey } from './types';

type Labelled = { name: string; description: string };

export type Dictionary = {
  title: string;
  subtitle: string;
  prefix: string;
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
  title: 'Wer würde am ehesten',
  subtitle: 'Zählt bis drei und zeigt auf jemanden.',
  prefix: 'Wer würde am ehesten',
  rules: 'Regeln',
  rulesTitle: 'Spielregeln',
  rulesList: [
    'Eine Person liest die Frage laut vor.',
    'Ihr zählt gemeinsam bis drei. Bei drei zeigen alle gleichzeitig auf die Person, die es am ehesten tun würde.',
    'Wer die meisten Finger abbekommt, trinkt. Bei Gleichstand trinken alle mit den meisten Fingern.',
    'Tippt irgendwo auf den Bildschirm für die nächste Frage.',
  ],
  rulesConfirm: 'Verstanden',
  language: 'Sprache',
  categoriesLabel: 'Kategorien',
  mixed: { name: 'Mixed', description: 'Alles gemischt, ohne Sexual' },
  categories: {
    normal: { name: 'Normal', description: 'Harmlose Fragen für jede Runde' },
    party: { name: 'Party', description: 'Feiern, Alkohol und lange Nächte' },
    friends: { name: 'Freunde', description: 'Was ihr übereinander schon wisst' },
    work: { name: 'Arbeit', description: 'Job, Büro und Kollegen' },
    love: { name: 'Liebe', description: 'Dates, Beziehungen und Gefühle' },
    crazy: { name: 'Verrückt', description: 'Absurde Ideen und wilde Aktionen' },
    future: { name: 'Zukunft', description: 'Wer was in zehn Jahren macht' },
    roast: { name: 'Roast', description: 'Ehrlich und ein bisschen gemein' },
    sexual: { name: 'Sexual', description: 'Flirt, Bett und peinliche Details' },
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
  title: 'Most Likely To',
  subtitle: 'Count to three and point at someone.',
  prefix: 'Who is most likely to',
  rules: 'Rules',
  rulesTitle: 'Rules',
  rulesList: [
    'One person reads the question out loud.',
    'Count to three together. On three, everyone points at the person most likely to do it.',
    'Whoever gets the most fingers drinks. On a tie, everyone with the most fingers drinks.',
    'Tap anywhere on the screen for the next question.',
  ],
  rulesConfirm: 'Got it',
  language: 'Language',
  categoriesLabel: 'Categories',
  mixed: { name: 'Mixed', description: 'Everything mixed, except Sexual' },
  categories: {
    normal: { name: 'Normal', description: 'Harmless questions for any group' },
    party: { name: 'Party', description: 'Partying, drinking and long nights' },
    friends: { name: 'Friends', description: 'What you already know about each other' },
    work: { name: 'Work', description: 'Jobs, office and colleagues' },
    love: { name: 'Love', description: 'Dates, relationships and feelings' },
    crazy: { name: 'Crazy', description: 'Absurd ideas and wild stunts' },
    future: { name: 'Future', description: 'Who does what in ten years' },
    roast: { name: 'Roast', description: 'Honest and a little mean' },
    sexual: { name: 'Sexual', description: 'Flirting, bedroom and awkward details' },
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
