# LUXOR Academy — Execution Log

Append-only build log. Every milestone = one entry. Every entry cites its commit SHA, verification status, and context-window snapshot so Manu (or any other agent) can see exactly what happened when.

**Read order:** top = most recent. Scroll down for history.

---

## Legend

| Symbol | Meaning |
|--------|---------|
| ✅ | shipped + verified |
| 🔄 | in-progress (look at HANDOFF for current state) |
| ⏳ | queued |
| ⛔ | blocked (see Blockers section) |
| 🔁 | reverted / reworked |

---

## 2026-04-19

### 12:XX — Foundation wave started (v2 session)

**Context:** Manu pivoted scope from "Phase 1 BARQUE-only" to "three-tier curriculum with shadcn/ui shell + extensive use of codebase-to-course skill." Execution moved from Vercel sandbox to local machine. Regular git commits + push are required for remote visibility.

**Milestone:** Foundation — CI workflow closes Phase 0.5 #12, HANDOFF rewritten for v2 scope, architecture decision record published.

**Files shipped this milestone:**
- `.github/workflows/ci.yml` — three jobs (validator / e2e / perf), concurrency cancellation, .nvmrc pinning
- `HANDOFF.md` — v2 resume-anywhere document
- `docs/EXECUTION-LOG.md` — this file
- `docs/ARCHITECTURE-v2.md` — shadcn/ui pivot decision record

**Commit SHA:** `d0f27db` → pushed to `origin/main`

**Verification:**
- `npm run validate:fixtures` — ✅ 6 passed, 0 failed
- GitHub Actions: CI workflow will fire on this push (first-ever run; validates own config)
- MERCURIO + MARS — deferred to first content milestone (BARQUE quest)

**Context snapshot:**
- Window: approximately 40% used at this point
- Tasks: 5 completed (#1-5), 5 pending (#6-10)
- Active: Task #6 (Merge landing/coming-soon assets)

**Next milestone:** Merge landing/coming-soon assets into main (autonomy/, content/sources/, vendor/, META-PROMPT.md). Validator must still return 6/6 after merge.

### 12:XX — Landing assets merged (wave 2)

**Milestone:** Bring autonomy/ + content/sources/ + vendor/ onto `main` so the Academy Forge loop and module content-extraction can operate without reaching outside the repo.

**Files shipped:** 178 files via selective `git checkout landing/coming-soon -- <paths>`:
- `autonomy/` (5 files) — META-PROMPT.md, README.md, run.sh, loop-state.seed.json, work-queue/priorities.yaml
- `content/sources/` (139 files) — BARQUE + HALCON + meta-prompting-plugin vendored source repos
- `vendor/` (34 files) — Claude Code skills + agents snapshotted
- Dedup: removed root `META-PROMPT.md` (identical to `autonomy/META-PROMPT.md`)

**Commit SHA:** `2240dd8` → pushed to `origin/main`

**Verification:** `npm run validate:fixtures` → 6 passed, 0 failed (substrate survived the merge).

### 12:XX — Web shell scaffolded (wave 3)

**Milestone:** Next.js 16 + shadcn/ui + Tailwind v4 shell in `web/` subdirectory. Luxor brand palette (navy + gold), three fonts (Playfair Display + Inter + JetBrains Mono), static export (no runtime SSR).

**Files shipped:**
- `web/` Next.js 16 + App Router + Turbopack + TypeScript, scaffolded via `create-next-app`
- `web/components.json` — shadcn/ui base-nova style, CSS variables, lucide icons
- `web/components/ui/{button,card,badge,separator}.tsx` — core shadcn primitives
- `web/app/globals.css` — Luxor brand override of shadcn OKLCH defaults; synergetic grid background; gold-glow focus ring
- `web/app/layout.tsx` — Playfair / Inter / JetBrains fonts loaded via `next/font/google`
- `web/next.config.ts` — `output: "export"` + `trailingSlash: true` + unoptimized images
- `web/lib/tiers.ts` — full tier curriculum data (3 tiers · 6 tracks · 8 quests total)
- `web/components/synergetics.tsx` — inline SVG components for all 6 Fuller glyphs
- `web/components/{nav,tier-card,quest-card,tier-page}.tsx` — shared shell components
- `web/app/page.tsx` + `web/app/{novice,experienced,expert}/page.tsx` — landing + three tier routes

**Static build output:** 5 routes prerendered (`/`, `/novice`, `/experienced`, `/expert`, `/_not-found`).

**Commit SHA:** (pending this commit)

**Verification:**
- `npm run build` (in `web/`) → Compiled successfully; TypeScript clean; 5 static pages.
- Lighthouse + Playwright on the shell: deferred until tier content lands (next wave).
- MERCURIO + MARS: deferred until first module (BARQUE) is content-complete.

**Context snapshot:**
- Window: approximately 55% used
- Tasks: 7 completed (#1-7), 3 pending (#8-10)
- Next: Task #8 (three tier pages are already in this commit but need polish/photography/screenshots), Task #9 (BARQUE modules via codebase-to-course)

### 12:XX — forge-barque Quest content shipped + MERCURIO+MARS validated (waves 4-5)

**Milestone:** First Quest's content is on `main`. Two verification agents ran in parallel, both cleared their gates, MERCURIO MEDIUM fixes applied.

**Commits:**
- `ede5efd` — forge-barque Quest: 4 modules (all validator-PASS) + track + quest manifests + `content/sources/VENDOR.json` provenance log. Module 03 rewritten by the content agent when it caught the priorities.yaml hint mismatching real BARQUE code (anti-confabulation discipline working at the content tier).
- `2846ff1` — HANDOFF mid-verification snapshot
- (this commit) — MERCURIO fixes + consolidated validation report + HANDOFF update for next-session integration work

**Verification outcomes:**
- **MERCURIO** (`a5c19be4…`): 8.93/10 composite · Mental 9.1 · Physical 8.4 · Spiritual 9.3 · CONDITIONAL-GO · three MEDIUM fixes → 2 applied, 1 deferred (SHA pinning)
- **MARS** (`ae81bd93…`): 91% confidence · 4/5 PASS + 1 PARTIAL PASS (integration coherence — `/novice/[track]/[quest]` route does not exist yet) · CONDITIONAL-GO · no CRITICALs

**Fixes applied this commit:**
- Module 03: explanation now cites both line 115 (`subprocess.run(...)` call) and line 121 (`env=` kwarg), no more drift
- Module 04: XP split 500 → 150 Phase-1-vesting + 350-deferred (noted in primer prose + quest.manifest.json.total_xp_deferred); quest total 675 → 325

**Re-validation:**
- `node validators/six-slots.js *.module.json` → 4/4 PASS
- `npm run validate:fixtures` → 6/6 PASS (no regression)

**Deferred to next session (tracked in HANDOFF):**
1. Close MARS integration gap: dynamic route `/novice/[track]/[quest]` + build-time module HTML sync into `web/public/modules/`
2. `scripts/refresh-sources.sh` to pin real upstream SHAs into `content/sources/VENDOR.json`
3. Phase 1 human gate

**Context snapshot:**
- Window: ~72% used at this point (approaching the 70% snapshot rule)
- Tasks: 10/10 for this session completed
- Next session resumes from HANDOFF.md next-step list

---

## Operator notes

- The existing `.planning/launch-plan-v1.1.md` remains authoritative for pedagogical decisions, slot contract, and brand invariants. v2 does not supersede it; v2 extends it with the shadcn/ui shell architecture.
- All module HTML output must remain self-contained (offline-capable) per the existing design ethos. The shell is separate.
- Every commit pushes. No local-only commits. Manu + other agents read from `origin/main`.
