export const DRINK_TASK_KINDS = [
  'task',
  'versus',
  'vote',
  'never',
  'group',
  'question',
  'rule',
  'curse',
  'category',
  'timer',
  'roulette',
  'double',
] as const;

/**
 * - versus: the first two {{player}} are the opponents
 * - never: content is only the continuation, the UI adds "Ich hab noch nie"
 * - rule, curse: last for `rounds` cards, then an automatic end card follows
 * - timer: countdown of `seconds`
 * - roulette: the game picks one random player, content has exactly one {{player}}
 */
export type DrinkTaskKind = (typeof DRINK_TASK_KINDS)[number];

export type DefaultTask = {
  type: 'default';
  content: string;
  contentEn?: string;
  /** Missing means 'task'. */
  kind?: DrinkTaskKind;
  rounds?: number;
  seconds?: number;
  /** Text for the automatic "rule over" card. */
  endContent?: string;
  endContentEn?: string;
};
// z.b. jeder muss sein glas schenller als in 10 sekunden austrinkt darf 3 Schlucke verteilen
export type ChallengeTask = {
  type: 'challenge';
  challenge: string;
  target: 'individual' | 'all{{player}}players';
};

// z.b. hat Jonas schonmal gesagt, dass er gerne ausziehen würde. Stimmt ab.
// z.b. jeder muss vor jedem Schluck "Ich bin ein Schluck" sagen
// oben oder unten
// z.b. wer muss jetzt um das haus rennen. stimmt ab.
// z.b. wie hoch ist der schiefe turm von pisa
export type FactTask = {
  type: 'fact';
  fact: string;
  incorrectAnswers: string[];
  correctAnswer: string;
};

export type TaskContent = DefaultTask | ChallengeTask | FactTask;
