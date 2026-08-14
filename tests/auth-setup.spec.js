import { test as setup, expect } from '@playwright/test';

const authFile = 'playwright/.auth/admin.json';

setup('authenticate as admin', async ({ page }) => {
  await page.goto('https://admin.pikpart.com/login');
  await page.getByPlaceholder('Enter Your Email Address').fill('salesadmintest@gmail.com');
  await page.getByPlaceholder('Enter Password').fill('test@123');
  await page.getByRole('button', { name: 'Login' }).click();
  await expect(page.getByText('Dashboard', { exact: true })).toBeVisible({ timeout: 15000 });

  await page.context().storageState({ path: authFile });
  console.log('Session saved successfully');
});