# LUXOR Academy — Launch Plan v1.1 (Revised)

**Date:** 2026-04-18
**Supersedes:** launch-plan.md (v1.0)
**Validation:** MERCURIO + MARS CONDITIONAL-GO → consensus revisions applied → ready to build
**See also:** `.planning/validation-round-1.md` for full validator reports and decision record.

---

## What changed from v1.0

1. **Split Phase 1 → Phase 0.5 (substrate, 3 days) + Phase 1 (BARQUE quest, 3 days) + Integration (1 day) = 7 days unchanged.** Substrate-first avoids content rework on a moving schema.
2. **`slots.schema.json`** is now the single source of truth — consumed by validator, pipeline, CI, dev-mode. Already published at `validators/slots.schema.json`.
3. **"Ship Your Own"** added as canonical last-module pattern of every Quest — learner pipes their own repo URL through the pipeline, gets a permalink personal quest. Inverts content economics.
4. **Human review gate** at every phase-end — Manu signs off in `progress.md`. MERCURIO/MARS advise; human decides.
5. **CETI outbound link** moved to Phase 2 (anonymous-XP, no auth) — validates distribution 3 weeks sooner. Magic-link auth deferred to Phase 5.
6. **Custom elements** (`<module-primer>`, `<module-visual>`, etc.) replace prose slot markers — HTML parse = contract check.
7. **Three fonts, not four** — Playfair Display / Inter / JetBrains Mono. Orbitron dropped.
8. **"Deterministic pipeline" → "templated pipeline with validator-enforced contract"** — accurate language.
9. **Non-goals added:** no runtime theme JS; no SSR in MVP; no user accounts before Phase 5.

---

## Top-5 Ship-Ready Repos (unchanged)

1. BARQUE · 2. Luxor Claude Marketplace · 3. HALCON · 4. Meta-Prompting Plugin · 5. Kochi

Second wave: SuperGrok-CLI, MAKER, paper2agent, CETI Course funnel (integration, not ship).

---

## Phase 0.5 — Substrate (Days 1-3)

**Goal:** Ship the frame that every Quest will be poured into. Zero content. Everything else depends on this.

**Build:**
- `validators/slots.schema.json` — ✅ done
- `validators/six-slots.js` — AST validator using the schema (Node, pure function, sub-ms per module)
- `atlas/tokens/tokens.css` — ✅ done
- `atlas/index.html` — Atlas shell; renders IVM grid + 12 VE vertices (1 live, 11 placeholder)
- `atlas/components/` — web-components (`<module-root>`, `<module-primer>`, `<module-visual>`, `<module-interactive>`, `<module-artifact>`, `<module-self-check>`, `<module-next>`) — one renderer, `data-zoom` switches Atlas/Quest/Module
- `atlas/scripts/keyboard.ts` — `g a/t/q`, `j/k`, `x`, `/`, `?`, `esc`
- `atlas/scripts/xp.ts` — localStorage read/write + export-JSON button
- `pipelines/codebase-to-course/extract.ts` — skeleton: README→primer, tests→self-check, mermaid→visual, canonical file→artifact
- `tests/perf.spec.ts` — Lighthouse mobile slow-4G throttle, TTI ≤1s assertion
- `tests/smoke.spec.ts` — Playwright end-to-end nav
- `tests/a11y.spec.ts` — axe-core landing + module pages
- `tests/validator.spec.ts` — golden-file test for slots.schema validator
- `.github/workflows/ci.yml` — runs validator + Playwright + Lighthouse + axe
- `atlas/icons/synergetics/` — 6 SVGs: tetrahedron, octahedron, cuboctahedron (VE), jitterbug keyframes, icosahedron, geodesic sphere

**Acceptance (Phase 0.5):**
- [ ] `node validators/six-slots.js example.module.json` exits 0 on valid, ≠0 on invalid
- [ ] Atlas loads ≤1s TTI on Lighthouse slow-4G mobile profile (asserted in CI)
- [ ] JS total ≤50KB on Atlas page (asserted)
- [ ] axe-core returns zero violations on Atlas
- [ ] Keyboard traversal Atlas→Track-vertex→(placeholder) works without mouse
- [ ] XP export button produces valid JSON
- [ ] `prefers-reduced-motion: reduce` suppresses jitterbug animation (visual regression)

**Gate:** Manu reviews Phase 0.5 artifacts in browser. If all acceptance boxes tick AND subjective "feels right," proceed to Phase 1. Otherwise revise.

