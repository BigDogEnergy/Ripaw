import { test, expect } from '@playwright/test';

test('Login Functionality Test', async ({ page }) => {
    await page.goto('https://ripbawbanking.onrender.com/');
    await page.getByRole('button', { name: 'Log In' }).click();
    await page.getByLabel('Email').click();
    await page.getByLabel('Email').fill('demo@aa.io');
    await page.getByLabel('Email').press('Tab');
    await page.getByLabel('Password').fill('password');
    await page.locator('#modal-content').getByRole('button', { name: 'Log In' }).click();
    await expect(page.getByRole('link', { name: 'Accounts Account Details' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Transactions Transactions' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Messaging Messaging' })).toBeVisible();
});

test('Demo User Functionality Test', async ({ page }) => {
    await page.goto('https://ripbawbanking.onrender.com/login');
    await page.getByRole('button', { name: 'Demo User' }).click();
    await expect(page.getByRole('link', { name: 'Accounts Account Details' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Transactions Transactions' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Messaging Messaging' })).toBeVisible();
});