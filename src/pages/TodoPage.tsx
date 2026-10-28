import { useEffect, useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../components/Header';
import { Filters } from '../components/Filters';
import { TodoItem } from '../components/TodoItem';
import {
  clearUser,
  delay,
  getUser,
  loadTodos,
  randomId,
  saveTodos,
  type Filter,
  type Todo,
} from '../store';

// Every change goes through a fake "request" so the UI shows a saving state.
const SAVE_DELAY_MS = 400;
// Clearing completed tasks is noticeably slower than other actions.
const CLEAR_DELAY_MS = 1500;

export function TodoPage() {
  const navigate = useNavigate();
  const [todos, setTodos] = useState<Todo[]>(() => loadTodos());
  const [filter, setFilter] = useState<Filter>('all');
  const [title, setTitle] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const user = getUser();

  useEffect(() => {
    saveTodos(todos);
  }, [todos]);

  const visible = todos.filter((t) => {
    if (filter === 'active') return !t.completed;
    if (filter === 'completed') return t.completed;
    return true;
  });

  const left = todos.filter((t) => !t.completed).length;
  const hasCompleted = todos.some((t) => t.completed);

  function validate(value: string): string | null {
    const trimmed = value.trim();
    if (!trimmed) return 'Task title cannot be empty';
    if (trimmed.length > 60) return 'Task title is too long (max 60 characters)';
    return null;
  }

  // Simulates a server round-trip: disables the controls and shows "Saving…".
  async function withSaving(ms: number, apply: () => void) {
    setBusy(true);
    await delay(ms);
    apply();
    setBusy(false);
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const message = validate(title);
    if (message) {
      setError(message);
      return;
    }

    setError(null);
    const trimmed = title.trim();
    setTitle(''); // clear the input right away so the user can type the next task
    await withSaving(SAVE_DELAY_MS, () => {
      setTodos((current) => [...current, { id: randomId(), title: trimmed, completed: false }]);
    });
  }

  // Optimistic update: the checkbox flips at once, the "request" runs afterwards.
  function toggle(id: string, completed: boolean) {
    setTodos((current) => current.map((t) => (t.id === id ? { ...t, completed } : t)));
    void withSaving(SAVE_DELAY_MS, () => {});
  }

  function remove(id: string) {
    void withSaving(SAVE_DELAY_MS, () => {
      setTodos((current) => current.filter((t) => t.id !== id));
    });
  }

  async function edit(id: string, newTitle: string): Promise<boolean> {
    const message = validate(newTitle);
    if (message) {
      setError(message);
      return false;
    }

    setError(null);
    const trimmed = newTitle.trim();
    await withSaving(SAVE_DELAY_MS, () => {
      setTodos((current) => current.map((t) => (t.id === id ? { ...t, title: trimmed } : t)));
    });
    return true;
  }

  function clearCompleted() {
    void withSaving(CLEAR_DELAY_MS, () => {
      setTodos((current) => current.filter((t) => !t.completed));
    });
  }

  function logout() {
    clearUser();
    navigate('/login');
  }

  return (
    <>
      <Header user={user} onLogout={logout} />

      <main className="card">
        <h1>My tasks</h1>

        <form className="todo-form" onSubmit={handleSubmit}>
          <label htmlFor="new-todo" className="visually-hidden">
            New task
          </label>
          <input
            id="new-todo"
            name="title"
            type="text"
            placeholder="What needs to be done?"
            autoComplete="off"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <button type="submit" disabled={busy}>
            Add
          </button>
        </form>

        {error && (
          <p className="error" role="alert">
            {error}
          </p>
        )}

        <Filters value={filter} onChange={setFilter} />

        <ul className="todo-list" data-testid="todo-list">
          {visible.map((todo) => (
            <TodoItem
              key={todo.id}
              todo={todo}
              busy={busy}
              onToggle={toggle}
              onDelete={remove}
              onEdit={edit}
            />
          ))}
        </ul>

        {todos.length === 0 && <p className="empty">Nothing here yet. Add your first task!</p>}

        <footer className="footer">
          <span className="footer-left" data-testid="items-left">
            {left} {left === 1 ? 'item' : 'items'} left
          </span>
          <span className="footer-center status" aria-live="polite" data-testid="saving-indicator">
            {busy && (
              <>
                <span className="spinner" aria-hidden="true" />
                Saving…
              </>
            )}
          </span>
          <button
            id="clear-completed"
            className="footer-right"
            type="button"
            disabled={busy || !hasCompleted}
            onClick={clearCompleted}
          >
            Clear completed
          </button>
        </footer>
      </main>
    </>
  );
}
