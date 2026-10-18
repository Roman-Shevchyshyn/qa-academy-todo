import { test, expect } from '@playwright/test';

// Every test needs a signed-in user, so we log in before each one.
test.beforeEach(async ({ page }) => {
  await page.goto('/login');
  await page.getByLabel('Username').fill('student');
  await page.getByLabel('Password').fill('qa2026');
  await page.getByRole('button', { name: 'Sign in' }).click();
  await expect(page.getByRole('heading', { name: 'My tasks' })).toBeVisible();
});

test('user can add a task', async ({ page }) => {
  await page.getByLabel('New task').fill('Buy milk');
  await page.getByRole('button', { name: 'Add' }).click();

  await expect(page.getByTestId('todo-item')).toHaveCount(1);
  await expect(page.getByTestId('todo-item')).toContainText('Buy milk');
  await expect(page.getByTestId('items-left')).toHaveText('1 item left');
});

test('user can complete a task', async ({ page }) => {
  await page.getByLabel('New task').fill('Write tests');
  await page.getByRole('button', { name: 'Add' }).click();

  await page.getByRole('checkbox', { name: 'Mark "Write tests" as completed' }).check();

  await expect(page.getByTestId('todo-item')).toHaveClass(/completed/);
  await expect(page.getByTestId('items-left')).toHaveText('0 items left');
});

test('user can edit a task', async ({ page }) => {
  await page.getByLabel('New task').fill('Draft title');
  await page.getByRole('button', { name: 'Add' }).click();

  await page.getByRole('button', { name: 'Edit "Draft title"' }).click();
  await page.getByLabel('Edit task').fill('Final title');
  await page.getByRole('button', { name: 'Save' }).click();

  await expect(page.getByTestId('todo-item')).toContainText('Final title');
  await expect(page.getByLabel('Edit task')).toHaveCount(0);
});

test('user can delete a task', async ({ page }) => {
  await page.getByLabel('New task').fill('Delete me');
  await page.getByRole('button', { name: 'Add' }).click();

  await page.getByRole('button', { name: 'Delete "Delete me"' }).click();

  await expect(page.getByTestId('todo-item')).toHaveCount(0);
});

test('clear completed removes finished tasks', async ({ page }) => {
  await page.getByLabel('New task').fill('Old task');
  await page.getByRole('button', { name: 'Add' }).click();
  await page.getByRole('checkbox', { name: 'Mark "Old task" as completed' }).check();

  await page.getByRole('button', { name: 'Clear completed' }).click();

  // Clearing takes 1.5 s in the app. No sleep is needed: expect() retries
  // the check until the list is empty or the 5 s timeout runs out.
  await expect(page.getByTestId('todo-item')).toHaveCount(0);
  await expect(page.getByText('Nothing here yet')).toBeVisible();
});
