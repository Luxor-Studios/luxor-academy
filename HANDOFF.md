# LUXOR Academy — Handoff Document

**Target reader:** a fresh Claude Code session (or human engineer) starting from zero context.
**Mission:** build Phase 0.5 substrate of the LUXOR Academy — a retro-futuristic gamified learning platform that converts a user's second-brain (repos + skills + agents + commands) into interactive HTML courses.
**Budget:** 3 days of focused build (Phase 0.5 only). Phase 1 is a separate handoff.
**Last updated:** 2026-04-18
**Prior session:** planning + validation complete, substrate ready to start.

---

## 1. What this project is

A static-first, retro-futuristic learning academy. The user (Manu) has built up 169 Claude skills + 55 agents + 103 commands + dozens of shippable repos. The academy turns that second-brain into a gamified, playable knowledge library. Think: **walking through a star-atlas of your own mind** — Atlas (home) → Constellations (Tracks) → Islands (Quests) → Rooms (Modules).

**Aesthetic brief:** navy + gold, Playfair Display + Inter, Fuller synergetics iconography (tetra/octa/cuboctahedron/jitterbug), Lucide utility icons, arcade CRT accents used sparingly, ceremonial gravitas. It should feel like a luxury alchemical grimoire crossed with a retro arcade cabinet.

**Brand canonical source:** `/Users/manu/Documents/LUXOR/luxor-claude-marketplace/landing-page/` — this is the existing Luxor Studios brand. Tokens already extracted.

**Core invariant:** every Module corresponds to a REAL artifact in the user's second-brain. No synthetic examples. No toy problems.

---

## 2. Prior session state — what is already done

### Completed deliverables
- ✅ Discovery: top-5 ship-ready repos identified
- ✅ Discovery: 169/55/103 inventory audit
- ✅ Discovery: brand/styling references extracted
- ✅ Pedagogical architecture (MERCURIO 8.7/10)
- ✅ Launch plan v1.0 drafted
- ✅ **Validation round 1:** MERCURIO + MARS both CONDITIONAL-GO
- ✅ `validators/slots.schema.json` — **single source of truth** for the 6-slot module contract
- ✅ `atlas/tokens/tokens.css` — production design tokens, WCAG AA verified
- ✅ `.planning/launch-plan-v1.1.md` — canonical plan (revised per validation)

### Files that exist (read these first)

| Path | Purpose |
|------|---------|
| `.planning/launch-plan-v1.1.md` | **THE plan.** Read this end-to-end before touching code. |
| `.planning/academy-architecture.md` | Pedagogical/gamification spec. Read for the why. |
| `.planning/validation-round-1.md` | MERCURIO + MARS reports + decision record. Read for the trade-offs. |
| `.planning/progress.md` | Current state + open questions. Update this as you go. |
| `validators/slots.schema.json` | 6-slot contract — DO NOT MODIFY without revising plan. |
| `atlas/tokens/tokens.css` | Design tokens — DO NOT add colors without updating the decision log. |
| `HANDOFF.md` | This file. |

---

## 3. Phase 0.5 — what you are building (3 days)

**Goal:** the substrate that every Quest will be poured into. Zero content. Everything else depends on this.

### 3.1 Directory scaffold (already exists)

```
LUXOR-ACADEMY/
├── atlas/
│   ├── tokens/tokens.css       ✅ DONE
│   ├── components/             ⬜ build
│   ├── icons/synergetics/      ⬜ build
│   ├── scripts/                ⬜ build
│   └── index.html              ⬜ build
├── modules/
│   └── build-and-ship/
│       └── forge-barque/       (Phase 1, not 0.5)
├── pipelines/
│   └── codebase-to-course/     ⬜ build skeleton only
├── validators/
│   ├── slots.schema.json       ✅ DONE
│   └── six-slots.js            ⬜ build
├── tests/                      ⬜ build
├── .planning/                  ✅ DONE
└── HANDOFF.md                  ✅ DONE
```

### 3.2 Build list (in order)

1. **`validators/six-slots.js`** — Node CLI that validates a module JSON against `slots.schema.json`. Exit 0 on valid, ≠0 on invalid. Uses `ajv` or equivalent. Pure function, sub-ms per module.

2. **`atlas/icons/synergetics/*.svg`** — six inline SVGs with stroke `var(--gold-300)`, fill none, 1.5px stroke:
   - `tetrahedron.svg` — Module glyph
   - `octahedron.svg` — Quest glyph
   - `cuboctahedron.svg` (vector equilibrium) — Track glyph
   - `jitterbug.svg` — animated morph (CSS keyframes toggling between VE ↔ octahedron vertex positions; `@media (prefers-reduced-motion: reduce)` suppresses)
   - `icosahedron.svg` — Master/boss glyph
   - `geodesic-sphere.svg` — Atlas/global glyph

