# LUXOR Academy — Expansion Roadmap

**Date:** 2026-04-21
**Status:** Synthesis of two parallel research passes
**Source docs:** [`ROADMAP-research-inventory.md`](./ROADMAP-research-inventory.md) · [`ROADMAP-research-meta.md`](./ROADMAP-research-meta.md)

---

## The North Star

**LUXOR Academy = tutorial layer for the `luxor-claude-marketplace`.**

The marketplace already ships 10 plugins covering frontend, backend, database, devops, data-engineering, testing, AI, design, specialized tooling, and skill-building. What it lacks is a teaching surface. That's what the Academy is — **every marketplace plugin gets a quest (or a track), every quest is a shippable plugin**.

Organizing principle going forward:

```
Plugin cluster   →   Track    →    Quests (1–4 per track)    →   Modules (4–9 per quest)
      ↑
 Shippable unit of distribution (install via `claude plugin install ...`)
```

---

## Current state (baseline)

- **8 quests live**, all Content-live: forge-barque, design-tool-planner, hello-agent, mercurio-for-decisions, mars-systems, mcp-from-zero, cmp-foundations, fstar-7-levels.
- **44 modules** validator-green.
- **3 tiers × 6 tracks** populated. Gaps: several tracks have one quest; most tracks could hold 2–3.

## What the research revealed

| Area | Finding |
|---|---|
| LUXOR/PROJECTS | 52 directories; **~22 mature enough to back a quest**; 8 already used; ~14 unclaimed candidates |
| luxor-claude-marketplace | 10 plugins, 67 skills — **no tutorial layer exists for any of them** |
| Meta-prompting ecosystem | Roughly **3× more quest-worthy material** than currently in the academy |
| HEKAT | Not a quest — a **full track** (4 quests). Working TUI, L1–L7 workflow engine, 5 industry templates |
| ~/.claude agents (96) | Cluster into 6 themes: Orchestration, Verification, Research, Execution, Docs, Specialized |
| meta-prompting-plugin | Alone is a **complete expert track** (5 commands, 10 skills) |

---

## The 10 Plugin Clusters (ship units)

Named bundles that can each be `claude plugin install`-able and carry their own tutorial track in the Academy.

| # | Cluster | Purpose (1 line) | Anchor project | Academy quests |
|---|---|---|---|---|
| 1 | `luxor-hekat-orchestration` | DSL + TUI + UBOS workflow engine | `PROJECTS/hekat-universal-business-os` | 4 (full track) |
| 2 | `luxor-mcp-server-builder` | Scaffold production MCP servers | textmate-mcp, branded-pptx-mcp | 2 |
| 3 | `luxor-agentic-automation` | Real-world agent automation (WhatsApp, calendar, email) | whatsapp-agent, calendar-availability | 2 |
| 4 | `luxor-rmp-maker` | Recursive Meta-Prompting + MAKER million-step pattern | meta-prompting-plugin, MAKER paper impl | 2 |
| 5 | `luxor-notebooklm-course-factory` | Codebase → polished course pipeline | codebase-to-course skill + NLM | 2 |
| 6 | `luxor-image-gen` | NanoBanana trio (repo + service + site gen) | nanobanana, nanobanana-website-generator | 2 |
| 7 | `luxor-categorical-ai` | DisCoPy, polynomial functors, quality-enriched prompting | categorical-meta-prompting beyond CMP basics | 3 |
| 8 | `luxor-cosmic-productivity` | HALCON — production React/TS astrological productivity app | PROJECTS/HALCON | 1 |
| 9 | `luxor-raven-tms` | RavenEye MCP + transactional email orchestration | RavenEye integrations | 1 |
| 10 | `luxor-gsd-workflow` | 50+ `/gsd-*` commands as a shippable workflow plugin | `~/.claude/commands/gsd-*` | 2 |

**Observation worth calling out:** cluster #10 already has 50+ commands written — zero-marginal-cost quest material if we bundle + document.

---

## Proposed new quests — organized by tier

**~23 new quest candidates** beyond the 8 live. Module counts are estimates; titles are working names.

