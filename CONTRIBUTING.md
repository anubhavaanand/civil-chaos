# Contributing to Dream of The Holy Himalayas

Start with [`AGENTS.md`](AGENTS.md) — the project constitution: guardrails, locked tech decisions, and phase scope. Detailed specs live in [`docs/`](docs).

## Environment

- Node.js 20+, npm workspaces
- A Neon Postgres database and a MapTiler API key (free tier) for full functionality
- Copy the example env files before first run:

```bash
cp apps/web/.env.example apps/web/.env
cp apps/cms/.env.example apps/cms/.env
```

## Local workflow

```bash
npm install                                # repo root

npm run dev                                # Astro frontend → http://localhost:4321
npm run develop --workspace=apps/cms       # Strapi → http://localhost:1337/admin (second terminal)
```

Before opening a pull request:

1. Branch from `main` (`feat/<name>` or `fix/<name>`).
2. Keep commits atomic and phase-scoped (foundation / content / map / booking / polish).
3. Run `npm run check` and `npm run build` in `apps/web` — both must pass.
4. If the booking flow changed, run the Playwright suite (`apps/web/tests`).
5. Seed-data changes belong in `apps/cms/scripts/seed.mjs`, never in frontend fixtures.

## Content rule

All trek information (names, prices, dates, itineraries) is managed by the agency team in the Strapi admin panel. Frontend code must fetch it from the API — pull requests that hard-code content will not be merged.

## Issue & PR conventions

Use the provided templates. One concern per PR; split refactors from behaviour changes; UI changes need before/after screenshots.
