# Validation Round — Phase 1 (forge-barque Quest)

**Date:** 2026-04-19
**Commit reviewed:** `ede5efd`
**Verdict after fixes at this commit:** CONDITIONAL-GO (both agents clear their gates)

See the per-agent reports for full detail:
- `validation-round-phase-1-mercurio.md` — three-plane review
- `validation-round-phase-1-mars.md` — five systems checks

---

## Consolidated verdict

| Agent | Score | Gate | Verdict |
|-------|-------|------|---------|
| MERCURIO (Mental · Physical · Spiritual) | **8.93** / 10 (9.1 / 8.4 / 9.3) | ≥8.0 | ✅ CONDITIONAL-GO |
| MARS (5 systems checks) | **91%** | ≥85% | ✅ CONDITIONAL-GO |

Neither agent raised a CRITICAL finding. Both cleared their quality gates. Both agreed that the forge-barque Quest is publication-ready once three small fixes land and one integration gap closes.

## Fixes applied at commit `<next>`

1. **MERCURIO MEDIUM #1** — Module 03 line-reference drift corrected. `subprocess.run(...)` begins at `email.py:115`; the `env=` kwarg is on line 121. The explanation now cites both so the reader can navigate without confusion.
2. **MERCURIO MEDIUM #2** — Module 04 XP split. `xp_reward` changed 500 → 150 so the Phase 1 deliverable (queue a repo URL) pays out proportionally. The remaining 350 XP vests when Phase 3 mints the learner's permalink — called out explicitly in the Module 04 primer and in `quest.manifest.json.total_xp_deferred`. `total_xp` updated 675 → 325.

## Fixes deferred (tracked in HANDOFF.md)

3. **MERCURIO LOW #3 / MARS Check 3 condition** — Replace placeholder `blob/main/...` permalinks with pinned upstream SHAs via a `scripts/refresh-sources.sh` that records the commit into `content/sources/VENDOR.json`. Known gap, already flagged in VENDOR.json `sha_is_placeholder: true` + `next_action`.
4. **MARS Integration Gap (biggest blocker for actually rendering the Quest)** — Shell route `/novice/[track]/[quest]/page.tsx` does not yet exist; `QuestCard` already emits an active `<Link>` to `/novice/build-and-ship/forge-barque` when status is `drafted`, so the MVP currently 404s on quest entry. Two artifacts needed next session:
   - `web/app/novice/[track]/[quest]/page.tsx` — dynamic route that reads the matching `*.module.json` + `*.html` and renders a quest overview + module list.
   - A build-time copy step (npm script) that syncs `modules/**/*.html` into `web/public/modules/` so the static export serves the module HTMLs at stable URLs.

## Quality evidence retained

Both validators re-run after fixes:
```
✓ modules/build-and-ship/forge-barque/01-venv-shebang-trap.module.json — PASS
✓ modules/build-and-ship/forge-barque/02-dual-theme-css.module.json — PASS
✓ modules/build-and-ship/forge-barque/03-ship-it-resend.module.json — PASS
✓ modules/build-and-ship/forge-barque/04-ship-your-own.module.json — PASS
6 passed, 0 failed (out of 6 fixtures — no regression)
```

## Human gate state

This report does NOT open the Phase 1 human gate. The human gate opens only after the integration gap closes (Fix #4) and the quest is actually renderable in the shell. At that point the Academy Forge's `priorities.yaml` unit `human-gate-phase-1` fires, writes `.planning/human-gate-phase-1.md`, and waits for Manu's approval.

Until then: modules are shippable content, but the shell's Forge-BARQUE card should keep `status: "drafted"` — which it already does in `web/lib/tiers.ts`.
