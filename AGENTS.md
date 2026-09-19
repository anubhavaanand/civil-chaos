# AGENTS.md  -  Project Rules (read this first)

Project: **Dream of The Holy Himalayas**  -  trekking agency website (Uttarakhand, India)
Owner agency site (single company, NOT a marketplace). Urgent: ship a working prototype fast.

## What this project is
Astro (frontend) + Strapi 5 (headless CMS) + MapLibre GL interactive Himalayan trek map.
Booking = request form (NO live payments in Phase 1). Razorpay is Phase 2.
Detailed specs live in `/docs/*.md` (this file only summarizes + sets guardrails).

## Spec map (read the relevant one before touching that area)
| File | Covers |
|---|---|
| docs/PRD.md | Goals, scope, users, phases |
| docs/ARCHITECTURE.md | Stack, infra, repo layout, env vars, deploy |
| docs/DATABASE_SCHEMA.md | All Strapi content types + fields |
| docs/API_CONTRACT.md | REST endpoints, webhook, action contract |
| docs/MAP_COMPONENT_SPEC.md | Homepage interactive map |
| docs/FRONTEND_DESIGN_SPEC.md | Pages, glass design system, SEO |
| docs/BOOKING_FLOW.md | Booking action, validation, notifications |

## Hard rules / guardrails
1. NEVER commit secrets. Env vars only (see ARCHITECTURE.md). Add `.env` to `.gitignore` on sight.
2. Do NOT introduce a payment gateway, auth system, or GraphQL. Phase 1 is deliberately small.
3. Do NOT add SSR to static marketing pages. Render mode: `output: 'hybrid'`  -  prerender everything EXCEPT the booking action endpoint and webhook receiver.
4. All content must be editable in Strapi  -  never hard-code trek names, prices, dates, or itineraries in the frontend.
5. Strapi writes from the frontend go ONLY through the Astro booking action (server-side token)  -  the public Strapi API is read-only.
6. Booking schema changes must stay backward-compatible (Phase 2 Razorpay adds fields, never rewrites).
7. Keep commits atomic and phase-scoped (foundation / content / map / booking / polish).
8. Run `npm run check` (astro check) and build before declaring any task done.
9. Self-host nothing (no self-hosted OSM tiles, no VPS) until MapTiler free tier (100k loads/mo) is exhausted.

## Tech decisions already made (do not revisit without explicit ask)
- REST from Strapi (not GraphQL) · Astro Actions for booking form · MapLibre GL + MapTiler tiles
- Deploy: Cloudflare Pages (web) + Render (Strapi, persistent disk) + Neon Postgres + Cloudinary
- WhatsApp deep-link = primary booking notification; email = backup/record
- Map scope: Uttarakhand + Himachal Pradesh only (not all-India)

## Current Project State (Phase 1 Backend Complete)
- ✅ **Strapi CMS**: Live at `civil-chaos.onrender.com`. All schemas created.
- ✅ **Neon DB**: Fully seeded (10 treks, 3 regions, 23 batches, 11 packages). Public read permissions are enabled.
- ✅ **Astro Frontend**: Live at `civil-chaos.pages.dev`. E2E Playwright tests implemented in `apps/web/tests/booking.spec.ts`.
- **Current Focus**: Frontend UI/UX (Google Stitch), booking action wiring, map integration.

## Commands
- Web: `npm run dev` / `npm run build` / `npm run check` (in `apps/web`)
- CMS: `npm run develop` / `npm run build` (in `apps/cms`)
