import { test, expect } from '@playwright/test';

// Seed test for the Playwright agents (planner, generator, healer).
// The agents run this test first and continue from where it stops,
// so every scenario they explore or generate starts on the task page
// as a signed-in user with an empty list.
test.describe('QA Academy Todo', () => {
  test('seed', async ({ page }) => {
    await page.goto('/login');
    await page.getByLabel('Username').fill('student');
    await page.getByLabel('Password').fill('qa2026');
    await page.getByRole('button', { name: 'Sign in' }).click();
    await expect(page.getByRole('heading', { name: 'My tasks' })).toBeVisible();
  });
});
