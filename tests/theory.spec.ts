import { test, expect } from '@playwright/test';

test('theory page shows blocks and korean learning card', async ({ page }) => {
  await page.goto('/theory');

  await expect(page.getByRole('heading', { name: 'Teoría' })).toBeVisible();

  // Should show theory blocks from the API (first belt level)
  await expect(page.getByText('9º GUP')).toBeVisible();

  // Should show the Korean learning card
  await expect(page.getByText('Coreano')).toBeVisible();
});

test('clicking a theory block shows its content', async ({ page }) => {
  await page.goto('/theory');

  // Click on the first theory block
  await page.getByRole('link', { name: /9º GUP/i }).click();

  // Should show some content (theory block detail page)
  await expect(
    page.locator('article, section, .card, [class*="card"]').first()
  ).toBeVisible();
});

test('korean learning shows vocabulary categories', async ({ page }) => {
  await page.goto('/theory/learn-korean');

  // Should show the categories heading and category buttons with word counts
  await expect(page.getByText('Aprende coreano')).toBeVisible();
  await expect(
    page
      .getByRole('button')
      .filter({ hasText: /palabras/ })
      .first()
  ).toBeVisible();
});

test('korean quiz flow works end to end', async ({ page }) => {
  await page.goto('/theory/learn-korean');

  // Click on the first category
  await page
    .getByRole('button')
    .filter({ hasText: /palabras/ })
    .first()
    .click();

  // Should be in study view — click "Hacer quiz" to start
  await page.getByRole('button', { name: /Hacer quiz/i }).click();

  // Should show the first question
  await expect(page.getByText(/Pregunta 1/)).toBeVisible();

  // Answer the question by clicking the first answer option
  await page.locator('button.border-gray-200').first().click();

  // Should show the "Siguiente" button after answering
  await expect(page.getByRole('button', { name: 'Siguiente' })).toBeVisible();
});
