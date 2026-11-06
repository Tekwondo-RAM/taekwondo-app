import { test, expect } from '@playwright/test';

test('can navigate to a tul and see its details', async ({ page }) => {
  // We're already logged in (storageState loaded by config)
  await page.goto('/');

  // Navigate into a specific exam belt
  await page.getByRole('link', { name: 'Blanco punta amarilla' }).click();

  // Click on a specific tul
  await page.getByRole('link', { name: 'Ir a la forma Saju Jirugi' }).click();

  // Verify we landed on the detail page
  await expect(page.locator('section')).toContainText('Diagrama');
});
