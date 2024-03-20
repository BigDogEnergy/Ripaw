// @ts-check
const { test, expect } = require('@playwright/test');

test.beforeEach(async ({ page }) => {
  await page.goto('https://ripbawbanking.onrender.com/');
})

test('Homepage Navigation', async ({ page }) => {
  await expect(page).toHaveTitle(/Ripaw Banking/);
});

//Profile Dropdown exists

test('Dropdown Menu', async ({ page }) => {
  const dropDown = page.getByRole('button').first();
  await dropDown.click();
});

//Main Page Cards

test('Account Card reroute to login', async ({ page }) => {
  const acctCard = page.getByText('Accounts:Users are able to:');
  await acctCard.click();
  await page.waitForURL('**/login');
});

test('Transaction Card reroute to login', async({ page }) => {
  const transCard = page.getByText('Transactions:Users are able to:');
  await transCard.click();
  await page.waitForURL('**/login');
});

test('Messaging Card reroute to login', async({ page }) => {
  const transCard = page.getByText('Messaging:Users are able to:');
  await transCard.click();
  await page.waitForURL('**/login');
});