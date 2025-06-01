
import { useDrinkGame } from '@/app/drink/game-provider';
import { ChallengeTask } from '@/types/task';
import { cw } from '@/util/tailwind';

function ChallengeTaskView({ task }: { task: ChallengeTask }) {
  const { replacePlayerNames, showNextTask, gradient } = useDrinkGame();

  return (
    <div
      className={cw(
        'flex flex-col items-center justify-center h-[calc(100dvh-2rem)] w-full p-4 text-center bg-gradient-to-br select-none',
        gradient,
      )}
      onClick={showNextTask}
    >
      <h2 className="text-5xl font-extrabold tracking-tight text-purple-300 drop-shadow-lg mb-2">
        Herausforderung
      </h2>
      <p className="mt-4 text-xl text-purple-100/80 font-medium">
        {replacePlayerNames(task.challenge)}
      </p>
      <div className="mt-8 text-sm text-purple-200/60">
        Tippe zum Fortfahren
      </div>
    </div>
  );
}

export default ChallengeTaskView;
