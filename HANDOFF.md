# LUXOR Academy — HANDOFF

**Resume-anywhere document.** If you are a fresh Claude Code session (or human engineer) picking this up: read this top-to-bottom, then `decisions.md`, then start work.

---

## Status (live)

| Field | Value |
|-------|-------|
| **Last updated** | 2026-04-28 |
| **Live URL** | <https://luxor-academy.vercel.app> |
| **Last commit on main** | `e8f4f05` — feat(diagrams): Wave 3 partial — kit v1.1 + DTP-01 split + DTP-04 totals grid |
| **Vercel project** | `manu-mulaveesalas-projects/luxor-academy` |
| **Current shape** | 8 quests, 44 modules, all Content-live. Diagram kit v1.1 deployed across all 44. |
| **Blockers** | None |
| **Human gate pending** | `phase-1` (forge-barque browser walkthrough) — never closed; not blocking new work |
| **Open Phase D items** | 1 critical (DTP-05 ship-your-own diagram), several deferred (Phase D primer refactor across all 40 subagent-generated modules) |

---

## Resume command

```bash
cd /Users/manu/Documents/LUXOR/PROJECTS/LUXOR-ACADEMY
git pull --rebase origin main
cat HANDOFF.md decisions.md
cat docs/ROADMAP-EXPANSION.md
```

`decisions.md` is REQUIRED reading before any new module/diagram work.

---

## What's done — phase by phase

### Phase 0.5 — Substrate ✅
- Six-slot validator + 6 golden fixtures
- Synergetics SVG icons + atlas web-components shell
- CI workflow (`.github/workflows/ci.yml`)

### Phase 1 — First quest content + validation ✅
- forge-barque (BARQUE quest): 4 hand-crafted modules, MERCURIO 8.93/10 + MARS 91% CONDITIONAL-GO, all citations pinned to SHA `3caace22`.
- `scripts/refresh-sources.sh` — pipeline for SHA-pinning vendored upstreams.

### Phase 2 — Static-export shell ✅
- Next.js 16 + shadcn/ui + Tailwind v4 in `web/`
- Three-tier curriculum (Novice / Experienced / Expert) at `web/lib/tiers.ts`
- Dynamic quest routes per tier with LIVE / ROADMAP / NONE state machine
- Theme toggle (dark + parchment)
- Retro-boardwalk per-track accent palette (coral / cyan / magenta / violet / arcade-green / gold)
- `web/scripts/sync-modules.mjs` syncs `modules/**/*.html` → `web/public/modules/` via npm `prebuild` hook
- Live: <https://luxor-academy.vercel.app>

### Phase 3 — Quest fan-out ✅
- 7 quest manifests with bilingual `modules_planned[]` rosters drafted by 2 parallel subagents:
  - Novice: design-tool-planner (5), hello-agent (6)
  - Experienced: mercurio-for-decisions (5), mars-systems (5), mcp-from-zero (6)
  - Expert: cmp-foundations (6), fstar-7-levels (7)
- 40 new modules forged via 7-subagent parallel wave (rate-limited mid-flight; partial completion + main-thread cleanup got everyone to v0.1.0).
- All 44 modules pass the six-slot validator.

### Phase C — Roadmap expansion plan ✅ documented (not yet executed)
- `docs/ROADMAP-EXPANSION.md` — 24 new quests across 10 plugin clusters. Academy reframed as tutorial layer for `luxor-claude-marketplace`.
- HEKAT identified as full 4-quest track.
- `codebase-to-course` as the meta-flywheel quest.
- Research backing: `docs/ROADMAP-research-inventory.md` + `docs/ROADMAP-research-meta.md`.

### Phase D Wave 1 — diagram polish (CSS halo kit) ✅
- `modules/_shared/diagram-kit.css` v1.0 — text halos via `paint-order: stroke fill`, typography scale, node/arrow utilities, 6 track-accent variants.
- 10 SVG redraws (LibreUI subagent) for the worst structural offenders.
- Injected into all 44 modules.

