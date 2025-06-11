import { useState } from 'react';

import { FactTask } from '@/types/task';
import { cw } from '@/util/tailwind';
import { useDrinkGame } from '@/app/(app)/drink/game-provider';

function FactTaskView({ task }: { task: FactTask }) {
  const { replacePlayerNames, showNextTask, gradient } = useDrinkGame();
  const allAnswers = [task.correctAnswer, ...task.incorrectAnswers];
  const [shuffledAnswers] = useState(() => allAnswers.sort(() => Math.random() - 0.5));
  const [selected, setSelected] = useState<string | null>(null);

  const handleAnswerClick = (answer: string) => {
    if (selected === null) {
      setSelected(answer);
      // Auto-advance after showing the result for 2 seconds
      setTimeout(() => {
        showNextTask();
      }, 2000);
    }
  };

  return (
    <div
      className={cw(
        'flex flex-col items-center justify-center h-[calc(100dvh-2rem)] w-full p-4 text-center bg-gradient-to-br select-none',
        gradient,
      )}
    >
      <h2 className="text-5xl font-extrabold tracking-tight text-purple-300 drop-shadow-lg mb-2">
        Quiz
      </h2>
      <p className="mt-4 text-xl text-purple-100/80 font-medium mb-8">
        {replacePlayerNames(task.fact)}
      </p>
      <div className="flex flex-col gap-3 w-full max-w-md">
        {shuffledAnswers.map((answer, idx) => {
          let btnClass = 'py-4 px-6 rounded-xl border-2 transition-all font-medium text-lg ';
          if (selected) {
            if (answer === task.correctAnswer) {
              btnClass += 'bg-green-600/90 border-green-400 text-white shadow-lg';
            } else if (answer === selected) {
              btnClass += 'bg-red-600/90 border-red-400 text-white shadow-lg';
            } else {
              btnClass += 'opacity-60 bg-purple-800/50 border-purple-600 text-purple-200';
            }
          } else {
            btnClass += 'bg-purple-800/80 border-purple-400 text-purple-100 hover:bg-purple-700/90 hover:border-purple-300 cursor-pointer';
          }
          return (
            <button
              key={idx}
              className={btnClass}
              onClick={() => handleAnswerClick(answer)}
              disabled={!!selected}
            >
              {replacePlayerNames(answer)}
            </button>
          );
        })}
      </div>
      {!selected && (
        <div className="mt-8 text-sm text-purple-200/60">
          Wähle eine Antwort
        </div>
      )}
      {selected && (
        <div className="mt-8 text-sm text-purple-200/60">
          Weiter in 2 Sekunden...
        </div>
      )}
    </div>
  );
}

export default FactTaskView;
