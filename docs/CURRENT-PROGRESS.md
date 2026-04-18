# LUXOR Academy — Current Progress

**Last updated:** 2026-04-18 (16:00 PT)
**Repo:** https://github.com/Luxor-Studios/luxor-academy (PUBLIC)
**Status:** Phase 0 (planning) ✅ done · Phase 0.5 (substrate) ⏳ in flight · Landing page ✅ branch ready to deploy

---

## Live state at a glance

| Track | Status | Branch | Where to look |
|-------|--------|--------|---------------|
| Planning + architecture | ✅ DONE | `main` | `.planning/launch-plan-v1.1.md` |
| Design tokens | ✅ DONE | `main` | `atlas/tokens/tokens.css` |
| Module slot contract | ✅ DONE | `main` | `validators/slots.schema.json` |
| MERCURIO+MARS validation | ✅ DONE | `main` | `.planning/validation-round-1.md` |
| Phase 0.5 substrate build | ⏳ RUNNING | `main` (branch may shift) | (autonomous agent at work) |
| Landing page | ✅ READY | `landing/coming-soon` | `index.html` + `vercel.json` |
| Vendored skills + agents | ✅ DONE | `landing/coming-soon` | `vendor/` |

---

## Branches on the remote

```
main                       Phase 0 + tokens + schema + plan (5476fac)
landing/coming-soon        + landing page + vendored resources (this branch)
```

Phase 0.5 build (autonomous) commits to `main`. Once it lands and the demo is gated, `landing/coming-soon` should be merged into main (or the landing kept as a separate Vercel deploy).

---

## What you have to work with remotely

### Read these in order
1. `HANDOFF.md` (root) — complete brief for fresh contributor
2. `.planning/launch-plan-v1.1.md` — canonical 5-phase plan
3. `.planning/academy-architecture.md` — pedagogy + Fuller synergetics mapping
4. `.planning/validation-round-1.md` — MERCURIO + MARS reports + decision record
5. `validators/slots.schema.json` — single source of truth for module contract
6. `atlas/tokens/tokens.css` — design tokens (Luxor canonical brand)
7. `index.html` (landing branch) — placeholder showcase
8. `vercel.json` (landing branch) — static deploy config + CSP

### Vendored Claude Code resources (landing branch)

Available offline at `vendor/` so a remote contributor doesn't need the user's local `~/.claude/` setup.

**Skills (`vendor/skills/`):**
- `codebase-to-course/` — THE pipeline. Repo → interactive HTML course. Read its README first; this is what powers Phase 3.
- `categorical-meta-prompting-ts/` — TypeScript implementation of the meta-prompting framework (referenced in Track: *Categorical Wizardry*).
- `code-review-triage/` — multi-perspective parallel review used as a phase quality gate.

**Agents (`vendor/agents/`):**
- `MERCURIO_AGENT_DEFINITION.md` + `mercurio-{orchestrator,pragmatist,synthesizer}.md` — three-plane validator (Mental/Physical/Spiritual). Use to gate every phase end.
- `MARS_AGENT_DEFINITION.md` + `MARS_QUICK_REFERENCE.md` + `mars-{architect,executor,innovator}.md` — systems-level architectural validator and executor.
- `libreui-orchestrator.md` + `libreui-specialist.md` — Seven Pillars (Meaningful, Beautiful, Accessible, Secure, Performant, Tested, Documented) implementation guidance for any UI work.
- `frontend-architect.md`, `software-architect.md` — general architecture guidance.

---

## Active task list

| # | Subject | Status |
|---|---------|--------|
| 1-7 | Discovery + architecture + planning + validation | ✅ done |
| 8 | Phase 0.5 substrate build | ⏳ in flight (autonomous agent) |
| 9 | Phase 1 BARQUE flagship Quest | ⬜ blocked on #8 + human gate |

---

## Decisions locked

| Decision | Value | Source |
|----------|-------|--------|
| Brand gold | `#E9B949` | Luxor Studios canonical |
| Brand navy | `#0A1628` | Luxor Studios canonical |
| Display font | Playfair Display | Luxor Studios canonical |
| Body font | Inter | Luxor + Ormus overlap |
| Mono font | JetBrains Mono | Both brands |
| Module contract | 6 slots via custom-elements + JSON schema | MARS round-1 |
| Last-module pattern | "Ship Your Own" — learner repo → permalink quest | MERCURIO round-1 |
| Render model | One web-component tree, `data-zoom` for Atlas/Quest/Module | MARS round-1 |
| Theme switching | tokens.css only, no JS | Round-1 non-goals |
| AI gate model | MERCURIO+MARS advise, human decides | MERCURIO condition |

---

## How to deploy the landing page

```bash
# clone the repo and check out the landing branch
git clone https://github.com/Luxor-Studios/luxor-academy
cd luxor-academy
git checkout landing/coming-soon

# deploy to Vercel (one command)
npx vercel --prod
# OR link via dashboard at https://vercel.com/new and import this repo + branch
```

The landing page is **fully static** (one HTML file, fonts via Google CDN, no JS). It will deploy in seconds.

For a permanent URL, point Vercel at the `landing/coming-soon` branch as the production branch, OR merge into `main` after Phase 0.5 substrate is in.

---

## Vercel project setup

**Recommended config:**
- Framework: Other (static)
- Build command: (none — static HTML)
- Output directory: `./` (root)
- Install command: (none)
- Production branch: `landing/coming-soon` for now; switch to `main` after Phase 0.5 ships

**Environment vars:** none required for landing page.

---

## Next actions (you, remotely)

1. **Set up Vercel project** pointing at this repo's `landing/coming-soon` branch — get a live URL today.
2. **Watch the autonomous Phase 0.5 build** at https://github.com/Luxor-Studios/luxor-academy/commits/main — agent commits as it ships each deliverable.
3. **When Phase 0.5 acceptance is reported** (see `.planning/phase-0.5-acceptance.md` after agent completes), human-gate review per `HANDOFF.md` §3.4 before greenlighting Phase 1.
4. **Phase 1** = Forge BARQUE flagship Quest. 3 days. Demo-ready end of Day 7 from Phase 0.5 start.

---

## Open questions (non-blocking — answer when convenient)

- "Ship Your Own" input: GitHub OAuth or anonymous URL paste?
- Parchment (light) theme: ship in Phase 1 or defer?
- Domain: `luxor.academy`, `academy.luxor.studio`, or `cetiai.co/academy`?
- Vercel project: separate from CETI's existing project, or under same Luxor-Studios team?
- Self-host fonts (WOFF2) or stay on Google Fonts CDN? (Affects offline + CSP scope.)

---

## Files added in this commit (landing branch)

- `index.html` — landing page (already on landing branch from prior commit)
- `vercel.json` — deploy config (already on landing branch)
- `docs/CURRENT-PROGRESS.md` — this file
- `vendor/skills/codebase-to-course/` — full skill copy
- `vendor/skills/categorical-meta-prompting-ts/` — full skill copy
- `vendor/skills/code-review-triage/` — full skill copy
- `vendor/agents/MERCURIO_AGENT_DEFINITION.md` + 3 sub-agents
- `vendor/agents/MARS_AGENT_DEFINITION.md` + quick-ref + 3 sub-agents
- `vendor/agents/libreui-{orchestrator,specialist}.md`
- `vendor/agents/{frontend,software}-architect.md`

All resources licensed per their original repo (`~/.claude/`); inherit the workspace LICENSE if any. For external publication, audit licenses first.