### Novice (6 proposed) — onboarding velocity

| # | Quest | Plugin cluster | Modules | Source |
|---|---|---|---|---|
| N1 | **First Spec-Driven Feature** | luxor-gsd-workflow | 6 | `/01-specify` + `/02-plan` + superpowers |
| N2 | **Your First Judge Loop** | luxor-gsd-workflow | 4 | `/judge`, `judge-with-debate` |
| N3 | **Claude Code Plugin from Scratch** | luxor-mcp-server-builder | 5 | `claude-plugin-marketplace-builder` agent |
| N4 | **GSD Starter — Plan · Execute · Verify** | luxor-gsd-workflow | 6 | `/gsd-*` commands |
| N5 | **Build Your Own Agent** | luxor-agentic-automation | 6 | `meta-agent` command + agent SDK |
| N6 | **Ship a NanoBanana Site** | luxor-image-gen | 5 | nanobanana-website-generator |

### Experienced (11 proposed) — where the depth is

| # | Quest | Plugin cluster | Modules |
|---|---|---|---|
| E1 | **RMP Quality-Gated Loops** | luxor-rmp-maker | 7 |
| E2 | **5-Command Plugin Authorship** (∘ → ⊗ >>=) | luxor-rmp-maker | 8 |
| E3 | **Polymorphic Agent Framework (PAF)** | luxor-categorical-ai | 7 |
| E4 | **SDD Mastery — Full Constitutional Cycle** | luxor-gsd-workflow | 8 |
| E5 | **Dynamic Prompt Registry** | luxor-rmp-maker | 6 |
| E6 | **HEKAT Foundations** | luxor-hekat-orchestration | 5 |
| E7 | **HEKAT Modules + Industry Templates** | luxor-hekat-orchestration | 7 |
| E8 | **HEKAT Workflow Engine Deep Dive** | luxor-hekat-orchestration | 8 |
| E9 | **GSD Full Track** (AGT-1) | luxor-gsd-workflow | 9 |
| E10 | **Multi-Perspective Code Review** | luxor-gsd-workflow | 5 |
| E11 | **WhatsApp Concierge Agent** | luxor-agentic-automation | 6 |

### Expert (6 proposed) — next-layer depth

| # | Quest | Plugin cluster | Modules |
|---|---|---|---|
| X1 | **RMP Deep Dive — Fixed-Point + Meta²/³** | luxor-rmp-maker | 9 |
| X2 | **Polynomial Functors (Spivak-Niu)** | luxor-categorical-ai | 8 |
| X3 | **Quality-Enriched Prompting ([0,1]-enriched cats, Bradley)** | luxor-categorical-ai | 8 |
| X4 | **HEKAT Categorical Architecture** | luxor-hekat-orchestration | 8 |
| X5 | **Prompt DSL Authorship** (prompt-dsl + guidance-grammars + lmql) | luxor-rmp-maker | 7 |
| X6 | **JUPITER + Grok Dialogue** | luxor-categorical-ai | 6 |

### Meta-quest (1 — the flywheel)

| Quest | Why it matters | Modules |
|---|---|---|
| **Forge Your Own Quest** (teaches `codebase-to-course`) | Turns every learner into a content creator. Catalog grows through use. | 6 |

---

## Totals at a glance

| Band | Live today | Candidates ready to forge | After expansion |
|---|---:|---:|---:|
| Novice | 3 | +6 | 9 |
| Experienced | 3 | +11 | 14 |
| Expert | 2 | +6 | 8 |
| Meta-flywheel | — | +1 | 1 |
| **Total quests** | **8** | **+24** | **32** |
| **Plugin clusters** | 1 (implicit) | +9 explicit | **10** |

---

## Execution priority

Ranked by (a) demo-ability today, (b) material depth already on disk, (c) distinctness from the 8 live quests, (d) shippability as a standalone plugin.

### Wave 1 — ship the rest of the low-hanging clusters (next 1–2 sessions)

