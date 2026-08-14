import { test, expect } from '@playwright/test';

test('search for a product on PikPart', async ({ page }) => {
  // Go to the site
  await page.goto('https://uat.pikpart.com');

  // Click the search box and type a product name
  await page.click('input[placeholder="Search Products"]');
  await page.fill('input[placeholder="Search Products"]', 'chain cleaner');

  // Press Enter to search
  await page.keyboard.press('Enter');

  // Wait for results and verify something related shows up
  await expect(page.locator('body')).toContainText('chain cleaner', { ignoreCase: true });
});