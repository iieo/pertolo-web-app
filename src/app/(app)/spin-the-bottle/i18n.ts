import type { Locale } from '@/components/game/locale';

import type { Mode, PickerSplit } from './types';

type Labelled = { name: string; description: string };

export type Dictionary = {
  title: string;
  subtitle: string;
  rules: string;
  rulesTitle: string;
  rulesList: string[];
  rulesConfirm: string;
  language: string;
  modesLabel: string;
  modes: Record<Mode, Labelled>;
  teamsLabel: string;
  teamsDescription: string;
  splits: Record<PickerSplit, string>;
  start: string;
  spin: string;
  spinning: string;
  stopped: string;
  fingerPrompt: string;
  pickerLabel: string;
  fingerCount: (count: number) => string;
  winnerChosen: string;
  teamsChosen: (teams: number) => string;
  quit: string;
  quitTitle: string;
  quitDescription: string;
  keepPlaying: string;
};

const de: Dictionary = {
  title: 'Flaschendrehen',
  subtitle: 'Dreht die Flasche oder legt alle einen Finger aufs Display.',
  rules: 'Regeln',
  rulesTitle: 'Spielregeln',
  rulesList: [
    'Flasche: Legt das Handy in die Mitte und setzt euch im Kreis darum.',
    'Tippt oder wischt, dann dreht sich die Flasche. Auf wen der Flaschenhals zeigt, ist dran.',
    'Tippt erneut, um noch einmal zu drehen.',
    'Fingerwahl: Alle legen gleichzeitig einen Finger aufs Display und lassen ihn liegen.',
    'Bleiben alle Finger zwei Sekunden ruhig, wird gewählt. Kommt ein Finger dazu oder geht einer weg, beginnt die Zeit von vorn.',
    'Bei Teams braucht es mindestens so viele Finger wie Teams. Neben jedem Finger steht dann seine Teamnummer.',
    'Nehmt alle Finger weg, und die nächste Runde kann beginnen.',
    'Die Fingerwahl braucht einen Touchscreen. Mit einer Maus gibt es nur einen Zeiger, das reicht nicht.',
  ],
  rulesConfirm: 'Verstanden',
  language: 'Sprache',
  modesLabel: 'Modus',
  modes: {
    bottle: { name: 'Flasche', description: 'Drehen, und der Flaschenhals entscheidet' },
    picker: { name: 'Fingerwahl', description: 'Alle Finger aufs Display, einer wird gewählt' },
  },
  teamsLabel: 'Teams',
  teamsDescription: 'Aus wählt eine Person.',
  splits: { winner: 'Aus', '2': '2', '3': '3', '4': '4' },
  start: 'Starten',
  spin: 'Tippen oder wischen, um die Flasche zu drehen',
  spinning: 'Die Flasche dreht sich.',
  stopped: 'Die Flasche steht.',
  fingerPrompt: 'Alle einen Finger aufs Display',
  pickerLabel: 'Fingerwahl. Alle legen einen Finger auf den Bildschirm.',
  fingerCount: (count) => `${count} Finger auf dem Display`,
  winnerChosen: 'Gewählt. Der Bildschirm hat die Farbe der gewählten Person.',
  teamsChosen: (teams) => `In ${teams} Teams aufgeteilt.`,
  quit: 'Beenden',
  quitTitle: 'Spiel beenden?',
  quitDescription: 'Ihr landet wieder in der Auswahl.',
  keepPlaying: 'Weiterspielen',
};

const en: Dictionary = {
  title: 'Spin the Bottle',
  subtitle: 'Spin the bottle or everyone puts a finger on the screen.',
  rules: 'Rules',
  rulesTitle: 'Rules',
  rulesList: [
    'Bottle: put the phone in the middle and sit in a circle around it.',
    'Tap or swipe and the bottle spins. Whoever the neck points at is up.',
    'Tap again to spin once more.',
    'Finger picker: everyone puts a finger on the screen at the same time and keeps it there.',
    'Once all fingers stay put for two seconds, it picks. If a finger is added or lifted, the time starts over.',
    'For teams you need at least as many fingers as teams. Each finger then shows its team number.',
    'Lift all fingers and the next round can start.',
    'The finger picker needs a touchscreen. A mouse is only one pointer, which is not enough.',
  ],
  rulesConfirm: 'Got it',
  language: 'Language',
  modesLabel: 'Mode',
  modes: {
    bottle: { name: 'Bottle', description: 'Spin it and the neck decides' },
    picker: { name: 'Finger picker', description: 'All fingers on the screen, one gets picked' },
  },
  teamsLabel: 'Teams',
  teamsDescription: 'Off picks one person.',
  splits: { winner: 'Off', '2': '2', '3': '3', '4': '4' },
  start: 'Start',
  spin: 'Tap or swipe to spin the bottle',
  spinning: 'The bottle is spinning.',
  stopped: 'The bottle has stopped.',
  fingerPrompt: 'Everyone put a finger on the screen',
  pickerLabel: 'Finger picker. Everyone puts a finger on the screen.',
  fingerCount: (count) => `${count} ${count === 1 ? 'finger' : 'fingers'} on the screen`,
  winnerChosen: 'Picked. The screen shows the color of the chosen person.',
  teamsChosen: (teams) => `Split into ${teams} teams.`,
  quit: 'Quit',
  quitTitle: 'Quit game?',
  quitDescription: "You'll go back to the setup.",
  keepPlaying: 'Keep playing',
};

export const DICTIONARIES: Record<Locale, Dictionary> = { de, en };
