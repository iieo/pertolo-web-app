import { useGame } from "@/app/(app)/game/[id]/game-provider";
import { DefaultTask } from "@/types/task";
import { cw } from "@/util/tailwind";


import { useEffect, useState } from "react";

function DefaultTaskView({ task }: { task: DefaultTask }) {
    const { replacePlayerNames, showNextTask } = useGame();

    const gradients = [
        "from-purple-950 via-purple-900 to-gray-900",
        "from-pink-900 via-fuchsia-900 to-indigo-900",
        "from-blue-900 via-cyan-900 to-teal-900",
        "from-emerald-900 via-green-900 to-lime-900",
        "from-yellow-900 via-orange-900 to-red-900",
    ];

    const [gradient, setGradient] = useState(gradients[0]);

    useEffect(() => {
        setGradient(gradients[Math.floor(Math.random() * gradients.length)]);
    }, []);

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
