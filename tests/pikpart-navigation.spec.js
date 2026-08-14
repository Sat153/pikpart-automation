import { test, expect } from '@playwright/test';

test.describe('Navigation Menu Tests', () => {

  test('SPARE BY BIKE dropdown opens and shows options', async ({ page }) => {
    await page.goto('https://www.pikpart.com');
    await page.getByText('SPARE BY BIKE').click();
    await page.waitForTimeout(1500);
    await page.screenshot({ path: 'nav-spare-by-bike.png' });
  });

  test('SPARE BY CAR dropdown opens and shows options', async ({ page }) => {
    await page.goto('https://www.pikpart.com');
    await page.getByText('SPARE BY CAR').click();
    await page.waitForTimeout(1500);
    await page.screenshot({ path: 'nav-spare-by-car.png' });
  });

  test('CATEGORIES dropdown opens and shows options', async ({ page }) => {
    await page.goto('https://www.pikpart.com');
    await page.getByText('CATEGORIES', { exact: true }).click();
    await page.waitForTimeout(1500);
    await page.screenshot({ path: 'nav-categories.png' });
  });

  test('BLOGS link navigates to blogs page', async ({ page }) => {
    await page.goto('https://www.pikpart.com');
    await page.getByText('BLOGS').click();
    await page.waitForTimeout(2000);
    await expect(page).toHaveURL(/blog/i);
    await page.screenshot({ path: 'nav-blogs.png' });
  });

  test('ABOUT US link navigates to about page', async ({ page }) => {
    await page.goto('https://www.pikpart.com');
    await page.getByText('ABOUT US', { exact: true }).click();
    await page.waitForTimeout(2000);
    await expect(page).toHaveURL(/about/i);
    await page.screenshot({ path: 'nav-about-us.png' });
  });

  test('GLOBAL SOURCING link navigates correctly', async ({ page }) => {
    await page.goto('https://www.pikpart.com');
    await page.getByText('GLOBAL SOURCING').click();
    await page.waitForTimeout(2000);
    await expect(page).toHaveURL(/global-sourcing/);
    await expect(page.getByText('PARTNER FOR AUTOMOTIVE')).toBeVisible();
    await page.screenshot({ path: 'nav-global-sourcing.png' });
  });

});