// @ts-check
const { test, expect } = require('@playwright/test');

test.beforeEach(async ({ page }) => {
  await page.goto('https://ripbawbanking.onrender.com/');
})

test('Homepage Live', async ({ page }) => {
  await expect(page).toHaveTitle(/Ripaw Banking/);
});

//Main Page Cards

test.describe('Homepage Cards', () => {
  
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

});

// Login & Signup Buttons

test.describe('Login & Signup Actions', () => {
 
  test('Dropdown Menu Login', async ({ page }) => {

    const dropDown = page.getByRole('button').first();
    await dropDown.click();
  
    const loginButton = page.locator('button', { hasText: 'Log In' }).first();
    await loginButton.click();
  
    const emailInput = page.getByLabel('Email');
    await expect(emailInput).toBeVisible();
  
    const passInput = page.getByLabel('Password');
    await expect(passInput).toBeVisible();
  
  });

  

  test('Footer Login', async ({ page }) => {

    const footerLogin = page.getByRole('button', { name: 'Log In' });
    await footerLogin.click();

    const emailInput = page.getByLabel('Email')
    await expect(emailInput).toBeVisible();

    const passInput = page.getByLabel('Password');
    await expect(passInput).toBeVisible();

  });


})