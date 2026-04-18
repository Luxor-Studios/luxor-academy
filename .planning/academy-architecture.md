# LUXOR Academy — Pedagogical Architecture (v0)

Source: mercurio-orchestrator subagent, MERCURIO three-plane scored 8.7/10.

## Taxonomy
- **Track** — thematic mastery domain (3-7 Quests). Examples: Categorical Wizardry · Build & Ship · Agent Mastery · Verification & Rigor · Synergetic Systems.
- **Quest** — guided build arc from a flagship repo/skill (4-8 Modules + Boss-Fight).
- **Module** — 10-25 min single-concept HTML page with 6 required slots.

**Rule:** every module maps to a REAL artifact in the second-brain. No synthetic examples.

## Progression (5 tiers, no dark patterns)
Initiate (0) → Adept (500) → Journeyman (2k) → Master (8k) → Synergist (20k).
XP: self-check 50 · widget-correct 75 · quest boss-fight 300 · shipped artifact 500 (file-verified).
Badges: First-Shipment · Composer · Debugger · Synthesizer · Verifier. **No streaks. No daily-login.**

## Module 6-Slot Contract (validator-enforced)
`<primer> <visual> <interactive> <artifact> <self-check> <next>`
Missing any slot = build fails.

## Codebase-to-Course Pipeline
Extract (README/docs/tests/examples/git-log) → Transform (deterministic) → Render (templated HTML).
- README intro → primer
- mermaid/diagram → visual
- example blocks → interactive
- canonical source file → artifact (permalinked)
- test assertions → self-check
- sibling files → next

## IA Metaphor (atlas of your own mind)
Atlas (cuboctahedron hub, 12 vertices = Tracks) → Constellation (Track) → Island (Quest) → Room (Module).
Keyboard: `g a/t/q` · `j/k` · `x` · `/` · `?`.

## Synergetics → Hierarchy
- Tetrahedron = Module (4 visible slots + 2 connection edges)
- Octahedron = Quest (6-8 face modules)
- Vector Equilibrium = Track (12 quest vertices around core insight)
- Jitterbug transformation = level-transition animation
- Isotropic Vector Matrix = Atlas lattice

## Seven Pillars — all mapped, all testable
Meaningful (real artifacts) · Beautiful (vector-line retro) · Accessible (keyboard+AA+reduced-motion) · Secure (static+CSP iframes) · Performant (<1s TTI / <50KB JS per track) · Tested (slot validator + Playwright) · Documented (auto .md siblings).

## Phase 1 MVP
**Track:** Build & Ship · **Quest:** Forge BARQUE — Markdown to Emailed PDF · **Modules:** (1) The venv-Shebang Trap (2) Dual-Theme CSS via Variables (3) Ship It with Resend. Plus: Atlas page w/ 1 populated vertex, jitterbug SVG morph, keyboard nav, 6-slot validator, Playwright smoke.

## MERCURIO Gate Scores
- Mental 9 — taxonomy crisp, geometry generative, pipeline testable. Red flag: validator must fail loudly on messy repos.
- Physical 8 — 1-2 week MVP achievable. Red flag: cap jitterbug at SVG/CSS (not WebGL) in MVP.
- Spiritual 9 — no streaks, XP tied to real shipped artifacts. Red flag: make XP toggleable from day 1.

**Verdict:** 8.7/10 — build it. BARQUE first (artifact ready, venv-shebang = memorable lesson).