### Phase D Wave 2 — 8 more structural redraws ✅
- LibreUI subagent rewrote 8 backlog diagrams: mcp-from-zero/{01,04}, fstar-7-levels/{03,04}, cmp-foundations/02-prompts-as-morphisms, mars-systems/{02,03}, mercurio-for-decisions/02-convergence-methods.
- Total: 18 of 40 subagent-generated visuals had structural rewrites.

### Phase D Wave 3 — kit v1.1 + remaining flagged-by-user modules ⚠️ PARTIAL
- ✅ Kit v1.1: `.lkd-callout--{insight,warning,ref,compare,math}` + `.lkd-codeblock` (line-number gutter via CSS counter, language badge, syntax tokens).
- ✅ `inject-diagram-kit.mjs` bug fix (regex metachar escaping → no more duplicate kit injections).
- ✅ DTP-01 universal-template — split into TWO diagrams (heptagon + pipeline-and-docs) separated by a `.lkd-callout--insight`. Vertex labels no longer collide with pipeline header.
- ✅ DTP-04 five-step-pipeline — totals row converted from cramped horizontal 4-column to breathing 2×2 grid, viewBox extended to 600×400.
- ❌ **DTP-05 ship-your-own** — NOT REWRITTEN. Subagent stalled (watchdog timeout / rate limit). Main thread chose to write HANDOFF instead of pushing context-budget to redraw it. Still has the broken generator-stub central circle that clips surrounding text. **This is the top open item.**

---

## What's NOT done — open items, ranked by priority

### Top priority — finish Phase D Wave 3

1. **Redraw DTP-05 ship-your-own** (`modules/build-and-ship/design-tool-planner/05-ship-your-own.html`).
   - Current state: generator stub from `scripts/generate-module-html.mjs`. Has a central "5-step pipeline" circle that clips its surrounding labels (user screenshot evidence).
   - Goal per `decisions.md`: 80% as polished as `modules/build-and-ship/forge-barque/04-ship-your-own.html` (the gold standard for ship-your-own).
   - Approach options:
     a. Hand-craft on main thread (~30-50 KB HTML) using forge-barque/04 as template; adapt content from `05-ship-your-own.module.json`.
     b. Spawn another LibreUI subagent with TIGHTER scope (just this one file, not three at once — the previous 3-file brief stalled).
   - Track accent: coral `#FF7E6B` (cuboctahedron — Build & Ship track).

### Phase D — broader polish (deferred from `decisions.md` §Wave 3-C)

2. **Primer-section refactor across all 40 subagent-generated modules.** Each primer should be re-worked to use one of the 5 structural patterns (prose+callout, contrast-pair, walkthrough, anchored-code, anti-pattern). Target: every >200-word primer broken with at least one `.lkd-callout` or mini-diagram. `decisions.md` §"The 'Break up text walls' pattern" is the spec.

3. **Artifact-section upgrade across all modules.** Apply the new `.lkd-codeblock` container (line-number gutter + language badge + source pill) to every module's artifact code block. Currently each module has its own ad-hoc `<pre><code>` styling — kit injection added the CSS but modules don't yet use the new class structure.

4. **Wave 2 backlog diagrams** — `decisions.md` lists 8 diagrams where Wave 1 CSS injection helped but structure could improve more. Wave 2 covered 8 different ones; the original 8 listed in DIAGRAM-AUDIT.md may still be on the list pending review.

### Phase 1 human gate (still pending)

5. Manu browser-walks all 44 modules → flips `autonomy/loop-state.json.human_approval["phase-1"] = true`.
6. Write `.planning/human-gate-phase-1.md` with the consolidated MERCURIO+MARS verdicts, browser screenshots, permalinks.

### Phase C — quest expansion (large scope)

7. Forge the 24 new quests across 10 plugin clusters per `docs/ROADMAP-EXPANSION.md`. Wave 1 priority list:
   - HEKAT Foundations (E6) — anchors the biggest unclaimed track
   - GSD Starter (N4) — 50+ commands already authored
   - First Spec-Driven Feature (N1)
   - Claude Code Plugin from Scratch (N3)
   - Forge Your Own Quest (meta-flywheel)

### Architectural debts to clean up

