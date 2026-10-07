import rawSnapshot from '../data/treks-snapshot.json';
import rawSeed from '../../../apps/cms/data/seed-data.json';
import type {
  AltitudePoint,
  Batch,
  FAQItem,
  ItineraryDay,
  PackageTier,
  RegionInfo,
  Trek,
} from './types';

const STRAPI_URL = (import.meta.env.PUBLIC_STRAPI_URL || 'https://civil-chaos.onrender.com').replace(/\/$/, '');

/* ---------- helpers ---------- */

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

function cheapestPrice(t: any): number {
  const prices: number[] = [];
  for (const b of t.batches ?? []) {
    const price = typeof b === 'object' ? b?.pricePerPersonINR : undefined;
    if (typeof price === 'number' && price > 0) prices.push(price);
  }
  for (const p of t.packages ?? []) {
    const price = typeof p === 'object' ? p?.priceINR : undefined;
    if (typeof price === 'number' && price > 0) prices.push(price);
  }
  return prices.length ? Math.min(...prices) : 0;
}

function galleryUrls(t: any): string[] {
  return (t.heroGallery ?? [])
    .map((g: any) => (typeof g === 'string' ? g : g?.url))
    .filter((u: unknown): u is string => typeof u === 'string' && u.length > 0);
}

/** Strapi v5 flat row (as returned by our populate query) -> Trek */
function normalizeTrek(row: any): Trek {
  const region = row.region ?? {};
  const gallery = galleryUrls(row);
  const seasons = toStringList(row.bestSeasons);

  return {
    name: row.name ?? '',
    slug: row.slug ?? '',
    difficulty: row.difficulty ?? 'moderate',
    durationDays: row.durationDays ?? 0,
    maxAltitudeM: row.maxAltitudeM ?? 0,
    trekDistanceKm: row.trekDistanceKm ?? 0,
    summary: row.summary ?? '',
    description: row.description ?? '',
    coordinates: row.coordinates
      ? [Number(row.coordinates.lng) || 0, Number(row.coordinates.lat) || 0]
      : [0, 0],
    region: region.name ?? '',
    regionSlug: region.slug ?? '',
    startPoint: row.startPoint ?? '',
    bestSeasons: seasons,
    fromPrice: cheapestPrice(row),
    heroImage: gallery[0] ?? '',
    gallery,
    altitudeProfile: [],
    itinerary: [],
    inclusions: toStringList(row.inclusions),
    exclusions: toStringList(row.exclusions),
    howToReach: {
      baseTown: row.startPoint ?? '',
      nearestAirport: 'Dehradun (DED) - contact us for the latest transit plan',
      nearestRailway: 'Dehradun / Rishikesh - contact us for the latest transit plan',
      commuteDetails: typeof row.howToReach === 'string' ? row.howToReach : '',
    },
    faqs: [],
    batches: (row.batches ?? []).map((b: any): Batch => {
      const seatsTotal = b.seatsTotal ?? 12;
      const seatsBooked = b.seatsBooked ?? 0;
      return {
        id: String(b.documentId ?? b.id ?? ''),
        startDate: b.startDate ?? '',
        endDate: b.endDate ?? '',
        seatsTotal,
        seatsBooked,
        pricePerPersonINR: b.pricePerPersonINR ?? 0,
        status: b.status ?? (seatsBooked >= seatsTotal ? 'full' : 'open'),
      };
    }),
    packages: (row.packages ?? []).map((p: any): PackageTier => ({
      id: String(p.documentId ?? p.id ?? ''),
      name: p.name ?? '',
      priceINR: p.priceINR ?? 0,
      isPopular: !!p.isPopular,
    })),
    isFeatured: !!row.isFeatured,
  };
}

/* ---------- seed enrichment (rich editorial content until the agency fills Strapi) ---------- */

interface SeedTrek {
  slug: string;
  heroImage?: string;
  gallery?: string[];
  itinerary?: ItineraryDay[];
  altitudeProfile?: AltitudePoint[];
  inclusions?: string[];
  exclusions?: string[];
  faqs?: FAQItem[];
  howToReach?: Partial<Trek['howToReach']>;
  description?: string;
}

