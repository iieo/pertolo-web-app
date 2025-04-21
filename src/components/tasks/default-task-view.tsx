import { DefaultTask } from "@/types/task";


function DefaultTaskView({ task }: { task: DefaultTask }) {
    return (
        <div className="flex flex-col items-center justify-center w-full h-full p-4 text-center">
            <h2 className="text-2xl font-bold">Default Task</h2>
            <p className="mt-4 text-lg">{task.content}</p>
        </div>
    );
}

export default DefaultTaskView;