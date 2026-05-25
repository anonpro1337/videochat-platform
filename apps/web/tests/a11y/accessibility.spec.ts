import { test, expect } from '@playwright/test';

test.describe('Accessibility checks', () => {
  test('homepage has no critical axe violations', async ({ page }) => {
    await page.goto('/', { waitUntil: 'networkidle' });

    await page.addScriptTag({
      url: 'https://cdnjs.cloudflare.com/ajax/libs/axe-core/4.10.0/axe.min.js',
    });
    const results = await page.evaluate(() => (window as any).axe.run());
    const violations = results.violations;

    const critical = violations.filter(
      (v: any) => v.impact === 'critical' || v.impact === 'serious',
    );
    expect(critical).toEqual([]);
  });
});
