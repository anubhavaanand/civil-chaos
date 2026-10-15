<div align="center">

  <img src="https://raw.githubusercontent.com/anubhavaanand/civil-chaos/main/docs/images/himalayas_banner.jpg" alt="Himalayan peaks at sunrise" style="width: 100%; height: 300px; object-fit: cover; border-radius: 12px; margin-bottom: 20px;">

  <img src="https://raw.githubusercontent.com/anubhavaanand/civil-chaos/main/apps/web/public/favicon.svg" width="72" height="72" alt="Dream of The Holy Himalayas">

  <h1 align="center">Dream of The Holy Himalayas</h1>

  <p align="center"><strong>Boutique Himalayan trekking platform — built for a small-batch expedition agency in Mautar, Uttarkashi.</strong></p>

  <p align="center">
    <a href="https://civil-chaos.pages.dev"><img src="https://img.shields.io/badge/Live_site-civil--chaos.pages.dev-0ea5e9?style=flat-square" alt="Live site" /></a>
    <a href="https://github.com/anubhavaanand/civil-chaos/actions/workflows/web-ci.yml"><img src="https://img.shields.io/github/actions/workflow/status/anubhavaanand/civil-chaos/web-ci.yml?style=flat-square&label=web%20CI" alt="Web CI" /></a>
    <a href="LICENSE"><img src="https://img.shields.io/badge/license-Proprietary-64748b?style=flat-square" alt="License" /></a>
    <img src="https://img.shields.io/badge/node-%3E%3D22.12.0-339933?style=flat-square&logo=node.js&logoColor=white" alt="Node" />
  </p>

  <p align="center">
    <img src="https://img.shields.io/badge/Astro_4-0C0E14?style=flat-square&logo=astro&logoColor=white" alt="Astro" />
    <img src="https://img.shields.io/badge/Strapi_5-2E7EEA?style=flat-square&logo=strapi&logoColor=white" alt="Strapi" />
    <img src="https://img.shields.io/badge/TypeScript-007ACC?style=flat-square&logo=typescript&logoColor=white" alt="TypeScript" />
    <img src="https://img.shields.io/badge/Tailwind_v4-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white" alt="Tailwind" />
    <img src="https://img.shields.io/badge/PostgreSQL-316192?style=flat-square&logo=postgresql&logoColor=white" alt="Neon Postgres" />
  </p>
</div>

---

## Overview

A decoupled content platform for **Dream of The Holy Himalayas**, a 5.0-star small-batch trekking
agency operating from Village Mautar in the Upper Bhagirathi basin. The agency runs expeditions
capped at 12–15 trekkers, led entirely by guides native to the region and certified by the
Nehru Institute of Mountaineering (NIM) and Wilderness First Responder (WFR).

The platform publishes ten precision-scouted routes across Garhwal and Himachal Pradesh, each
with full day-by-day itineraries, elevation profiles, batch calendars with live seat counts, and
logistics. Editorial operations run through a headless CMS, so the agency can manage departures,
pricing and FAQ content without a developer.

**Design direction.** A bespoke *Alpine Glass* design system: obsidian surfaces, a single glacier
cyan accent, and telemetry readouts drawn from the agency's own field logs. The aesthetic
deliberately distances the product from the conventional budget-tour-operator look.

---

## Architecture

```mermaid
graph LR
    Visitor((Visitor)) -->|HTTPS| Edge[Cloudflare Pages<br/>Astro 4 · hybrid output]

    subgraph Edge
        Edge -->|prerendered HTML| Site[Route pages<br/>/treks /about /contact]
        Edge -->|server actions| Actions[/_actions/booking]
    end

    Site -.->|build + runtime fetch| CMS[Render · Strapi 5 API]
    Actions -->|secure server-to-server POST| CMS
    CMS -->|Reads/Writes| Neon[(Neon Postgres)]
    CMS -->|Uploads| Cloudinary[Cloudinary CDN]
    Actions -.->|deep link| WhatsApp[WhatsApp relay]
```

**Why this shape.** Route pages are prerendered to static HTML and served from the edge, so the
catalog and trek detail pages carry no server latency and no CMS dependency at read time. Editorial
mutations are the only dynamic path, and they are routed through Astro server actions — the Strapi
API token never reaches the browser.

**Data floor.** The build fetches live Strapi at prerender time. When Render cold-starts or
Strapi returns an error, the build falls back to a committed snapshot, then to the editorial seed
in `apps/cms/data/seed-data.json`. A catalog that renders as an empty page on a cold morning is
not an acceptable failure mode for a commercial site, so the build is deterministic by design.

### Repository layout

```
apps/web        Astro 4 frontend — hybrid output, Cloudflare Pages
apps/cms        Strapi 5 CMS — Render, Neon Postgres, Cloudinary media
docs/           Specifications: PRD, architecture, schema, API contract, design system
prototype/     Standalone Astro app for validating the design language (not deployed)
.github/        CI: web + prototype type-check and build
```

### Monorepo scripts

npm workspaces monorepo. Run from the repository root:

| Command | What it does |
|---|---|
| `npm run dev` | Astro dev server → http://localhost:4321 |
| `npm run build` | Production build of `apps/web` |
| `npm run dev:cms` | Strapi admin → http://localhost:1337/admin |
| `npm run build:cms` | Production build of `apps/cms` |

CI (`web-ci.yml`, `prototype-ci.yml`) runs `astro check` and a production build on every PR
touching its paths. Both are currently green on `main`.

---

## Local development

**Prerequisites:** Node.js >= 22.12.0 and npm with workspace support.

```bash
git clone https://github.com/anubhavaanand/civil-chaos.git
cd civil-chaos
npm install
```

Create the two environment files, then start the two processes in separate terminals:

```bash
cp apps/web/.env.example apps/web/.env
cp apps/cms/.env.example apps/cms/.env

npm run dev          # frontend
npm run dev:cms      # CMS
```

The frontend reads `PUBLIC_STRAPI_URL` and falls back through the snapshot → seed chain when
Strapi is unreachable, so a local build works without the CMS running. See
[.env.example](apps/web/.env.example) for the full variable list.

---

## Documentation

| Spec | Covers |
|---|---|
| [docs/PRD.md](docs/PRD.md) | Goals, scope, users, and phases |
| [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) | Stack, infrastructure, environment, deployment |
| [docs/DATABASE_SCHEMA.md](docs/DATABASE_SCHEMA.md) | Strapi content types and relations |
| [docs/API_CONTRACT.md](docs/API_CONTRACT.md) | REST endpoints and webhooks |
| [docs/MAP_COMPONENT_SPEC.md](docs/MAP_COMPONENT_SPEC.md) | Interactive trek map component |
| [docs/FRONTEND_DESIGN_SPEC.md](docs/FRONTEND_DESIGN_SPEC.md) | Page structure and the Alpine Glass design system |
| [docs/BOOKING_FLOW.md](docs/BOOKING_FLOW.md) | Booking validation, CRM write, and notifications |

---

## Contributing

Contributions welcome from contracted collaborators. See [CONTRIBUTING.md](CONTRIBUTING.md) and
open an issue using the templates in `.github/ISSUE_TEMPLATE/`.

---

<div align="center">
  <sub>Proprietary software — see <a href="LICENSE">LICENSE</a>. All rights reserved by Dream of The Holy Himalayas.</sub>
</div>