8. **`hello-agent` source vendoring** — currently points at `~/Documents/LUXOR/skills/claude-agent-sdk-multiplatform`. Should be vendored under `content/sources/claude-agent-sdk/` and SHA-pinned via `refresh-sources.sh`.
9. **MERCURIO/MARS sources** live at `~/.claude/agents/{mercurio,mars}-agent/docs/` — not in the LUXOR-Academy vendor tree. `refresh-sources.sh` needs a local-path mode or files copied.
10. **`web/lib/tiers.ts` XP totals** — derive-from-manifest rather than hardcoded. Currently quest-overview reads manifests directly so the live data is correct, but the `/novice` tier card still uses hardcoded values from `tiers.ts`.

---

## Current file map (the things that matter)

### Documentation
- `HANDOFF.md` — this file
- `decisions.md` — design principles + 5 primer patterns + forge-barque 80% polish target. **Required reading before any module work.**
- `progress.md` — earlier session snapshot (mostly superseded by this HANDOFF)
- `docs/ROADMAP-EXPANSION.md` — Phase C expansion plan, 24 quests × 10 plugin clusters
- `docs/ROADMAP-research-inventory.md` — 52-project LUXOR survey + 10 plugin-cluster proposals
- `docs/ROADMAP-research-meta.md` — meta-prompting + HEKAT + 96-agent taxonomy
- `docs/DIAGRAM-AUDIT.md` — Wave 1 & 2 audit + redraw notes
- `docs/DEPLOY.md` — Vercel redeploy recipe
- `docs/ARCHITECTURE-v2.md` — shadcn/ui + Next.js 16 pivot decision
- `.planning/launch-plan-v1.1.md` — original canonical pedagogical plan (still authoritative for invariants)

### Shell (Next.js 16 + static export)
- `web/app/layout.tsx` — root, wraps with ThemeProvider
- `web/app/page.tsx` — landing
- `web/app/{novice,experienced,expert}/page.tsx` — tier landings
- `web/app/{novice,experienced,expert}/[track]/[quest]/page.tsx` — thin tier delegations
- `web/components/quest-page.tsx` — shared QuestPage with LIVE / ROADMAP / NONE state machine
- `web/components/quest-card.tsx`, `tier-card.tsx`, `tier-page.tsx`, `nav.tsx`, `theme-toggle.tsx`
- `web/lib/tiers.ts` — full curriculum data
- `web/lib/track-accents.ts` — glyph → accent color map
- `web/lib/theme.tsx` — dark/parchment context provider
- `web/scripts/sync-modules.mjs` — prebuild hook copies module HTMLs to public/
- `web/app/globals.css` — theme tokens
- `web/next.config.ts` — `output: "export"`, `trailingSlash: true`

### Content
- `modules/_shared/diagram-kit.css` (v1.1, 449 lines) — shared SVG kit + callouts + code blocks. Injected into every `*.html` under `modules/`.
- `modules/<track>/<quest>/quest.manifest.json` — per-quest catalog (8 quests × 1 file)
- `modules/<track>/<quest>/{NN}-<slug>.module.json` — six-slot module manifest (44 files)
- `modules/<track>/<quest>/{NN}-<slug>.html` — self-contained module page (44 files)
- `content/sources/<repo>/` — vendored upstreams (barque pinned at SHA `3caace22`)

### Build / scripts
- `scripts/refresh-sources.sh` — clone + SHA-pin + perl-rewrite permalinks
- `scripts/generate-module-html.mjs` — minimal HTML generator from module.json (used as fallback when subagent runs out)
- `scripts/inject-diagram-kit.mjs` — diagram kit propagation, idempotent. **Was buggy through commit `b853dde`; fixed in `e8f4f05`.**
- `validators/six-slots.js` — schema-contract validator
- `validators/run-fixtures.js` — 6-fixture regression gate

### Live deploy
- Vercel project: `manu-mulaveesalas-projects/luxor-academy`
- Build: `cd web && npm run build` produces `web/out/` static export
- Deploy: `cd web/out && vercel deploy --prod --yes`
- See `docs/DEPLOY.md` for full recipe (note: link to luxor-academy may need re-establishing if `.vercel/project.json` was wiped during a prior abort)

