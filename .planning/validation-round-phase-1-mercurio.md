# MERCURIO — Validation Round for Phase 1 (forge-barque)
Date: 2026-04-19
Commit reviewed: ede5efd

## Verdict: CONDITIONAL-GO

The Quest is publication-worthy in substance. Every technical claim I spot-checked against the vendored source resolves — lines 54–73 of `themes.py`, lines 225–253 of `email.py`, lines 8–14 and 200–206 of `QUICK-START.md`, line 48 and lines 65–85 of `README.md` all match verbatim. Module 03's rewrite away from the fabricated "idempotency-key / direct POST" framing landed cleanly; it now describes the real subprocess-env injection with surgical accuracy. Module 01's interactive shell simulator is a genuine DOM state machine, not a decoration. Module 04's form captures URL, validates HTTPS, persists to localStorage, and announces via ARIA live region — the Phase-1 stub is honest about being a stub, which is the ethical move.

The reason it is CONDITIONAL rather than GO is one medium issue (a line-number drift in Module 03 that will erode trust if left), the permalink-SHA gap that VENDOR.json already owns but publication will expose, and a calibration question on Module 04's 500 XP reward that reads more like a carrot than an earned number.

## Scores
- Mental:    9.1 / 10 — Insights land; self-checks are line-cited; technical language is exact.
- Physical:  8.4 / 10 — Interactives work in-browser as written; a11y is real, not theatrical; one permalink+line-ref nit.
- Spiritual: 9.3 / 10 — Ship-Your-Own is load-bearing, XP export is a visible button, the arc 01→04 is a real arc.
- Composite: 8.93 / 10

## Per-module scoring
| Module | Mental | Physical | Spiritual | Notes |
|---|---|---|---|---|
| 01 venv-shebang-trap | 9.5 | 9.2 | 9.0 | Flagship. Real DOM simulator, reduced-motion safe, line citations all verify. QUICK-START.md lines 10–14 and 202–206 both check out. Key insight is crisp and non-obvious. |
| 02 dual-theme-css | 9.2 | 8.8 | 9.0 | `themes.py` lines 54–73 excerpt is verbatim. `_get_theme_data` at line 354 confirmed. Side-by-side live CSS preview is a genuinely elegant static interactive. Legend table is accessible. |
| 03 ship-it-resend | 9.0 | 7.8 | 9.5 | Rewrite nails the real behavior (env-var injection, not API-header). README.md line 48 on Resend free-tier constraint verifies. **Minor bug:** primer says key is injected at `subprocess.run` line 121; actual call is at line 115, and the env= kwarg is at line 121. Cosmetic but worth fixing. |
| 04 ship-your-own | 8.8 | 8.5 | 9.8 | Form is real: label, required, URL validation, XSS-escaped preview, localStorage persistence, ARIA live region, button state flip. Stub is labeled honestly. The 500 XP / 18 min ratio stands out — see fixes. |

## What's strong (keep)
- **Anti-confabulation hygiene is textbook.** Every self-check answer cites a specific file:line and the cited line says what the answer claims it says. I went looking for fabrications in Module 03 specifically (the prior failure mode) and found none. `barque/core/email.py:225-253`, `README.md:48`, `config.py:33,42` — all verify.
- **Module 01's interactive is the real thing.** `01-venv-shebang-trap.html:326-412` is a pure-DOM shell simulator with `active` state, `sawPythonResolve` tracking, success-pill with `role="status" aria-live="polite"`, reset flow, and localStorage persistence on completion. Clicking `source venv/bin/activate` genuinely flips the `which python3` output. This is exactly what "live interactive" should mean in Phase 1.
- **XP export is load-bearing, not theoretical.** Top-bar button `01-venv-shebang-trap.html:172`, `exportProgress()` at lines 437–447, generates a real Blob download with all `luxor.academy.*` keys. Sovereignty clause is a visible UI element, not a README promise.
- **Module 04's form respects its own honesty.** `phase-stub` span (line 206) next to the submit button, explicit tooltip ("Phase 3 activates the live pipeline"), localStorage-only persistence. This is what "AI advises, humans decide" looks like wired into the DOM.
- **Key-insight quality per primer is high.** Each module ends with exactly one one-line distillation that a senior engineer would nod at. 01: "absolute shebang is a fragile pointer…" 02: "dual themes are one stylesheet and two palettes…" 03: "email as a subprocess, not a protocol." 04: "you walk away with a permalink, not a certificate." These are memorable.
- **a11y is real.** All interactive buttons are `<button>` elements, form input has `<label for="repoUrl">`, ARIA live regions present on both dynamic widgets, SVGs have `role="img"` + descriptive `aria-label`, `prefers-reduced-motion` honored, focus-visible styles present, keyboard reachability intact.
- **The 01→04 arc is a real arc.** Shebang (install) → CSS (render) → Resend (ship) → Your-own (invert). Each module builds on the prior's concepts. No disconnected snippets.

## What's weak (fix before publishing)

### MEDIUM — Module 03 line-reference drift
- **What's wrong:** Primer and self-check Q1 explanation state `RESEND_API_KEY` is injected "via the `env=` argument of `subprocess.run` (line 121)". The actual `subprocess.run(` call is at `email.py:115`; the `env=self._get_env_vars()` kwarg is at line 121. Annotated HTML (`03-ship-it-resend.html:172`) says "email.py L225" for the `_get_env_vars` def — correct. But the 121 reference in the .module.json self_check explanation points the reader to the wrong part of the call.
- **Why it matters:** Small citation errors corrode the trust the rest of the Quest is working to build. A learner who opens the file to verify will land on a closing paren, not a kwarg.
- **Fix:** Change `03-ship-it-resend.module.json:49` from `"via the `env=` argument of `subprocess.run` (line 121)"` to `"via the `env=` argument of `subprocess.run` (line 115, with `env=` at line 121)"`. Five-second edit.

