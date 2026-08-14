import { test, expect } from '@playwright/test';

test('logged in user can add a product to cart', async ({ page }) => {
  await page.goto('https://www.pikpart.com');

  await page.getByText('Login/Register').click();
  await page.getByPlaceholder('00000-00000').fill('6377353765');
  await page.getByRole('button', { name: 'Get OTP' }).click();
  await expect(page.getByText('Enter OTP')).toBeVisible();

  await page.pause();

  await expect(page.getByText('Login/Register')).not.toBeVisible();

  const product = page.getByText('Rear Fender Fit For Xl-Super Red');
  await product.scrollIntoViewIfNeeded();
  await page.getByRole('button', { name: 'ADD TO CART' }).first().click();

  // Verify "ADD TO CART" button is replaced by quantity stepper (proves item was added)
  await expect(page.getByRole('button', { name: 'ADD TO CART' }).first()).not.toBeVisible({ timeout: 5000 });

  await page.screenshot({ path: 'after-add-to-cart.png' });
});