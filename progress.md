# LUXOR Academy — Session Progress Snapshot

**Last updated**: 2026-04-21 (live session)
**Live URL**: https://luxor-academy.vercel.app

---

## Mission (this session)

Phase B: forge full module content (JSON + HTML) for all 7 remaining quests via parallel agentic teams. Every Roadmap-state quest → Content-live state. ~40 modules total.

## Status — current moment

| Subagent | Quest | Modules | State |
|---|---|---|---|
| A | design-tool-planner (novice/build-and-ship) | 5 | ⏳ running |
| B | hello-agent (novice/first-agent) | 6 | ⏳ running |
| C | mercurio-for-decisions (exp/orchestration) | 5 | ⏳ running |
| D | mars-systems (exp/orchestration) | 5 | ⏳ running |
| E | mcp-from-zero (exp/mcp-integration) | 6 | ⏳ running |
| F | cmp-foundations (expert/categorical) | 6 | ⏳ running |
| **G** | **fstar-7-levels (expert/formal-verification)** | **7** | **✅ DONE — 7/7 validator PASS** |

1 of 7 subagents returned. 33 modules still being forged in parallel.

## What's already shipped + live

- https://luxor-academy.vercel.app — full site
- Forge BARQUE (`/novice/build-and-ship/forge-barque/`) — Content live, 4 modules
- 7 Roadmap pages with real `modules_planned[]` outlines drawn from source repos
- Dark + Parchment themes (toggle in Nav)
- Retro-boardwalk per-track accent palette (6 colors, one per glyph)
- Bilingual manifest schema (EN + ES fields, UI is EN-only for now)

## Recent commits on origin/main

```
9df5c49 feat: 7 quest roadmaps + dark/light theme + bilingual manifest schema
63bad57 docs(deploy): live on luxor-academy.vercel.app + redeploy recipe
ed45038 feat(web): browsable docs mode + retro-boardwalk color injection
f706559 feat(web+scripts): close MARS integration gap + pin barque to real SHA
83051cb feat(validation): Phase 1 forge-barque — MERCURIO 8.93/10 + MARS 91%
```

## Active TODOs

**If session resumes after compaction, next-session moves (in order)**:

1. Wait for/collect the 6 remaining subagent completions.
2. Sanity-check: `for f in modules/*/*/*.module.json; do node validators/six-slots.js "$f"; done` — all must PASS.
3. `cd web && npm run build` (prebuild:modules auto-syncs the ~40 new HTMLs into web/public/modules/).
4. Spot-check: verify the quest detail pages now report **Content live** badge (not Roadmap) for all 7 previously-Roadmap quests.
5. `cd web/out && vercel link --yes --project luxor-academy && vercel deploy --prod --yes`.
6. Smoke-test a sample of the 40 new module URLs (200 response + visible content).
7. Single commit covering: 40 × module.json, 40 × module.html, 7 × quest.manifest.json updates (modules_planned → modules, version v0.1.0, total_xp).
8. Update HANDOFF.md + docs/EXECUTION-LOG.md with the Phase B wave's outcome.
9. `git push origin main`.

## Key architectural decisions this session

1. **Each module is self-contained HTML** (not a shared template). Each ~25KB with inline CSS, mirrors `modules/build-and-ship/forge-barque/01-venv-shebang-trap.html`. Stays offline-capable; no build-time generator needed.
2. **Bilingual data, EN-only UI** — manifests carry `title_es` / `subtitle_es` / `description_es` / `*_es` fields, but the UI renders EN only. Future-proofs Spanish without committing to an i18n runtime now.
3. **Parallel subagent team, one per quest** — no file contention, no shared template, each subagent owns its quest dir. Briefs reference forge-barque as the canonical exemplar and `validators/slots.schema.json` as the hard contract.
4. **Track accents are the signal** — `lib/track-accents.ts` maps glyph → hex. Coral / gold / cyan / magenta / violet / arcade-green. UI surfaces on glyph color, hover glow, hero horizon stripe.
5. **Roadmap → Content-live transition is data-driven**: quest-page loader flips state when `{id}.module.json` files appear on disk alongside an updated `modules` array in the manifest.

## Key file paths

**Shell (Next.js 16 + static export)**:
- `web/app/layout.tsx` — root, Providers wrap (ThemeProvider only)
- `web/app/{novice,experienced,expert}/[track]/[quest]/page.tsx` — thin tier delegations to shared QuestPage
- `web/components/quest-page.tsx` — the 3-state (LIVE / ROADMAP / NONE) server-side renderer
- `web/components/quest-card.tsx`, `web/components/tier-card.tsx` — always-clickable, track-accent-aware
- `web/components/nav.tsx`, `web/components/theme-toggle.tsx` — nav + dark/light toggle
- `web/lib/tiers.ts` — shell's view of all 8 quests
- `web/lib/track-accents.ts` — glyph → accent color map
- `web/lib/theme.tsx` — dark/parchment React context + localStorage persistence
- `web/scripts/sync-modules.mjs` — prebuild hook, copies `modules/**/*.html` → `web/public/modules/`
- `web/app/globals.css` — theme tokens (dark + parchment palettes)

**Content**:
- `modules/_shared/` — (not used; abandoned in favor of per-module self-contained HTML)
- `modules/<track>/<quest>/quest.manifest.json` — per-quest manifest (one per 8 quests)
- `modules/<track>/<quest>/{id}.module.json` + `{id}.html` — per-module content (forge-barque has 4; fstar-7-levels now has 7; others being forged)
- `content/sources/` — vendored source trees (barque pinned at SHA 3caace22)
- `scripts/refresh-sources.sh` — pipeline for SHA-pinning upstreams

**Validation**:
- `validators/six-slots.js` — runs the schema contract per module.json
- `validators/slots.schema.json` — hard contract; tier enum: Initiate | Adept | Journeyman | Master | Synergist
- `npm run validate:fixtures` — 6/6 golden fixtures, regression gate

**Docs**:
- `HANDOFF.md` — resume-anywhere document
- `docs/EXECUTION-LOG.md` — append-only session log
- `docs/DEPLOY.md` — Vercel redeploy recipe
- `docs/ARCHITECTURE-v2.md` — shadcn/ui + Next pivot decision

## User direction captured (recent)

- "Approve the design" — retro-boardwalk colors are locked in.
- **"I don't really like i18n systems"** — UI toggle for languages was reverted. Translations still saved in JSON manifest fields for future use, but NOT rendered.
- **"Proceed to next phase"** — Phase B green-lit, use agentic teams.
- **"What's stopping you from writing out the remaining elements"** — pushback on my earlier "your move on priority order" pause. User wants full forging, not incremental approval gates.

## Context-preservation hint for compaction

If compaction happens before subagents return:
- Subagent transcripts are at `/private/tmp/claude-501/-Users-manu-Documents-LUXOR/529a6488-b039-4293-aaa9-07045f0b4767/tasks/{agent-id}.output` — DO NOT Read these; they're huge. Wait for completion notifications.
- Post-compaction, poll `modules/*/*/quest.manifest.json` → check if `modules_planned` field is still there (subagent didn't finish) vs replaced by `modules` (did finish).
- Each subagent ID prefix in this session: A=ae78..., B=af48..., C=a7f7..., D=a360..., E=a75f..., F=a0c3..., G=a5d4... (fstar = G, completed).
