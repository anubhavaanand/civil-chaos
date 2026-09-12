# API_CONTRACT

Base URLs: site `https://<domain>.com` · Strapi `https://cms.<domain>.com/api`
Auth: public Strapi token, read-only scope (published content). Booking write uses server-only token inside the Astro action.

## Public reads (build-time + client)
| endpoint | use |
|---|---|
| `GET /regions?populate=mapBounds,coverImage` | homepage map regions |
| `GET /treks?populate=region,coordinates,heroGallery,difficulty,durationDays&filters[isFeatured][$eq]=true` | featured/homepage |
| `GET /treks?filters[region][slug][$eq]={slug}&filters[difficulty][$eq]={d}&sort=...` | listing filters |
| `GET /treks/{slug}?populate=*` | detail page (itinerary, faq, batches, packages, gallery) |
| `GET /batches?filters[trek][slug][$eq]={slug}&filters[status][$eq]=open&sort=startDate:asc` | upcoming departures |
| `GET /packages?filters[trek][slug][$eq]={slug}` | pricing tiers |

Strapi `populate=*` is acceptable here (bounded content). All list endpoints paginated `pageSize=100` max; expect < 200 treks for years.

## Booking action (the ONLY write path)
`POST /_actions/booking` — Astro Action (serverless fn), never direct Strapi POST from browser.
Request JSON:
```
{ trekSlug, batchId?, packageId?, customerName, phone, email?, groupSize, preferredDates?, message?, company? /* honeypot, must be empty */ }
```
Success 200: `{ ok: true, whatsappUrl: "https://wa.me/91XXXXXXXXXX?text=..." }`
Failure 400 (zod messages) / 429 (rate limited) / 409 (honeypot tripped — silently return 200 ok:false to not tip off bots).
Server-side sequence: validate → honeypot → IP rate limit (max 3/min/IP) → create Strapi booking-request (server token, set sourceIp) → return wa.me deep link to customer + agency notification fires from the Strapi `afterCreate` lifecycle (email).

## Revalidation webhook (inbound)
`POST /api/revalidate` header `x-revalidate-secret: {STRAPI_WEBHOOK_SECRET}`
Body: `{ model: "trek"|"batch"|"package"|"region", slug?, action: "create"|"update"|"delete" }`
Purges: `/`, `/treks`, `/treks/{slug}`, `/map` as applicable; CF cache purge via REST.

## Strapi outbound webhook
Strapi admin → Settings → Webhooks → on publish/unpublish/update/delete of trek, batch, package, region → `POST {WEB_REVALIDATE_URL}` with secret → revalidation above.

## Error handling
Strapi down at build time → fail build loudly (never ship stale silently). Strapi down at runtime → cached static pages still serve; booking action returns 503 "please WhatsApp us directly" with the wa.me link.

## Phase 2 additions (reserved)
`POST /_actions/payment/create-order` (Razorpay order), webhook `/api/payments/razorpay` — fields only, no implementation now.
