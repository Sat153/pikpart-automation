import { test, expect } from '@playwright/test';

test('logged in user can proceed through checkout up to payment page', async ({ page }) => {
  await page.goto('https://www.pikpart.com');

  await page.getByText('Login/Register').click();
  await page.getByPlaceholder('00000-00000').fill('6377353765');
  await page.getByRole('button', { name: 'Get OTP' }).click();
  await expect(page.getByText('Enter OTP')).toBeVisible();

  await page.pause();

  await expect(page.getByText('Login/Register')).not.toBeVisible();

  const product = page.getByText('Rear Fender Fit For Xl-Super Red');
  await product.scrollIntoViewIfNeeded();

  const addToCartBtn = page.getByRole('button', { name: 'ADD TO CART' }).first();
  if (await addToCartBtn.isVisible().catch(() => false)) {
    await addToCartBtn.click();
    await expect(addToCartBtn).not.toBeVisible({ timeout: 10000 });
  }

  await page.locator('div:has(> img[src*="CartIcon"])').click();
  await expect(page.getByText('PRICE DETAILS')).toBeVisible({ timeout: 10000 });

  await page.getByText('SELECT ADDRESS').click();
  await expect(page.getByText('SELECT DELIVERY ADDRESS')).toBeVisible();

  await page.locator('input[type="radio"]').first().click();
  await expect(page.getByText('Deliver to')).toBeVisible({ timeout: 10000 });

  // FIX: getByText use karo, getByRole nahi
  await page.getByText('CHECKOUT').click();

  await page.waitForTimeout(10000);
  await page.screenshot({ path: 'checkout-page.png', fullPage: true });
});