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

## AI test agents (lecture 8)

The project is set up for [Playwright Test Agents](https://playwright.dev/docs/test-agents): three agent definitions that an AI tool can run to plan, generate and repair tests. They were created with:

```bash
npx playwright init-agents --loop=claude
```

What it added:

| Path | What it is |
|---|---|
| `.claude/agents/playwright-test-planner.md` | Planner: explores the app and writes a test plan to `specs/` |
| `.claude/agents/playwright-test-generator.md` | Generator: turns one plan item into a test under `tests/` |
| `.claude/agents/playwright-test-healer.md` | Healer: runs the tests and fixes the failing ones |
| `.claude/commands/playwright-test-*.md` | Slash commands for Claude Code that call the agents |
| `docs/app-spec.md` | How the app must behave; the planner and the healer read it |
| `.mcp.json` | Starts the Playwright MCP server (`npx playwright run-test-mcp-server`) |
| `specs/` | Test plans written by the planner |
| `tests/seed.spec.ts` | Seed test: logs in and opens the task page; the agents start every scenario from there |

`docs/app-spec.md` is a short description of how the app must behave. The planner takes expected results from it, and the healer reads it before touching an assertion: if a test matches the spec and the app does not, the healer marks the test `test.fixme()` and reports a product bug instead of changing the expected value. Keep the spec accurate: the agents trust it over the running app.

One change was made to the generated planner: the `browser_run_code_unsafe` tool was removed from its tool list, so it explores the app with ordinary click / type / snapshot tools (easier to follow, and a `run_code` call hung in a rehearsal). The planner and the healer also got a paragraph about `docs/app-spec.md`. The agent files are plain Markdown, so such changes are normal; keep them in mind when you regenerate the agents after a Playwright update, because `init-agents` overwrites these files.

The agents are written for [Claude Code](https://code.claude.com). For VS Code + Copilot run `npx playwright init-agents --loop=vscode` instead; the files then go to `.github/agents/` and `.vscode/mcp.json`.

### Using the agents

Open Claude Code in the project folder (`claude`) and use the slash commands:

```text
/playwright-test-plan       plan the filters and the "items left" counter -> specs/filters.plan.md
/playwright-test-generate   generate the test for bullet 1.1 of the plan -> tests/filters/
/playwright-test-heal       run all tests and fix the failing ones
/playwright-test-coverage   all three in one go, for a feature you name
```

Or ask in plain words, for example: "Use the playwright-test-planner subagent to create a test plan for log out. Seed file: tests/seed.spec.ts. Test plan: specs/logout.plan.md".

The MCP server opens a visible browser by default, so you can watch the planner explore the app. Each agent run takes minutes, not seconds.

Always read what the agents produce: the planner can miss or invent behaviour, and the healer can make a test green by adapting it to a bug in the app.

## Project structure

```
src/
  main.tsx              entry point and routes
  store.ts              localStorage / sessionStorage helpers
  pages/TodoPage.tsx    task list page
  pages/LoginPage.tsx   sign-in page
  components/           Header, Filters, TodoItem, RequireAuth (route guard)
tests/
  seed.spec.ts          seed test for the AI agents: logs in and opens the task page
  01-login.spec.ts      valid login opens the task page, invalid login shows an error and keeps the form
  02-todos.spec.ts      logs in before each test, then: add, complete, edit, delete, clear completed
specs/                  test plans written by the planner agent
.claude/                agent definitions and slash commands for Claude Code
.mcp.json               Playwright MCP server config
playwright.config.ts
```

## Useful locators

`getByRole`, `getByLabel`, `getByPlaceholder`, `getByText`, `getByTestId('todo-item')`, `getByTestId('items-left')`, `getByTestId('saving-indicator')`.
