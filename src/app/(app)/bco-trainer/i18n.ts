import type { Locale } from '@/components/game/locale';

import type { Level } from './rhythm';
import type { Mode } from './settings';

type Labelled = { name: string; description: string };

export type Dictionary = {
  title: string;
  subtitle: string;
  rules: string;
  rulesTitle: string;
  rulesList: string[];
  rulesConfirm: string;
  modesLabel: string;
  modes: Record<Mode, Labelled>;
  level: string;
  levels: Record<Level, string>;
  tempo: string;
  tempoDescription: string;
  measures: string;
  quizMeasures: string;
  metronome: string;
  on: string;
  off: string;
  language: string;
  start: string;
  startDetail: (level: Level, tempo: number) => string;
  quizDetail: (rounds: number) => string;
  audioUnsupported: string;
  notation: string;
  reveal: string;
  again: string;
  next: string;
  play: string;
  stop: string;
  showScore: string;
  optionsLabel: string;
  option: (number: number) => string;
  correct: string;
  wrong: string;
  correctAnnouncement: string;
  wrongAnnouncement: (number: number) => string;
  quit: string;
  quitTitle: string;
  quitDescription: string;
  keepPlaying: string;
  endTitle: string;
  score: (score: number, total: number) => string;
  playAgain: string;
  backToSetup: string;
};

const de: Dictionary = {
  title: 'BCO Trainer',
  subtitle: 'Rhythmen hören, lesen und erkennen.',
  rules: 'So geht es',
  rulesTitle: 'So geht es',
  rulesList: [
    'Wähl einen Modus, eine Stufe, das Tempo und wie viele Takte du üben willst.',
    'Hören: Nach vier Schlägen zum Einzählen spielt der Rhythmus, die Noten bleiben verdeckt. Mit Nochmal hörst du ihn so oft du willst. Tipp auf Auflösen und vergleich mit dem, was du gehört hast.',
    'Lesen: Die Noten sind sofort sichtbar. Zähl leise mit und klatsch oder tipp den Rhythmus selbst. Tipp danach auf Anhören. Nach dem Einzählen läuft der Rhythmus und die gerade gespielte Note wird markiert.',
    'Quiz: Der Rhythmus spielt und du siehst drei Notenbilder. Tipp auf das passende. Nach zehn Runden siehst du, wie viele du richtig hattest.',
    'Mit dem Metronom hörst du beim Abspielen jeden Schlag als Klick.',
  ],
  rulesConfirm: 'Verstanden',
  modesLabel: 'Modus',
  modes: {
    listen: {
      name: 'Hören',
      description:
        'Der Rhythmus spielt, die Noten bleiben verdeckt. Hör genau hin und deck dann auf.',
    },
    read: {
      name: 'Lesen',
      description:
        'Die Noten sind sichtbar. Klatsch den Rhythmus und hör ihn dir dann zur Kontrolle an.',
    },
    quiz: {
      name: 'Quiz',
      description: 'Hör zu und finde unter drei Notenbildern das richtige. Zehn Runden.',
    },
  },
  level: 'Stufe',
  levels: {
    1: 'Viertel, Halbe, Ganze und Viertelpausen',
    2: 'Alles aus Stufe 1, dazu Achtel',
    3: 'Alles bis Stufe 2, dazu Achtelpausen und punktierte Viertel',
    4: 'Alles bis Stufe 3, dazu Sechzehntel',
    5: 'Alles bis Stufe 4, dazu punktierte Achtel und Synkopen',
    6: 'Alles bis Stufe 5, dazu Triolen',
  },
  tempo: 'Tempo',
  tempoDescription: 'Schläge pro Minute',
  measures: 'Takte',
  quizMeasures: 'Im Quiz höchstens 2 Takte',
  metronome: 'Metronom',
  on: 'An',
  off: 'Aus',
  language: 'Sprache',
  start: 'Starten',
  startDetail: (level, tempo) => `Stufe ${level}, ${tempo} BPM`,
  quizDetail: (rounds) => `${rounds} Runden`,
  audioUnsupported: 'Dieser Browser kann keinen Ton abspielen.',
  notation: 'Noten',
  reveal: 'Auflösen',
  again: 'Nochmal',
  next: 'Weiter',
  play: 'Anhören',
  stop: 'Stopp',
  showScore: 'Zum Ergebnis',
  optionsLabel: 'Welches Notenbild passt?',
  option: (number) => `Option ${number}`,
  correct: 'Richtig',
  wrong: 'Falsch',
  correctAnnouncement: 'Richtig.',
  wrongAnnouncement: (number) => `Falsch. Richtig ist Option ${number}.`,
  quit: 'Beenden',
  quitTitle: 'Training beenden?',
  quitDescription: 'Du landest wieder in der Auswahl.',
  keepPlaying: 'Weiter üben',
  endTitle: 'Quiz beendet.',
  score: (score, total) => `${score} von ${total} richtig`,
  playAgain: 'Nochmal spielen',
  backToSetup: 'Zur Auswahl',
};

