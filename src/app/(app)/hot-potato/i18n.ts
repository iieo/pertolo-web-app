import type { Locale } from '@/components/game/locale';
import { CategoryKey, FuseLength } from './types';

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
  fuseLabel: string;
  fuseLengths: Record<FuseLength, string>;
  soundLabel: string;
  soundOn: string;
  soundOff: string;
  promptCount: (count: number) => string;
  promptsPerRound: (count: number) => string;
  selectAtLeastOne: string;
  start: string;
  tapToStart: string;
  lightFuse: (prompt: string) => string;
  ticking: string;
  boom: string;
  boomAnnouncement: string;
  nextPromptHint: string;
  lastPromptHint: string;
  quit: string;
  quitTitle: string;
  quitDescription: string;
  keepPlaying: string;
  endTitle: string;
  promptsPlayed: (count: number) => string;
  playAgain: string;
  backHome: string;
};

const de: Dictionary = {
  title: 'Tickende Bombe',
  subtitle: 'Antworten, weitergeben, bloß nicht zuletzt halten.',
  rules: 'Regeln',
  rulesTitle: 'Spielregeln',
  rulesList: [
    'Eine Aufgabe erscheint, zum Beispiel „Nenne Automarken“.',
    'Tippt auf den Bildschirm, dann tickt die Bombe. Wie lange, weiß niemand.',
    'Wer das Handy hat, nennt eine passende Antwort und gibt es an die nächste Person weiter.',
    'Keine Antwort darf doppelt vorkommen. Erst mit einer gültigen Antwort darf weitergegeben werden.',
    'Explodiert die Bombe, hat verloren, wer das Handy gerade hält, und trinkt.',
    'Tippt danach für die nächste Aufgabe.',
  ],
  rulesConfirm: 'Verstanden',
  language: 'Sprache',
  categoriesLabel: 'Kategorien',
  mixed: { name: 'Mixed', description: 'Alles gemischt, ohne Sexual' },
  categories: {
    normal: { name: 'Normal', description: 'Allgemeine Themen für jede Runde' },
    food: { name: 'Essen', description: 'Gerichte, Getränke und Zutaten' },
    animals: { name: 'Tiere', description: 'Vom Haustier bis zum Raubtier' },
    popculture: { name: 'Popkultur', description: 'Filme, Serien und Stars' },
    places: { name: 'Orte', description: 'Länder, Städte und Sehenswürdigkeiten' },
    music: { name: 'Musik', description: 'Bands, Songs und Instrumente' },
    sports: { name: 'Sport', description: 'Sportarten, Vereine und Profis' },
    brands: { name: 'Marken', description: 'Firmen, Logos und Produkte' },
    party: { name: 'Party', description: 'Feiern, Drinks und Ausgehen' },
    sexual: { name: 'Sexual', description: 'Dating, Flirt und Sex' },
  },
  chooseIndividually: 'Oder einzeln wählen',
  fuseLabel: 'Zündschnur',
  fuseLengths: { short: 'Kurz', normal: 'Normal', long: 'Lang' },
  soundLabel: 'Ton',
  soundOn: 'An',
  soundOff: 'Aus',
  promptCount: (count) => `${count} ${count === 1 ? 'Aufgabe' : 'Aufgaben'}`,
  promptsPerRound: (count) => `${count} ${count === 1 ? 'Aufgabe' : 'Aufgaben'} pro Runde`,
  selectAtLeastOne: 'Wähle mindestens eine Kategorie.',
  start: 'Starten',
  tapToStart: 'Tippen zum Starten',
  lightFuse: (prompt) => `${prompt}. Tippen, um die Bombe zu zünden.`,
  ticking: 'Die Bombe tickt. Antworten und weitergeben.',
  boom: 'Boom',
  boomAnnouncement: 'Boom. Wer das Handy hält, hat verloren.',
  nextPromptHint: 'Tippen für die nächste Aufgabe',
  lastPromptHint: 'Tippen zum Beenden',
  quit: 'Beenden',
  quitTitle: 'Spiel beenden?',
  quitDescription: 'Ihr landet wieder in der Auswahl. Der Fortschritt dieser Runde geht verloren.',
  keepPlaying: 'Weiterspielen',
  endTitle: 'Alle Aufgaben durch.',
  promptsPlayed: (count) => `${count} ${count === 1 ? 'Aufgabe' : 'Aufgaben'} gespielt`,
  playAgain: 'Nochmal',
  backHome: 'Zur Startseite',
};

const en: Dictionary = {
  title: 'Hot Potato',
  subtitle: "Answer, pass it on, and don't hold it when it blows.",
  rules: 'Rules',
  rulesTitle: 'Rules',
  rulesList: [
    'A prompt appears, for example "Name car brands".',
    'Tap the screen and the bomb starts ticking. Nobody knows for how long.',
    'Whoever holds the phone says a fitting answer and passes it to the next person.',
    'No answer may be repeated. You may only pass the phone on after a valid answer.',
    'When the bomb explodes, whoever is holding the phone loses and drinks.',
    'Then tap for the next prompt.',
  ],
  rulesConfirm: 'Got it',
  language: 'Language',
  categoriesLabel: 'Categories',
  mixed: { name: 'Mixed', description: 'Everything mixed, except Sexual' },
  categories: {
    normal: { name: 'Normal', description: 'General topics for any group' },
    food: { name: 'Food', description: 'Dishes, drinks and ingredients' },
    animals: { name: 'Animals', description: 'From pets to predators' },
    popculture: { name: 'Pop Culture', description: 'Movies, shows and stars' },
    places: { name: 'Places', description: 'Countries, cities and landmarks' },
    music: { name: 'Music', description: 'Bands, songs and instruments' },
    sports: { name: 'Sports', description: 'Sports, teams and athletes' },
    brands: { name: 'Brands', description: 'Companies, logos and products' },
    party: { name: 'Party', description: 'Partying, drinks and going out' },
    sexual: { name: 'Sexual', description: 'Dating, flirting and sex' },
  },
  chooseIndividually: 'Or pick your own',
  fuseLabel: 'Fuse',
  fuseLengths: { short: 'Short', normal: 'Normal', long: 'Long' },
  soundLabel: 'Sound',
  soundOn: 'On',
  soundOff: 'Off',
  promptCount: (count) => `${count} ${count === 1 ? 'prompt' : 'prompts'}`,
  promptsPerRound: (count) => `${count} ${count === 1 ? 'prompt' : 'prompts'} per round`,
  selectAtLeastOne: 'Pick at least one category.',
  start: 'Start',
  tapToStart: 'Tap to start',
  lightFuse: (prompt) => `${prompt}. Tap to light the fuse.`,
  ticking: 'The bomb is ticking. Answer and pass it on.',
  boom: 'Boom',
  boomAnnouncement: 'Boom. Whoever holds the phone loses.',
  nextPromptHint: 'Tap for the next prompt',
  lastPromptHint: 'Tap to finish',
  quit: 'Quit',
  quitTitle: 'Quit game?',
  quitDescription: "You'll go back to the setup. Progress from this round will be lost.",
  keepPlaying: 'Keep playing',
  endTitle: 'All prompts done.',
  promptsPlayed: (count) => `${count} ${count === 1 ? 'prompt' : 'prompts'} played`,
  playAgain: 'Play again',
  backHome: 'Back to home',
};

export const DICTIONARIES: Record<Locale, Dictionary> = { de, en };