3. **`atlas/components/`** — web-components (vanilla, no framework). ONE renderer tree, `data-zoom` switches Atlas/Quest/Module presentations:
   - `<module-root data-zoom="atlas|quest|module">`
   - `<module-primer>`, `<module-visual>`, `<module-interactive>`, `<module-artifact>`, `<module-self-check>`, `<module-next>`
   - `<atlas-map>` — renders IVM grid background + 12 VE vertices
   - `<quest-island>` — single vertex content
   - `<xp-bar>`, `<badge-display>`, `<command-palette>` (⌘K)

4. **`atlas/scripts/keyboard.ts`** — global keyboard nav:
   - `g a` → Atlas, `g t` → current Track, `g q` → current Quest
   - `j`/`k` → next/prev Module
   - `x` → mark complete (triggers XP)
   - `/` → focus search / command palette
   - `?` → help overlay
   - `esc` → zoom out one level

5. **`atlas/scripts/xp.ts`** — localStorage XP persistence:
   - Read/write under `luxor-academy:xp`
   - Export to JSON button (sovereignty requirement, MERCURIO)
   - Import from JSON
   - XP events: `module:self-check:pass` (50), `module:interactive:complete` (75), `quest:boss-fight:pass` (300), `artifact:shipped` (500, verified by file-exists)
   - Tier thresholds: Initiate 0 · Adept 500 · Journeyman 2000 · Master 8000 · Synergist 20000
   - **Toggle:** respect `localStorage['luxor-academy:xp-enabled']` (default true; user can disable)

6. **`atlas/index.html`** — the Atlas page:
   - Loads tokens.css + minimal JS
   - Renders `<atlas-map>` with 12 VE vertices
   - Phase 0.5: 1 vertex live (points to Build & Ship placeholder), 11 placeholder
   - Keyboard shortcut `?` shows help overlay
   - Semantic HTML: `<header><nav><main><aside><footer>` with aria-labels
   - Skip-to-main link (first focusable, visually hidden until focus)

7. **`pipelines/codebase-to-course/extract.ts`** — SKELETON ONLY in Phase 0.5:
   - Reads a repo path
   - Parses `README.md` headings → outline
   - Finds `tests/` + `examples/`
   - Produces a draft module JSON (matches slots.schema.json)
   - No transform/render yet — those are Phase 1 and 3

8. **`tests/perf.spec.ts`** — Lighthouse CI:
   - Mobile profile, slow-4G throttle
   - Assert TTI ≤1000ms on Atlas page
   - Assert total JS ≤50KB

9. **`tests/smoke.spec.ts`** — Playwright:
   - Visit `/` → Atlas loads
   - Keyboard `g a` works
   - Keyboard traversal to a placeholder vertex
   - No console errors

10. **`tests/a11y.spec.ts`** — axe-core on Atlas page; assert zero violations.

11. **`tests/validator.spec.ts`** — golden-file tests: validator pass on 3 valid fixtures, fail on 3 invalid.

12. **`.github/workflows/ci.yml`** — run validator + Playwright + Lighthouse + axe on every PR.

### 3.3 Acceptance criteria (ALL must pass before Phase 1)

- [ ] `node validators/six-slots.js <fixture>` exits 0 on valid, ≠0 on invalid
- [ ] Atlas TTI ≤1s on Lighthouse slow-4G mobile (CI-asserted)
- [ ] Atlas total JS ≤50KB (CI-asserted)
- [ ] axe-core returns 0 violations on Atlas
- [ ] Keyboard traversal Atlas → placeholder vertex works without mouse
- [ ] XP export button produces valid JSON; import restores state
- [ ] `prefers-reduced-motion: reduce` suppresses jitterbug animation (visual regression)
- [ ] 6 synergetics SVGs render at 24px, 48px, 96px without artifacting
- [ ] Web-components registered and usable in Phase 1 without modification
- [ ] Extract.ts skeleton consumes a real repo (`/Users/manu/Documents/LUXOR/PROJECTS/BARQUE/`) and produces draft JSON validated by schema

### 3.4 Human review gate

**DO NOT start Phase 1 until Manu has:**
- Opened `atlas/index.html` in a browser and navigated with keyboard only
- Reviewed at least one draft module JSON from extract.ts
- Signed off in `.planning/progress.md` by checking the Phase 0.5 gate boxes

If anything in the acceptance list fails, revise and re-gate. No "good enough."

---

## 4. Constraints from validation — DO NOT VIOLATE

These came from MERCURIO + MARS round-1 validation. They are hard constraints.

1. **One renderer, three zoom levels.** Atlas/Quest/Module = same web-component tree with `data-zoom`. Do NOT write separate renderers.
2. **`slots.schema.json` is the single source of truth.** The validator, the pipeline's exit criterion, Playwright assertions, and dev-mode console warnings all read this file. One schema, four consumers.
3. **No runtime theme JS.** Theme switches via `data-theme` attribute on `<html>`; all styling via tokens.css. No JS-driven theme logic.
4. **No SSR in MVP.** Static HTML + progressive enhancement.
5. **No user accounts before Phase 5.** Anonymous + localStorage until then.
6. **No WebGL in Phase 0.5/1/2.** SVG/CSS only. Jitterbug = CSS keyframes.
7. **Three fonts max:** Playfair Display (display), Inter (body), JetBrains Mono (code). No Orbitron. No others.
8. **No new colors without updating `validation-round-1.md`.** Tokens.css is authoritative.
9. **Pipeline is TEMPLATED, not deterministic.** Use "templated with validator-enforced contract" in any docs. "Deterministic" is inaccurate.
10. **Every interactive widget must declare `sandbox_policy`** in its slot (CSP + iframe sandbox + no-eval). Non-negotiable.
11. **XP export button is mandatory** in Phase 0.5. Sovereignty-over-data principle.
12. **"Ship Your Own" is the canonical last-module pattern** for every Quest (Phase 1+). Placeholder hook in Phase 0.5 — schema supports `next.ship_your_own: true`.

