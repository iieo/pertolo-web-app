import { useState } from "react";
import { FactTask } from "@/types/task";

function FactTaskView({ task }: { task: FactTask }) {
    const allAnswers = [task.correctAnswer, ...task.incorrectAnswers];
    const [shuffledAnswers] = useState(() =>
        allAnswers.sort(() => Math.random() - 0.5)
    );
    const [selected, setSelected] = useState<string | null>(null);

    const handleAnswerClick = (answer: string) => {
        if (selected === null) setSelected(answer);
    };

    return (
        <div className="flex flex-col items-center justify-center w-full h-full p-4 text-center">
            <h2 className="text-2xl font-bold">Default Task</h2>
            <p className="mt-4 text-lg">{task.fact}</p>
            <div className="mt-6 flex flex-col gap-2 w-full max-w-md">
                {shuffledAnswers.map((answer, idx) => {
                    let btnClass =
                        "py-2 px-4 rounded border border-gray-300 transition";
                    if (selected) {
                        if (answer === task.correctAnswer) {
                            btnClass += " bg-green-200 border-green-500";
                        } else if (answer === selected) {
                            btnClass += " bg-red-200 border-red-500";
                        } else {
                            btnClass += " opacity-60";
                        }
                    } else {
                        btnClass += " hover:bg-gray-100";
                    }
                    return (
                        <button
                            key={idx}
                            className={btnClass}
                            onClick={() => handleAnswerClick(answer)}
                            disabled={!!selected}
                        >
                            {answer}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}

export default FactTaskView;