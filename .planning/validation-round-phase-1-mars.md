# MARS — Systems Validation for Phase 1 (forge-barque)
Date: 2026-04-19
Commit reviewed: ede5efd

## Confidence: 91% — CONDITIONAL-GO

Holds together as a content system. The four modules are schema-clean, verbatim-sourced, invariant-compliant, and render as self-contained HTML. The shell lists the quest and will happily link to it. The only reason this is CONDITIONAL and not an unqualified GO is that the shell has no route yet to render `/novice/build-and-ship/forge-barque`, so every "Drafted" click on the quest card in the currently-shipped web app lands on a Next.js 404. That is an expected Phase-1 MVP gap per the brief, not a content defect — hence no "must-fix" blockers for the modules themselves.

## Five systems checks

| Check | Status | Notes |
|---|---|---|
| 1. Integration coherence | PARTIAL PASS | IDs, paths, glyph all aligned; the quest route target doesn't exist in the shell yet (known MVP gap) |
| 2. Contract enforcement | PASS | 4/4 modules validate; 6/6 fixtures green; `web` Next.js build succeeds (4 static routes) |
| 3. Source provenance | PASS | All four artifact excerpts verbatim in vendored source; line ranges check out; VENDOR.json SHA is a placeholder flagged for Phase-2 |
| 4. Invariant compliance | PASS | Tokens-only theming, 3 fonts, zero remote `<script>`, sandbox policy on every interactive slot, `ship_your_own:true` only on 04 |
| 5. HTML size + a11y | PASS | 23.5–26.2 KB per module (well under 80 KB), semantic buttons/forms/labels, reduced-motion + focus-visible present |

## Evidence

**Integration coherence**
- `web/lib/tiers.ts:61` quest id `forge-barque` == filesystem `modules/build-and-ship/forge-barque/` ✓
- `web/lib/tiers.ts:58` track glyph `cuboctahedron` == `track.manifest.json` `glyph: "cuboctahedron"` ✓
- `quest.manifest.json.modules` == [`01-venv-shebang-trap`, `02-dual-theme-css`, `03-ship-it-resend`, `04-ship-your-own`] == actual filenames ✓
- `quest-card.tsx:35` builds `href = /${tier}/${trackSlug}/${quest.id}` = `/novice/build-and-ship/forge-barque`. Only four routes exist in the shell (`/`, `/novice`, `/experienced`, `/expert`). The `drafted` status does NOT disable the link (only `locked` does), so in production users would click through to a 404. **Phase-1 MVP gap — flagged, not a content blocker.**

**Contract enforcement**
```
$ node validators/six-slots.js modules/build-and-ship/forge-barque/0{1,2,3,4}-*.module.json
✓ 01-venv-shebang-trap.module.json — PASS   EXIT=0
✓ 02-dual-theme-css.module.json    — PASS   EXIT=0
✓ 03-ship-it-resend.module.json    — PASS   EXIT=0
✓ 04-ship-your-own.module.json     — PASS   EXIT=0

$ npm run validate:fixtures
6 passed, 0 failed (out of 6)

$ cd web && npm run build
✓ Compiled successfully in 1.7s
✓ Generating static pages 7/7
```

**Source provenance** (all verbatim-match vendored source)
| Module | Source file | Stated range | Verified |
|---|---|---|---|
| 01 | `content/sources/barque/QUICK-START.md` | L8–L14 (`## Installation` at L8, code block L10–14) | ✓ |
| 02 | `content/sources/barque/barque/core/themes.py` | L54–L73 (`:root {{` at L54) | ✓ |
| 03 | `content/sources/barque/barque/core/email.py` | L225–L253 (`def _get_env_vars` at L225) | ✓ |
| 04 | `content/sources/barque/README.md` | L65–L85 (`### Basic Usage` at L65; `barque send report.md --to boss@company.com` at L78) | ✓ |

Self-check citations also verify: email.py L231–232 `env["RESEND_API_KEY"] = …` ✓, README.md L48 "Free Resend accounts can only send to your verified email" ✓.

**Invariant compliance**
- Every interactive slot declares `csp`, `iframe_sandbox`, `no_eval` (12/12 fields present, 4 interactive slots × 3 keys).
- CSS vars (`--primary`, `--accent`, `--surface-*`, `--text*`, `--border*`) drive brand tokens; hard-coded hex only inside inline SVG labels, which is acceptable per the brief.
- Font stack across all four HTML files: `Playfair Display + Inter + JetBrains Mono`. No fourth family.
- Zero `<script type="module" src="http…">`; one inline CSP-scoped `<script>` per file for the DOM simulator.
- `ship_your_own: true` appears only on `04-ship-your-own.module.json:66`. The three earlier modules set it `false`.

**HTML size + a11y**
```
25649 01-venv-shebang-trap.html
26246 02-dual-theme-css.html
23552 03-ship-it-resend.html
25951 04-ship-your-own.html
```
- All < 27 KB, far under the 80 KB ceiling.
- All 30 `onclick` handlers across the four files land on `<button type="button">` — zero `<div onclick>`.
- `prefers-reduced-motion` + `:focus-visible` both present in each file (counts: 6/9/6/9 matches).
- CSP blocks network, allows only `font-src https://fonts.gstatic.com` + inline style/script.

## Integration gaps (non-blocking)

1. **`web/app/novice/[track]/[quest]/page.tsx` (or equivalent dynamic route) does not exist.** Clicking the "Forge BARQUE" card in the live shell 404s. Add a route that: reads `modules/build-and-ship/forge-barque/quest.manifest.json`, lists the four modules, and links each to the static module HTML.

2. **No route serves the module HTML itself.** `modules/build-and-ship/forge-barque/01-venv-shebang-trap.html` is not inside `web/public/` and Next.js does not serve files outside `web/`. Either symlink/copy the module HTML under `web/public/modules/**` at build time, or add a Next.js rewrite. Current build output has exactly four routes — none of them module-serving.

3. **`VENDOR.json` still records `sha: "main"` with `sha_is_placeholder: true`.** Not a Phase-1 blocker per the file's own note, but before any public publication the `scripts/refresh-sources.sh` capture step listed in `VENDOR.json.next_action` must replace the placeholder with the real commit SHA; otherwise the permalinks cite a moving HEAD.

4. **Draft-status UX.** `quest-card.tsx:34-35` only disables navigation when `status === "locked"`. A `drafted` quest renders as a live `<Link>`. Either add a `drafted` branch that renders as non-navigable, OR ship gap #1 before changing the quest status from `drafted`. Today the two are consistent (both pre-launch) but they drift the moment the route lands.

5. **`track.manifest.json` vs `web/lib/tiers.ts` use different vocabularies for "status."** Track manifest says `"status": "ready"`, tiers.ts says `"status": "drafted"`. Both are fine in isolation but they will diverge. Pick one source of truth — suggest: the track manifest is canonical, `tiers.ts` should be generated or at least reconciled by a script before publish.

## Must-fix before publication (CRITICAL only)

None. All CRITICAL invariants from launch-plan-v1.1 are satisfied. The four integration gaps above are HIGH, not CRITICAL — and the brief explicitly classifies the missing-route issue as a "known MVP gap, don't ding."
