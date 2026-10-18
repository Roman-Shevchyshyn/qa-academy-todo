export interface Todo {
  id: string;
  title: string;
  completed: boolean;
}

export type Filter = 'all' | 'active' | 'completed';

const STORAGE_KEY = 'qa-academy-todos';
const AUTH_KEY = 'qa-academy-user';

export function loadTodos(): Todo[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Todo[]) : [];
  } catch {
    return [];
  }
}

export function saveTodos(todos: Todo[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
}

export function getUser(): string | null {
  return sessionStorage.getItem(AUTH_KEY);
}

export function setUser(name: string): void {
  sessionStorage.setItem(AUTH_KEY, name);
}

export function clearUser(): void {
  sessionStorage.removeItem(AUTH_KEY);
}

// Unstable id: different on every render.
// A locator like #todo-abc123 breaks on the next run.
export function randomId(): string {
  return 'todo-' + Math.random().toString(36).slice(2, 10);
}

export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
