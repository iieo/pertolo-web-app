// z.b. hat Jonas schonmal gesagt, dass er gerne ausziehen würde. Stimmt ab.
export type QuestionTask = {
  type: 'question';
  question: string;
};
// z.b. jeder muss sein glas schenller als in 10 sekunden austrinkt darf 3 Schlucke verteilen
export type ChallengeTask = {
  type: 'challenge';
  challenge: string;
  target: 'individual' | 'all_players';
};
// z.b. jeder muss vor jedem Schluck "Ich bin ein Schluck" sagen
export type RuleTask = {
  type: 'rule';
  rule: string;
};
// z.b. wer muss jetzt um das haus rennen. stimmt ab.
export type VoteTask = {
  type: 'vote';
  vote: string;
};
// z.b. wie hoch ist der schiefe turm von pisa
export type FactTask = {
  type: 'fact';
  fact: string;
  incorrectAnswers: string[];
  correctAnswer: string;
};

export type TaskContent = QuestionTask | ChallengeTask | RuleTask | VoteTask | FactTask;