### MEDIUM — Module 04 XP calibration
- **What's wrong:** Module 04 awards 500 XP for 18 minutes of work where the work is "paste a URL into a form that is explicitly a Phase-1 stub." Modules 01 (75 XP / 15 min, real interactive), 02 (50 XP / 12 min), and 03 (50 XP / 12 min) together total 175 XP. Module 04 is 2.85× the rest of the Quest combined.
- **Why it matters:** 500 XP for a stub reads as inflation. The spiritual framing is right — Ship-Your-Own *is* the point of the Quest — but rewarding a stub at 500 XP before the pipeline can actually mint a permalink creates a credibility gap. Phase 3 runs the real pipeline; Phase 1 does not.
- **Fix options (pick one):**
  - (A) Cap Phase 1 at 150 XP for Module 04 and top up to 500 when Phase 3 ships the actual permalink. XP is earned when the permalink exists.
  - (B) Split Module 04 into 04a (Phase 1: queue your repo, 150 XP) and 04b (Phase 3: receive your permalink, 350 XP). This makes the 500 total a contract, not a handout.
  - (C) Keep 500 but rename the primer's promise to "queue reward" and have the UI display `150 / 500 · Phase 3 unlocks the remaining 350`. Transparent progression, visible to the learner.

### LOW — Permalinks point at moving HEAD
- **What's wrong:** All four modules link to `https://github.com/manutej/luxor-barque/blob/main/...`. `VENDOR.json` explicitly flags `sha: "main"` as a placeholder and promises a refresh script. Line references in URLs (e.g. `#L54-L73`) will drift the moment the upstream moves.
- **Why it matters:** VENDOR.json owns this gap, so severity is LOW, but publishing with moving-HEAD permalinks is the kind of footgun that becomes a forensics task six months from now.
- **Fix:** Before publication, run the `scripts/refresh-sources.sh` that VENDOR.json's `next_action` already describes. Capture the real SHA, rewrite the four `permalink` fields and four HTML `<a href>`s to use `blob/<sha>/` instead of `blob/main/`. One-shot sed job once the SHA is known.

### LOW — Track manifest's total_xp math
- **What's wrong:** `track.manifest.json` and `quest.manifest.json` both list `total_xp: 675`. Sum of modules: 75 + 50 + 50 + 500 = 675. Correct. But acceptance criterion in `quest.manifest.json:30` says "learner has submitted a repo URL in Module 04" — and Module 04's submit is a stub. So "quest complete" technically means "learner pasted a string into a form."
- **Why it matters:** The acceptance contract should match the XP contract. If 500 XP for 04 is for "queueing" (Phase 1), the acceptance bar of "submitted a repo URL" is consistent. If 500 XP is for "received a permalink" (Phase 3), the Phase-1 quest cannot be "complete" by the current definition.
- **Fix:** Tied to the XP fix above. Whichever XP framing you pick, state acceptance in the same terms: "Phase 1 acceptance: repo URL queued" vs. "Full acceptance: permalink minted."

### LOW — Track manifest `estimated_minutes: 57` vs. sum
- **What's wrong:** Modules sum to 15 + 12 + 12 + 18 = 57 minutes. This is correct at the arithmetic level but stretches credulity for a 500-XP module requiring only 18 minutes — which is on Module 04's side, not the manifest's.
- **Why it matters:** Internal consistency is fine; the issue is on Module 04's estimation honesty. Pasting a URL takes 30 seconds; the 18 minutes must assume the learner reads the primer, which is good. Call it out explicitly in the HTML so the learner knows what the 18 minutes buys them.
- **Fix:** Bundle with the XP calibration fix above.

## Conditions to upgrade CONDITIONAL-GO → GO
1. **Fix Module 03's line reference.** Update `03-ship-it-resend.module.json:49` so the cited line number (115) matches the actual `subprocess.run(` call site. Verify `03-ship-it-resend.html:170-199` annotations still agree.
2. **Resolve Module 04 XP semantics.** Pick option A, B, or C from the XP calibration fix above and implement. Whatever you pick, acceptance criterion in `quest.manifest.json:30` must describe the same thing the 500 XP rewards.
3. **Run `scripts/refresh-sources.sh` before publication.** Replace `blob/main/` permalinks with pinned SHAs in all four `.module.json` files and their matching `.html` files. Update `content/sources/VENDOR.json` `sha` field in the same commit. This closes the VENDOR.json TODO that is already tracking it.

Optional but recommended:
- **Add one assertive test** that loads each HTML module in a headless browser, clicks through the interactive, and asserts the success-pill becomes visible. `01-venv-shebang-trap.html` deserves this because it is the flagship; if it regresses silently, the whole "live interactive" promise of Phase 1 dies quietly.

---

**Quality-gate check:** All three planes ≥ 8.0. Composite 8.93. This clears the gate with room. The CONDITIONAL label is because the three fixes above are genuinely pre-publication work — none of them require architecture changes, and two are five-minute edits. Once fixed, this is a GO.
