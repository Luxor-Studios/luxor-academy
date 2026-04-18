# LUXOR Academy — 5-Phase Launch Plan

**Date:** 2026-04-18
**Status:** Draft — awaiting MERCURIO + MARS validation
**Goal:** Ship a retro-futuristic gamified learning academy converting the user's second-brain (repos + skills + agents + commands) into interactive HTML courses. First demo-able in ~7 days, first 10 courses in ~30 days.

---

## Synthesized Top-5 Ship-Ready Repos (local + GitHub merged)

Ranked by **ship-distance × learning-value × demo-impact**:

| # | Repo | Local path / GitHub | Ship-distance | Why it's #N |
|---|------|---------------------|---------------|-------------|
| 1 | **BARQUE** | LUXOR/PROJECTS/BARQUE ↔ manutej/luxor-barque | ≤1 day (tag v1.0) | Artifact already working daily; the venv-shebang lesson is memorable; dual-theme PDFs are visually stunning |
| 2 | **LUXOR Claude Marketplace** | manutej/luxor-claude-marketplace (53 stars, landing page exists) | ≤3 days (content refresh) | Only public traction; anchor of "tooling distribution" story; landing page already has canonical brand tokens |
| 3 | **HALCON** | LUXOR/PROJECTS/HALCON | ~1 week (Vercel config) | 54 tests passing, 80% coverage, exemplar TDD repo; orbital navigation UI is a "wow" demo |
| 4 | **Meta-Prompting Plugin** | manutej/meta-prompting-plugin | ~1 week (docs + install) | Students install this plugin on Day 1 of the course → instant engagement |
| 5 | **Kochi** | manutej/kochi (pushed 1 day ago — active) | ~1 week (deploy demo) | 3D phi-layout knowledge graph; IS the visual metaphor of the academy itself |

**Honorable / second wave:** SuperGrok-CLI (needs `npm publish`), MAKER (needs tests), paper2agent (needs public flip + docs), CETI Claude Code Course (live funnel already at learn.cetiai.co — integration, not ship).

---

## Phase 1 — Atlas Shell + BARQUE Flagship Quest (Week 1)

**Goal:** user can open one HTML page, navigate from Atlas → Track → Quest → three Modules, complete one interactive widget, earn first XP + First-Shipment badge.

**Build:**
- `atlas/` — single-page Atlas with 1 populated Track vertex (Build & Ship), 11 placeholder vertices. Vector-equilibrium SVG rendered.
- `modules/build-and-ship/forge-barque/` — three modules:
  1. *The venv-Shebang Trap* — interactive shell simulator (broken vs activated venv, run live)
  2. *Dual-Theme CSS via Variables* — live CSS editor, side-by-side render
  3. *Ship It with Resend* — mock API sandbox (structured POST body check; no real send)
- `atlas/tokens/tokens.css` — ✅ already drafted, Luxor canonical brand
- `atlas/components/` — CourseCard, XPBar, BadgeDisplay, DiagramViewer, CodeSandbox (vanilla TS + lucide-react)
- `pipelines/codebase-to-course/` — the extract → transform → render script for the BARQUE repo
- `validators/six-slots.js` — build-time enforcer of the primer/visual/interactive/artifact/self-check/next contract
- Playwright smoke test + link-check CI

**Acceptance criteria (all must pass before demo):**
- [ ] Atlas loads ≤1s on 4G, ≤50KB JS, ≤100KB total
- [ ] Keyboard-only traversal complete end-to-end (`g a` → `j/k` → `x`)
- [ ] All 3 modules validate against 6-slot contract
- [ ] Playwright smoke: visit Atlas → click Quest → complete Module 1 self-check → XP persists in localStorage
- [ ] WCAG AA contrast verified on all gold-on-navy pairs
- [ ] `prefers-reduced-motion` disables jitterbug morph
- [ ] MERCURIO & MARS gate scores ≥8/10 on architecture + ≥9/10 on quest pedagogy

**Out of scope (Phase 1):** user accounts, backend, server-side XP persistence, multi-user, leaderboards, audio, video.

**Owner:** Claude Code (automated with user review gates at atlas-scaffold, quest-complete, pre-demo).

---

## Phase 2 — 3 More Quests, Atlas Fills Up (Week 2)

**Goal:** three Tracks partially populated, 10 total modules live, academy feels "real."

**Quests:**
- **Build & Ship**: *Deploy HALCON to Vercel* (4 modules: Vercel config, env-var hygiene, preview-branch workflow, custom domain)
- **Agent Mastery**: *Compose Parallel Agents* (3 modules: dispatch-pattern, result-synthesis, MERCURIO convergence) — sourced from ~/.claude/agents/mercurio-*.md
- **Categorical Wizardry**: *Your First DSL* (4 modules: atomic blocks → composition → quality gates → ship) — sourced from ~/.claude/skills/categorical-meta-prompting-ts

**New infrastructure:**
- Track-switching animation (jitterbug SVG morph)
- CommandPalette (`⌘K`) searches across all 10 modules
- Shareable quest-completion card (OG image generator)

**Acceptance:** 10 modules pass 6-slot validator, Atlas has 3 live vertices + 9 placeholders, ≤100KB JS per track bundle.

---

## Phase 3 — Marketplace + Pipeline + Second Wave of Quests (Weeks 3-4)

