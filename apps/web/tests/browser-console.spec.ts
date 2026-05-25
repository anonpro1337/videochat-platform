import { test, expect } from '@playwright/test';

const ALL_ROUTES = ['/', '/auth', '/chat', '/explore', '/premium', '/profile', '/video', '/privacy', '/terms', '/safety', '/sitemap.xml'];
const BASE_URL = 'https://chatvibe-web.vercel.app';

test.describe('Browser console errors — all routes', () => {
  for (const route of ALL_ROUTES) {
    test(`${route} has no console errors`, async ({ page }) => {
      const errors: string[] = [];
      const warnings: string[] = [];
      const pageErrors: string[] = [];

      page.on('console', (msg) => {
        if (msg.type() === 'error') errors.push(msg.text());
        if (msg.type() === 'warning') warnings.push(msg.text());
      });
      page.on('pageerror', (err) => pageErrors.push(err.message));

      const resp = await page.goto(`${BASE_URL}${route}`, {
        waitUntil: 'networkidle',
        timeout: 20000,
      });

      await page.waitForTimeout(1500);

      expect(resp?.status()).toBe(200);
      expect(errors).toEqual([]);
      expect(pageErrors).toEqual([]);
    });
  }
});

test.describe('Broken resources', () => {
  test('no images or scripts return 4xx/5xx', async ({ page }) => {
    const failed: string[] = [];
    page.on('response', (resp) => {
      if (resp.status() >= 400 && resp.url().startsWith(BASE_URL)) {
        failed.push(`${resp.url()} -> ${resp.status()}`);
      }
    });
    await page.goto(BASE_URL, { waitUntil: 'networkidle' });
    expect(failed).toEqual([]);
  });
});
