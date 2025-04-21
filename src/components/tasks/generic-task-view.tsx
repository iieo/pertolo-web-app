"use client";
import { TaskModel } from "@/db/schema";
import DefaultTaskView from "./default-task-view";
import ChallengeTaskView from "./challenge-task-view";
import FactTaskView from "./fact-task-view";

function GenericTaskView({ task }: { task: TaskModel }) {

    switch (task.content.type) {
        case 'default':
            return <DefaultTaskView task={task.content} />;
        case 'challenge':
            return <ChallengeTaskView task={task.content} />;
        case 'fact':
            return <FactTaskView task={task.content} />;
        default:
            return <div>Unknown task type</div>;
    }
}

export default GenericTaskView;