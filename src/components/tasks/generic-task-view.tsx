'use client';
import DefaultTaskView from './default-task-view';
import ChallengeTaskView from './challenge-task-view';
import FactTaskView from './fact-task-view';

import GameEndScreen from './game-end-screen';
import { useDrinkGame } from '@/app/(app)/drink/game-provider';

function GenericTaskViewer() {
  const { currentTask } = useDrinkGame();

  if (currentTask === null) {
    return <GameEndScreen />;
  }

  switch (currentTask.content.type) {
    case 'default':
      return <DefaultTaskView task={currentTask.content} />;
    case 'challenge':
      return <ChallengeTaskView task={currentTask.content} />;
    case 'fact':
      return <FactTaskView task={currentTask.content} />;
    default:
      return <div>Unknown task type</div>;
  }
}

export default GenericTaskViewer;
