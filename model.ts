export type TaskStatus = "todo" | "in-progress" | "done";

export interface Task {
  id: number;
  title: string;
  status: TaskStatus;
}

// Next id is one more than the current max, so ids stay unique even after deletions.
export function addTask(tasks: Task[], title: string): Task[] {
  const nextId = tasks.reduce((max, t) => Math.max(max, t.id), 0) + 1;
  const task: Task = { id: nextId, title, status: "todo" };
  return [...tasks, task];
}

export function completeTask(tasks: Task[], id: number): Task[] {
  return tasks.map((t): Task => (t.id === id ? { ...t, status: "done" } : t));
}

export function filterByStatus(tasks: Task[], status: TaskStatus): Task[] {
  return tasks.filter((t) => t.status === status);
}

// --- Extra operations (original) ---

const NEXT_STATUS: Record<TaskStatus, TaskStatus> = {
  "todo": "in-progress",
  "in-progress": "done",
  "done": "done",
};

/** Moves a task one step forward: todo -> in-progress -> done. */
export function advanceTask(tasks: Task[], id: number): Task[] {
  return tasks.map((t): Task =>
    t.id === id ? { ...t, status: NEXT_STATUS[t.status] } : t
  );
}

export function deleteTask(tasks: Task[], id: number): Task[] {
  return tasks.filter((t) => t.id !== id);
}

export function countByStatus(tasks: Task[], status: TaskStatus): number {
  return filterByStatus(tasks, status).length;
}
