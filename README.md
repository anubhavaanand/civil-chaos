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
    <i>HQ: Village Mautar, Uttarkashi, Uttarakhand</i>
  </p>
</div>

<br />

> **Dream of The Holy Himalayas** is a premium, high-performance web platform built for a boutique trekking agency. Designed to shatter the traditional "budget tour operator" aesthetic, this platform utilizes a bespoke **Alpine Glass** design system, cinematic dark-mode interfaces, interactive 3D topography, and real-time telemetry HUDs.

---



## 🏗 System Architecture

The platform operates on a decoupled edge-architecture, ensuring lightning-fast static delivery with secure, serverless data fetching.

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

### 🔀 Secure Booking Flow (Phase 1)

All Strapi write operations are routed securely through an Astro Server Action, completely hiding the Strapi API tokens from the client browser.

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

## 🚀 Local Development

### Prerequisites
* Node.js 20+
* NPM Workspace Support

### 1. Installation
Clone the repository and install dependencies from the root directory:
```bash
git clone https://github.com/anubhavaanand/civil-chaos.git
cd civil-chaos
npm install
```

### 2. Environment Setup
You will need to configure environment variables for both the frontend and the CMS. 
```bash
cp apps/web/.env.example apps/web/.env
cp apps/cms/.env.example apps/cms/.env
```

### 3. Running the Stack
Run the entire monorepo concurrently:
```bash
npm run dev
```
* **Astro Frontend:** [http://localhost:4321](http://localhost:4321)
* **Strapi Admin Panel:** [http://localhost:1337/admin](http://localhost:1337/admin)

---
<p align="center">
  <i>Proprietary software. All rights reserved by Dream of The Holy Himalayas.</i>
</p>