---

## Recent commit history (top 10)

```
e8f4f05  feat(diagrams): Wave 3 partial — kit v1.1 + DTP-01 split + DTP-04 totals grid
63228d4  docs(decisions): capture Wave-2 feedback + define Phase D bar
b853dde  feat(diagrams): LUXOR Diagram Kit + 10 redraws + uniform injection
e4da024  docs(roadmap): Phase C expansion plan — 24 new quests, 10 plugin clusters
4288b61  feat(modules): Phase B forge — 40 new modules across 7 quests, all Content-live
9df5c49  feat: 7 quest roadmaps + dark/light theme + bilingual manifest schema
63bad57  docs(deploy): live on luxor-academy.vercel.app + redeploy recipe
ed45038  feat(web): browsable docs mode + retro-boardwalk color injection
f706559  feat(web+scripts): close MARS integration gap + pin barque to real SHA
83051cb  feat(validation): Phase 1 forge-barque — MERCURIO 8.93/10 + MARS 91%
```

---

## Known gotchas / lessons learned

1. **Subagents stall.** Wave 3-B subagent timed out mid-task. Main thread had to recover. Lesson: **scope subagents tighter** (one file per subagent, not three) and have main-thread fallback paths.

2. **Rate limits hit hard.** Phase B was 7 parallel subagents; 5 hit rate limit and terminated mid-write, but each had finished most of their work. The fallback HTML generator (`scripts/generate-module-html.mjs`) closed the 3 remaining gaps. Lesson: **assume subagents may not finish; design for partial completion**.

3. **Vercel link gets wiped on `web/out/` regenerate.** Each `npm run build` rewrites `out/`, including any `.vercel/project.json` we put there. After every fresh build, run `vercel link --yes --project luxor-academy` before `vercel deploy`. Documented in `docs/DEPLOY.md`.

4. **Regex metachars in inject-script markers.** The kit-injection script's strip-before-reinject regex used unescaped `*` in the marker literal — silently no-op'd, causing kit duplication on `--force`. Fixed in `e8f4f05`. The `escapeRegex()` pattern is now in the script and should be reused for any future marker-based scripts.

5. **CSS halos fix text-on-arrow but not text-on-text.** `paint-order: stroke fill` only helps when text overlaps OTHER GEOMETRY. Two text elements at the same coordinates still collide in the same pixels. Structural fixes (separate viewBoxes, label positioning discipline) are required for those cases — `decisions.md` calls this out as a lesson.

6. **Bilingual data was the easy part.** Subagents wrote `_es` siblings into all manifests during Phase B for ~zero marginal cost. The hard part is the UI renderer — currently EN-only per user direction. The `_es` data is dormant; a future i18n activation is one renderer file.

---

## Resume protocol (next session checklist)

When picking up:

1. ✅ `git pull --rebase origin main`
2. ✅ Read `HANDOFF.md` (this file) + `decisions.md` (REQUIRED).
3. ✅ Verify substrate: `npm run validate:fixtures` should return `6 passed, 0 failed`. Then `node validators/six-slots.js modules/*/*/*.module.json` should return 44/44 PASS.
4. ✅ Verify live: `curl -o /dev/null -s -w "%{http_code}" https://luxor-academy.vercel.app/` returns 200.
5. ✅ Pick the top open item from "What's NOT done" — likely **DTP-05 ship-your-own redraw** unless user redirects.
6. ✅ If launching a subagent, use `decisions.md` as required reading in the brief and ONE FILE PER SUBAGENT.
7. ✅ Build + deploy + smoke-test before committing.
8. ✅ Update this HANDOFF + commit + push at end of session.

---

## User's quality bar (durable reminder)

> "The UI and the functionality are the first impression that people have of us, so we need to make sure it's top-notch and locked in."

The hand-crafted forge-barque modules are the gold standard. Every new module compares side-by-side against the nearest forge-barque equivalent. **80% as polished or iterate.**

---

**Simplicity is the ultimate sophistication.** One HANDOFF, one EXECUTION-LOG, one main branch. Resist the temptation to build machinery before content.
