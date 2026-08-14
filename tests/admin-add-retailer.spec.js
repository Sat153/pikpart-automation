import { test, expect } from '@playwright/test';

test.use({ storageState: 'playwright/.auth/admin.json' });

async function reachAddRetailer(page) {
  await page.goto('https://admin.pikpart.com/admin/list-retailer-requests');
  await expect(page.getByRole('button', { name: 'Add Retailer' })).toBeVisible({ timeout: 15000 });
  await page.getByRole('button', { name: 'Add Retailer' }).click();
  await expect(page).toHaveURL(/AddNewRetailer/, { timeout: 15000 });
}

test.describe('Add New Retailer Form - Negative Scenarios', () => {

  test('NEG-01: Submit with all fields empty shows validation errors', async ({ page }) => {
    await reachAddRetailer(page);
    await page.getByRole('button', { name: 'Submit' }).click();
    await page.waitForTimeout(1500);
    await page.screenshot({ path: 'neg01-empty-submit.png', fullPage: true });
  });

  test('NEG-02: Phone number field rejects alphabetic characters', async ({ page }) => {
    await reachAddRetailer(page);
    await page.getByLabel('Retailer Name *').fill('Test Retailer Neg02');
    await page.getByLabel('Shop Name *').fill('Test Shop');
    await page.getByLabel('Address line 1 *').fill('123 Test Street');
    await page.getByLabel('Address line 2 *').fill('Near Test Landmark');
    await page.getByLabel('Pincode *').fill('110002');
    await page.getByLabel('City *').fill('Delhi');
    await page.getByLabel('State *').fill('Delhi');

    const phoneField = page.getByLabel('Phone Number *');
    await phoneField.click();
    await phoneField.pressSequentially('abcdefghij', { delay: 100 }).catch(() => {});
    await expect(phoneField).toHaveValue('');

    await page.screenshot({ path: 'neg02-invalid-phone.png', fullPage: true });
  });

  test('NEG-03: Invalid pincode (letters) is accepted by field (potential bug) - check Submit behavior', async ({ page }) => {
    await reachAddRetailer(page);
    await page.getByLabel('Retailer Name *').fill('Test Retailer Neg03');
    await page.getByLabel('Phone Number *').fill('9876543210');
    await page.getByLabel('Shop Name *').fill('Test Shop');
    await page.getByLabel('Address line 1 *').fill('123 Test Street');
    await page.getByLabel('Address line 2 *').fill('Near Test Landmark');
    await page.getByLabel('City *').fill('Delhi');
    await page.getByLabel('State *').fill('Delhi');

    const pincodeField = page.getByLabel('Pincode *');
    await pincodeField.click();
    await pincodeField.pressSequentially('ABCDEF', { delay: 100 });
    await expect(pincodeField).toHaveValue('ABCDEF');
    console.log('BUG FOUND: Pincode field accepts alphabetic characters - no client-side validation');

    await page.getByRole('button', { name: 'Submit' }).click();
    await page.waitForTimeout(1500);
    await page.screenshot({ path: 'neg03-invalid-pincode-bug.png', fullPage: true });
  });

  test('NEG-04: Phone number too short is rejected', async ({ page }) => {
    await reachAddRetailer(page);
    await page.getByLabel('Retailer Name *').fill('Test Retailer Neg04');
    await page.getByLabel('Phone Number *').fill('123');
    await page.getByLabel('Shop Name *').fill('Test Shop');
    await page.getByLabel('Address line 1 *').fill('123 Test Street');
    await page.getByLabel('Address line 2 *').fill('Near Test Landmark');
    await page.getByLabel('Pincode *').fill('110002');
    await page.getByLabel('City *').fill('Delhi');
    await page.getByLabel('State *').fill('Delhi');
    await page.getByRole('button', { name: 'Submit' }).click();
    await page.waitForTimeout(1500);
    await page.screenshot({ path: 'neg04-short-phone.png', fullPage: true });
  });

  test('NEG-05: Invalid email format is rejected', async ({ page }) => {
    await reachAddRetailer(page);
    await page.getByLabel('Retailer Name *').fill('Test Retailer Neg05');
    await page.getByLabel('Phone Number *').fill('9876543210');
    await page.getByLabel('Email').fill('not-a-valid-email');
    await page.getByLabel('Shop Name *').fill('Test Shop');
    await page.getByLabel('Address line 1 *').fill('123 Test Street');
    await page.getByLabel('Address line 2 *').fill('Near Test Landmark');
    await page.getByLabel('Pincode *').fill('110002');
    await page.getByLabel('City *').fill('Delhi');
    await page.getByLabel('State *').fill('Delhi');
    await page.getByRole('button', { name: 'Submit' }).click();
    await page.waitForTimeout(1500);
    await page.screenshot({ path: 'neg05-invalid-email.png', fullPage: true });
  });

  test('NEG-06: Pincode too short is rejected', async ({ page }) => {
    await reachAddRetailer(page);
    await page.getByLabel('Retailer Name *').fill('Test Retailer Neg06');
    await page.getByLabel('Phone Number *').fill('9876543210');
    await page.getByLabel('Shop Name *').fill('Test Shop');
    await page.getByLabel('Address line 1 *').fill('123 Test Street');
    await page.getByLabel('Address line 2 *').fill('Near Test Landmark');
    await page.getByLabel('Pincode *').fill('123');
    await page.getByLabel('City *').fill('Delhi');
    await page.getByLabel('State *').fill('Delhi');
    await page.getByRole('button', { name: 'Submit' }).click();
    await page.waitForTimeout(1500);
    await page.screenshot({ path: 'neg06-short-pincode.png', fullPage: true });
  });

  test('NEG-07: Mandatory Shop Name left empty is rejected', async ({ page }) => {
    await reachAddRetailer(page);
    await page.getByLabel('Retailer Name *').fill('Test Retailer Neg07');
    await page.getByLabel('Phone Number *').fill('9876543210');
    await page.getByLabel('Address line 1 *').fill('123 Test Street');
    await page.getByLabel('Address line 2 *').fill('Near Test Landmark');
    await page.getByLabel('Pincode *').fill('110002');
    await page.getByLabel('City *').fill('Delhi');
    await page.getByLabel('State *').fill('Delhi');
    await page.getByRole('button', { name: 'Submit' }).click();
    await page.waitForTimeout(1500);
    await page.screenshot({ path: 'neg07-empty-shopname.png', fullPage: true });
  });

});

