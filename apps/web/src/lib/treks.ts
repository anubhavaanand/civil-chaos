// apps/web/src/lib/treks.ts
// Trek normalization, enrichment from seed/snapshot, and public query functions.
// Depends on strapi-client.ts for fetch and types.ts for interfaces.

import { fetchStrapi, unwrap, seedBySlug, snapshotItems } from './strapi-client';
import type {
  Trek, Batch, PackageTier, FAQItem, AltitudePoint, ItineraryDay,
} from './types';

/* ---------- helpers ---------- */

function getCheapestPrice(item: any): number {
  let minPrice = Infinity;

  if (Array.isArray(item.batches) && item.batches.length > 0) {
    for (const b of item.batches) {
      const batch = unwrap(b);
      if (batch.pricePerPersonINR && batch.pricePerPersonINR < minPrice) {
        minPrice = batch.pricePerPersonINR;
      }
    }
  }

  if (Array.isArray(item.packages) && item.packages.length > 0) {
    for (const p of item.packages) {
      const pkg = unwrap(p);
      if (pkg.priceINR && pkg.priceINR < minPrice) {
        minPrice = pkg.priceINR;
      }
    }
  }

  return minPrice === Infinity ? 0 : minPrice;
}

function toStringList(value: unknown): string[] {
  if (Array.isArray(value)) return value.map(String).filter(Boolean);
  if (typeof value === 'string' && value.trim()) {
    return value
      .split('\n')
      .map((line) => line.replace(/^[-*\d.)\s]+/, '').trim())
      .filter(Boolean);
  }
  return [];
}

const CONTACT_PLACEHOLDER = 'Please contact us';

function isPlaceholder(value: string): boolean {
  return !value || value === CONTACT_PLACEHOLDER;
}

/**
 * Normalize a raw Strapi Trek item into the Trek interface.
 */
export function normalizeTrek(rawItem: any): Trek {
  const item = unwrap(rawItem);
  const region = unwrap(item.region);

  return {
    name: item.name || '',
    slug: item.slug || '',
    difficulty: item.difficulty || 'moderate',
    durationDays: item.durationDays || 0,
    maxAltitudeM: item.maxAltitudeM || 0,
    trekDistanceKm: item.trekDistanceKm || 0,
    summary: item.summary || '',
    description: item.description || '',
    coordinates: item.coordinates ? [item.coordinates.lng, item.coordinates.lat] : [0, 0],
    region: region?.name || '',
    regionSlug: region?.slug || '',
    startPoint: item.startPoint || '',
    bestSeasons: Array.isArray(item.bestSeasons) ? item.bestSeasons : [],
    fromPrice: getCheapestPrice(item),
    heroImage: Array.isArray(item.heroGallery) && item.heroGallery.length > 0
      ? unwrap(item.heroGallery[0]).url
      : '',
    gallery: Array.isArray(item.heroGallery)
      ? item.heroGallery.map((g: any) => unwrap(g).url)
      : [],
    altitudeProfile: [],
    itinerary: Array.isArray(item.itinerary)
      ? item.itinerary.map((it: any) => {
          const uIt = unwrap(it);
          return {
            day: uIt.day,
            title: uIt.title,
            altitudeM: uIt.altitudeM || 0,
            distanceKm: uIt.distanceKm || 0,
            description: uIt.description || uIt.details || '',
          };
        })
      : [],
    inclusions: typeof item.inclusions === 'string' ? [item.inclusions] : Array.isArray(item.inclusions) ? item.inclusions : [],
    exclusions: typeof item.exclusions === 'string' ? [item.exclusions] : Array.isArray(item.exclusions) ? item.exclusions : [],
    howToReach: {
      baseTown: item.startPoint || '',
      nearestAirport: 'Please contact us',
      nearestRailway: 'Please contact us',
      commuteDetails: typeof item.howToReach === 'string' ? item.howToReach : (unwrap(item.howToReach)?.commuteDetails || ''),
      mapEmbedUrl: item.googleMapsEmbedUrl || '',
    },
    faqs: Array.isArray(item.faq)
      ? item.faq.map((f: any) => {
          const uF = unwrap(f);
          return {
            question: uF.question || '',
            answer: uF.answer || '',
          };
        })
      : [],
    batches: Array.isArray(item.batches)
      ? item.batches.map((b: any) => {
          const uB = unwrap(b);
          return {
            id: uB.documentId || String(uB.id),
            startDate: uB.startDate,
            endDate: uB.endDate,
            seatsTotal: uB.seatsTotal || 12,
            seatsBooked: uB.seatsBooked || 0,
            pricePerPersonINR: uB.pricePerPersonINR || 0,
            status: uB.status || 'open',
          };
        })
      : [],
    packages: Array.isArray(item.packages)
      ? item.packages.map((p: any) => {
          const uP = unwrap(p);
          return {
            id: uP.documentId || String(uP.id),
            name: uP.name || '',
            priceINR: uP.priceINR || 0,
            description: uP.description || '',
            features: uP.features || [],
            isPopular: uP.isPopular || false,
          };
        })
      : [],
    isFeatured: !!item.isFeatured,
  };
}

