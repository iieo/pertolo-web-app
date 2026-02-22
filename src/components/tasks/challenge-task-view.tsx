import { useDrinkGame } from '@/app/(app)/drink/game-provider';
import { ChallengeTask } from '@/types/task';
import { cw } from '@/util/tailwind';

function ChallengeTaskView({ task }: { task: ChallengeTask }) {
  const { replacePlayerNames, showNextTask, gradient } = useDrinkGame();

  return (
    <div
      className={cw(
        'relative flex flex-col items-center justify-center min-h-[calc(100dvh-2rem)] w-full p-6 text-center select-none overflow-hidden cursor-pointer transition-colors duration-1000',
        gradient,
      )}
      onClick={showNextTask}
    >
      <div className="absolute inset-0 bg-[url('/noise.png')] opacity-5 mix-blend-overlay pointer-events-none" />
      <div className="z-10 flex flex-col items-center gap-6 animate-in fade-in zoom-in-95 duration-500 max-w-2xl w-full">
        <div className="inline-block px-4 py-1.5 rounded-full bg-orange-500/20 border border-orange-500/30 backdrop-blur-md mb-4 shadow-[0_0_30px_rgba(249,115,22,0.3)]">
          <h2 className="text-sm font-black uppercase tracking-[0.2em] text-orange-200">
            Herausforderung
          </h2>
        </div>
        <p className="text-3xl md:text-5xl font-black text-white drop-shadow-2xl leading-tight">
          {replacePlayerNames(task.challenge)}
        </p>
      </div>

      <div className="absolute bottom-12 animate-pulse text-white/50 text-sm font-medium tracking-widest uppercase">
        Tippen zum Fortfahren
      </div>
    </div>
  );
}

export default ChallengeTaskView;
