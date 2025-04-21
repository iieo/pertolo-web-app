import GenericTaskView from "@/components/tasks/generic-task-view";
import { dbGetGameByCode, dbGetRandomTasks } from "../../actions";


export default async function GameScreen({ params }: { params: Promise<{ id: string }> }) {
  const loadedParams = await params;
  const gameCode = loadedParams.id.toUpperCase();
  const gameData = await dbGetGameByCode(gameCode);

  if (gameData.success === false) {
    return <div>Game not found</div>;
  }
  const gameMode = gameData.data.gameSettings.currentGameModeId;
  if (gameMode === null) {
    return <div>Gamemode not selected</div>;
  }

  const tasksData = await dbGetRandomTasks(gameMode, 30);

  if (tasksData.success === false) {
    return <div>Tasks not found</div>;
  }
  const tasks = tasksData.data;

  return <div>
    <ul className="list-disc pl-6">
      {tasks.map((task) => (
        <li key={task.id} className="mb-2">
          <GenericTaskView task={task} />
        </li>
      ))}
    </ul>

  </div>;
}