---

## Phase 1 — Forge BARQUE Flagship Quest (Days 4-6)

**Goal:** First instantiation of the substrate. One Quest, 4 modules (3 content + 1 "Ship Your Own"), BARQUE as the canonical example.

**Modules:**
1. **The venv-Shebang Trap** — interactive shell simulator (broken vs activated venv). `interactive.kind: simulator`, sandboxed iframe, no eval. Success = user runs `which python3` in activated venv pane.
2. **Dual-Theme CSS via Variables** — *static-readable in Phase 1* (per MERCURIO condition #1). Shows side-by-side rendering of sample doc, live editor DEFERRED to Phase 2. Artifact: actual tokens.css excerpt from BARQUE.
3. **Ship It with Resend** — *static-readable in Phase 1*. Shows structured POST body example, explains idempotency key. Live mock-API sandbox DEFERRED to Phase 2.
4. **Ship Your Own (PDF generator)** — canonical last-module. Learner enters their own markdown/report generator repo URL → pipeline extracts + renders → they get a permalink quest they own. (MERCURIO inversion insight.)

**Each module:**
- Validated against `slots.schema.json` at build time
- Rendered by the shared `<module-root data-zoom="module">` web-component
- License declared in `meta.license` (BARQUE artifacts = BARQUE repo LICENSE; Manu-authored prose = CC-BY-SA-4.0)

**Acceptance (Phase 1):**
- [ ] 4 module HTML files validate against `slots.schema.json`
- [ ] Quest page shows all 4 modules with completion-ring at Quest level
- [ ] Playwright smoke: visit Atlas → click Build & Ship vertex → enter BARQUE quest → complete Module 1 interactive → XP persists in localStorage
- [ ] All contrast pairs verified (scripted test against tokens.css hex values)
- [ ] Perf budget holds: quest + 4 modules ≤60KB JS total
- [ ] "Ship Your Own" module accepts a test repo URL and produces a draft output passing slot validation

**Gate:** Manu reviews Phase 1 in browser end-to-end. Sign-off required before Phase 2.

---

## Phase 2 — Second Quests + CETI Outbound (Week 2)

**Goal:** Academy feels real. 3 Tracks partially populated. CETI funnel validated.

- **Quests:**
  - *Deploy HALCON to Vercel* (Build & Ship, 4 modules + Ship-Your-Own)
  - *Compose Parallel Agents* (Agent Mastery, 3 modules + Ship-Your-Own — sourced from mercurio-*)
  - *Your First DSL* (Categorical Wizardry, 4 modules + Ship-Your-Own — from categorical-meta-prompting-ts)
- **Upgrades:**
  - Promote Phase 1 static-readable modules (CSS editor + Resend mock) to live interactive
  - Jitterbug SVG morph between Atlas/Track/Quest zoom transitions
  - CommandPalette (`⌘K`) fuzzy-searches across all modules
  - CETI.AI outbound link from learn.cetiai.co (anonymous XP, no auth)
  - Shareable quest-completion OG-image generator

**Acceptance:** 10+ modules pass slot validator; CETI outbound link shows ≥50 visitors in a week; axe-core clean on every module.

---

## Phase 3 — Pipeline Hardening + Grimoire (Weeks 3-4)

**Goal:** Any repo → draft quest in <60s, 80% pass-rate without hand-edits. Grimoire library of all skills/agents/commands.

- Pipeline enhancements:
  - AST-based README section detection (not regex)
  - Test-assertion → self-check mapping with prompt-stem rewriter
  - Mermaid/graphviz pre-render to inline SVG
  - `quest.manifest.json` generated per quest (id, version, slot-map, artifact-refs)
  - Fallback contract: `--manual-slot-override.yaml` for the 20% that fail
- **Quests added** (each using the hardened pipeline):
  - *Build Your Plugin* (meta-prompting-plugin)
  - *Model a Knowledge Graph* (kochi embedded as widget)
  - *MAKER: Million-Step Orchestration* (Towers-of-Hanoi)
  - *Ship with paper2agent*
- **Grimoire** — searchable static library
  - Lunr/MiniSearch prebuilt index at build time
  - Route-level code-splitting per Track (100+ module prep)

**Acceptance:** Pipeline ingests 5 test repos, 4/5 produce draft quests passing slot validation without human edit (80% target measurable); Grimoire searches 169 skills + 55 agents + 103 commands with <100ms latency.

---

## Phase 4 — Beta + Polish (Week 5)

**Goal:** 10 external learners onboarded via CETI funnel.

- Promote CETI outbound to "Enter Academy" CTA
- Magic-link auth (Resend) introduced here, *optional* — anonymous continues to work
- Privacy policy + data-deletion route + GDPR/CCPA posture doc
- Feedback in-page `?` → form, routes to Linear
- Analytics: local-only histograms (completion-by-module) aggregated at client, reported opt-in

**Acceptance:** 10 learners complete ≥1 Quest; NPS ≥40; zero a11y blocker reports; feedback loop closes to ≤48h response.

---

## Phase 5 — Public Launch + Scale (Weeks 6-8)

**Goal:** 5 Tracks × 4-6 Quests each = 20-30 Quests, ~120 modules.

- Content sprint: Verification & Rigor, Synergetic Systems, Infrastructure tracks populated
- Immutable module snapshots: `v-YYYYMMDD-HHMM` per module, learner progress pinned to version at enrollment
- SEO: static sitemap, OG per module, RSS for new-quest announcements
- Public launch: HN + targeted communities + Twitter thread + one Master-tier capstone
- Business model: free = all Initiate/Adept; Synergist tier = paid cohort + office hours

**Acceptance:** 100% of Master-tier modules pass MERCURIO+MARS+human review; ≥50 Initiate modules live; ≥1000 unique visitors week-1 post-launch; XP/progress export works end-to-end.

**Deferred past Phase 5:** Capstone live cohort automation, monetization tooling, i18n beyond English.

---

## Validation Gates (revised)

| Gate | Judge | Threshold |
|------|-------|-----------|
| Per-module | `slots.schema.json` validator | Pass = publish-eligible |
| Per-module | axe-core | 0 violations |
| Per-module | contrast test | AA on every token pair in use |
| Per-phase | MERCURIO 3-plane | ≥8/10 average, red flags addressed |
| Per-phase | MARS systems | ≥85% confidence, blockers addressed |
| Per-phase | **Human sign-off** | Manu checks off in `progress.md` |

AI validators advise. Human decides.

## Success Metrics (Phase 0.5 + 1 combined = 7 days)

| Metric | Target | Measurement |
|--------|--------|-------------|
| Atlas TTI on slow-4G mobile | ≤1s | Lighthouse CI asserted |
| JS per Atlas page | ≤50KB | rollup-analyzer asserted |
| Slot validator pass rate | 100% on 4 modules | `node validators/six-slots.js` |
| axe-core violations | 0 on Atlas + 4 modules | axe-core CI |
| Keyboard completion | 100% of flow | Playwright |
| MERCURIO re-score | ≥8/10 every plane | validator agent |
| MARS re-score | ≥85% Phase-1 confidence | validator agent |
| Manu sign-off | yes | checkbox in progress.md |

## Non-Goals (explicit)

- No runtime theme JS — tokens.css only
- No SSR in MVP — static HTML + enhance
- No user accounts before Phase 5
- No moderation system before Phase 5
- No WebGL in Phase 1-2 (SVG/CSS only)
- No i18n before Phase 5+1

## Risks + Mitigations (expanded)

| Risk | Mitigation |
|------|------------|
| Phase 0.5 slips | Substrate is discrete; if validator+tokens+shell land but tests don't, demo with in-repo tests only |
| Pipeline hallucinates on messy repo | Validator fails loudly; `--manual-slot-override.yaml` fallback (Phase 3) |
| "Ship Your Own" produces ugly output | Phase 1 launches with *one* tested repo URL; learner-submitted expanded in Phase 3 with hardened pipeline |
| CETI outbound drives zero traffic | Distribution hypothesis test — if <10 visitors/week by Phase 2 end, rethink funnel before Phase 3 |
| XP becomes vanity | XP-toggle from Day 1; export/import ensures portability; badges only verified-artifact |
| Content licensing ambiguity | Per-module `meta.license` in schema; prose CC-BY-SA-4.0, code inherits repo LICENSE |
| Brand drift | tokens.css is single source; `#E9B949` gold + Playfair Display enforced in PR template |
| TTI regresses | CI asserts on every PR; blocks merge |
| 500-module scale breaks Grimoire | Build-time search index (Phase 3), route-splitting (Phase 3) — designed in, not retrofitted |
| Mid-quest upstream breakage | v-snapshots at Phase 5; during Phases 1-4, accept occasional broken artifact link as expected |
