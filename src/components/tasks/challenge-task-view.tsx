
import { useGame } from '@/app/drink/game/[id]/game-provider';
import { ChallengeTask } from '@/types/task';

function ChallengeTaskView({ task }: { task: ChallengeTask }) {
  const { replacePlayerNames } = useGame();
  return (
    <div className="flex flex-col items-center justify-center w-full h-full p-4 text-center">
      <h2 className="text-2xl font-bold">Default Task</h2>
      <p className="mt-4 text-lg">{replacePlayerNames(task.challenge)}</p>
    </div>
  );
}

export default ChallengeTaskView;
