# QA Academy Todo: how the app must behave

This is the source of truth for expected behaviour. When a test and the app disagree, check this document first:
if the test matches the spec and the app does not, it is a product bug, not a test bug.

## Login (`/login`)

- Fields: `Username`, `Password`; button `Sign in`.
- Valid credentials: `student` / `qa2026`. After a successful login the app redirects to `/`.
- Invalid credentials: the page stays on `/login`, shows the alert `Invalid username or password`, keeps the typed values in both fields, and the `Sign in` button is enabled again.
- While the request is in flight (about 400 ms) the `Sign in` button is disabled.
- Opening `/` without a session redirects to `/login`.

## Header

- Shows `Hi, <username>` and a `Log out` button. `Log out` clears the session and returns to `/login`.

## Tasks (`/`)

- Heading: `My tasks`. Input labelled `New task` (placeholder `What needs to be done?`), button `Add`. Enter in the input also adds.
- A task title is trimmed. Empty title: error `Task title cannot be empty`. Longer than 60 characters: error `Task title is too long (max 60 characters)`. Nothing is added in both cases.
- Every change (add, edit, complete, delete) takes about 400 ms: the controls are disabled and `Saving…` is shown. The input is cleared after a successful add.
- Each task row (`data-testid="todo-item"`) has: a checkbox named `Mark "<title>" as completed`, the title, an `Edit "<title>"` button and a `Delete "<title>"` button.
- Edit: the `Edit` button or a double-click on the title opens an input labelled `Edit task` with `Save` and `Cancel`. Enter saves, Escape cancels. The same title rules apply.
- Completed tasks keep their row; the title is shown struck through.
- Empty list (no tasks at all): the message `Nothing here yet. Add your first task!` is shown.
- Tasks persist in the browser (`localStorage`); the session does not survive a new browser context.

## Filters

- A button group named `Filter tasks` with `All`, `Active`, `Completed`. Exactly one is pressed (`aria-pressed="true"`); `All` is pressed by default.
- `All` shows every task. `Active` shows only uncompleted tasks. `Completed` shows only completed tasks.
- Changing a task while a filter is on updates the list immediately (for example, completing a task under `Active` removes it from view).
- A filter with no matching tasks shows an empty list and no "Nothing here yet" message.
- The filter is not part of the URL and resets to `All` after a reload.

## Items-left counter (`data-testid="items-left"`)

- Counts uncompleted tasks only, regardless of the active filter.
- Wording: `0 items left`, `1 item left`, `2 items left`, `3 items left` and so on. Singular `item` only for exactly 1.

## Clear completed

- The `Clear completed` button is disabled when there are no completed tasks.
- Clicking it removes every completed task. It takes about 1.5 s (`Saving…` is shown); no other control is usable meanwhile.
