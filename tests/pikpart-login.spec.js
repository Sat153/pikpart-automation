import { test, expect } from '@playwright/test';

test('user can complete login with real OTP', async ({ page }) => {
  await page.goto('https://www.pikpart.com');
  await page.getByText('Login/Register').click();

  await expect(page.getByText('Login as')).toBeVisible();

  await page.getByPlaceholder('00000-00000').fill('6377353765');
  await page.getByRole('button', { name: 'Get OTP' }).click();

  await expect(page.getByText('Enter OTP')).toBeVisible();

  await page.pause();

  // Confirm login succeeded: Login/Register replaced by account menu
  await expect(page.getByText('Login/Register')).not.toBeVisible({ timeout: 15000 });
});