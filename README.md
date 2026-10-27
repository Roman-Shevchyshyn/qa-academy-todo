# QA Academy Todo

A small React + TypeScript todo app with Playwright end-to-end tests in the same project.

## Prerequisites

1. **Node.js 20 or newer** (22 LTS recommended). Download it from https://nodejs.org or install via `nvm`. `npm` comes with it.
2. **Git**, to clone the repository.
3. A terminal: Terminal / iTerm on macOS, PowerShell or Git Bash on Windows.

Check that everything is in place:

```bash
node -v    # v20.x or higher
npm -v     # 9.x or higher
git --version
```

## Step-by-step setup

```bash
# 1. Clone the repository and go into the folder
git clone https://github.com/Roman-Shevchyshyn/qa-academy-todo.git
cd qa-academy-todo

# 2. Install project dependencies (React, Vite, Playwright, ...)
#    npm ci installs the exact versions from package-lock.json
npm ci

# 3. Download the browser Playwright will use for tests (one-time, ~100 MB)
npx playwright install chromium
```

On Linux, use `npx playwright install --with-deps chromium` to also install the system libraries the browser needs.

## Run the app

```bash
npm run dev
```

Open http://localhost:5173 in your browser. You will land on the login page; sign in with `student` / `qa2026`.
Stop the server with `Ctrl + C`.

Port 5173 must be free: if another program is using it, `npm run dev` stops with an error instead of switching to a different port.

## Run the tests

```bash
npm test
```

You do not need to start the app first: the `webServer` entry in `playwright.config.ts` starts `npm run dev` on its own and waits until the app responds. If the app is already running, Playwright reuses it.

Other useful ways to run them:

```bash
npm run test:headed   # watch the browser while tests run
npm run test:ui       # Playwright UI Mode: step through tests, inspect locators
npm run test:debug    # Playwright Inspector: pause and step through each action
npm run test:report   # open the HTML report of the last run
```

## Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Start the app in dev mode on port 5173 |
| `npm run build` | Type-check and build for production |
| `npm test` | Run all Playwright tests headless |
| `npm run test:headed` | Same, with a visible browser |
| `npm run test:ui` | Open Playwright UI Mode |
| `npm run test:debug` | Run tests in Playwright Inspector |
| `npm run test:report` | Open the last HTML report |

## The app

| Route | What is there |
|---|---|
| `/login` | Sign-in form. Valid credentials: `student` / `qa2026` |
| `/` | Task list: add, edit (Edit button or double-click), complete, delete, filters (All / Active / Completed), counter, "Clear completed" |

Signing in is required. Opening `/` without a session redirects to `/login`; after a successful login the app redirects back to `/`. The header shows `Hi, student` and a `Log out` button, which clears the session and returns to `/login`.

Every change (add, edit, complete, delete) goes through a fake 400 ms request: the controls are disabled and a `Saving…` indicator is shown. "Clear completed" takes 1.5 s.

Tasks live in `localStorage`, the session in `sessionStorage`. Playwright gives every test a fresh browser context, so tests never see each other's data.

## Project structure

```
src/
  main.tsx              entry point and routes
  store.ts              localStorage / sessionStorage helpers
  pages/TodoPage.tsx    task list page
  pages/LoginPage.tsx   sign-in page
  components/           Header, Filters, TodoItem, RequireAuth (route guard)
tests/
  01-login.spec.ts      valid login opens the task page, invalid login shows an error and keeps the form
  02-todos.spec.ts      logs in before each test, then: add, complete, edit, delete, clear completed
playwright.config.ts
```

## Useful locators

`getByRole`, `getByLabel`, `getByPlaceholder`, `getByText`, `getByTestId('todo-item')`, `getByTestId('items-left')`, `getByTestId('saving-indicator')`.
