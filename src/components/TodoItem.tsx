import { useEffect, useRef, useState, type KeyboardEvent } from 'react';
import { randomId, type Todo } from '../store';

interface TodoItemProps {
  todo: Todo;
  busy: boolean;
  onToggle: (id: string, completed: boolean) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string, title: string) => Promise<boolean>;
}

export function TodoItem({ todo, busy, onToggle, onDelete, onEdit }: TodoItemProps) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(todo.title);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editing) inputRef.current?.focus();
  }, [editing]);

  function startEditing() {
    setDraft(todo.title);
    setEditing(true);
  }

  function cancelEditing() {
    setDraft(todo.title);
    setEditing(false);
  }

  async function save() {
    const ok = await onEdit(todo.id, draft);
    if (ok) setEditing(false);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Enter') void save();
    if (event.key === 'Escape') cancelEditing();
  }

  if (editing) {
    return (
      <li className="todo-item editing" data-testid="todo-item">
        <input
          ref={inputRef}
          type="text"
          aria-label="Edit task"
          value={draft}
          disabled={busy}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button type="button" className="small" disabled={busy} onClick={save}>
          Save
        </button>
        <button type="button" className="small secondary" disabled={busy} onClick={cancelEditing}>
          Cancel
        </button>
      </li>
    );
  }

  return (
    <li
      // Unstable id: changes on every render, so do not rely on it in tests.
      id={randomId()}
      className={'todo-item' + (todo.completed ? ' completed' : '')}
      data-testid="todo-item"
    >
      <input
        type="checkbox"
        checked={todo.completed}
        disabled={busy}
        aria-label={`Mark "${todo.title}" as completed`}
        onChange={(e) => onToggle(todo.id, e.target.checked)}
      />
      {/* Double-click the title to edit it (shows dblclick() in Playwright). */}
      <span className="title" onDoubleClick={startEditing}>
        {todo.title}
      </span>
      <button
        type="button"
        className="small secondary"
        disabled={busy}
        aria-label={`Edit "${todo.title}"`}
        onClick={startEditing}
      >
        Edit
      </button>
      <button
        type="button"
        className="delete"
        disabled={busy}
        aria-label={`Delete "${todo.title}"`}
        onClick={() => onDelete(todo.id)}
      >
        ✕
      </button>
    </li>
  );
}
