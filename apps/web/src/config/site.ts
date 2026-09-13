// apps/web/src/config/site.ts
// Central site configuration and operational constants for Dream of The Holy Himalayas

export const SITE_CONFIG = {
  name: "Dream of The Holy Himalayas",
  shortName: "Holy Himalayas",
  tagline: "Small-Batch Himalayan Expeditions",
  basecamp: "Village Mautar, District Uttarkashi, Uttarakhand 249128",
  phoneDisplay: "+91 98765 43210",
  phoneRaw: "919876543210",
  phoneTel: "+919876543210",
  email: "contact@holyhimalayas.com",
  googleReviews: {
    rating: 5.0,
    count: 40,
    displayText: "5.0 (40+ Google Reviews)",
    badgeText: "40+ Verified Reviews",
    schemaCount: "40"
  },
  coordinates: {
    lat: 30.7268,
    lng: 78.4354,
    dms: "30°43'36\" N, 78°26'07\" E",
    elevationM: 1950
  }
} as const;
