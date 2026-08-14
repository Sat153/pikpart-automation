import { test, expect } from '@playwright/test';

test('homepage displays trending products', async ({ page }) => {
  await page.goto('https://www.pikpart.com');

  // Verify Trending Products section exists
  await expect(page.getByText('Trending Products')).toBeVisible();

  // Verify at least one product card is visible (adjust text once confirmed)
  await expect(page.getByText('Horn Switch For Deo')).toBeVisible();
});

test('user can click into a product detail page', async ({ page }) => {
  await page.goto('https://www.pikpart.com');

  // Click on a specific product name
  await page.getByText('Horn Switch For Deo').click();

  // Verify we navigated to a product page (URL should change)
  await expect(page).toHaveURL(/.+/); // basic check - we'll refine after seeing real URL
});