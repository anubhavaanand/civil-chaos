<div align="center">

  <img src="https://raw.githubusercontent.com/anubhavaanand/civil-chaos/main/docs/images/himalayas_banner.jpg" alt="Himalayan Peaks Banner" style="width: 100%; height: 300px; object-fit: cover; border-radius: 12px; margin-bottom: 20px;">

  <img src="https://raw.githubusercontent.com/anubhavaanand/civil-chaos/main/apps/web/public/favicon.svg" width="80" height="80" alt="Holy Himalayas Logo">
  
  <h1 align="center">Dream of The Holy Himalayas</h1>
  <p align="center"><strong>Next-Generation Himalayan Trekking & Expedition Platform</strong></p>

  <p align="center">
    <img src="https://img.shields.io/badge/Astro-0C0E14?style=for-the-badge&logo=astro&logoColor=white" alt="Astro" />
    <img src="https://img.shields.io/badge/Strapi_5-2E7EEA?style=for-the-badge&logo=strapi&logoColor=white" alt="Strapi" />
    <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
    <img src="https://img.shields.io/badge/Tailwind_v4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind" />
    <img src="https://img.shields.io/badge/Three.js-000000?style=for-the-badge&logo=threedotjs&logoColor=white" alt="Three.js" />
    <img src="https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white" alt="Neon Postgres" />
  </p>

  <p align="center">
    <a href="https://civil-chaos.pages.dev"><img src="https://img.shields.io/badge/%F0%9F%94%BA_Live-civil--chaos.pages.dev-F4A261?style=for-the-badge" alt="Live site" /></a>
  </p>

  <p align="center">
    <i>Proprietary in-house platform of Dream of The Holy Himalayas — HQ: Village Mautar, Uttarkashi, Uttarakhand</i>
  </p>
</div>

<br />

> **Dream of The Holy Himalayas** is the proprietary booking and storytelling platform of a boutique Himalayan trekking agency. Designed to shatter the traditional "budget tour operator" aesthetic, it pairs a bespoke **Alpine Glass** design system with interactive 3D topography, live trek telemetry HUDs, and a fully CMS-driven content pipeline — every trek, price, and batch is managed by the agency team without a single code deploy.

---

## ✦ Platform Highlights

| | |
|---|---|
| 🏔 **Immersive 3D Terrain** | Draco-compressed GLB mountain models with procedural snowfall, lazy-loaded only when in viewport |
| 🗺 **Interactive Trek Map** | MapLibre GL + MapTiler terrain DEM, trekkable routes with elevation-exaggerated profiles |
| 📱 **Telemetry-Style Storytelling** | Altitude acclimatization lab, fitness readiness quiz, live batch-seat availability |
| 🔒 **Secure Booking Relay** | Bot-hardened form → server-side Strapi write → instant WhatsApp deep link to basecamp |
| ✍️ **Zero-Deploy Content** | All trek data, pricing, itineraries, FAQs, and SEO metadata editable in Strapi admin |
| ⚡ **Edge-Fast Delivery** | Astro hybrid rendering on Cloudflare Pages; marketing pages ship pure HTML, near-zero JS |

---

## 🏗 System Architecture

A decoupled edge architecture: lightning-fast static delivery with secure, serverless data fetching.

```mermaid
graph TD;
    User((🧑‍💻 Explorer)) -->|Visits Site| CF[☁️ Cloudflare Pages<br/>Astro Frontend];
    
    subgraph Edge Network
        CF
    end

    subgraph Infrastructure
        CF <-->|REST API / Webhooks| Render[⚙️ Render<br/>Strapi 5 CMS];
        Render <-->|Reads/Writes| Neon[(🐘 Neon Postgres<br/>Serverless DB)];
        Render <-->|Asset Uploads| Cloudinary[🖼️ Cloudinary<br/>Media CDN];
    end

    subgraph External APIs
        CF -.->|Loads 3D Terrain| MapTiler[🗺️ MapTiler API];
    end
```

### 🔀 Secure Booking Flow

All CMS writes are routed through an Astro Server Action with honeypot checks and per-IP rate limiting — the Strapi token never touches a browser.

```mermaid
sequenceDiagram
    participant U as User
    participant A as Astro Client (Browser)
    participant C as Astro Server (Cloudflare)
    participant S as Strapi CMS (Render)
    
    U->>A: Submits Booking Form
    A->>C: POST /_actions/booking (Honeypot + Data)
    activate C
    C->>C: Validate Rate Limits & Bot Checks
    C->>S: Secure Server-to-Server POST /api/booking-requests
    S-->>C: 201 Created (Booking ID)
    C-->>A: Success Response
    deactivate C
    A->>U: Redirect to WhatsApp Deep Link for Verification
```

---

## 🗂 Inside the Repository

```
civil-chaos/
├── apps/
│   ├── web/                  # Astro 4 frontend — hybrid render, Cloudflare Pages
│   │   ├── src/
│   │   │   ├── pages/        # Home, About, Contact, Trek catalog & detail routes
│   │   │   ├── components/   # Alpine Glass UI: map, 3D viewer, telemetry, booking
│   │   │   ├── actions/      # Serverless booking endpoint (validation + rate limit)
│   │   │   ├── lib/          # Strapi client, Zod response schemas
│   │   │   └── styles/       # Design tokens & glass system
│   │   ├── public/           # GLB terrain models, expedition photography, favicons
│   │   └── tests/            # Playwright E2E for the booking journey
│   └── cms/                  # Strapi 5 headless CMS — Render + Neon Postgres
│       ├── src/api/          # Content types: Trek, Batch, Package, Region, Booking, Settings
│       └── scripts/          # Database seeding for reproducible environments
├── docs/                     # Engineering specs (see below)
├── DESIGN.md                 # Alpine Glass design-system contract
├── AGENTS.md                 # Project guardrails & locked architectural decisions
├── render.yaml               # CMS infrastructure-as-code (Render blueprint)
└── package.json              # npm workspaces orchestrating web + cms
```

### 📐 Engineering Standards

Every subsystem is spec-driven:

| Spec | Covers |
|---|---|
| [docs/PRD.md](docs/PRD.md) | Goals, scope, users, phases |
| [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) | Stack, infra, env vars, deploy topology |
| [docs/DATABASE_SCHEMA.md](docs/DATABASE_SCHEMA.md) | Strapi content types & relations |
| [docs/API_CONTRACT.md](docs/API_CONTRACT.md) | REST endpoints, webhooks, error semantics |
| [docs/MAP_COMPONENT_SPEC.md](docs/MAP_COMPONENT_SPEC.md) | Interactive trek map |
| [docs/FRONTEND_DESIGN_SPEC.md](docs/FRONTEND_DESIGN_SPEC.md) | Pages & Alpine Glass design system |
| [docs/BOOKING_FLOW.md](docs/BOOKING_FLOW.md) | Booking validation & notification flow |

---

<p align="center">
  <i>🔒 This repository is a public showcase of proprietary software.</i><br/>
  <i>All rights reserved by Dream of The Holy Himalayas — see <a href="LICENSE">LICENSE</a>.</i>
</p>
