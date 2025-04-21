import { useGame } from "@/app/(app)/game/[id]/game-provider";
import { DefaultTask } from "@/types/task";


import { useMemo } from "react";

function DefaultTaskView({ task }: { task: DefaultTask }) {
    const { replacePlayerNames } = useGame();

    const gradients = [
        "bg-gradient-to-br from-purple-950 via-purple-900 to-gray-900",
        "bg-gradient-to-br from-pink-900 via-fuchsia-900 to-indigo-900",
        "bg-gradient-to-br from-blue-900 via-cyan-900 to-teal-900",
        "bg-gradient-to-br from-emerald-900 via-green-900 to-lime-900",
        "bg-gradient-to-br from-yellow-900 via-orange-900 to-red-900",
    ];

    const gradient = useMemo(
        () => gradients[Math.floor(Math.random() * gradients.length)],
        []
    );

    return (
        <div
            className={`flex flex-col items-center justify-center min-h-screen w-full p-4 text-center ${gradient}`}
            onClick={() => alert('Page clicked!')}
        >
            <h2 className="text-5xl font-extrabold tracking-tight text-purple-300 drop-shadow-lg mb-2">
                Default Task
            </h2>
            <p className="mt-4 text-xl text-purple-100/80 font-medium">
                {replacePlayerNames(task.content)}
            </p>
        </div>
    );
}

export default DefaultTaskView;
