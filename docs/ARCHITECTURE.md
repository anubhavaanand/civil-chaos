# ARCHITECTURE

## High level
```
[Trekker] --HTTPS--> [Cloudflare Pages: Astro site]
                          |  static prerender (build-time fetch from Strapi)
                          |  hybrid: /_actions/booking  +  /api/revalidate  = serverless fns
                          v
                     [Render: Strapi 5] --REST--> [Neon Postgres]
                          |  media --> [Cloudinary]
                          |  afterCreate hook --> email (Resend/SMTP)
[Trekker] <--WhatsApp deep-link-- [Agency phone]     [MapTiler] <-- tiles --> browser
```

Repo: monorepo `apps/web` (Astro 5, output: 'hybrid') + `apps/cms` (Strapi 5). `docs/` at root.

## Why these choices (locked decisions)
- **Static-first Astro**: the old competitor site dies on chunk-load errors; static pages can't. Trek content changes rarely → prerender + on-demand revalidation.
- **Strapi 5 REST** (not GraphQL): caching simplicity, per-field permissions, one client surface. Public API read-only; writes only via booking action using a server-side token.
- **Hybrid rendering**: everything prerendered EXCEPT the booking action endpoint and the Strapi webhook receiver.
- **MapLibre GL + MapTiler free tier** (100k map loads/mo). No Google Maps key needed for the homepage map. Google Maps used ONLY as per-trek-page embed (free).
- **Render for Strapi** (not Railway): free tier has persistent disk  -  Railway's ephemeral FS loses `/uploads` on every deploy. Media anyway goes to Cloudinary; disk is belt-and-suspenders.
- **Neon** free Postgres, **Cloudinary** free tier (25GB) for images.

## Revalidation flow
Strapi `afterUpdate`/`afterCreate`/`afterDelete` on trek/batch/package content types → POST `/api/revalidate` on the site with secret header → Astro/CF purges affected trek pages → next request re-prerenders (ISR-style).

## Environment variables
`apps/web` (.env):
```
PUBLIC_STRAPI_URL=https://cms.<domain>.com
PUBLIC_SITE_URL=https://<domain>.com
PUBLIC_MAPTILER_KEY=          # client-safe
STRAPI_API_TOKEN=             # server-only, read+create on booking-request
STRAPI_WEBHOOK_SECRET=        # validates inbound revalidate calls
RESEND_API_KEY=               # booking notification email (or SMTP_*)
```
`apps/cms` (.env):
```
DATABASE_URL=                 # Neon postgres pooled URL
CLOUDINARY_NAME= CLOUDINARY_KEY= CLOUDINARY_SECRET=
APP_KEYS= API_TOKEN_SALT= ADMIN_JWT_SECRET= JWT_SECRET= TRANSFER_TOKEN_SALT= ENCRYPTION_KEY=
WEB_REVALIDATE_URL= WEB_REVALIDATE_SECRET=   # outbound webhook target
```

## Deployment checklist
1. Neon: create project → copy pooled `DATABASE_URL` into Render env.
2. Cloudinary: create account → credentials into Strapi env + install `strapi-provider-upload-cloudinary`.
3. Render: new Web Service from repo `apps/cms`, persistent disk mounted at `/opt/render/project/src/public/uploads` (fallback only), health check `/admin`, auto-deploy on push to `main`.
4. Strapi admin: create API token (read + create on booking-request), create regions/treks seed content.
5. Cloudflare Pages: project from repo `apps/web`, build `npm run build`, output `dist`, env vars above, deploy hook = `WEB_REVALIDATE_URL`.
6. DNS: A/AAAA via Cloudflare; `cms.` subdomain → Render.

## Local dev
`npm run dev` in both apps (web :4321, cms :1337/admin). Seed script `apps/cms/scripts/seed.mjs` loads 4 sample treks + batches from `docs/seed-data/`.
