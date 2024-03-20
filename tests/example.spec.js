// @ts-check
const { test, expect } = require('@playwright/test');

test('has title', async ({ page }) => {
  await page.goto('https://ripbawbanking.onrender.com/');
  //Playwright is Async 
  //waits for: Stylesheets, Scripts, Iframes, Images, Ready to be interacted with

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Ripaw Banking/);
});

// test('get started link', async ({ page }) => {
//   await page.goto('https://ripbawbanking.onrender.com/');

//   // Click the get started link.
//   await page.getByRole('link', { name: 'Get started' }).click();

//   // Expects page to have a heading with the name of Installation.
//   await expect(page.getByRole('heading', { name: 'Installation' })).toBeVisible();
// });
