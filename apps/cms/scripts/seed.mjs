import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const STRAPI_URL = process.env.STRAPI_URL || 'http://localhost:1337';
const API_TOKEN = process.env.STRAPI_API_TOKEN || '';

const headers = {
  'Content-Type': 'application/json',
  ...(API_TOKEN ? { Authorization: `Bearer ${API_TOKEN}` } : {})
};

const SEED_DATA_PATH = path.join(__dirname, '..', 'data', 'seed-data.json');

const REGIONS = [
  {
    name: 'Garhwal',
    slug: 'garhwal',
    state: 'uttarakhand',
    description: 'The sanctuary of Nanda Devi, Chaukhamba, and ancient pilgrimage routes in western Uttarakhand.',
    mapBounds: [77.5, 29.8, 80.0, 31.5]
  },
  {
    name: 'Kumaon',
    slug: 'kumaon',
    state: 'uttarakhand',
    description: 'Quiet ridges, pristine alpine lakes, and panoramic vistas of the Panchachuli massif.',
    mapBounds: [78.8, 28.8, 81.1, 30.8]
  },
  {
    name: 'Himachal',
    slug: 'himachal',
    state: 'himachal_pradesh',
    description: 'Dramatic pass crossings transitioning from verdant Kullu glades to stark high-altitude deserts.',
    mapBounds: [75.5, 30.4, 79.0, 33.3]
  }
];

const SITE_SETTING = {
  agencyName: 'Dream of The Holy Himalayas',
  phone: '+91 98765 43210',
  whatsappNumber: '919876543210',
  email: 'contact@holyhimalayas.com',
  address: 'Village Mautar, District Uttarkashi, Uttarakhand 249128',
  googleBusinessUrl: 'https://maps.google.com',
  socialLinks: {
    instagram: 'https://instagram.com/dreamoftheholyhimalayas',
    facebook: 'https://facebook.com/holyhimalayas'
  }
};

async function apiRequest(endpoint, method = 'GET', body = null) {
  const url = `${STRAPI_URL}/api${endpoint}`;
  try {
    const res = await fetch(url, {
      method,
      headers,
      ...(body ? { body: JSON.stringify({ data: body }) } : {})
    });
    if (!res.ok) {
      const errBody = await res.text();
      return { ok: false, status: res.status, error: errBody };
    }
    const json = await res.json();
    return { ok: true, data: json.data };
  } catch (err) {
    return { ok: false, error: err.message };
  }
}

async function main() {
  console.log('====================================================');
  console.log(' Dream of The Holy Himalayas - Strapi 5 Seeder');
  console.log(' Target Endpoint:', `${STRAPI_URL}/api`);
  console.log('====================================================\n');

  // Verify server reachability
  try {
    const health = await fetch(`${STRAPI_URL}/_health`);
    if (!health.ok && health.status !== 204) {
      console.warn(`[WARN] Strapi returned status ${health.status} on /_health`);
    }
  } catch (e) {
    console.error(`[ERROR] Cannot connect to Strapi at ${STRAPI_URL}.`);
    console.error('Please ensure Strapi is running (npm run dev:cms or npx strapi start) before executing the seed script.');
    process.exit(1);
  }

  // Load Seed Treks
  if (!fs.existsSync(SEED_DATA_PATH)) {
    console.error(`[ERROR] Seed data not found at ${SEED_DATA_PATH}`);
    process.exit(1);
  }
  const treks = JSON.parse(fs.readFileSync(SEED_DATA_PATH, 'utf-8'));

  // 1. Seed Regions
  console.log('--- Step 1: Seeding Himalayan Regions ---');
  const regionMap = {};
  for (const reg of REGIONS) {
    const res = await apiRequest('/regions', 'POST', reg);
    if (res.ok) {
      const id = res.data.documentId || res.data.id;
      regionMap[reg.name.toLowerCase()] = id;
      console.log(`✓ Seeded Region: ${reg.name} (ID: ${id})`);
    } else {
      console.warn(`! Region ${reg.name} creation notice:`, res.error);
    }
  }

  // 2. Seed Treks with Batches, Packages, Itineraries, FAQs
  console.log('\n--- Step 2: Seeding Expeditions & Itineraries ---');
  for (const trek of treks) {
    const regionKey = (trek.region || 'Garhwal').toLowerCase();
    const regionId = regionMap[regionKey];

    const trekPayload = {
      name: trek.name,
      slug: trek.slug,
      summary: trek.summary,
      description: trek.description,
      difficulty: trek.difficulty,
      durationDays: trek.durationDays,
      maxAltitudeM: trek.maxAltitudeM,
      trekDistanceKm: trek.trekDistanceKm,
      startPoint: trek.startPoint,
      coordinates: trek.coordinates ? { lng: trek.coordinates[0], lat: trek.coordinates[1] } : null,
      bestSeasons: trek.bestSeasons,
      isFeatured: trek.slug === 'kuari-pass' || trek.slug === 'kedarkantha' || trek.slug === 'bali-pass',
      itinerary: (trek.itinerary || []).map(item => ({
        day: item.day,
        title: item.title,
        details: item.description,
        altitudeM: item.altitudeM
      })),
      faq: (trek.faqs || []).map(f => ({
        q: f.question,
        a: f.answer
      })),
      seo: {
        metaTitle: `${trek.name} Trek 2027 | Dream of The Holy Himalayas`,
        metaDescription: trek.summary
      },
      ...(regionId ? { region: regionId } : {})
    };

    const trekRes = await apiRequest('/treks', 'POST', trekPayload);
    if (!trekRes.ok) {
      console.warn(`! Trek ${trek.name} creation notice:`, trekRes.error);
      continue;
    }

    const trekId = trekRes.data.documentId || trekRes.data.id;
    console.log(`✓ Seeded Trek: ${trek.name} (ID: ${trekId})`);

    // Seed Batches
    if (Array.isArray(trek.batches)) {
      for (const batch of trek.batches) {
        const batchPayload = {
          trek: trekId,
          startDate: batch.startDate,
          endDate: batch.endDate,
          seatsTotal: batch.seatsTotal || 12,
          seatsBooked: batch.seatsBooked || 0,
          status: batch.status || 'open',
          pricePerPersonINR: batch.pricePerPersonINR || trek.fromPrice
        };
        await apiRequest('/batches', 'POST', batchPayload);
      }
      console.log(`  └─ Seeded ${trek.batches.length} departure batches`);
    }

    // Seed Packages
    if (Array.isArray(trek.packages)) {
      for (const pkg of trek.packages) {
        const pkgPayload = {
          trek: trekId,
          name: pkg.name,
          priceINR: pkg.priceINR,
          durationDays: trek.durationDays,
          isPopular: !!pkg.isPopular
        };
        await apiRequest('/packages', 'POST', pkgPayload);
      }
      console.log(`  └─ Seeded ${trek.packages.length} package tiers`);
    }
  }

  // 3. Seed Site Settings
  console.log('\n--- Step 3: Seeding Site Settings ---');
  const siteRes = await apiRequest('/site-setting', 'PUT', SITE_SETTING);
  if (siteRes.ok) {
    console.log('✓ Seeded Global Site Settings (Basecamp Mautar, HQ Phone & Contacts)');
  } else {
    console.warn('! Site Settings notice:', siteRes.error);
  }

  console.log('\n====================================================');
  console.log('✓ Seeding Completed Successfully!');
  console.log('====================================================\n');
}

main().catch(console.error);