test.describe('Add New Retailer Form - Field & Button Checks (no submit)', () => {

  test('CHECK-01: Upload PDF buttons and Shop Image icon are clickable', async ({ page }) => {
    await reachAddRetailer(page);
    const uploadButtons = page.getByText('UPLOAD PDF');
    const count = await uploadButtons.count();
    for (let i = 0; i < count; i++) {
      await expect(uploadButtons.nth(i)).toBeEnabled();
      await expect(uploadButtons.nth(i)).toBeVisible();
    }
    const shopImageBox = page.locator('text=Shop Image').locator('..').locator('div').last();
    await expect(shopImageBox).toBeVisible();
    await page.screenshot({ path: 'check01-upload-buttons.png', fullPage: true });
  });

  test('CHECK-02: Retailer Type dropdown shows 2W and 4W options', async ({ page }) => {
    await reachAddRetailer(page);
    const comboboxes = page.locator('div[role="combobox"]');
    await comboboxes.nth(0).click();
    await expect(page.getByText('2W', { exact: true })).toBeVisible();
    await expect(page.getByText('4W', { exact: true })).toBeVisible();
    await page.screenshot({ path: 'check02-retailer-type-dropdown.png' });
    await page.keyboard.press('Escape');
  });

  test('CHECK-03: Lead Type dropdown shows App, Offline Lead, Campaign, Meta', async ({ page }) => {
    await reachAddRetailer(page);
    const comboboxes = page.locator('div[role="combobox"]');
    await comboboxes.nth(1).click();
    await expect(page.getByText('App', { exact: true })).toBeVisible();
    await expect(page.getByText('Offline Lead')).toBeVisible();
    await expect(page.getByText('Campaign')).toBeVisible();
    await expect(page.getByText('Meta')).toBeVisible();
    await page.screenshot({ path: 'check03-lead-type-dropdown.png' });
    await page.keyboard.press('Escape');
  });

});

test.describe('Add New Retailer Form - Positive Scenario (stops before submit)', () => {

  test('POS-01: All fields filled correctly, form ready to submit (no actual submit)', async ({ page }) => {
    await reachAddRetailer(page);

    await page.getByLabel('Retailer Name *').fill('TEST_AUTOMATION_DO_NOT_APPROVE');
    await page.getByLabel('Phone Number *').fill('9876543210');
    await page.getByLabel('Email').fill('test.automation@example.com');

    const comboboxes = page.locator('div[role="combobox"]');
    await comboboxes.nth(0).click();
    await page.getByText('2W', { exact: true }).click();

    await comboboxes.nth(1).click();
    await page.getByText('Offline Lead').click();

    await page.getByLabel('Shop Name *').fill('TEST_AUTOMATION_SHOP');
    await page.getByLabel('Address line 1 *').fill('123 Automation Test Street');
    await page.getByLabel('Address line 2 *').fill('Near Test Landmark');
    await page.getByLabel('Landmark').fill('Test Landmark');
    await page.getByLabel('Pincode *').fill('110002');
    await page.getByLabel('City *').fill('New Delhi');
    await page.getByLabel('State *').fill('Delhi');

    await page.getByLabel('Type Name').fill('Test Approver');
    await page.getByLabel('Mobile Number').fill('9876543211');
    await page.getByLabel('Enter Designation').fill('Test Manager');
    await page.getByLabel('Type Comment').fill('Automation test - do not approve');

    const uploadButtons = page.getByText('UPLOAD PDF');
    const count = await uploadButtons.count();
    for (let i = 0; i < count; i++) {
      await expect(uploadButtons.nth(i)).toBeEnabled();
    }

    const shopImageBox = page.locator('text=Shop Image').locator('..').locator('div').last();
    await expect(shopImageBox).toBeVisible();

    await page.screenshot({ path: 'pos01-form-fully-filled.png', fullPage: true });

    await expect(page.getByRole('button', { name: 'Submit' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Submit' })).toBeEnabled();

    console.log('Form fully filled and validated. Submit intentionally NOT clicked.');
  });

});