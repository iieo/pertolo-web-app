import { useGame } from "@/app/(app)/game/[id]/game-provider";
import { DefaultTask } from "@/types/task";
import { cw } from "@/util/tailwind";

function DefaultTaskView({ task }: { task: DefaultTask }) {
    const { replacePlayerNames, showNextTask, gradient } = useGame();

    return (
        <div
            className={cw('flex flex-col items-center justify-center min-h-screen w-full p-4 text-center bg-gradient-to-br select-none', gradient)}
            onClick={showNextTask}
        >
            <h2 className="text-5xl font-extrabold tracking-tight text-purple-300 drop-shadow-lg mb-2">
                Aufgabe
            </h2>
            <p className="mt-4 text-xl text-purple-100/80 font-medium">
                {replacePlayerNames(task.content)}
            </p>
        </div>
    );
}

export default DefaultTaskView;
