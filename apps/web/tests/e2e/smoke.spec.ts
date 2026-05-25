import { test, expect } from '@playwright/test';

const PUBLIC_ROUTES = ['/', '/auth', '/privacy', '/terms', '/safety'];

test.describe('Smoke tests — public routes', () => {
  for (const route of PUBLIC_ROUTES) {
    test(`${route} loads with 200 and no console errors`, async ({ page }) => {
      const consoleErrors: string[] = [];
      page.on('console', (msg) => {
        if (msg.type() === 'error') consoleErrors.push(msg.text());
      });

      const resp = await page.goto(route, { waitUntil: 'networkidle' });
      expect(resp?.status()).toBe(200);
      expect(consoleErrors).toEqual([]);
    });
  }
});
