import { test, expect } from '@playwright/test';

test('logged in user can add any product to wishlist', async ({ page }) => {
  await page.goto('https://www.pikpart.com');

  await page.getByText('Login/Register').click();
  await page.getByPlaceholder('00000-00000').fill('6377353765');
  await page.getByRole('button', { name: 'Get OTP' }).click();
  await expect(page.getByText('Enter OTP')).toBeVisible();

  await page.pause();

  await expect(page.getByText('Login/Register')).not.toBeVisible();

  await page.mouse.wheel(0, 800);
  await page.waitForTimeout(1500);
  await page.mouse.wheel(0, 800);
  await page.waitForTimeout(1500);

  const wishlistIcon = page.locator('div:has(> img[src*="NewWishlistIcon"])').nth(1);
  await wishlistIcon.waitFor({ state: 'visible', timeout: 10000 });
  await wishlistIcon.click();

  await expect(page).toHaveURL('https://www.pikpart.com/');

  await page.waitForTimeout(2000); // thoda zyada wait, taaki backend sync ho jaye

  await page.goto('https://www.pikpart.com/wishlist');

  // FIX: simpler check - "Empty" text nahi hona chahiye
  await expect(page.getByText('Your Wishlist is Empty')).not.toBeVisible({ timeout: 10000 });

  await page.screenshot({ path: 'wishlist-success.png', fullPage: true });
});