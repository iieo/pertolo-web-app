export type DefaultTask = {
  type: 'default';
  content: string;
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
