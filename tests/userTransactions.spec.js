const { test, expect } = require('@playwright/test');

test.beforeEach(async ({ page }) => {
    await page.goto('https://ripbawbanking.onrender.com/login');
    await page.getByRole('button', { name: 'Demo User' }).click();
    await page.getByText('Transactions:Users are able to:').click();
});

test('Transactions - Page Live', async ({ page }) => {
    await expect(page).toHaveTitle(/Ripaw Banking/);
});

// Add automations for transactions
// Add automations for messaging