1. **HEKAT Foundations (E6)** — anchors the biggest unclaimed track; working TUI + specs on disk.
2. **GSD Starter (N4)** — 50+ commands already authored; quest-writing cost is near zero.
3. **First Spec-Driven Feature (N1)** — introductory complement to E4.
4. **Claude Code Plugin from Scratch (N3)** — directly enables the plugin-distribution story.
5. **Forge Your Own Quest (meta-flywheel)** — unlocks learner-contributed content.

### Wave 2 — HEKAT track completion + MCP depth

6. E7 HEKAT Modules + Industry Templates
7. E8 HEKAT Workflow Engine Deep Dive
8. X4 HEKAT Categorical Architecture
9. E10 Multi-Perspective Code Review
10. E11 WhatsApp Concierge Agent

### Wave 3 — expert-tier deep dives

11. E1 RMP Quality-Gated Loops
12. X1 RMP Deep Dive
13. X2 Polynomial Functors
14. X3 Quality-Enriched Prompting
15. E3 PAF

### Wave 4 — fill the outer edges

16–24. Remaining Novice/Experienced/Expert items (image gen, NLM course factory, RavenEye TMS, JUPITER/Grok, HALCON, SDD Mastery, DSL Authorship).

---

## Plugin anatomy — what we ship

Each cluster becomes a `.claude-plugin/` bundle in the `luxor-claude-marketplace`. Ingredients per plugin:

```
luxor-<cluster>-plugin/
├── .claude-plugin/plugin.json      # marketplace manifest
├── skills/                          # 3–8 scoped skills
├── agents/                          # 0–3 agents if applicable
├── commands/                        # optional slash commands
├── workflows/                       # optional yaml workflows
└── install.sh                       # one-shot installer
```

Corresponding Academy track:

```
modules/<track>/<quest>/
├── quest.manifest.json             # EN + ES bilingual metadata
├── {NN}-<slug>.module.json         # 6-slot contract per module
└── {NN}-<slug>.html                # self-contained HTML renderer
```

**One-to-one invariant:** if you ship the plugin, you ship the quest. If you ship the quest, you ship the plugin. No orphan tutorials, no un-taught plugins.

---

## Key architectural decisions implied by this roadmap

1. **Introduce 4 new tracks** to `web/lib/tiers.ts`:
   - Novice: `plugin-authoring`
   - Experienced: `hekat-orchestration` (new), `gsd-workflow` (new)
   - Expert: `formal-meta-prompting` (or extend `categorical-meta-prompting`)

2. **Subagent briefs now include plugin-cluster context** — each forge run should also produce the `.claude-plugin/` bundle, not just the quest content. Parallel output.

3. **`codebase-to-course` skill gets promoted** from "future Phase 3 pipeline" to "live skill" — once N1 or the meta-flywheel quest lands, learners can run it on their own repos.

4. **`total_xp` across the site when fully expanded** ≈ ~35,000 XP (from ~5,500 today). Tier thresholds may want tuning.

---

## What I'd do first if we keep going this session

1. Add HEKAT to `web/lib/tiers.ts` as a new track under Experienced (glyph: `jitterbug` — dynamic transform vibe).
2. Scaffold an empty `modules/hekat-orchestration/hekat-foundations/quest.manifest.json` with `modules_planned[]` — makes the Roadmap state light up immediately on the live site without needing to forge content yet.
3. Mirror for 3 other top-priority new quests (N1, N3, N4, meta-flywheel) so the live site grows visibly.
4. Commit — "scaffold Wave 1 quest roadmaps (5 new draft quests)".

Forging to Content-live happens wave-by-wave in subsequent sessions via the same parallel-subagent pattern that produced Phase B.

---

## Related documents

- [`ROADMAP-research-inventory.md`](./ROADMAP-research-inventory.md) — 227 lines, full LUXOR/marketplace inventory
- [`ROADMAP-research-meta.md`](./ROADMAP-research-meta.md) — 182 lines, meta-prompting/HEKAT/agents deep-dive
- [`../HANDOFF.md`](../HANDOFF.md) — resume-anywhere document
- [`../progress.md`](../progress.md) — live session snapshot
