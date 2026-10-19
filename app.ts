import {
  addTask,
  advanceTask,
  completeTask,
  countByStatus,
  deleteTask,
  filterByStatus,
  type Task,
  type TaskStatus,
} from "./model.js";

type Filter = TaskStatus | "all";

const form = document.getElementById("add-form") as HTMLFormElement;
const titleInput = document.getElementById("title") as HTMLInputElement;
const listEl = document.getElementById("task-list") as HTMLUListElement;
const filtersEl = document.getElementById("filters") as HTMLDivElement;
const summaryEl = document.getElementById("summary") as HTMLParagraphElement;

const STORAGE_KEY = "typetasks.v1";
const STATUSES: TaskStatus[] = ["todo", "in-progress", "done"];

function isTask(value: unknown): value is Task {
  if (typeof value !== "object" || value === null) return false;
  const v = value as Record<string, unknown>;
  return (
    typeof v.id === "number" &&
    typeof v.title === "string" &&
    STATUSES.some((s) => s === v.status)
  );
}

function load(): Task[] {
  try {
    const parsed: unknown = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]");
    return Array.isArray(parsed) ? parsed.filter(isTask) : [];
  } catch {
    return [];
  }
}

let tasks: Task[] = load();
let filter: Filter = "all";

function save(): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  } catch {
    // storage unavailable; app still works in memory
  }
}

function button(label: string, cls: string, onClick: () => void): HTMLButtonElement {
  const b = document.createElement("button");
  b.type = "button";
  b.className = cls;
  b.textContent = label;
  b.addEventListener("click", onClick);
  return b;
}

function update(next: Task[]): void {
  tasks = next;
  save();
  render();
}

function render(): void {
  const visible = filter === "all" ? tasks : filterByStatus(tasks, filter);
  listEl.replaceChildren();

  if (visible.length === 0) {
    const li = document.createElement("li");
    li.className = "empty";
    li.textContent = "Nothing here yet.";
    listEl.append(li);
  }

  for (const task of visible) {
    const li = document.createElement("li");
    li.className = task.status;

    const badge = document.createElement("span");
    badge.className = `badge ${task.status}`;
    badge.textContent = task.status;

    const title = document.createElement("span");
    title.className = "title";
    title.textContent = task.title;

    li.append(title, badge);
    if (task.status !== "done") {
      const label = task.status === "todo" ? "Start" : "Finish";
      li.append(button(label, "act", () => update(advanceTask(tasks, task.id))));
      li.append(button("✓", "act", () => update(completeTask(tasks, task.id))));
    }
    li.append(button("✕", "act", () => update(deleteTask(tasks, task.id))));
    listEl.append(li);
  }

  for (const chip of filtersEl.querySelectorAll<HTMLButtonElement>(".chip")) {
    chip.classList.toggle("active", chip.dataset.filter === filter);
  }

  summaryEl.textContent =
    `${countByStatus(tasks, "todo")} todo · ` +
    `${countByStatus(tasks, "in-progress")} in progress · ` +
    `${countByStatus(tasks, "done")} done`;
}

form.addEventListener("submit", (e: SubmitEvent) => {
  e.preventDefault();
  const title = titleInput.value.trim();
  if (title === "") return;
  titleInput.value = "";
  update(addTask(tasks, title));
});

filtersEl.addEventListener("click", (e: MouseEvent) => {
  const target = e.target as HTMLElement;
  const value = target.dataset.filter;
  if (value === "all" || STATUSES.some((s) => s === value)) {
    filter = value as Filter;
    render();
  }
});

render();
