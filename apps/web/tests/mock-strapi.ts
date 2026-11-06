/**
 * Mock Strapi API responses for Playwright E2E tests.
 *
 * Intercepts /api/* requests and returns realistic fixture data so the
 * frontend can be exercised end-to-end without a live Strapi instance.
 *
 * Usage: call `mockStrapiAPI(page)` after `page.goto()` in test beforeEach.
 */

export async function mockStrapiAPI(page: any) {
  // Treks list
  await page.route('**/api/treks*', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        data: [
          {
            documentId: 'trek-1',
            id: 1,
            name: 'Kedarkantha Trek',
            slug: 'kedarkantha',
            summary: 'Classic Himalayan winter trek with summit views',
            description:
              'A beginner-friendly trek through pine forests to snowy meadows.',
            difficulty: 'moderate',
            durationDays: 6,
            maxAltitudeM: 3810,
            trekDistanceKm: 22,
            bestSeasons: ['dec_feb', 'mar_apr', 'nov'],
            startPoint: 'Sankri',
            coordinates: { lat: 31.0701, lng: 78.2575 },
            heroGallery: [],
            itinerary: [
              {
                day: 1,
                title: 'Arrival at Sankri',
                description: 'Drive from Dehradun to Sankri base village.',
                altitudeM: 1950,
                distanceKm: 10,
              },
              {
                day: 2,
                title: 'Sankri to Juda Ka Talab',
                description: 'Trek through pine forests to alpine lake.',
                altitudeM: 2700,
                distanceKm: 4,
              },
              {
                day: 3,
                title: 'Summit Push',
                description: 'Early morning ascent to Kedarkantha summit.',
                altitudeM: 3810,
                distanceKm: 6,
              },
            ],
            inclusions: 'Stay, meals, guide, permits',
            exclusions: 'Personal gear, travel to base',
            howToReach: 'Train/bus to Dehradun, shared taxi to Sankri',
            googleMapsEmbedUrl: null,
            faq: [
              {
                question: 'What is the difficulty level?',
                answer: 'Moderate — suitable for fit beginners.',
              },
              {
                question: 'What if weather closes the route?',
                answer: 'Reschedule with zero penalty.',
              },
            ],
            batches: [
              {
                documentId: 'batch-1',
                id: 1,
                trek: 'trek-1',
                startDate: '2026-12-15',
                endDate: '2026-12-20',
                seatsTotal: 12,
                seatsBooked: 3,
                status: 'open',
                pricePerPersonINR: 8500,
              },
              {
                documentId: 'batch-2',
                id: 2,
                trek: 'trek-1',
                startDate: '2026-12-22',
                endDate: '2026-12-27',
                seatsTotal: 12,
                seatsBooked: 9,
                status: 'open',
                pricePerPersonINR: 8500,
              },
            ],
            packages: [
              { documentId: 'pkg-1', id: 1, name: 'Basecamp', priceINR: 8500, durationDays: 6 },
              { documentId: 'pkg-2', id: 2, name: 'With Transport', priceINR: 12000, durationDays: 7 },
            ],
            isFeatured: true,
            seo: {
              metaTitle: 'Kedarkantha Trek',
              metaDescription: 'Classic Himalayan winter trek',
            },
            publishedAt: new Date().toISOString(),
          },
          {
            documentId: 'trek-2',
            id: 2,
            name: 'Kuari Pass Trek',
            slug: 'kuari-pass',
            summary: 'Panoramic views of Nanda Devi and surrounding peaks',
            description: "Curzon's Trail offering unobstructed views of the Garhwal Himalayas.",
            difficulty: 'moderate',
            durationDays: 5,
            maxAltitudeM: 3650,
            trekDistanceKm: 20,
            bestSeasons: ['mar_apr', 'dec_feb'],
            startPoint: 'Joshimath',
            coordinates: { lat: 30.5302, lng: 79.5679 },
            heroGallery: [],
            itinerary: [],
            inclusions: 'Stay, meals, guide',
            exclusions: 'Personal gear',
            howToReach: 'Train to Rishikesh, taxi to Joshimath',
            googleMapsEmbedUrl: null,
            faq: [],
            batches: [],
            packages: [],
            isFeatured: true,
            seo: {
              metaTitle: 'Kuari Pass Trek',
              metaDescription: 'Panoramic Garhwal Himalayan views',
            },
            publishedAt: new Date().toISOString(),
          },
        ],
        meta: { pagination: { page: 1, pageSize: 100, pageCount: 1, total: 2 } },
      }),
    });
  });

  // FAQs (homepage Field Briefing)
  await page.route('**/api/faqs*', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        data: [
          {
            documentId: 'faq-1',
            id: 1,
            question: 'What happens if weather closes the route?',
            answer: 'If unpassable weather closes a route, you reschedule to any future departure with zero penalty.',
            isPublished: true,
            order: 1,
          },
          {
            documentId: 'faq-2',
            id: 2,
            question: 'Who leads the expeditions?',
            answer: 'Every expedition leader is a native of Mautar trained at NIM with WFR certification.',
            isPublished: true,
            order: 2,
          },
        ],
        meta: {},
      }),
    });
  });

  // Site settings (single type)
  await page.route('**/api/site-setting*', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        data: {
          documentId: 'site-1',
          id: 1,
          agencyName: 'Dream of The Holy Himalayas',
          phone: '+91 98765 43210',
          whatsappNumber: '919876543210',
          email: 'contact@holyhimalayas.com',
          address: 'Village Mautar, District Uttarkashi, Uttarakhand 249128',
          publishedAt: new Date().toISOString(),
        },
      }),
    });
  });

  // Regions list
  await page.route('**/api/regions*', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        data: [
          { documentId: 'region-1', id: 1, name: 'Garhwal', slug: 'garhwal', state: 'uttarakhand' },
          { documentId: 'region-2', id: 2, name: 'Himachal', slug: 'himachal', state: 'himachal_pradesh' },
        ],
        meta: {},
      }),
    });
  });

  // Booking request creation (POST - intercepted for verification)
  await page.route('**/api/booking-requests', async (route) => {
    const request = route.request();
    const body = await request.postDataJSON();
    await route.fulfill({
      status: 201,
      contentType: 'application/json',
      body: JSON.stringify({
        data: {
          documentId: 'booking-1',
          id: 1,
          ...body,
          status: 'new',
          createdAt: new Date().toISOString(),
        },
        meta: {},
      }),
    });
  });

  // Batches list
  await page.route('**/api/batches*', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        data: [],
        meta: { pagination: { page: 1, pageSize: 50, pageCount: 0, total: 0 } },
      }),
    });
  });
}
