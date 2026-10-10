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
  spectrumCount: (count: number) => string;
  teams: string;
  teamsDescription: string;
  rounds: string;
  roundsDetail: (count: number) => string;
  selectAtLeastOne: string;
  start: string;
  teamName: (index: number) => string;
  showTarget: string;
  hide: string;
  reveal: string;
  needle: string;
  needleValue: (value: number, left: string, right: string) => string;
  target: (center: number) => string;
  points: (count: number) => string;
  total: string;
  scoresLabel: string;
  nextRoundHint: string;
  lastRoundHint: string;
  quit: string;
  quitTitle: string;
  quitDescription: string;
  keepPlaying: string;
  endTitleCoop: (points: number) => string;
  endDetailCoop: (rounds: number, max: number) => string;
  endTitleWinner: (team: number) => string;
  endTitleTie: string;
  endDetailTeams: (a: number, b: number, rounds: number) => string;
  playAgain: string;
  backHome: string;
};

const de: Dictionary = {
  title: 'Wellenlänge',
  subtitle: 'Ein Hinweis, eine Skala. Seid ihr auf einer Wellenlänge?',
  rules: 'Regeln',
  rulesTitle: 'Spielregeln',
  rulesList: [
    'Wer den Hinweis gibt, nimmt das Handy und tippt, um das Ziel zu sehen. Alle anderen schauen weg.',
    'Merk dir, wo das Ziel zwischen den beiden Enden liegt, und tippe auf Verstecken.',
    'Sag einen Hinweis, der genau dort liegt. Bei Kalt bis Heiß und einem Ziel kurz vor Heiß passt zum Beispiel „Sauna“.',
    'Die anderen schieben die Nadel gemeinsam auf ihre Vermutung und tippen auf Aufdecken.',
    'Die Mitte des Ziels bringt 4 Punkte, die Felder daneben 3 und die äußeren 2. Tippt dann für die nächste Runde.',
    'Mit zwei Teams wechselt ihr euch jede Runde ab. Wer am Ende mehr Punkte hat, gewinnt.',
  ],
  rulesConfirm: 'Verstanden',
  language: 'Sprache',
  categoriesLabel: 'Kategorien',
  mixed: { name: 'Mixed', description: 'Alles gemischt, ohne Sexual' },
  categories: {
    normal: { name: 'Normal', description: 'Alltägliche Skalen für jede Runde' },
    food: { name: 'Essen', description: 'Gerichte, Geschmack und Küche' },
    popculture: { name: 'Popkultur', description: 'Filme, Serien, Musik und Stars' },
    people: { name: 'Menschen', description: 'Typen, Eigenschaften und Verhalten' },
    abstract: { name: 'Abstrakt', description: 'Ideen, Gefühle und Begriffe' },
    party: { name: 'Party', description: 'Feiern, Alkohol und Ausgehen' },
    sexual: { name: 'Sexual', description: 'Dating, Flirt und Sex' },
  },
  chooseIndividually: 'Oder einzeln wählen',
  spectrumCount: (count) => `${count} ${count === 1 ? 'Skala' : 'Skalen'}`,
  teams: 'Teams',
  teamsDescription: 'Ein Team spielt zusammen, zwei Teams wechseln sich ab.',
  rounds: 'Runden',
  roundsDetail: (count) => `${count} ${count === 1 ? 'Runde' : 'Runden'}`,
  selectAtLeastOne: 'Wähle mindestens eine Kategorie.',
  start: 'Starten',
  teamName: (index) => `Team ${index + 1}`,
  showTarget: 'Ziel anzeigen',
  hide: 'Verstecken',
  reveal: 'Aufdecken',
  needle: 'Nadel',
  needleValue: (value, left, right) => `${value} von 100, von ${left} bis ${right}`,
  target: (center) => `Ziel bei ${center} von 100`,
  points: (count) => (count === 1 ? 'Punkt' : 'Punkte'),
  total: 'Gesamt',
  scoresLabel: 'Punktestand',
  nextRoundHint: 'Tippen für die nächste Runde',
  lastRoundHint: 'Tippen zum Beenden',
  quit: 'Beenden',
  quitTitle: 'Spiel beenden?',
  quitDescription: 'Ihr landet wieder in der Auswahl. Der Punktestand geht verloren.',
  keepPlaying: 'Weiterspielen',
  endTitleCoop: (points) => `${points} ${points === 1 ? 'Punkt' : 'Punkte'}.`,
  endDetailCoop: (rounds, max) =>
    `In ${rounds} ${rounds === 1 ? 'Runde' : 'Runden'}, von ${max} möglichen.`,
  endTitleWinner: (team) => `Team ${team + 1} gewinnt.`,
  endTitleTie: 'Unentschieden.',
  endDetailTeams: (a, b, rounds) =>
    `Team 1: ${a} ${a === 1 ? 'Punkt' : 'Punkte'}, Team 2: ${b} ${b === 1 ? 'Punkt' : 'Punkte'}. ${rounds} ${rounds === 1 ? 'Runde' : 'Runden'} gespielt.`,
  playAgain: 'Nochmal',
  backHome: 'Zur Startseite',
};

