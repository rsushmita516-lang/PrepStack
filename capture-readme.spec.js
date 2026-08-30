const { test } = require('@playwright/test');

test('capture app pages for README', async ({ page }) => {
  await page.goto('http://localhost:3000/login', { waitUntil: 'networkidle' });
  await page.screenshot({ path: 'docs/screenshots/login.png', fullPage: true });

  await page.getByRole('button', { name: 'Sign up' }).click();
  const email = `demo-${Date.now()}@prepstack.dev`;
  await page.getByLabel('Email').fill(email);
  await page.getByLabel('Password').fill('StrongPass123!');
  await page.getByRole('button', { name: 'Create account' }).click();

  await page.waitForURL('**/dashboard', { timeout: 30000 });
  await page.screenshot({ path: 'docs/screenshots/dashboard.png', fullPage: true });

  await page.goto('http://localhost:3000/problems', { waitUntil: 'networkidle' });
  await page.screenshot({ path: 'docs/screenshots/problems.png', fullPage: true });

  await page.goto('http://localhost:3000/articles', { waitUntil: 'networkidle' });
  await page.screenshot({ path: 'docs/screenshots/articles.png', fullPage: true });
});
