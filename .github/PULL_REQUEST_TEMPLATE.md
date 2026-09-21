## What does this PR change?

<!-- One or two sentences: what and why. Link the issue if applicable: Fixes # -->

## Type of change

- [ ] Bug fix
- [ ] Feature
- [ ] Content / design
- [ ] Refactor
- [ ] Docs
- [ ] Infra / deploy

## Scope check (AGENTS.md guardrails)

- [ ] No secrets committed; new env vars documented in the relevant `.env.example`
- [ ] No Phase 2 scope creep (payments, auth, GraphQL)
- [ ] Trek names, prices, dates, itineraries come from Strapi — not hard-coded
- [ ] Booking schema changes are backward-compatible
- [ ] Commits are atomic and phase-scoped

## Verification

- [ ] `npm run check` passes in `apps/web`
- [ ] `npm run build` passes (web and/or cms as applicable)
- [ ] Playwright booking E2E passes (`apps/web/tests`), if booking flow touched
- [ ] Tested on mobile viewport (375px) and desktop

## Screenshots / recordings

<!-- Required for any UI change; before/after helps review. -->
