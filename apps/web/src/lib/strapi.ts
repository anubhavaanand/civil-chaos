// apps/web/src/lib/strapi.ts
// Backward-compatible re-export of split modules.
// Imports from ../lib/strapi continue to work unchanged.

export {
  fetchStrapi,
  unwrap,
  seedBySlug,
  snapshotItems,
} from './strapi-client';

export type {
  AltitudePoint,
  ItineraryDay,
  Batch,
  PackageTier,
  FAQItem,
  HowToReach,
  Trek,
} from './types';

export {
  normalizeTrek,
  enrich,
  enrichFromSnapshot,
  snapshotTreks,
  getTreks,
  getTrekBySlug,
  getOpenBatches,
  TREKS_POPULATE,
} from './treks';