const seedBySlug = new Map<string, SeedTrek>(
  (rawSeed as unknown as SeedTrek[]).map((s) => [s.slug, s]),
);

/** Live Strapi data wins; seed JSON only fills gaps (gallery, itinerary, faq, inclusions). */
function enrich(trek: Trek): Trek {
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
    howToReach: { ...trek.howToReach, ...(seed.howToReach ?? {}) },
  };
}

/* ---------- public API ---------- */

function loadSnapshot(): Trek[] {
  const rows = (rawSnapshot as { data?: unknown[] }).data ?? (rawSnapshot as unknown as unknown[]);
  return rows.map((row) => enrich(normalizeTrek(row as any)));
}

async function fetchLive(): Promise<Trek[] | null> {
  const endpoint =
    '/treks?populate=region,heroGallery,batches,packages&pagination[pageSize]=100';
  try {
    const res = await fetch(`${STRAPI_URL}/api${endpoint}`, {
      signal: AbortSignal.timeout(12000),
      headers: { 'Content-Type': 'application/json' },
    });
    if (!res.ok) return null;
    const json = (await res.json()) as { data?: unknown[] };
    if (!Array.isArray(json.data) || json.data.length === 0) return null;
    return json.data.map((row) => enrich(normalizeTrek(row)));
  } catch {
    return null;
  }
}

let cache: Trek[] | null = null;

/** Live Strapi -> snapshot fallback (Render cold starts / offline builds). */
export async function getTreks(): Promise<Trek[]> {
  if (cache) return cache;
  const live = import.meta.env.PROD || import.meta.env.DEV ? await fetchLive() : null;
  cache = live ?? loadSnapshot();
  return cache;
}

export async function getTrekBySlug(slug: string): Promise<Trek | undefined> {
  const treks = await getTreks();
  return treks.find((t) => t.slug === slug);
}

export function regionsOf(treks: Trek[]): RegionInfo[] {
  const bounds: RegionInfo[] = [
    { name: 'Garhwal', slug: 'garhwal', mapBounds: [77.5, 29.8, 80.0, 31.5] },
    { name: 'Kumaon', slug: 'kumaon', mapBounds: [78.8, 28.8, 81.1, 30.8] },
    { name: 'Himachal', slug: 'himachal', mapBounds: [75.5, 30.4, 79.0, 33.3] },
  ];
  const used = new Set(treks.map((t) => t.regionSlug));
  return bounds.filter((r) => used.has(r.slug));
}

export function upcomingBatches(treks: Trek[], limit = 8) {
  return treks
    .flatMap((trek) =>
      trek.batches
        .filter((b) => b.status !== 'cancelled' && b.startDate)
        .map((batch) => ({ ...batch, trekName: trek.name, trekSlug: trek.slug, region: trek.region, durationDays: trek.durationDays, maxAltitudeM: trek.maxAltitudeM })),
    )
    .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())
    .slice(0, limit);
}

export function formatDate(dateStr: string): string {
  if (!dateStr) return '-';
  return new Date(dateStr).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export function seatsLeft(b: Batch): number {
  return Math.max(0, b.seatsTotal - b.seatsBooked);
}

export function difficultyLabel(d: Trek['difficulty']): string {
  return d.charAt(0).toUpperCase() + d.slice(1);
}

export function whatsappBookingUrl(opts: {
  trekName: string;
  batchDates?: string;
  groupSize?: number;
  customerName?: string;
  phone?: string;
  message?: string;
}): string {
  const parts = [`I want to book *${opts.trekName}*`, opts.batchDates ? `(${opts.batchDates})` : null]
    .filter(Boolean)
    .join(' ');
  const lines = [
    `Hi! ${parts}, group of ${opts.groupSize ?? 1}.`,
    opts.customerName ? `- Name: ${opts.customerName}` : null,
    opts.phone ? `- Mobile: ${opts.phone}` : null,
    opts.message ? `- Note: ${opts.message}` : null,
  ].filter(Boolean);
  return `https://wa.me/919876543210?text=${encodeURIComponent(lines.join('\n'))}`;
}
