import { test, expect } from '@playwright/test';

// test.use({ storageState: 'playwright/.auth/user.json' });

// test('Logged-In Test', async ({ page }) => {
//     await page.goto('https://ripbawbanking.onrender.com/');
//     await page.context().storageState({ path: 'playwright/.auth/user.json' });
//     await expect(page.getByRole('link', { name: 'Accounts Account Details' })).toBeVisible();
//     await expect(page.getByRole('link', { name: 'Transactions Transactions' })).toBeVisible();
//     await expect(page.getByRole('link', { name: 'Messaging Messaging' })).toBeVisible();
// });

const userFile = 'playwright/.auth/user.json';

test.describe(() => {
    test.use({ storageState: userFile });
    test('Logged-In Test', async ({ page }) => {
        await page.goto('https://ripbawbanking.onrender.com/');
        await expect(page.getByRole('link', { name: 'Accounts Account Details' })).toBeVisible();
        await expect(page.getByRole('link', { name: 'Transactions Transactions' })).toBeVisible();
        await expect(page.getByRole('link', { name: 'Messaging Messaging' })).toBeVisible();
    });
});

