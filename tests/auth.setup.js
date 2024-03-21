import { test as setup } from '@playwright/test';

// Currently getting the user.json but we are unable to properly use it for validation.
// Come back later to try again.

const userFile = 'playwright/.auth/user.json';

setup('authenticate as user', async ({ request }) => {
  await request.post('https://ripbawbanking.onrender.com/login', {
    form: {
      'user': 'demo@aa.io',
      'password': 'password'
    }
  });
  await request.storageState({ path: userFile });
});