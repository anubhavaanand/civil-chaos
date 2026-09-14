// apps/web/src/lib/strapi.ts
// Typed Strapi 5 client with automatic graceful fallback to local mock data

import { mockTreks, type Trek, type Batch } from '../data/mock-treks';

const STRAPI_URL = import.meta.env.PUBLIC_STRAPI_URL || 'http://localhost:1337';
const STRAPI_TOKEN = import.meta.env.STRAPI_API_TOKEN || '';

interface StrapiResponse<T> {
  data: T;
  meta?: {
    pagination?: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

export async function fetchStrapi<T>(endpoint: string, options: RequestInit = {}): Promise<T | null> {
  const url = `${STRAPI_URL}/api${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
  try {
    const res = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(STRAPI_TOKEN ? { Authorization: `Bearer ${STRAPI_TOKEN}` } : {}),
        ...options.headers,
      },
      signal: AbortSignal.timeout(3000), // 3s fail-fast timeout for builds
    });

    if (!res.ok) {
      return null;
    }

    const json: StrapiResponse<T> = await res.json();
    return json.data;
  } catch {
    // Fail silently to local fallback
    return null;
  }
}

/**
 * Fetch all published treks with fallback to mockTreks
 */
export async function getTreks(): Promise<Trek[]> {
  const data = await fetchStrapi<any[]>('/treks?populate=*&pagination[pageSize]=100');
  if (Array.isArray(data) && data.length > 0) {
    return data.map((item) => normalizeTrek(item));
  }
  return mockTreks;
}

/**
 * Fetch a single trek by slug with fallback
 */
export async function getTrekBySlug(slug: string): Promise<Trek | undefined> {
  const data = await fetchStrapi<any[]>(`/treks?filters[slug][$eq]=${slug}&populate=*`);
  if (Array.isArray(data) && data.length > 0) {
    return normalizeTrek(data[0]);
  }
  return mockTreks.find((t) => t.slug === slug);
}

/**
 * Fetch upcoming open batches with fallback
 */
export async function getOpenBatches(trekSlug?: string): Promise<Batch[]> {
  const endpoint = trekSlug
    ? `/batches?filters[trek][slug][$eq]=${trekSlug}&filters[status][$eq]=open&sort=startDate:asc`
    : '/batches?filters[status][$eq]=open&sort=startDate:asc&pagination[pageSize]=50';

  const data = await fetchStrapi<any[]>(endpoint);
  if (Array.isArray(data) && data.length > 0) {
    return data.map((b) => ({
      id: b.documentId || String(b.id),
      startDate: b.startDate,
      endDate: b.endDate,
      seatsTotal: b.seatsTotal,
      seatsBooked: b.seatsBooked,
      pricePerPersonINR: b.pricePerPersonINR,
      status: b.status,
    }));
  }

  const allBatches = mockTreks.flatMap((t) => t.batches);
  return trekSlug
    ? (mockTreks.find((t) => t.slug === trekSlug)?.batches || [])
    : allBatches;
}

/**
 * Helper to normalize Strapi Document / Entry format into application Trek interface
 */
function normalizeTrek(item: any): Trek {
  const fallback = mockTreks.find((m) => m.slug === item.slug) || mockTreks[0];

  return {
    name: item.name || fallback.name,
    slug: item.slug || fallback.slug,
    difficulty: item.difficulty || fallback.difficulty,
    durationDays: item.durationDays || fallback.durationDays,
    maxAltitudeM: item.maxAltitudeM || fallback.maxAltitudeM,
    trekDistanceKm: item.trekDistanceKm || fallback.trekDistanceKm,
    summary: item.summary || fallback.summary,
    description: item.description || fallback.description,
    coordinates: item.coordinates
      ? [item.coordinates.lng, item.coordinates.lat]
      : fallback.coordinates,
    region: item.region?.name || fallback.region,
    regionSlug: (item.region?.slug || fallback.regionSlug) as any,
    startPoint: item.startPoint || fallback.startPoint,
    bestSeasons: item.bestSeasons || fallback.bestSeasons,
    fromPrice: item.fromPrice || fallback.fromPrice,
    heroImage: item.heroGallery?.[0]?.url || fallback.heroImage,
    gallery: item.heroGallery?.map((g: any) => g.url) || fallback.gallery,
    altitudeProfile: fallback.altitudeProfile,
    itinerary: Array.isArray(item.itinerary) && item.itinerary.length > 0
      ? item.itinerary.map((it: any) => ({
          day: it.day,
          title: it.title,
          altitudeM: it.altitudeM || 0,
          distanceKm: 0,
          description: it.details || '',
        }))
      : fallback.itinerary,
    inclusions: fallback.inclusions,
    exclusions: fallback.exclusions,
    howToReach: fallback.howToReach,
    batches: Array.isArray(item.batches) && item.batches.length > 0
      ? item.batches.map((b: any) => ({
          id: b.documentId || String(b.id),
          startDate: b.startDate,
          endDate: b.endDate,
          seatsTotal: b.seatsTotal || 12,
          seatsBooked: b.seatsBooked || 0,
          pricePerPersonINR: b.pricePerPersonINR,
          status: b.status || 'open',
        }))
      : fallback.batches,
    packages: fallback.packages,
    faqs: Array.isArray(item.faq) && item.faq.length > 0
      ? item.faq.map((f: any) => ({
          question: f.q,
          answer: f.a,
        }))
      : fallback.faqs,
  };
}
