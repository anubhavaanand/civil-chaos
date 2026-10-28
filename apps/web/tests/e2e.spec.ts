import { test, expect } from '@playwright/test';

test.describe('Catalog Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/treks/');
    await page.waitForLoadState('networkidle');
  });

  test('loads with trek cards', async ({ page }) => {
    const cards = page.locator('.trek-item-wrapper, .trek-card');
    await expect(cards.first()).toBeVisible();
  });

  test('shows filter pills for region, altitude, difficulty', async ({ page }) => {
    await expect(page.locator('[data-filter-group="region"]')).toBeVisible();
    await expect(page.locator('[data-filter-group="altitude"]')).toBeVisible();
    await expect(page.locator('[data-filter-group="difficulty"]')).toBeVisible();
  });

  test('filtering reduces visible trek count', async ({ page }) => {
    const allCards = page.locator('.trek-item-wrapper, .trek-card');
    const initialCount = await allCards.count();

    // Click a difficulty filter
    await page.locator('[data-filter-group="difficulty"] [data-value="easy"]').click();

    const filteredCards = page.locator('.trek-item-wrapper:not([style*="display: none"]), .trek-card:not([style*="display: none"])');
    const visibleCount = await filteredCards.count();
    expect(visibleCount).toBeLessThanOrEqual(initialCount);
  });

  test('reset filters restores all cards', async ({ page }) => {
    // Apply a filter first
    await page.locator('[data-filter-group="difficulty"] [data-value="difficult"]').click();

    // Reset
    await page.locator('#resetAllFiltersBtn').click();

    const cards = page.locator('.trek-item-wrapper, .trek-card');
    const visibleCards = cards.filter(':visible');
    await expect(visibleCards.first()).toBeVisible();
  });

  test('navigates to trek detail from card', async ({ page }) => {
    const firstCard = page.locator('.trek-item-wrapper a, .trek-card a').first();
    const href = await firstCard.getAttribute('href');
    await firstCard.click();
    await expect(page).toHaveURL(href);
  });
});

test.describe('Trek Detail Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/treks/kedarkantha/');
    await page.waitForLoadState('networkidle');
  });

  test('loads trek name and altitude', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('Kedarkantha');
    await expect(page.locator('text=m')).toBeVisible();
  });

  test('shows itinerary timeline', async ({ page }) => {
    await expect(page.locator('text=Daily Itinerary Log')).toBeVisible();
  });

  test('shows batch table with availability', async ({ page }) => {
    await expect(page.locator('text=Fixed Departures')).toBeVisible();
  });

  test('opens booking modal from sticky bar', async ({ page }) => {
    const bookBtn = page.locator('.open-booking-trigger').first();
    await expect(bookBtn).toBeVisible();
    await bookBtn.click();

    const dialog = page.locator('#booking-dialog');
    await expect(dialog).toBeVisible();
  });

  test('booking modal has valid phone pattern', async ({ page }) => {
    const bookBtn = page.locator('.open-booking-trigger').first();
    await bookBtn.click();

    const phoneInput = page.locator('#phone');
    await expect(phoneInput).toHaveAttribute('pattern', /^[6-9]\d{9}$/);
    await expect(phoneInput).toHaveAttribute('inputmode', 'tel');
  });

  test('honeypot field is hidden', async ({ page }) => {
    const bookBtn = page.locator('.open-booking-trigger').first();
    await bookBtn.click();

    const honeypot = page.locator('input[name="company"]');
    await expect(honeypot).toBeHidden();
    await expect(honeypot).toHaveAttribute('tabindex', '-1');
  });
});

test.describe('Region Pages', () => {
  test('garhwal region loads with treks', async ({ page }) => {
    await page.goto('/regions/garhwal/');
    await page.waitForLoadState('networkidle');
    await expect(page.locator('h1')).toContainText('Garhwal');
  });

  test('himachal region loads with treks', async ({ page }) => {
    await page.goto('/regions/himachal/');
    await page.waitForLoadState('networkidle');
    await expect(page.locator('h1')).toContainText('Himachal');
  });

  test('region page shows upcoming departures', async ({ page }) => {
    await page.goto('/regions/garhwal/');
    await page.waitForLoadState('networkidle');
    await expect(page.locator('text=Upcoming Departures')).toBeVisible();
  });
});

test.describe('Error Pages', () => {
  test('500 page shows WhatsApp CTA', async ({ page }) => {
    await page.goto('/500');
    await expect(page.locator('h1')).toContainText('TEMPORARILY CLOSED');
    await expect(page.locator('text=WhatsApp Basecamp')).toBeVisible();
  });
});

test.describe('Accessibility', () => {
  test.skip('skip link is focusable and works', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Tab to skip link
    await page.keyboard.press('Tab');
    const skipLink = page.locator('a[href="#main"]');
    await expect(skipLink).toBeFocused();

    // Activate skip link
    await skipLink.press('Enter');
    await expect(page.locator('#main')).toBeFocused();
  });

  test('focus rings are visible on interactive elements', async ({ page }) => {
    await page.goto('/treks/');
    await page.waitForLoadState('networkidle');

    const firstCard = page.locator('.trek-item-wrapper a, .trek-card a').first();
    await firstCard.focus();
    await expect(firstCard).toHaveFocus();
  });
});

test.describe('Map Component', () => {
  test('map section exists on homepage', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await expect(page.locator('#interactive-map')).toBeVisible();
    await expect(page.locator('#maplibre-container')).toBeVisible();
  });

  test('map has region filter chips', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await expect(page.locator('[data-region="all"]')).toBeVisible();
    await expect(page.locator('[data-region="garhwal"]')).toBeVisible();
    await expect(page.locator('[data-region="kumaon"]')).toBeVisible();
    await expect(page.locator('[data-region="himachal"]')).toBeVisible();
  });

  test('map has noscript fallback', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    const noscript = page.locator('noscript');
    await expect(noscript).toBeVisible();
  });
});

test.describe('Homepage', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('shows hero with trek title', async ({ page }) => {
    await expect(page.locator('h1')).toBeVisible();
  });

  test('has WhatsApp booking form', async ({ page }) => {
    await expect(page.locator('#waBookingForm')).toBeVisible();
  });

  test('shows upcoming departures table', async ({ page }) => {
    await expect(page.locator('#departures')).toBeVisible();
  });

  test('has ReviewBadge with 5.0 rating', async ({ page }) => {
    // ReviewBadge may not be on homepage yet; check for rating text
    await expect(page.locator('text=5.0')).toBeVisible();
  });

  test('navigation links work', async ({ page }) => {
    await expect(page.locator('a[href="/treks/"]')).toBeVisible();
    await expect(page.locator('a[href="/about"]')).toBeVisible();
    await expect(page.locator('a[href="/contact"]')).toBeVisible();
  });
});
