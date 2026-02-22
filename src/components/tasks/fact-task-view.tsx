import { useState } from 'react';

import { FactTask } from '@/types/task';
import { cw } from '@/util/tailwind';
import { useDrinkGame } from '@/app/(app)/drink/game-provider';
import { Check, X } from 'lucide-react';

function FactTaskView({ task }: { task: FactTask }) {
  const { replacePlayerNames, showNextTask, gradient } = useDrinkGame();
  const allAnswers = [task.correctAnswer, ...task.incorrectAnswers];
  const [shuffledAnswers] = useState(() => allAnswers.sort(() => Math.random() - 0.5));
  const [selected, setSelected] = useState<string | null>(null);

  const handleAnswerClick = (answer: string) => {
    if (selected === null) {
      setSelected(answer);
      setTimeout(() => {
        showNextTask();
      }, 2500);
    }
  };

  return (
    <div
      className={cw(
        'relative flex flex-col items-center justify-center min-h-[calc(100dvh-2rem)] w-full px-4 py-8 text-center select-none overflow-hidden transition-colors duration-1000',
        gradient,
      )}
    >
      <div className="absolute inset-0 bg-[url('/noise.png')] opacity-5 mix-blend-overlay pointer-events-none" />

      <div className="z-10 flex flex-col items-center w-full max-w-2xl animate-in fade-in zoom-in-95 duration-500">
        <div className="inline-block px-4 py-1.5 rounded-full bg-blue-500/20 border border-blue-500/30 backdrop-blur-md mb-8 shadow-[0_0_30px_rgba(59,130,246,0.3)]">
          <h2 className="text-sm font-black uppercase tracking-[0.2em] text-blue-200">
            Quiz
          </h2>
        </div>

        <p className="text-2xl md:text-4xl font-black text-white drop-shadow-2xl leading-tight mb-12 px-4">
          {replacePlayerNames(task.fact)}
        </p>

        <div className="flex flex-col gap-4 w-full">
          {shuffledAnswers.map((answer, idx) => {
            const isSelected = selected === answer;
            const isCorrect = answer === task.correctAnswer;
            const showResult = selected !== null;

            let btnClass = 'relative overflow-hidden py-5 px-6 rounded-2xl border-2 transition-all duration-300 font-bold text-lg md:text-xl w-full flex items-center justify-between group ';

            if (showResult) {
              if (isCorrect) {
                btnClass += 'bg-gradient-to-r from-green-500 to-emerald-600 border-green-400 text-white shadow-[0_0_30px_rgba(16,185,129,0.4)] scale-[1.02] z-10';
              } else if (isSelected) {
                btnClass += 'bg-gradient-to-r from-red-500 to-rose-600 border-red-400 text-white shadow-[0_0_30px_rgba(239,68,68,0.4)] scale-100 z-10';
              } else {
                btnClass += 'bg-white/5 border-white/10 text-white/40 scale-95 opacity-50 blur-[1px]';
              }
            } else {
              btnClass += 'bg-white/10 border-white/20 text-white hover:bg-white/20 hover:border-white/40 hover:scale-[1.02] cursor-pointer shadow-lg active:scale-95';
            }

            return (
              <button
                key={idx}
                className={btnClass}
                onClick={() => handleAnswerClick(answer)}
                disabled={showResult}
                style={!showResult ? { animationDelay: `${idx * 150}ms`, animationFillMode: 'both' } : undefined}
              >
                {!showResult && (
                  <div className="absolute inset-0 bg-white/0 group-hover:bg-white/5 transition-colors" />
                )}
                <span className="relative z-10 text-left w-full pr-8">
                  {replacePlayerNames(answer)}
                </span>

                {showResult && (
                  <div className="absolute right-6 z-10 animate-in zoom-in duration-300">
                    {isCorrect ? (
                      <div className="bg-white/20 rounded-full p-1"><Check className="w-6 h-6 text-white" /></div>
                    ) : isSelected ? (
                      <div className="bg-white/20 rounded-full p-1"><X className="w-6 h-6 text-white" /></div>
                    ) : null}
                  </div>
                )}
              </button>
            );
          })}
        </div>

        <div className="h-10 mt-8 flex items-center justify-center">
          {!selected ? (
            <div className="text-sm font-medium tracking-widest uppercase text-white/50 animate-pulse">
              Wähle eine Antwort
            </div>
          ) : (
            <div className="text-sm font-medium tracking-widest uppercase text-white/70 animate-in fade-in duration-500">
              {selected === task.correctAnswer ? '✨ Richtig!' : '❌ Falsch!'} &middot; Weiter in 2 Sekunden...
            </div>
          )}
        </div>
      </div>
    </div >
  );
}

export default FactTaskView;
