export type TaskStatus = "todo" | "in-progress" | "done";
export interface Task {
    id: number;
    title: string;
    status: TaskStatus;
}
export declare function addTask(tasks: Task[], title: string): Task[];
export declare function completeTask(tasks: Task[], id: number): Task[];
export declare function filterByStatus(tasks: Task[], status: TaskStatus): Task[];
/** Moves a task one step forward: todo -> in-progress -> done. */
export declare function advanceTask(tasks: Task[], id: number): Task[];
export declare function deleteTask(tasks: Task[], id: number): Task[];
export declare function countByStatus(tasks: Task[], status: TaskStatus): number;
//# sourceMappingURL=model.d.ts.map