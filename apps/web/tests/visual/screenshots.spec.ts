import { test, expect } from '@playwright/test';

const VIEWPORTS = [
  { width: 375, height: 667, name: 'mobile' },
  { width: 768, height: 1024, name: 'tablet' },
  { width: 1440, height: 900, name: 'desktop' },
];

const ROUTES = ['/', '/auth', '/privacy', '/terms'];

test.describe('Visual regression — full page screenshots', () => {
  for (const route of ROUTES) {
    for (const vp of VIEWPORTS) {
      test(`${route} @ ${vp.name}`, async ({ page }) => {
        await page.setViewportSize({ width: vp.width, height: vp.height });
        await page.goto(route, { waitUntil: 'networkidle' });
        await page.screenshot({
          path: `test-results/screenshots/${route.replace(/\//g, '_')}__${vp.name}.png`,
          fullPage: true,
        });
      });
    }
  }
});
