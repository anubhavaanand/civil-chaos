import { test, expect } from '@playwright/test';

const TREK_SLUG = 'kedarkantha';

test.describe('Booking Workflow E2E', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`/treks/${TREK_SLUG}`);
    await page.waitForLoadState('networkidle');
  });

  test('1. Opens booking dialog from trek detail page', async ({ page }) => {
    const bookBtn = page.locator('.open-booking-trigger').first();
    await expect(bookBtn).toBeVisible();

    await bookBtn.click();

    const dialog = page.locator('#booking-dialog');
    await expect(dialog).toBeVisible();

    const heading = page.locator('#booking-dialog h3');
    await expect(heading).toContainText('Reserve');
  });

  test('2. Selecting a batch pre-fills dates in booking dialog', async ({ page }) => {
    const batchBtn = page.locator('.open-booking-trigger[data-dates]').first();
    const dates = await batchBtn.getAttribute('data-dates');

    await batchBtn.click();

    const banner = page.locator('#selected-batch-banner');
    await expect(banner).toBeVisible();

    const dateText = page.locator('#selected-dates-text');
    await expect(dateText).toContainText(dates || '');
  });

  test('3. Phone input rejects numbers not starting with 6-9', async ({ page }) => {
    await page.locator('.open-booking-trigger').first().click();

    await page.fill('#phone', '1234567890');

    const phoneValid = await page.evaluate(() => {
      const input = document.getElementById('phone') as HTMLInputElement;
      return input.validity.valid;
    });
    expect(phoneValid).toBe(false);
  });

  test('4. Phone input rejects non-numeric input', async ({ page }) => {
    await page.locator('.open-booking-trigger').first().click();

    await page.fill('#phone', 'abcdefghij');

    const phoneValid = await page.evaluate(() => {
      const input = document.getElementById('phone') as HTMLInputElement;
      return input.validity.valid;
    });
    expect(phoneValid).toBe(false);
  });

  test('5. Phone input rejects 10-digit number starting with 5', async ({ page }) => {
    await page.locator('.open-booking-trigger').first().click();

    await page.fill('#phone', '5876543210');

    const phoneValid = await page.evaluate(() => {
      const input = document.getElementById('phone') as HTMLInputElement;
      return input.validity.valid;
    });
    expect(phoneValid).toBe(false);
  });

  test('6. Group size respects min/max constraints', async ({ page }) => {
    await page.locator('.open-booking-trigger').first().click();

    const groupInput = page.locator('#groupSize');
    const min = await groupInput.getAttribute('min');
    const max = await groupInput.getAttribute('max');
    expect(min).toBe('1');
    expect(max).toBe('15');
  });

  test('7. Honeypot field is hidden from visible users', async ({ page }) => {
    await page.locator('.open-booking-trigger').first().click();

    const honeypot = page.locator('input[name="company"]');
    await expect(honeypot).toBeHidden();
    await expect(honeypot).toHaveAttribute('tabindex', '-1');
  });

  test('8. Booking dialog closes on backdrop click', async ({ page }) => {
    await page.locator('.open-booking-trigger').first().click();

    const dialog = page.locator('#booking-dialog');
    await expect(dialog).toBeVisible();

    await page.mouse.click(10, 10);

    await expect(dialog).not.toBeVisible();
  });

  test('9. Booking dialog closes on close button', async ({ page }) => {
    await page.locator('.open-booking-trigger').first().click();

    const dialog = page.locator('#booking-dialog');
    await expect(dialog).toBeVisible();

    await page.click('#close-dialog-btn');

    await expect(dialog).not.toBeVisible();
  });

  test('10. Clear batch button removes batch selection', async ({ page }) => {
    const batchBtn = page.locator('.open-booking-trigger[data-dates]').first();
    await batchBtn.click();

    const banner = page.locator('#selected-batch-banner');
    await expect(banner).toBeVisible();

    await page.click('#clear-batch-btn');

    await expect(banner).toBeHidden();
  });
});