/**
 * Enrich a normalized trek with seed data for fields Strapi doesn't model:
 * altitudeProfile, itinerary, inclusions/exclusions/faqs, howToReach depth.
 * Live Strapi wins; seed fills gaps.
 */
export function enrich(trek: Trek): Trek {
  const seed = seedBySlug.get(trek.slug);
  if (!seed) return trek;

  const itinerary = trek.itinerary.length ? trek.itinerary : (seed.itinerary ?? []);

  const fallbackProfile: AltitudePoint[] = itinerary.length
    ? [
        { distanceKm: 0, altitudeM: 1950, label: 'Mautar Basecamp' },
        ...itinerary.map((d) => ({
          distanceKm: d.distanceKm,
          altitudeM: d.altitudeM,
          label: d.title,
        })),
      ]
    : [];

  return {
    ...trek,
    heroImage: trek.heroImage || seed.heroImage || '',
    gallery: trek.gallery.length ? trek.gallery : (seed.gallery ?? []),
    itinerary,
    altitudeProfile: trek.altitudeProfile.length
      ? trek.altitudeProfile
      : (seed.altitudeProfile ?? fallbackProfile),
    inclusions: trek.inclusions.length ? trek.inclusions : toStringList(seed.inclusions),
    exclusions: trek.exclusions.length ? trek.exclusions : toStringList(seed.exclusions),
    faqs: trek.faqs.length ? trek.faqs : (seed.faqs ?? []),
    description: trek.description || (seed.description ?? ''),
    howToReach: {
      baseTown: trek.howToReach.baseTown || seed.howToReach?.baseTown || '',
      nearestAirport: isPlaceholder(trek.howToReach.nearestAirport)
        ? seed.howToReach?.nearestAirport || ''
        : trek.howToReach.nearestAirport,
      nearestRailway: isPlaceholder(trek.howToReach.nearestRailway)
        ? seed.howToReach?.nearestRailway || ''
        : trek.howToReach.nearestRailway,
      commuteDetails: isPlaceholder(trek.howToReach.commuteDetails)
        ? seed.howToReach?.commuteDetails || ''
        : trek.howToReach.commuteDetails,
      mapEmbedUrl: trek.howToReach.mapEmbedUrl || seed.howToReach?.mapEmbedUrl || '',
    },
  };
}

function snapshotTrekItems(): any[] {
  return snapshotItems;
}

/**
 * Deterministic build floor: live Strapi wins, but Render cold starts and
 * populate regressions must never publish an empty catalog again.
 */
export function snapshotTreks(): Trek[] {
  return snapshotTrekItems().map((item) => enrich(normalizeTrek(item)));
}

/** Fill empty CMS galleries from the committed snapshot so cards never render bare. */
export function enrichFromSnapshot(trek: Trek): Trek {
  if (trek.heroImage) return trek;
  const fallback = snapshotTreks().find((t) => t.slug === trek.slug);
  if (!fallback) return trek;
  trek.heroImage = fallback.heroImage;
  if (trek.gallery.length === 0) trek.gallery = fallback.gallery;
  return trek;
}

/* ---------- public query functions ---------- */

/** populate=* only: naming scalar fields in a deep-populate list makes Strapi 5 reject the whole request with a 400. */
const TREKS_POPULATE = '/treks?populate=*&pagination[pageSize]=100';

/**
 * Fetch all treks. Live Strapi wins; falls back to committed snapshot when
 * Strapi is unreachable or returns no data.
 */
export async function getTreks(): Promise<Trek[]> {
  const data = await fetchStrapi<any[]>(TREKS_POPULATE);
  if (Array.isArray(data) && data.length > 0) {
    return data.map((item) => enrich(enrichFromSnapshot(normalizeTrek(item))));
  }
  return snapshotTreks();
}

export async function getTrekBySlug(slug: string): Promise<Trek | undefined> {
  const data = await fetchStrapi<any[]>(`/treks?filters[slug][$eq]=${slug}&populate=*`);
  if (Array.isArray(data) && data.length > 0) {
    return enrich(enrichFromSnapshot(normalizeTrek(data[0])));
  }
  return snapshotTreks().find((t) => t.slug === slug);
}

export async function getOpenBatches(trekSlug?: string): Promise<Batch[]> {
  const endpoint = trekSlug
    ? `/batches?filters[trek][slug][$eq]=${trekSlug}&filters[status][$eq]=open&sort=startDate:asc`
    : '/batches?filters[status][$eq]=open&sort=startDate:asc&pagination[pageSize]=50';

  const data = await fetchStrapi<any[]>(endpoint);
  if (Array.isArray(data)) {
    return data.map((b) => {
      const uB = unwrap(b);
      return {
        id: uB.documentId || String(uB.id),
        startDate: uB.startDate,
        endDate: uB.endDate,
        seatsTotal: uB.seatsTotal || 12,
        seatsBooked: uB.seatsBooked || 0,
        pricePerPersonINR: uB.pricePerPersonINR || 0,
        status: uB.status || 'open',
      };
    });
  }
  return [];
}
