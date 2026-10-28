---
description: Playwright agents - plan, generate and heal in one go
---

Produce test coverage for: $ARGUMENTS

Requirements: `docs/app-spec.md`. Seed file: `tests/seed.spec.ts`. Test plan file: a new file under `specs/` named after the task.

1. Call the `playwright-test-planner` subagent with the task, the seed file and the plan file.
2. For each test case from the test plan file (1.1, 1.2, ...), one after another, not in parallel,
   call the `playwright-test-generator` subagent with the suite name, the test name,
   the target file under `tests/`, the seed file and the test case body.
3. Call the `playwright-test-healer` subagent: run all tests and fix the failing ones one after another.
