---
description: Playwright generator - turn one plan item into a test
---

Use the `playwright-test-generator` subagent to generate a test from the test plan.

Plan item: $ARGUMENTS

If no item is given, generate the test for bullet 1.1 of `specs/filters.plan.md`.

- Test plan: `specs/filters.plan.md`
- Requirements: `docs/app-spec.md`
- Seed file: `tests/seed.spec.ts`
- Save generated tests under `tests/filters/`
