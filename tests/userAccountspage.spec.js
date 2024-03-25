const { test, expect } = require('@playwright/test');

test.beforeEach(async ({ page }) => {
  await page.goto('https://ripbawbanking.onrender.com/login');
})

test('Accounts - Page Live', async ({ page }) => {
  await expect(page).toHaveTitle(/Ripaw Banking/);
});

test('Accounts - Displays accounts', async ({ page }) => {
    await page.getByRole('button', { name: 'Demo User' }).click();
    await page.getByText('Accounts:Users are able to:').click();
    await page.getByText('#1 - Checking').click();
    const transHistory = page.getByRole('link', { name: 'View transaction history' })
    await expect(transHistory).toBeVisible();
});

test('Accounts - Displays transactions for account', async ({ page }) => {
    await page.getByRole('button', { name: 'Demo User' }).click();
    await page.getByText('Accounts:Users are able to:').click();
    await page.locator('text=/^#\\d+ - .*$/').first().click();
    const transaction = page.locator('div').filter({ hasText: /\d{4}-\d{2}-\d{2}/ }).first();
    await expect(transaction).toBeVisible();
});


test('Accounts - Transaction History Reroute', async ({ page }) => {
    await page.getByRole('button', { name: 'Demo User' }).click();
    await page.getByText('Accounts:Users are able to:').click();
    page.locator('text=/^#\\d+ - .*$/').first().click();
    await page.getByRole('link', { name: 'View transaction history' }).click();
    const filterText = page.locator('div').filter({ hasText: /Filters:All Accounts \d+: .*/ }).nth(0);
    await expect(filterText).toBeVisible();
});

test('Accounts - New Account Creation', async ({ page }) => {
    await page.getByRole('button', { name: 'Demo User' }).click(); 
    await page.getByText('Accounts:Users are able to:').click();
    await expect(page.getByRole('button', { name: 'Options' })).toBeVisible()
    await page.getByRole('button', { name: 'Options' }).click();
    await page.getByRole('button', { name: 'Open new Account' }).click();
    await page.getByLabel('Account Name').click();
    await page.getByLabel('Account Name').fill('Test Account 4');
    await page.getByRole('button', { name: 'Submit' }).click();
    await page.locator('text=/^#\\d+ - .*$/').last().click();
    await expect(page.getByText('No transaction history')).toBeVisible();
});

// await page.getByRole('button', { name: 'Options' }).click();
// await page.getByRole('button', { name: 'Edit an Account' }).click();
// await page.getByLabel('New Name').click();
// await page.getByLabel('New Name').fill('Oh No They Delete Me :(');
// await page.getByRole('button', { name: 'Submit' }).click();
// await page.getByRole('button', { name: 'Options' }).click();
// await page.getByRole('button', { name: 'Close an Account' }).click();
// await page.getByRole('button', { name: 'Submit' }).click();

  