const en: Dictionary = {
  title: 'BCO Trainer',
  subtitle: 'Hear, read and recognize rhythms.',
  rules: 'How it works',
  rulesTitle: 'How it works',
  rulesList: [
    'Pick a mode, a level, the tempo and how many measures you want to practice.',
    'Listen: after four beats of count-in the rhythm plays while the notes stay hidden. Tap Again to hear it as often as you like. Tap Reveal and compare with what you heard.',
    'Read: the notes are shown right away. Count along quietly and clap or tap the rhythm yourself. Then tap Play. After the count-in the rhythm plays and the current note is highlighted.',
    'Quiz: the rhythm plays and you see three notations. Tap the one that matches. After ten rounds you see how many you got right.',
    'With the metronome on, every beat clicks during playback.',
  ],
  rulesConfirm: 'Got it',
  modesLabel: 'Mode',
  modes: {
    listen: {
      name: 'Listen',
      description: 'The rhythm plays while the notes stay hidden. Listen closely, then reveal.',
    },
    read: {
      name: 'Read',
      description: 'The notes are shown. Clap the rhythm, then play it to check.',
    },
    quiz: {
      name: 'Quiz',
      description: 'Listen and pick the right notation out of three. Ten rounds.',
    },
  },
  level: 'Level',
  levels: {
    1: 'Quarters, halves, whole notes and quarter rests',
    2: 'Everything from level 1, plus eighths',
    3: 'Everything up to level 2, plus eighth rests and dotted quarters',
    4: 'Everything up to level 3, plus sixteenths',
    5: 'Everything up to level 4, plus dotted eighths and syncopation',
    6: 'Everything up to level 5, plus triplets',
  },
  tempo: 'Tempo',
  tempoDescription: 'Beats per minute',
  measures: 'Measures',
  quizMeasures: 'Quiz uses 2 measures at most',
  metronome: 'Metronome',
  on: 'On',
  off: 'Off',
  language: 'Language',
  start: 'Start',
  startDetail: (level, tempo) => `Level ${level}, ${tempo} BPM`,
  quizDetail: (rounds) => `${rounds} rounds`,
  audioUnsupported: 'This browser cannot play sound.',
  notation: 'Notation',
  reveal: 'Reveal',
  again: 'Again',
  next: 'Next',
  play: 'Play',
  stop: 'Stop',
  showScore: 'See score',
  optionsLabel: 'Which notation matches?',
  option: (number) => `Option ${number}`,
  correct: 'Correct',
  wrong: 'Wrong',
  correctAnnouncement: 'Correct.',
  wrongAnnouncement: (number) => `Wrong. Option ${number} is correct.`,
  quit: 'Quit',
  quitTitle: 'Quit training?',
  quitDescription: "You'll go back to the setup.",
  keepPlaying: 'Keep practicing',
  endTitle: 'Quiz done.',
  score: (score, total) => `${score} of ${total} correct`,
  playAgain: 'Play again',
  backToSetup: 'Back to setup',
};

export const DICTIONARIES: Record<Locale, Dictionary> = { de, en };
