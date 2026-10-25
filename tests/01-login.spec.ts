import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/login');
});

test('valid credentials open the task page', async ({ page }) => {
  await page.getByLabel('Username').fill('student');
  await page.getByLabel('Password').fill('qa2026');
  await page.getByRole('button', { name: 'Sign in' }).click();

  await expect(page).toHaveURL('/');
  await expect(page.getByRole('heading', { name: 'My tasks' })).toBeVisible();
  await expect(page.getByTestId('greeting')).toHaveText('Hi, student');
});

test('invalid credentials show an error and keep the form', async ({ page }) => {
  await page.getByLabel('Username').fill('student');
  await page.getByLabel('Password').fill('wrong-password');
  await page.getByRole('button', { name: 'Sign in' }).click();

  await expect(page.getByRole('alert')).toHaveText('Invalid username or password');
  // Regex: the URL must end with "/login" (the backslash escapes the slash,
  // "$" means end of string). Any host or port before it is fine.
  await expect(page).toHaveURL(/\/login$/);

  // The form keeps what the user typed, so they can fix just the password.
  await expect(page.getByLabel('Username')).toHaveValue('student');
  await expect(page.getByLabel('Password')).toHaveValue('wrong-password');

  // The button was disabled during the fake request and must be usable again.
  await expect(page.getByRole('button', { name: 'Sign in' })).toBeEnabled();
});
