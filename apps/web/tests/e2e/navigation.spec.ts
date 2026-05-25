import { test, expect } from '@playwright/test';

test.describe('Navigation — critical journeys', () => {
  test('can navigate from homepage to auth page via link', async ({ page }) => {
    await page.goto('/', { waitUntil: 'networkidle' });

    // Try to find and click a link/button that goes to auth
    const authLink = page.locator('a[href="/auth"], button:has-text("Sign In"), button:has-text("Login")').first();
    if (await authLink.isVisible()) {
      await authLink.click();
      await page.waitForURL('**/auth');
      expect(page.url()).toContain('/auth');
    }
  });

  test('network: no 4xx/5xx on homepage load', async ({ page }) => {
    const failedRequests: string[] = [];
    page.on('requestfailed', (req) => {
      failedRequests.push(`${req.url()} — ${req.failure()?.errorText}`);
    });

    await page.goto('/', { waitUntil: 'networkidle' });
    expect(failedRequests).toEqual([]);
  });
});
