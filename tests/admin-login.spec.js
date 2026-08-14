import { test, expect } from '@playwright/test';

test('admin can login with email and password', async ({ page }) => {
  await page.goto('https://admin.pikpart.com/login');

  // Apna real admin email/password yahan daalo (VS Code mein, edit karke)
  await page.getByPlaceholder('Enter Your Email Address').fill('salesadmintest@gmail.com');
  await page.getByPlaceholder('Enter Password').fill('test@123');

  await page.getByRole('button', { name: 'Login' }).click();

  // Login ke baad kya hota hai dekhne ke liye wait + screenshot
  await page.waitForTimeout(3000);
  await page.screenshot({ path: 'admin-login-result.png', fullPage: true });
});