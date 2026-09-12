# DATABASE_SCHEMA — Strapi 5 content types

Naming: singular PascalCase types, kebab-case APIs. All APIs prefixed `/api/`.
Media fields → Cloudinary via upload provider. Timestamps + publishedAt on all.

## Region  (`/api/regions`)
| field | type | notes |
|---|---|---|
| name | string | e.g. "Garhwal", "Kumaon", "Himachal" |
| slug | uid | from name |
| state | enum | uttarakhand \| himachal_pradesh |
| description | richtext | |
| coverImage | media (single) | |
| mapBounds | json | [minLng,minLat,maxLng,maxLat] for map fly-to |
| treks | relation 1:N → trek | back-populated |

## Trek  (`/api/treks`)
| field | type | notes |
|---|---|---|
| name | string | e.g. "Kuari Pass Trek" |
| slug | uid | URL: /treks/kuari-pass-trek |
| region | relation N:1 → region | |
| summary | text | 1-2 lines for cards/popups |
| description | richtext | long-form |
| difficulty | enum | easy \| moderate \| difficult |
| durationDays | integer | |
| maxAltitudeM | integer | |
| trekDistanceKm | decimal | |
| bestSeasons | enum multiple | dec_feb \| mar_apr \| may_jun \| jul_aug \| sep_oct \| nov |
| startPoint | string (town) | e.g. "Joshimath" |
| coordinates | json | {"lat":30.42,"lng":79.57} — map marker |
| heroGallery | media (multiple) | ordered |
| itinerary | component repeatable: { day: integer, title: string, details: richtext, altitudeM: integer } | |
| inclusions | richtext | |
| exclusions | richtext | |
| howToReach | richtext | trains/buses to base town |
| googleMapsEmbedUrl | string | optional per-trek embed |
| faq | component repeatable: { q: string, a: richtext } | |
| batches | relation 1:N → batch | |
| packages | relation 1:N → package | |
| isFeatured | boolean | homepage boost |
| seo | component: { metaTitle, metaDescription } | |

## Batch  (`/api/batches`) — a dated departure
| field | type | notes |
|---|---|---|
| trek | relation N:1 → trek | |
| startDate / endDate | date | |
| seatsTotal / seatsBooked | integer | `seatsLeft` derived in frontend |
| status | enum | open \| full \| cancelled |
| pricePerPersonINR | integer | Phase 1 price lives on batch (date-based pricing) |

## Package  (`/api/packages`) — pricing tiers of one trek
| field | type | notes |
|---|---|---|
| trek | relation N:1 → trek | |
| name | string | e.g. "Standard", "With Transport", "Private Group" |
| priceINR | integer | from-price when no batch chosen |
| durationDays | integer | may differ per package |
| inclusionsOverride | richtext | optional delta vs trek-level |
| isPopular | boolean | |

## BookingRequest  (`/api/booking-requests`) — written ONLY by the Astro action
| field | type | notes |
|---|---|---|
| trek | relation N:1 → trek | |
| batch | relation N:1 → batch | optional if undecided |
| package | relation N:1 → package | optional |
| customerName | string | required |
| phone | string | required, validated `^[6-9]\d{9}$` (Indian mobile) |
| email | email | optional |
| groupSize | integer | default 1, max 30 |
| message | text | optional |
| preferredDates | string | free text, e.g. "first week of Oct" |
| status | enum | new \| contacted \| confirmed \| closed (admin-managed) |
| sourceIp | string | set by action for rate limiting audit |
| honeypot | string | must be empty (action rejects otherwise) |

## SiteSetting  (`/api/site-settings`, single type)
agencyName, phone, whatsappNumber, email, address, googleBusinessUrl, socialLinks, homepageHeroMedia.

## Phase 2 (reserved, do not build)
Review (trek N:1, rating, author), Payment (booking N:1, razorpayPaymentId, amount, status), Enquiry (generic contact form), localized fields (name_hi, etc.).
