// Next id is one more than the current max, so ids stay unique even after deletions.
export function addTask(tasks, title) {
    const nextId = tasks.reduce((max, t) => Math.max(max, t.id), 0) + 1;
    const task = { id: nextId, title, status: "todo" };
    return [...tasks, task];
}
export function completeTask(tasks, id) {
    return tasks.map((t) => (t.id === id ? { ...t, status: "done" } : t));
}
export function filterByStatus(tasks, status) {
    return tasks.filter((t) => t.status === status);
}
// --- Extra operations (original) ---
const NEXT_STATUS = {
    "todo": "in-progress",
    "in-progress": "done",
    "done": "done",
};
/** Moves a task one step forward: todo -> in-progress -> done. */
export function advanceTask(tasks, id) {
    return tasks.map((t) => t.id === id ? { ...t, status: NEXT_STATUS[t.status] } : t);
}
export function deleteTask(tasks, id) {
    return tasks.filter((t) => t.id !== id);
}
export function countByStatus(tasks, status) {
    return filterByStatus(tasks, status).length;
}
//# sourceMappingURL=model.js.map