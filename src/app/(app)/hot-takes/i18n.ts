import type { Locale } from '@/components/game/locale';
import { CategoryKey, Choice } from './types';

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
  takeCount: (count: number) => string;
  takesPerRound: (count: number) => string;
  selectAtLeastOne: string;
  start: string;
  answers: Record<Choice, string>;
  answersLabel: string;
  shareLabel: Record<Choice, string>;
  resultBarLabel: (agree: number, disagree: number) => string;
  votes: (formatted: string, count: number) => string;
  resultsAnnouncement: (agree: number, disagree: number) => string;
  yourChoice: string;
  nextTakeHint: string;
  lastTakeHint: string;
  quit: string;
  quitTitle: string;
  quitDescription: string;
  keepPlaying: string;
  endTitle: string;
  takesPlayed: (count: number) => string;
  playAgain: string;
  backHome: string;
};

const de: Dictionary = {
  title: 'Hot Takes',
  subtitle: 'Stimmst du zu oder nicht?',
  rules: 'Regeln',
  rulesTitle: 'Spielregeln',
  rulesList: [
    'Wer das Handy hat, liest den Hot Take laut vor.',
    'Auf drei zeigen alle gleichzeitig: Daumen hoch heißt Zustimmung, Daumen runter heißt Ablehnung.',
    'Die Minderheit trinkt oder muss ihre Meinung verteidigen. Bei Gleichstand trinken alle.',
    'Tippt, wie die Person mit dem Handy abstimmt. Danach seht ihr, wie alle anderen bisher abgestimmt haben.',
    'Tippt nochmal für den nächsten Hot Take und gebt das Handy weiter.',
  ],
  rulesConfirm: 'Verstanden',
  language: 'Sprache',
  categoriesLabel: 'Kategorien',
  mixed: { name: 'Mixed', description: 'Alles gemischt, ohne Sexual' },
  categories: {
    normal: { name: 'Normal', description: 'Alltägliche Meinungen für jede Runde' },
    food: { name: 'Essen', description: 'Gerichte, Geschmack und Küche' },
    love: { name: 'Liebe', description: 'Beziehungen, Dating und Gefühle' },
    work: { name: 'Arbeit', description: 'Job, Büro und Kollegen' },
    popculture: { name: 'Popkultur', description: 'Filme, Serien, Musik und Stars' },
    lifestyle: { name: 'Lifestyle', description: 'Alltag, Wohnen und Gewohnheiten' },
    party: { name: 'Party', description: 'Feiern, Alkohol und Ausgehen' },
    unpopular: { name: 'Unpopular', description: 'Meinungen, die kaum jemand teilt' },
    sexual: { name: 'Sexual', description: 'Dating, Flirt und Sex' },
  },
  chooseIndividually: 'Oder einzeln wählen',
  takeCount: (count) => `${count} Hot ${count === 1 ? 'Take' : 'Takes'}`,
  takesPerRound: (count) => `${count} Hot ${count === 1 ? 'Take' : 'Takes'} pro Runde`,
  selectAtLeastOne: 'Wähle mindestens eine Kategorie.',
  start: 'Starten',
  answers: { agree: 'Stimme zu', disagree: 'Stimme nicht zu' },
  answersLabel: 'Deine Antwort',
  shareLabel: { agree: 'stimmen zu', disagree: 'stimmen nicht zu' },
  resultBarLabel: (agree, disagree) =>
    `${agree} Prozent stimmen zu, ${disagree} Prozent stimmen nicht zu`,
  votes: (formatted, count) => `${formatted} ${count === 1 ? 'Stimme' : 'Stimmen'}`,
  resultsAnnouncement: (agree, disagree) =>
    `${agree} Prozent stimmen zu, ${disagree} Prozent stimmen nicht zu.`,
  yourChoice: 'Deine Wahl',
  nextTakeHint: 'Tippen für den nächsten Hot Take',
  lastTakeHint: 'Tippen zum Beenden',
  quit: 'Beenden',
  quitTitle: 'Spiel beenden?',
  quitDescription: 'Ihr landet wieder in der Auswahl. Der Fortschritt dieser Runde geht verloren.',
  keepPlaying: 'Weiterspielen',
  endTitle: 'Alle Hot Takes durch.',
  takesPlayed: (count) => `${count} Hot ${count === 1 ? 'Take' : 'Takes'} gespielt`,
  playAgain: 'Nochmal',
  backHome: 'Zur Startseite',
};

const en: Dictionary = {
  title: 'Hot Takes',
  subtitle: 'Agree or disagree?',
  rules: 'Rules',
  rulesTitle: 'Rules',
  rulesList: [
    'Whoever holds the phone reads the hot take out loud.',
    'On three, everyone shows their vote at once: thumbs up means agree, thumbs down means disagree.',
    'The minority drinks or has to defend their opinion. On a tie, everyone drinks.',
    'Tap how the person holding the phone votes. Then you see how everyone else has voted so far.',
    'Tap again for the next hot take and pass the phone on.',
  ],
  rulesConfirm: 'Got it',
  language: 'Language',
  categoriesLabel: 'Categories',
  mixed: { name: 'Mixed', description: 'Everything mixed, except Sexual' },
  categories: {
    normal: { name: 'Normal', description: 'Everyday opinions for any group' },
    food: { name: 'Food', description: 'Dishes, taste and cooking' },
    love: { name: 'Love', description: 'Relationships, dating and feelings' },
    work: { name: 'Work', description: 'Jobs, office and colleagues' },
    popculture: { name: 'Pop Culture', description: 'Movies, shows, music and stars' },
    lifestyle: { name: 'Lifestyle', description: 'Daily life, home and habits' },
    party: { name: 'Party', description: 'Partying, drinking and going out' },
    unpopular: { name: 'Unpopular', description: 'Opinions hardly anyone shares' },
    sexual: { name: 'Sexual', description: 'Dating, flirting and sex' },
  },
  chooseIndividually: 'Or pick your own',
  takeCount: (count) => `${count} hot ${count === 1 ? 'take' : 'takes'}`,
  takesPerRound: (count) => `${count} hot ${count === 1 ? 'take' : 'takes'} per round`,
  selectAtLeastOne: 'Pick at least one category.',
  start: 'Start',
  answers: { agree: 'Agree', disagree: 'Disagree' },
  answersLabel: 'Your answer',
  shareLabel: { agree: 'agree', disagree: 'disagree' },
  resultBarLabel: (agree, disagree) => `${agree} percent agree, ${disagree} percent disagree`,
  votes: (formatted, count) => `${formatted} ${count === 1 ? 'vote' : 'votes'}`,
  resultsAnnouncement: (agree, disagree) => `${agree} percent agree, ${disagree} percent disagree.`,
  yourChoice: 'Your choice',
  nextTakeHint: 'Tap for the next hot take',
  lastTakeHint: 'Tap to finish',
  quit: 'Quit',
  quitTitle: 'Quit game?',
  quitDescription: "You'll go back to the setup. Progress from this round will be lost.",
  keepPlaying: 'Keep playing',
  endTitle: 'All hot takes done.',
  takesPlayed: (count) => `${count} hot ${count === 1 ? 'take' : 'takes'} played`,
  playAgain: 'Play again',
  backHome: 'Back to home',
};

export const DICTIONARIES: Record<Locale, Dictionary> = { de, en };
