# AGENTS.md — Project rules (read this first)

Project: **Dream of The Holy Himalayas** — trekking agency website (Uttarakhand, India).
Single company, not a marketplace. Proprietary software, not open source.

## What this is
Astro 4 (frontend) + Strapi 5 (headless CMS) + MapLibre GL trek map, deployed on Cloudflare
Pages and Render. Booking is a request form — no live payments.
Detailed specs live in `/docs/*.md`; this file only summarizes and sets guardrails.

## Spec map — read the relevant one before touching that area
| File | Covers |
|---|---|
| docs/PRD.md | Goals, scope, users, phases |
| docs/ARCHITECTURE.md | Stack, infra, repo layout, env vars, deploy |
| docs/DATABASE_SCHEMA.md | Strapi content types and fields |
| docs/API_CONTRACT.md | REST endpoints, webhook, action contract |
| docs/MAP_COMPONENT_SPEC.md | Homepage interactive map |
| docs/FRONTEND_DESIGN_SPEC.md | Pages, glass design system, SEO |
| docs/BOOKING_FLOW.md | Booking action, validation, notifications |

## Guardrails
1. **Never commit secrets.** Env vars only (see ARCHITECTURE.md). Add `.env` to `.gitignore` on sight.
2. **All trek content is managed in Strapi.** Never hard-code names, prices, dates, or
   itineraries in the frontend — PRs that do will not be merged. The only exceptions are the
   committed snapshot and `apps/cms/data/seed-data.json`, which exist as the deliberate build
   floor when Strapi is unreachable.
3. **Strapi writes go only through the Astro booking action** (server-side token). The public
   Strapi API is read-only.
4. **Do not add SSR to static marketing pages.** `output: 'hybrid'` — prerender everything
   except the booking action endpoint and webhook receiver.
5. **Booking schema changes stay backward-compatible.** Phase 2 payments add fields, never rewrite.
6. **Do not self-host infrastructure** (tiles, VPS) while free tiers suffice.
7. **Do not introduce a payment gateway, auth system, or GraphQL** without explicit approval.

## Before declaring a task done
- `npm run check --workspace=apps/web` — 0 errors
- `npm run build --workspace=apps/web` — completes
- If the booking flow changed, run the Playwright suite in `apps/web/tests/`
- **Verify against what is actually committed/deployed, not a dirty working tree.** Build from
  the commit you intend to ship.

## Conventions
- Commits atomic and phase-scoped (foundation / content / map / booking / polish).
- One concern per PR; split refactors from behaviour changes.
- UI changes need before/after screenshots.
- Seed-data changes belong in `apps/cms/scripts/seed.mjs`, never in frontend fixtures.

## Commands
| Command | Purpose |
|---|---|
| `npm run dev` | Astro dev server → localhost:4321 |
| `npm run build` | Production build of `apps/web` |
| `npm run dev:cms` | Strapi admin → localhost:1337/admin |
| `npm run build:cms` | Production build of `apps/cms` |
| `npm run check --workspace=apps/web` | `astro check` (types + diagnostics) |

## Current state
Frontend and CMS are both live. The catalog renders ten treks across Garhwal and Himachal
Pradesh with itineraries, elevation profiles, batch calendars and logistics. Editorial content
is managed entirely in Strapi. See the README for the platform overview.
