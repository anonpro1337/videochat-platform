import { test, expect } from '@playwright/test';

const VIEWPORTS = [
  { width: 375, height: 667, name: 'mobile' },
  { width: 768, height: 1024, name: 'tablet' },
  { width: 1440, height: 900, name: 'desktop' },
];

test.describe('Responsive — homepage renders on all viewports', () => {
  for (const vp of VIEWPORTS) {
    test(`homepage at ${vp.name} (${vp.width}×${vp.height})`, async ({ page }) => {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      const resp = await page.goto('/', { waitUntil: 'networkidle' });
      expect(resp?.status()).toBe(200);
    });
  }
});