const en: Dictionary = {
  title: 'Wavelength',
  subtitle: 'One clue, one scale. Are you on the same wavelength?',
  rules: 'Rules',
  rulesTitle: 'Rules',
  rulesList: [
    'The clue giver takes the phone and taps to see the target. Everyone else looks away.',
    'Remember where the target sits between the two ends, then tap Hide.',
    'Say a clue that lands right there. For Cold to Hot with the target just short of Hot, "sauna" works.',
    'The others drag the needle to their guess together and tap Reveal.',
    'The center of the target scores 4 points, the bands next to it 3 and the outer ones 2. Then tap for the next round.',
    'With two teams you take turns every round. Whoever has more points at the end wins.',
  ],
  rulesConfirm: 'Got it',
  language: 'Language',
  categoriesLabel: 'Categories',
  mixed: { name: 'Mixed', description: 'Everything mixed, except Sexual' },
  categories: {
    normal: { name: 'Normal', description: 'Everyday scales for any group' },
    food: { name: 'Food', description: 'Dishes, taste and cooking' },
    popculture: { name: 'Pop Culture', description: 'Movies, shows, music and stars' },
    people: { name: 'People', description: 'Types, traits and behavior' },
    abstract: { name: 'Abstract', description: 'Ideas, feelings and concepts' },
    party: { name: 'Party', description: 'Partying, drinking and going out' },
    sexual: { name: 'Sexual', description: 'Dating, flirting and sex' },
  },
  chooseIndividually: 'Or pick your own',
  spectrumCount: (count) => `${count} ${count === 1 ? 'scale' : 'scales'}`,
  teams: 'Teams',
  teamsDescription: 'One team plays together, two teams take turns.',
  rounds: 'Rounds',
  roundsDetail: (count) => `${count} ${count === 1 ? 'round' : 'rounds'}`,
  selectAtLeastOne: 'Pick at least one category.',
  start: 'Start',
  teamName: (index) => `Team ${index + 1}`,
  showTarget: 'Show target',
  hide: 'Hide',
  reveal: 'Reveal',
  needle: 'Needle',
  needleValue: (value, left, right) => `${value} of 100, from ${left} to ${right}`,
  target: (center) => `Target at ${center} of 100`,
  points: (count) => (count === 1 ? 'point' : 'points'),
  total: 'Total',
  scoresLabel: 'Score',
  nextRoundHint: 'Tap for the next round',
  lastRoundHint: 'Tap to finish',
  quit: 'Quit',
  quitTitle: 'Quit game?',
  quitDescription: "You'll go back to the setup. The score will be lost.",
  keepPlaying: 'Keep playing',
  endTitleCoop: (points) => `${points} ${points === 1 ? 'point' : 'points'}.`,
  endDetailCoop: (rounds, max) =>
    `In ${rounds} ${rounds === 1 ? 'round' : 'rounds'}, out of ${max}.`,
  endTitleWinner: (team) => `Team ${team + 1} wins.`,
  endTitleTie: "It's a tie.",
  endDetailTeams: (a, b, rounds) =>
    `Team 1: ${a} ${a === 1 ? 'point' : 'points'}, Team 2: ${b} ${b === 1 ? 'point' : 'points'}. ${rounds} ${rounds === 1 ? 'round' : 'rounds'} played.`,
  playAgain: 'Play again',
  backHome: 'Back to home',
};

export const DICTIONARIES: Record<Locale, Dictionary> = { de, en };
