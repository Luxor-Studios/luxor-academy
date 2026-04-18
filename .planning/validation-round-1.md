# Validation Round 1 — MERCURIO + MARS

**Date:** 2026-04-18
**Plan under review:** launch-plan.md (v1.0)
**Result:** Both validators → CONDITIONAL-GO
**Composite score:** MERCURIO 7.33/10 · MARS 7.5/10 · Phase 1 confidence 72%

## Scores

| Validator | Plane / Metric | Score |
|-----------|----------------|-------|
| MERCURIO | Mental | 7.5 |
| MERCURIO | Physical | 6.5 |
| MERCURIO | Spiritual | 8.0 |
| MARS | Systems architecture | 7.5 |
| MARS | Phase-1 shippability (7 days) | 72% |

## Convergent blockers (both agents flagged)

1. **Phase 1 is 2-3 weeks of work, not 1 week** — MERCURIO: 3 interactive widgets is too much. MARS: four co-dependent primitives (validator + pipeline + Atlas + XP) with zero slack.
2. **Sequencing is wrong — substrate must precede content.** MARS: BARQUE content authored before slot grammar is frozen = guaranteed rework.
3. **Self-gating: AI can't be sole arbiter of AI-produced content.** MERCURIO: need human review gate per phase-end.

## MERCURIO-unique insights (incorporating)

- **"Ship Your Own" module** as canonical last-module of every Quest — learner's own repo URL becomes their personal permalink quest via the codebase-to-course pipeline. Turns the academy from "museum of Manu's brain" into "build your own second brain using the same engine." Content scales without moderation debt.
- **"Deterministic" language is oversold** — rename to "templated / heuristic-with-validator"
- **Content licensing matrix** — per-module LICENSE, especially for pipeline-generated content from external repos
- **Privacy posture** — magic-link means Resend holds emails; GDPR/CCPA policy required
- **Course-update versioning** — immutable v-snapshots when upstream repo ships new version
- **XP export button** — sovereignty principle demands portable progress
- **Font audit** — 4 font families vs 50KB budget; subset or drop Orbitron

## MARS-unique insights (incorporating)

- **`slots.schema.json` as single source of truth** — consumed by (a) build validator, (b) pipeline transform exit criterion, (c) dev-mode browser console warnings, (d) Playwright assertions. One schema, four consumers. Highest-leverage consolidation available.
- **One renderer, three viewports** — Atlas / Quest / Module = same custom-element tree at different zoom levels (IVM lattice → VE cluster → octahedron face). Single CSS grid + `data-zoom` attribute. Kills ~60% of component code.
- **Required custom elements** — `<module-primer>`, `<module-visual>`, etc. — so HTML parse = contract check. No prose-level validation.
- **CETI integration earlier (Phase 2)** — anonymous-XP outbound link. Validates distribution hypothesis 3 weeks sooner. Magic-link auth deferred to Phase 5.
- **Route-level code-splitting per Track** — required at 100+ modules
- **Build-time search index** (Lunr/MiniSearch prebuilt JSON) — required at 500+ modules (Grimoire)
- **`quest.manifest.json`** — (id, version, slot-map, artifact-refs) required BEFORE Phase 3 or forking becomes a rewrite
- **Atlas first-load optimization** — SVG sprite sheet + `<template>` previews populated on focus; designed-in at Phase 1

## Seven Pillars status (MARS)

| Pillar | Status | Gap to close before Phase 1 |
|--------|--------|-----------------------------|
| Meaningful | enforced | — |
| Beautiful | enforced | — |
| Accessible | partial | Explicit skip-link spec, announced-XP live region, screen-reader landmark list |
| Secure | partial | CSP header spec, sandbox attribute policy for CodeSandbox, Resend-mock isolation contract |
| Performant | partial | Per-Track code-splitting strategy, 500-module scaling plan |
| Tested | partial | Visual regression, axe-core a11y automation, pipeline golden-file tests |
| Documented | partial | "Auto .md siblings" concretized in Phase 1 build list |

## Decisions made in response

1. **Insert Phase 0.5 (substrate)** — 3 days. Builds validator, slots.schema.json, Atlas shell, pipeline skeleton, CI harness. No content.
2. **Shrink Phase 1 (BARQUE flagship)** — 3 days. 1 fully-interactive module (venv-shebang shell sim) + 2 static-readable modules. Move live CSS editor and Resend sandbox to Phase 2.
3. **Combined 0.5 + 1 = 7 days total** honoring original demo timeline.
4. **Insert Phase 2 CETI outbound link** — anonymous XP, no auth. Defer magic-link to Phase 5.
5. **Adopt "Ship Your Own" as canonical last-module pattern** — every Quest ends with a `module/ship-your-own/` pointing the pipeline at learner's repo URL.
6. **Publish slots.schema.json** as first Phase 0.5 artifact — everything else builds on it.
7. **Promote Atlas-renderer unification** — Atlas/Quest/Module = one web-component tree with `data-zoom`.
8. **Add human review gate** — per phase-end, Manu signs off in `progress.md` before next phase starts. MERCURIO/MARS inform but do not decide.
9. **Rewrite "deterministic pipeline" as "templated pipeline with validator-enforced contract"** — accurate language.
10. **Add risk-table entries** — TTI harness (Lighthouse mobile + slow-4G throttling in CI), content licensing matrix, XP export/import, font audit, fork model (quest.manifest.json), 500-module scaling (Grimoire build-index).
11. **Drop 4-font count to 3** — Playfair Display (display), Inter (body), JetBrains Mono (code). Orbitron removed; its HUD role covered by Inter + `tracking-widest` + mono numerals.
12. **Explicit non-goals** — no theme JS at runtime (tokens.css-only); no server-side rendering in MVP; no user accounts before Phase 5.

## What did NOT change

- Luxor canonical brand (navy `#0A1628` + gold `#E9B949` + Playfair Display) — stays.
- Fuller synergetics → hierarchy mapping — stays (MARS confirmed generative not cosmetic).
- 5-tier progression (Initiate → Synergist), no streaks, no daily-login — stays (MERCURIO Spiritual 8.0 confirmed coherent).
- 6-slot module contract — stays, now enforced via custom elements.
- BARQUE as flagship Quest — stays. Confirmed lowest ship-distance.

## Next action

Write revised `launch-plan-v1.1.md`, publish `slots.schema.json`, update `progress.md`. Then resume Phase 0.5 build under human-gated review.