**Goal:** codebase-to-course pipeline can turn ANY user repo into a quest with minimal editing. 20 total modules across 5 Tracks.

- **Pipeline hardening**: pattern-match `README.md` section headings, auto-generate primers, extract test assertions as self-checks
- **Quests added**:
  - *Build Your Plugin* (from meta-prompting-plugin) — live plugin install inside the module page
  - *Model a Knowledge Graph* (from kochi) — embed kochi as the Module's interactive widget
  - *MAKER: Million-Step Orchestration* (from MAKER) — Towers-of-Hanoi interactive demo
  - *Ship with paper2agent* (from paper2agent) — paper-URL → agent pipeline
- **Grimoire section** — searchable library of all 169 skills + 55 agents + 103 commands (auto-generated from frontmatter)

**Acceptance:** pipeline can ingest a new repo in <60s and produce a draft quest that passes 6-slot validator on 80%+ of modules without hand-editing.

---

## Phase 4 — Beta Enrollment + CETI.AI Integration (Week 5)

**Goal:** 10 external learners onboarded. learn.cetiai.co funnel routes to academy.

- CETI Claude Code Course landing page integrates an **Enter The Academy** CTA
- Auth: magic-link only (Resend), no passwords, email-scoped localStorage import on first login
- Private beta invite list (25 seats), feedback loop via in-page `?` → form
- Enrollment metrics (completion rate per module, drop-off points) — local-only instrumentation, no 3rd-party analytics

**Acceptance:** 10 learners complete ≥1 full quest; NPS ≥ 40; zero accessibility blocker reports.

---

## Phase 5 — Public Launch + Full Quest Library (Weeks 6-8)

**Goal:** 12 Tracks × 3-7 Quests each = 40-60 Quests, ~200 Modules. Public, open, indexed.

- Content sprint: remaining Tracks populated (Verification & Rigor, Synergetic Systems, Infrastructure, DSL Design, Agent Patterns, Categorical Foundations, etc.)
- SEO: static sitemap, OG images per module, RSS for new-quest announcements
- Public launch: HackerNews + relevant subreddits + Twitter thread + one **Master** tier capstone open to all (e.g., *Build a paper2agent clone in 48h*)
- **Business Model**: free tier = all Initiate/Adept content. Synergist tier (private cohort, live office hours) = paid.

**Acceptance:** MERCURIO/MARS gates on 100% of Master-tier modules; ≥50 Initiate-tier modules; public launch post drives ≥1000 unique visitors in week 1; Atlas supports 12 populated Track vertices.

---

## Validation Gates (MERCURIO + MARS, every phase)

- **MERCURIO** (mental/physical/spiritual) on every Quest before it goes live. Must score ≥8/10 each plane.
- **MARS** (systems-level architecture) on every Phase-end artifact. Must score ≥95% confidence.
- **Anti-confabulation protocol** on every technical claim — all cited to source files or official docs, zero fabricated APIs.
- **Seven Pillars checklist** on every Module (see academy-architecture.md).

## Success Metrics (Phase 1)

| Metric | Target |
|--------|--------|
| Atlas TTI on 4G | ≤1s |
| JS per track bundle | ≤50KB |
| WCAG AA contrast coverage | 100% |
| Keyboard-only completable | 100% of Phase 1 modules |
| 6-slot validator pass rate | 100% |
| MERCURIO plane scores | ≥8/10 |
| MARS confidence | ≥95% |
| User demo response | "I want to see more" (qualitative) |

## Risks + Mitigations

| Risk | Mitigation |
|------|------------|
| Jitterbug animation scope-creeps into WebGL | MVP = SVG/CSS only; WebGL is Phase 3+ opt-in |
| Codebase-to-course pipeline hallucinates structure | 6-slot validator FAILS LOUDLY on missing data; no auto-published modules |
| XP becomes vanity metric | XP-toggle from Day 1; badges only for verified-file-exists criteria |
| Context-loss during long build sessions | `.planning/progress.md` updated per phase; session-handoff docs per Quest |
| Brand drift from Luxor canonical | Tokens.css enforces `#E9B949` gold + Playfair Display; no new colors without doc update |

## File Tree (Phase 1 target)

```
LUXOR-ACADEMY/
├── atlas/
│   ├── index.html                # Atlas page
│   ├── tokens/tokens.css         # ✅ drafted
│   ├── components/               # CourseCard, XPBar, BadgeDisplay, etc.
│   ├── icons/synergetics/        # tetra, octa, VE, jitterbug SVGs
│   └── scripts/                  # keyboard nav, XP persistence, command palette
├── modules/
│   └── build-and-ship/
│       └── forge-barque/
│           ├── 01-venv-shebang-trap.html
│           ├── 02-dual-theme-css.html
│           └── 03-ship-it-resend.html
├── pipelines/
│   └── codebase-to-course/
│       ├── extract.ts
│       ├── transform.ts
│       └── render.ts
├── validators/
│   └── six-slots.js
├── tests/
│   ├── smoke.spec.ts             # Playwright
│   └── link-check.yml            # CI
├── .planning/
│   ├── progress.md               # ✅ exists
│   ├── academy-architecture.md   # ✅ exists
│   └── launch-plan.md            # ✅ this file
└── README.md
```
