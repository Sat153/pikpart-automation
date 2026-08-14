import { test, expect } from '@playwright/test';

test('admin can navigate to List Retailer Requests and see Add Retailer button', async ({ page }) => {
  await page.goto('https://admin.pikpart.com/login');

  await page.getByPlaceholder('Enter Your Email Address').fill('salesadmintest@gmail.com');
  await page.getByPlaceholder('Enter Password').fill('test@123');
  await page.getByRole('button', { name: 'Login' }).click();

  // FIX: exact: true, kyunki "Quotation Dashboard" bhi match ho raha tha
  await expect(page.getByText('Dashboard', { exact: true })).toBeVisible({ timeout: 10000 });

  await page.getByText('Business Units').click();
  await page.getByText('List Retailer Requests').click();

  await expect(page).toHaveURL(/list-retailer-requests/);
  await expect(page.getByRole('button', { name: 'Add Retailer' })).toBeVisible();

  await page.screenshot({ path: 'admin-list-retailer-requests.png', fullPage: true });
});