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

  const existingRegionsRes = await apiRequest('/regions', 'GET');
  if (existingRegionsRes.ok && Array.isArray(existingRegionsRes.data)) {
    for (const reg of existingRegionsRes.data) {
      const id = reg.documentId || reg.id;
      regionMap[reg.name.toLowerCase()] = id;
      console.log(`✓ Existing Region Found: ${reg.name} (ID: ${id})`);
    }
  }

  for (const reg of REGIONS) {
    if (regionMap[reg.name.toLowerCase()]) {
      continue;
    }
    const res = await apiRequest('/regions', 'POST', {
      ...reg,
      publishedAt: new Date().toISOString()
    });
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
  const existingTreksRes = await apiRequest('/treks?pagination[pageSize]=100', 'GET');
  const existingTrekSlugs = new Set();
  if (existingTreksRes.ok && Array.isArray(existingTreksRes.data)) {
    for (const t of existingTreksRes.data) {
      existingTrekSlugs.add(t.slug);
      console.log(`✓ Existing Trek Found: ${t.name} (Slug: ${t.slug})`);
    }
  }

  for (const trek of treks) {
    if (existingTrekSlugs.has(trek.slug)) {
      continue;
    }
    const regionKey = (trek.region || 'Garhwal').toLowerCase();
    const regionId = regionMap[regionKey];
    const isFeatured = trek.slug === 'kuari-pass' || trek.slug === 'kedarkantha' || trek.slug === 'bali-pass';

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
      isFeatured,
      popularity: isFeatured ? 100 : Math.max(1, treks.length - treks.indexOf(trek)),
      itinerary: (trek.itinerary || []).map(item => ({
        day: item.day,
        title: item.title,
        description: item.description || '',
        altitudeM: item.altitudeM || null,
        distanceKm: item.distanceKm || null
      })),
      faq: (trek.faqs || []).map(f => ({
        question: f.question,
        answer: f.answer
      })),
      seo: {
        metaTitle: `${trek.name} | Holy Himalayas`.slice(0, 60),
        metaDescription: (trek.summary || '').slice(0, 160)
      },
      publishedAt: new Date().toISOString(),
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
          isPopular: !!pkg.isPopular,
          publishedAt: new Date().toISOString()
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

  // 4. Seed FAQs (homepage Field Briefing)
  console.log('\n--- Step 4: Seeding Homepage FAQs ---');
  const FAQS = [
    {
      question: 'What happens if weather closes the route?',
      answer: 'If unpassable weather closes a route, you reschedule to any future departure with zero penalty. Weather is the mountain\'s decision, never a charge on yours.',
      isPublished: true,
      order: 1
    },
    {
      question: 'What is the difference between Basecamp and With Transit packages?',
      answer: 'Every trek is seeded in Strapi with two transparent package tiers: our Basecamp Tier (report directly at the base village like Joshimath, Sankri, or Manali) and our With Transit Tier (includes round-trip SUV/Tempo pickup & drop from Rishikesh, Dehradun, or Kathgodam).',
      isPublished: true,
      order: 2
    },
    {
      question: 'Who leads the expeditions?',
      answer: 'Every expedition leader is a native of Mautar trained at the Nehru Institute of Mountaineering (NIM) and holds international Wilderness First Responder (WFR) certification.',
      isPublished: true,
      order: 3
    },
    {
      question: 'How large is each batch?',
      answer: 'Batches are strictly capped at 12–15 trekkers to preserve trail intimacy, safety ratios, and the environmental sanctity of the routes.',
      isPublished: true,
      order: 4
    },
    {
      question: 'How is acclimatization and medical safety handled on the trail?',
      answer: 'We carry medical-grade oxygen canisters and pulse oximeters, with twice-daily acclimatization audits and evacuation protocols coordinated with regional mountain stations.',
      isPublished: true,
      order: 5
    },
    {
      question: 'How do I reserve my seat?',
      answer: 'Select any trek package or departure batch below to log your request in our Strapi CRM and launch a pre-filled WhatsApp confirmation directly with our Mautar basecamp.',
      isPublished: true,
      order: 6
    }
  ];

  const existingFaqsRes = await apiRequest('/faqs?pagination[pageSize]=50', 'GET');
  const existingFaqQuestions = new Set();
  if (existingFaqsRes.ok && Array.isArray(existingFaqsRes.data)) {
    for (const f of existingFaqsRes.data) {
      existingFaqQuestions.add(f.question);
    }
  }

  for (const faq of FAQS) {
    if (existingFaqQuestions.has(faq.question)) {
      continue;
    }
    const res = await apiRequest('/faqs', 'POST', {
      ...faq,
      publishedAt: new Date().toISOString()
    });
    if (res.ok) {
      console.log(`✓ Seeded FAQ: ${faq.question}`);
    } else {
      console.warn(`! FAQ creation notice: ${faq.question}`, res.error);
    }
  }

  console.log('\n====================================================');
  console.log('✓ Seeding Completed Successfully!');
  console.log('====================================================\n');
}

main().catch(console.error);