---

## 5. Design decisions already locked

| Decision | Value | Source |
|----------|-------|--------|
| Canonical gold | `#E9B949` | Luxor Studios existing brand |
| Canonical navy | `#0A1628` | Luxor Studios existing brand |
| Display font | Playfair Display | Luxor Studios canonical |
| Body font | Inter | Luxor + Ormus overlap |
| Mono font | JetBrains Mono | Both brands |
| Parchment theme accent | `#9E6A3C` (Ormus burnished bronze) | Ormus alchemical palette |
| Module contract | 6 slots via custom elements + JSON schema | MARS round-1 |
| Last-module pattern | "Ship Your Own" — learner repo → permalink quest | MERCURIO round-1 |
| Theme switching | tokens.css only, no JS | Round-1 non-goals |
| AI gate model | MERCURIO+MARS advise, human decides | MERCURIO condition |

---

## 6. Open questions (non-blocking — ask Manu when convenient)

- "Ship Your Own" input — authenticated GitHub or anonymous URL paste? (Phase 3 decision)
- Parchment (light) theme — Phase 1 or defer? (Tokens already support both)
- Domain — `luxor.academy`, `academy.luxor.studio`, or CETI subpath?
- Source repo — new `manutej/luxor-academy` or inside `luxor-claude-marketplace`?
- Font hosting — self-host WOFF2 (preferred) or Google Fonts CDN?

---

## 7. Key context beyond this folder

| Context | Path |
|---------|------|
| Flagship Quest target repo | `/Users/manu/Documents/LUXOR/PROJECTS/BARQUE/` |
| Luxor Studios canonical brand | `/Users/manu/Documents/LUXOR/luxor-claude-marketplace/landing-page/` |
| User's Claude Code skills | `~/.claude/skills/` (169 items) |
| User's Claude Code agents | `~/.claude/agents/` (55 items) |
| Global CLAUDE.md | `/Users/manu/Documents/LUXOR/.claude/CLAUDE.md` — **READ** the security rules + anti-confabulation + workspace-hygiene sections |

---

## 8. How to use MERCURIO + MARS during Phase 0.5

Use them to gate work, not to bless it:

- **Before starting work on a new component:** not needed. Just build.
- **At mid-Phase checkpoint (Day 2 EOD):** optional MERCURIO ping on progress. Skip if velocity is fine.
- **At Phase 0.5 gate (Day 3 EOD):** REQUIRED MERCURIO + MARS re-validation of the substrate before Phase 1 can start.
- **If you make an architectural change that contradicts this handoff:** route through MERCURIO OR MARS (whichever is relevant) before committing. Update `validation-round-1.md` with the new decision.

Invoke via the `Agent` tool with `subagent_type: "MERCURIO"` or `subagent_type: "MARS"`. Pass the files to review; request a ≤900-word report.

---

## 9. Anti-patterns to avoid (from CLAUDE.md)

- ❌ Never accept API keys in chat
- ❌ Never claim success from mock tests alone
- ❌ Never create MD files in the workspace root — project docs go in `.planning/` or `docs/`
- ❌ Never invent features/APIs without citation (anti-confabulation)
- ❌ Never commit `.env` or secrets
- ❌ Never skip the human gate on AI self-scoring

---

## 10. First commands to run (fresh session start)

```bash
cd /Users/manu/Documents/LUXOR/PROJECTS/LUXOR-ACADEMY
cat HANDOFF.md                              # this file — read fully
cat .planning/launch-plan-v1.1.md           # the canonical plan
cat .planning/validation-round-1.md         # the constraints
cat validators/slots.schema.json            # the contract
cat atlas/tokens/tokens.css                 # the design tokens
git log --oneline                           # prior commits
```

Then begin with `validators/six-slots.js` (item 1 in the build list) — it's the foundation every other artifact depends on.

---

## 11. Success signal

At end of Phase 0.5, I should be able to:
1. Open `atlas/index.html` in a browser
2. See the IVM lattice background with 12 VE vertices
3. Navigate to a placeholder vertex with `g a` then arrow keys
4. Export my (empty) XP as JSON
5. Toggle reduced-motion and watch jitterbug go still
6. Run `npm run validate` and pass 3 fixtures
7. Run `npm test` and see green Playwright + axe + Lighthouse

If those seven things work, Phase 0.5 is done. Hand off to Phase 1 (BARQUE quest content).

**Go build.**
