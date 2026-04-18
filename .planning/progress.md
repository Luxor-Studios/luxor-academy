# LUXOR Academy — Progress

**Session:** 2026-04-18
**Current state:** Planning complete, substrate-build ready to start (Phase 0.5)
**Awaiting:** Human sign-off before Phase 0.5 build begins

---

## Completed

- ✅ Discovery: top-5 ship-ready LUXOR repos (BARQUE, Luxor Marketplace, HALCON, Meta-Prompting Plugin, Kochi)
- ✅ Discovery: GitHub manutej survey (10 shippable + 3 overlap candidates)
- ✅ Discovery: inventory audit (169 skills / 55 agents / 103 commands / 44 workflows clustered)
- ✅ Discovery: styling references (Ormus + Luxor Studios canonical + Fuller synergetics + Lucide)
- ✅ Architecture: pedagogical spec (MERCURIO 8.7/10 on pedagogy)
- ✅ Architecture: design tokens v0.1 → `atlas/tokens/tokens.css`
- ✅ Launch plan v1.0 drafted → `.planning/launch-plan.md`
- ✅ Validation round 1: MERCURIO (7.33/10) + MARS (72% Phase-1 confidence) — both CONDITIONAL-GO
- ✅ Validation report: `.planning/validation-round-1.md`
- ✅ slots.schema.json (single source of truth) → `validators/slots.schema.json`
- ✅ Launch plan v1.1 (revised) → `.planning/launch-plan-v1.1.md`

## Awaiting human sign-off

- ⬜ Manu reviews `.planning/launch-plan-v1.1.md` — GO / revise?
- ⬜ Manu approves Phase 0.5 scope (substrate: validator + atlas shell + pipeline skeleton + CI)

## Phase 0.5 — ready to start when approved (Days 1-3)

- ⬜ `validators/six-slots.js` — AST validator consuming slots.schema.json
- ⬜ `atlas/index.html` — Atlas shell with 12 VE vertices (1 live, 11 placeholder)
- ⬜ `atlas/components/*` — web-components with shared `<module-root data-zoom>` renderer
- ⬜ `atlas/scripts/{keyboard,xp}.ts`
- ⬜ `atlas/icons/synergetics/*.svg` — 6 Fuller primitive SVGs
- ⬜ `pipelines/codebase-to-course/extract.ts` (skeleton only)
- ⬜ `tests/{perf,smoke,a11y,validator}.spec.ts`
- ⬜ `.github/workflows/ci.yml`

## Key decisions locked

| Decision | Value |
|----------|-------|
| Canonical gold | `#E9B949` (Luxor Studios) |
| Canonical navy | `#0A1628` |
| Display font | Playfair Display |
| Body font | Inter |
| Mono font | JetBrains Mono |
| Slot contract | 6 slots enforced via custom elements + JSON schema |
| Canonical last module | "Ship Your Own" (learner repo → personal quest) |
| Render model | One web-component tree, `data-zoom` for Atlas/Quest/Module |
| Theme | tokens.css only, no runtime JS |
| Auth | Anonymous + localStorage until Phase 5 magic-link |
| AI gate model | MERCURIO+MARS advise, human decides |

## Files

- `.planning/launch-plan-v1.1.md` — canonical plan (v1.0 archived in same folder)
- `.planning/academy-architecture.md` — pedagogical spec
- `.planning/validation-round-1.md` — MERCURIO + MARS reports
- `.planning/progress.md` — this file
- `atlas/tokens/tokens.css` — design tokens
- `validators/slots.schema.json` — module contract

## Open questions (non-blocking)

- Does Manu want the "Ship Your Own" module to gate on authenticated GitHub, or anonymous URL paste? (Phase 3 decision, not blocker.)
- Parchment (light) theme — ship in Phase 1 or defer? (tokens.css supports both via `data-theme`.)
- Domain: luxor.academy, academy.luxor.studio, or subpath of cetiai.co?
- Source repo for academy: new `manutej/luxor-academy` or monorepo inside `luxor-claude-marketplace`?
