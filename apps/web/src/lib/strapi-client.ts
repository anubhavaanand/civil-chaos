// apps/web/src/lib/strapi-client.ts
// Low-level Strapi REST client: fetch + auth + error handling.
// No type definitions live here — those are in types.ts.

import snapshotJson from '../data/treks-snapshot.json';
import rawSeedData from '../../../../apps/cms/data/seed-data.json';

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

/**
 * Fetch from Strapi with a 5s timeout and Bearer auth when a token is set.
 * Returns null on any failure (network, 4xx, 5xx, parse error) so callers
 * can fall back to snapshot/seed data.
 */
export async function fetchStrapi<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T | null> {
  const url = `${STRAPI_URL}/api${endpoint.startsWith('/') ? endpoint : `//${endpoint}`}`;
  try {
    const res = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(STRAPI_TOKEN ? { Authorization: `Bearer ${STRAPI_TOKEN}` } : {}),
        ...options.headers,
      },
      signal: AbortSignal.timeout(5000),
    });

    if (!res.ok) {
      console.error(`Strapi error: ${res.status} on ${url}`);
      return null;
    }

    const json: StrapiResponse<T> = await res.json();
    return json.data;
  } catch (err) {
    console.error(`Strapi fetch failed on ${url}`, err);
    return null;
  }
}

/**
 * Unwrap Strapi 5 document format: { id, documentId, attributes: {...} }
 * → { id, documentId, ...attributes }
 */
export function unwrap(item: any): any {
  if (!item) return item;
  if (item.attributes) {
    return { id: item.id, documentId: item.documentId, ...item.attributes };
  }
  return item;
}

/* ---------- editorial seed floor ---------- */

interface SeedTrek {
  slug: string;
  heroImage?: string;
  gallery?: string[];
  itinerary?: ItineraryDay[];
  altitudeProfile?: AltitudePoint[];
  inclusions?: string[];
  exclusions?: string[];
  faqs?: FAQItem[];
  howToReach?: Partial<import('./types').Trek['howToReach']>;
  description?: string;
}

const seedBySlug = new Map<string, SeedTrek>(
  (rawSeedData as unknown as SeedTrek[]).map((s) => [s.slug, s]),
);

const snapshotItems = (() => {
  const data = (snapshotJson as { data?: unknown }).data;
  return Array.isArray(data) ? data : [];
})();

export { seedBySlug, snapshotItems };

// Import types for use in this file
import type { AltitudePoint, FAQItem, ItineraryDay } from './types';
