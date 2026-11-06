import { test, expect } from '@playwright/test';

test('exam list shows all belt levels', async ({ page }) => {
  await page.goto('/');

  // Should see the exams page with belt entries
  await expect(page.getByRole('heading', { name: 'Exámenes' })).toBeVisible();

  // Current exam card should be visible
  await expect(page.getByText('Actual')).toBeVisible();
});

test('clicking an exam shows its required tules', async ({ page }) => {
  await page.goto('/');

  // Click on the first exam (Blanco punta amarilla)
  await page.getByRole('link', { name: 'Blanco punta amarilla' }).click();

  // Should see the exam detail with required tules
  await expect(page.getByText('Tules')).toBeVisible();
});

test('clicking a tul from exam detail navigates to tul page', async ({
  page,
}) => {
  await page.goto('/');

  await page.getByRole('link', { name: 'Blanco punta amarilla' }).click();
  await expect(page.getByText('Tules')).toBeVisible();

  // Click on a tul in the list (accessible name from aria-label)
  await page
    .getByRole('link', { name: /Ir a la forma Saju Jirugi/i })
    .click();

  // Should see the tul detail page with diagram and meaning
  await expect(page.locator('section')).toContainText('Diagrama');
});
