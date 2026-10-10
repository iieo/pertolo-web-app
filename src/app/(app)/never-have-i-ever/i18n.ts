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
  statementCount: (count: number) => string;
  statementsPerRound: (count: number) => string;
  selectAtLeastOne: string;
  start: string;
  nextStatementHint: string;
  lastStatementHint: string;
  quit: string;
  quitTitle: string;
  quitDescription: string;
  keepPlaying: string;
  endTitle: string;
  statementsPlayed: (count: number) => string;
  playAgain: string;
  backHome: string;
};

const de: Dictionary = {
  title: 'Ich hab noch nie',
  subtitle: 'Wer es schon getan hat, trinkt.',
  rules: 'Regeln',
  rulesTitle: 'Spielregeln',
  rulesList: [
    'Alle halten zu Beginn fünf Finger hoch.',
    'Eine Person liest die Aussage laut vor.',
    'Wer das schon mal gemacht hat, trinkt oder nimmt einen Finger runter.',
    'Wer zuerst alle Finger unten hat, verliert.',
    'Tippt irgendwo für die nächste Aussage.',
  ],
  rulesConfirm: 'Verstanden',
  language: 'Sprache',
  categoriesLabel: 'Kategorien',
  mixed: { name: 'Mixed', description: 'Alles gemischt, ohne Sexual' },
  categories: {
    normal: { name: 'Normal', description: 'Harmlos, passt in jede Gruppe' },
    party: { name: 'Party', description: 'Feiern, Alkohol und Ausgehen' },
    travel: { name: 'Reisen', description: 'Urlaub, Flüge und fremde Orte' },
    love: { name: 'Liebe', description: 'Beziehungen, Dates und Gefühle' },
    food: { name: 'Essen', description: 'Gerichte, Küche und Restaurants' },
    embarrassing: { name: 'Peinlich', description: 'Momente, über die keiner gern spricht' },
    school: { name: 'Schule', description: 'Unterricht, Lehrer und Klassenfahrten' },
    crazy: { name: 'Crazy', description: 'Wilde und absurde Aktionen' },
    deep: { name: 'Deep', description: 'Persönlich und ehrlich' },
    sexual: { name: 'Sexual', description: 'Flirt, Dating und Sex' },
  },
  chooseIndividually: 'Oder einzeln wählen',
  statementCount: (count) => `${count} ${count === 1 ? 'Aussage' : 'Aussagen'}`,
  statementsPerRound: (count) => `${count} ${count === 1 ? 'Aussage' : 'Aussagen'} pro Runde`,
  selectAtLeastOne: 'Wähle mindestens eine Kategorie.',
  start: 'Starten',
  nextStatementHint: 'Tippen für die nächste Aussage',
  lastStatementHint: 'Tippen zum Beenden',
  quit: 'Beenden',
  quitTitle: 'Spiel beenden?',
  quitDescription: 'Ihr landet wieder in der Auswahl. Der Fortschritt dieser Runde geht verloren.',
  keepPlaying: 'Weiterspielen',
  endTitle: 'Alle Aussagen durch.',
  statementsPlayed: (count) => `${count} ${count === 1 ? 'Aussage' : 'Aussagen'} gespielt`,
  playAgain: 'Nochmal',
  backHome: 'Zur Startseite',
};

const en: Dictionary = {
  title: 'Never Have I Ever',
  subtitle: 'If you have done it, you drink.',
  rules: 'Rules',
  rulesTitle: 'Rules',
  rulesList: [
    'Everyone starts by holding up five fingers.',
    'One person reads the statement out loud.',
    'Whoever has done it drinks or puts a finger down.',
    'Whoever has all fingers down first loses.',
    'Tap anywhere for the next statement.',
  ],
  rulesConfirm: 'Got it',
  language: 'Language',
  categoriesLabel: 'Categories',
  mixed: { name: 'Mixed', description: 'Everything mixed, except Sexual' },
  categories: {
    normal: { name: 'Normal', description: 'Harmless, works with any group' },
    party: { name: 'Party', description: 'Partying, drinking and going out' },
    travel: { name: 'Travel', description: 'Holidays, flights and faraway places' },
    love: { name: 'Love', description: 'Relationships, dates and feelings' },
    food: { name: 'Food', description: 'Dishes, cooking and restaurants' },
    embarrassing: { name: 'Embarrassing', description: 'Moments nobody likes to talk about' },
    school: { name: 'School', description: 'Classes, teachers and school trips' },
    crazy: { name: 'Crazy', description: 'Wild and absurd stunts' },
    deep: { name: 'Deep', description: 'Personal and honest' },
    sexual: { name: 'Sexual', description: 'Flirting, dating and sex' },
  },
  chooseIndividually: 'Or pick your own',
  statementCount: (count) => `${count} ${count === 1 ? 'statement' : 'statements'}`,
  statementsPerRound: (count) => `${count} ${count === 1 ? 'statement' : 'statements'} per round`,
  selectAtLeastOne: 'Pick at least one category.',
  start: 'Start',
  nextStatementHint: 'Tap for the next statement',
  lastStatementHint: 'Tap to finish',
  quit: 'Quit',
  quitTitle: 'Quit game?',
  quitDescription: "You'll go back to the setup. Progress from this round will be lost.",
  keepPlaying: 'Keep playing',
  endTitle: 'All statements done.',
  statementsPlayed: (count) => `${count} ${count === 1 ? 'statement' : 'statements'} played`,
  playAgain: 'Play again',
  backHome: 'Back to home',
};

export const DICTIONARIES: Record<Locale, Dictionary> = { de, en };
