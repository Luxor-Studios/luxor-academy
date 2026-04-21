# LUXOR Ecosystem — Research Inventory & Plugin Cluster Roadmap

**Date:** 2026-04-20
**Purpose:** Map every LUXOR project + marketplace plugin, propose new plugin clusters that can ship as LUXOR-ACADEMY quests, and rank the top 10 most-shippable pieces.
**Scope:** `/Users/manu/Documents/LUXOR/` (root), `PROJECTS/` (52 dirs), `luxor-claude-marketplace/` (10 plugins).

---

## Part A — Inventory

### A.1 LUXOR root — top-level folders worth exploring

| Folder | Worth exploring? | Why |
|---|---|---|
| `PROJECTS/` | YES | Primary quarry — 50+ project subdirs |
| `luxor-claude-marketplace/` | YES | Canonical shape of a "shippable plugin" |
| `.claude/` | YES | Already wired into skills/agents/commands registry |
| `COURSEWARE/` | MAYBE | Teaching assets; likely feeds quests rather than becomes one |
| `MAAT/`, `MERCURIO/`, `HKT/`, `EPUB/`, `HTML/`, `LaTeX/` | MAYBE | Support assets (rendering, LaTeX pipelines) |
| `Elder-Council/`, `Elias-rentals/`, `CLIENTS/` | NO | Domain-specific / client work — not reusable as plugins |
| `Git_Projects/`, `Git_Repos/` | NO | Historical scratch |

### A.2 Marketplace plugins (the canonical "shippable" shape)

Structure: every plugin has `.claude-plugin/plugin.json` + `skills/`, `commands/`, `agents/`, `workflows/`, `install.sh`, `uninstall.sh`. `plugin.json` declares contents list + install metadata. `marketplace.json` at marketplace root aggregates the 10 plugins.

| Plugin | Category | Contents (from marketplace.json) |
|---|---|---|
| luxor-frontend-essentials | frontend | 13 skills |
| luxor-backend-toolkit | backend | 14 skills |
| luxor-database-pro | database | 9 skills |
| luxor-devops-suite | devops | 12 skills |
| luxor-data-engineering | data | skills for Airflow/Spark/Kafka/dbt/MLOps |
| luxor-testing-essentials | testing | 3 skills (pytest, pytest-patterns, shell-testing) |
| luxor-ai-integration | ai | 2 skills (claude-sdk-integration-patterns, langchain-orchestration) |
| luxor-design-toolkit | design | 4 skills (figma-design, ux-principles, wireframing, perf-bench) |
| luxor-specialized-tools | misc | asyncio, linear-dev-accelerator, playwright-visual-testing, pydantic, unix-goto |
| luxor-skill-builder | meta | 30 agents + 28 commands (the meta-plugin; zero skills) |

**Key takeaway for quest design:** plugins are thin bundles. The *depth* lives in the skills themselves (~5-50KB each). A "shippable plugin" = curated bundle + clear narrative + install.sh. Most existing marketplace plugins have **no tutorial layer** — that's the gap LUXOR-ACADEMY quests fill.

### A.3 LUXOR/PROJECTS classification

Format: `name | domain | maturity (1-10) | shippable-as-plugin? | quest candidate?`

Maturity heuristic: code files count + README + package.json + src/ + docs coherence.

| Project | Domain | Maturity | Plugin? | Quest? | Notes |
|---|---|---|---|---|---|
| HALCON | Productivity UI (orbital nav + ephemeris) | 9 | N | Y | 155K files, React/TS/Vitest; huge, distinctive |
| LUXOR-ACADEMY | Courseware site itself | 9 | N | — | The caller |
| hekat-universal-business-os | Business OS (DSL + TS impl) | 8 | Y | Y | 8.1K files, src + specs + docs |
| grok-cli | CLI (agent + MCP + tools) | 8 | Y | Y | 10K files, full SDK |
| hekat-tui | Terminal UI for Hekat DSL | 8 | Y | Y | fp-ts + Claude SDK, Ink-based |
| hekat-ts | TypeScript impl of HEKAT | 7 | Y | Y | 5.4K files |
| textmate | MCP server (SMS/Twilio) | 7 | Y | Y | 14 tools, real MCP |
| MAKER | MAKER paper impl (million-step tasks) | 7 | Y | Y | TS impl of arxiv:2511.09030 |
| nanobanana-repo | Image generation templates + Docker | 7 | Y | Y | 2K files, accessibility track |
| nanobanana-website-generator | Block-composition website generator | 7 | N | Y | 15K files — demo-rich |
| LUMOS | Comonadic synthesis / PDF | 7 | N | Y | 735 files, phased implementation |
| BARQUE | Markdown→PDF | 8 | — | LIVE | already shipped |
| DESIGN-TOOL-PLANNER | Two-agent pattern | 8 | — | LIVE | already shipped |
| MERCURIO | Essays + MoE framework | 7 | — | LIVE | already shipped |
| fstar-framework | 7-level F* verification | 8 | — | LIVE | already shipped |
| nanobanana (microservice) | FastAPI + worker | 6 | Y | Y | Dockerized, has MICROSERVICE-SPEC |
| whatsapp-agent | Wassenger + Claude Haiku parser | 6 | Y | Y | Small, demo-ready |
| calendar-availability-system | Calendar availability TS service | 5 | Y | M | Narrow |
| HEKAT (root docs) | HEKAT canonical spec | 8 | N | Y | 3.3K lines of spec; pairs with hekat-ts |
| hyperglyph | 5-phase DAG/hypergraph/animations | 6 | N | Y | Python, visualizable |
| discopy | DisCoPy course materials | 7 | N | M | Course, not plugin |
| ai-dialogue | Category-theory research + CLI | 6 | Y | M | Python + cli.py |
| paper2agent | Paper→agent specs | 7 | N | Y | Category A/B synthesis docs |
| docrag | RAG systems + cat-research | 6 | Y | Y | rag-systems + builds dirs |
| hkt-implementation | 9-module category theory course | 7 | N | Y | Structured Haskell/TS |
| branded-pptx-mcp | Branded PPTX MCP | 6 | Y | M | 5K files but no README |
| claude-sdk-microservice | SDK microservice scaffold | 5 | Y | M | Roadmap stage |
| copilot-course | Context engineering course | 6 | N | Y | PDFs + MD |
| ANTHROPIC-AGENT-SDK-COURSE | Full SDK course | 7 | N | Y | 8 chapters |
| agentic-ai-course / -accenture | Enterprise agentic course | 7 | N | M | Client-flavored |
| n8n-agentic-ai-course | n8n automation course | 6 | N | Y | Docs + slides |
| MCP-COURSE | MCP course (beyond mcp-from-zero) | 6 | N | M | Overlaps with live quest |
| NOTEBOOKLM-CLAUDE-CODE | NLM+CC integration | 5 | N | Y | Thin shell, good skill |
| notebooklm-framework | NLM meta-prompting | 5 | Y | Y | 4 files, one skill.md |
| LUMINA | Multi-stage expert convergence | 6 | N | Y | 5 stages of planning output |
| MAAT | API key guardian (empty dir, command exists) | 2 | N | N | Command lives in ~/.claude |
| orch-cli | Orch CLI design doc | 2 | N | N | Just DESIGN.md |
| raven-architecture | Single index.html | 1 | N | N | — |
| CETI / CETI-Web | Client/festival ops | 3 | N | N | Client |
| sentinel | Jupyter notebook | 3 | N | N | Notebook prototype |
| maestros, customer-support | Empty/trivial | 1 | N | N | — |
| FINANCE-ANALYSIS | Personal finance scratch | 3 | N | N | Not reusable |
| Elias-rentals, CLIENTS | Client work | 3 | N | N | Private |
| ai-proficiency-site | Site build | 4 | N | M | Site, not plugin |
| 15X-GROWTH-EXECUTION-PLAN.md | Plan doc | — | N | N | Planning doc |
| ANTHROPIC-AGENT-SDK-COURSE | Already counted | | | | |

**Already-live quests (do not duplicate):** forge-barque (BARQUE), design-tool-planner (DESIGN-TOOL-PLANNER), hello-agent, mercurio-for-decisions (MERCURIO), mars-systems (MARS), mcp-from-zero (meta-prompting-plugin), cmp-foundations (categorical-meta-prompting), fstar-7-levels (fstar-framework).

---

## Part B — Plugin Cluster Proposals

Each cluster below is a shippable bundle (like existing marketplace plugins) + 1-3 quest candidates that teach its usage. Ingredients reference actual skills/agents/commands already present in `~/.claude/`.

### B.1 `luxor-hekat-orchestration-plugin`
**Purpose:** Complexity-aware agent orchestration via the HEKAT DSL + TUI.
**Ingredients:** skills `hekat`, `hekat-v5.2`, `ois-orchestrator`, `cc2-orchestrator`, `cc2-meta-orchestrator`, `workflow-composition`; commands `/hekat`, `/hekat-exit`, `/ois-plan`, `/ois-compose`, `/orch`; anchor agent `project-orchestrator`.
**Anchor projects:** `hekat`, `hekat-ts`, `hekat-tui`, `hekat-universal-business-os`.
**Quest candidates:**
- `hekat-query-builder` — "Build your first HEKAT query and execute it on a live agent swarm."
- `hekat-tui-hands-on` — "Wire the Ink-based TUI to Claude Agent SDK."
- `universal-business-os-tour` — "Apply HEKAT to a real business-automation scenario."

### B.2 `luxor-mcp-server-builder-plugin`
**Purpose:** Turn any domain into a real MCP server (not just consuming one).
**Ingredients:** skills `mcp-categorical`, `mcp-integration-expert`, `n8n-mcp-orchestrator`, `build-mcp`; commands `/build-mcp`, `/setup-arxiv-mcp`, `/setup-context7-mcp`, `/setup-serena-mcp`.
**Anchor projects:** `textmate` (SMS/Twilio MCP, 14 tools), `branded-pptx-mcp`, `notebooklm-framework`.
**Quest candidates:**
- `build-your-first-mcp-server` — "Ship textmate-style MCP: tools, storage, templates in <1 day."
- `mcp-for-domain-x` — "Adapt the pattern to PPTX branding or NotebookLM."

### B.3 `luxor-agentic-automation-plugin`
**Purpose:** Production agentic automations: inbound natural-language → parsed action → external API.
**Ingredients:** skills `claude-agent-sdk-multiplatform`, `claude-sdk-integration-patterns`, `claude-api`, `n8n-master`, `oauth2-authentication`; agent `claude-sdk-expert`.
**Anchor projects:** `whatsapp-agent`, `calendar-availability-system`, `textmate`.
**Quest candidates:**
- `whatsapp-concierge` — "Ship the Wassenger+Haiku concierge in 30 minutes."
- `calendar-concierge` — "Natural-language → booked meeting."

### B.4 `luxor-rmp-maker-plugin` (Recursive Meta-Prompting + MAKER)
**Purpose:** Quality-gated iterative meta-prompting + million-step zero-error execution.
**Ingredients:** skills `recursive-meta-prompting`, `meta-prompt-iterate`, `atomic-blocks`, `prompt-benchmark`, `quality-enriched-prompting`; commands `/rmp`, `/rmp-hard`, `/meta-prompting`, `/meta-build`, `/meta-fix`, `/meta-refactor`.
**Anchor projects:** `MAKER` (arxiv:2511.09030 TS impl), `paper2agent`.
**Quest candidates:**
- `rmp-for-hard-tasks` — "Quality gates that force convergence."
- `maker-million-step` — "MAD + voting + red-flagging for zero-error pipelines."

### B.5 `luxor-notebooklm-course-factory-plugin`
**Purpose:** Turn a codebase or paper into an interactive NotebookLM course.
**Ingredients:** skills `notebooklm`, `notebooklm-cc`, `nlm-course-creation`, `codebase-to-course`; commands `/nlm`, `/nlm-course`, `/courseware`, `/study-repo`, `/enrich-repo`.
**Anchor projects:** `NOTEBOOKLM-CLAUDE-CODE`, `notebooklm-framework`, `ANTHROPIC-AGENT-SDK-COURSE`, `discopy`, `copilot-course`, `MCP-COURSE`.
**Quest candidates:**
- `codebase-to-course-in-a-day` — "Any repo → interactive course."
- `nlm-deep-integration` — "Audio overviews, mind maps, flashcards via MCP."

### B.6 `luxor-image-gen-plugin` (NanoBanana suite)
**Purpose:** Production-grade AI image generation with accessible prompts + block-based site generation.
**Ingredients:** skills `nano-banana`, `nanobanana-image-generation`, `generating-image-prompts`, `atomic-blocks`; command `/nanobanana`.
**Anchor projects:** `nanobanana-repo`, `nanobanana`, `nanobanana-website-generator`.
**Quest candidates:**
- `nanobanana-from-prompt-to-site` — "Block composition → live site with generated imagery."
- `accessible-image-prompting` — "Dual-track delivery: seeing + screen-reader users."

### B.7 `luxor-categorical-ai-plugin`
**Purpose:** Practical categorical foundations (beyond CMP foundations quest) — DisCoPy, polynomial functors, enriched prompting, HKT.
**Ingredients:** skills `discopy-nlp`, `discopy-categorical-computing`, `polynomial-functors`, `quality-enriched-prompting`, `hasktorch-typed`, `category-master`, `category-theory-foundations`, `tensor-composition-patterns`, `unified-categorical-syntax`, `dspy-categorical`, `effect-ts-ai`; commands `/meta`, `/compose`, `/transform`, `/blocks`.
**Anchor projects:** `discopy`, `hkt-implementation`, `hyperglyph`, `ai-dialogue`.
**Quest candidates:**
- `discopy-for-nlp` — "String diagrams → working text classifier."
- `polynomial-functors-in-practice` — "Spivak-Niu for real pipeline design."
- `hkt-9-modules` — "Functors through higher categories."

### B.8 `luxor-cosmic-productivity-plugin` (HALCON)
**Purpose:** Ship the orbital-nav productivity app + Swiss Ephemeris integration as a reference React/TS codebase with tests.
**Ingredients:** skills `react-development`, `react-patterns`, `nextjs-development`, `tailwind-css`, `jest-react-testing`, `frontend-architecture`, `responsive-design`, `playwright-visual-testing`.
**Anchor project:** `HALCON` (155K files, Vitest, 80% coverage).
**Quest candidates:**
- `halcon-tour` — "Tour a production React/TS app with orbital UI, Zustand state, ephemeris calculations."
- `add-a-planet` — "Extend HALCON with a new productivity domain."

### B.9 `luxor-raven-tms-plugin` (RavenEye / TMS + email)
**Purpose:** Production MCP integration with a transportation management system + email orchestration.
**Ingredients:** MCP tools `raven-core`, `raveneye-email`; skills `oauth2-authentication`, `api-gateway-patterns`, `rest-api-design-patterns`.
**Anchor projects:** RavenEye MCP server (already in `.mcp.json`), `CETI-Web/raven`, `raven-training-kickoff`.
**Quest candidates:**
- `raven-mcp-walkthrough` — "Query orders/movements through an MCP client."
- `email-workflow-via-mcp` — "End-to-end authenticate → dispatch."

### B.10 `luxor-linear-gsd-plugin` (GSD project workflow)
**Purpose:** Ship the opinionated GSD (Get Stuff Done) phase/milestone workflow as a plugin — 50+ `/gsd-*` commands already exist.
**Ingredients:** ~50 `/gsd-*` commands (new-project, new-milestone, plan-phase, execute-phase, ui-phase, ship, review, audit-fix, map-codebase, etc.); Linear MCP tools.
**Anchor:** the GSD command suite in `~/.claude/commands/` + Linear MCP.
**Quest candidates:**
- `gsd-first-milestone` — "From new-project to shipped PR in one afternoon."
- `gsd-with-linear` — "Sync phases ↔ Linear issues automatically."

---

## Part C — Top 10 Most-Shippable Pieces

Ranked by (a) demo-ability today, (b) depth of teaching material, (c) distinctness from live quests.

1. **luxor-hekat-orchestration-plugin (quest: hekat-query-builder)** — Four codebases (hekat, hekat-ts, hekat-tui, UBOS) + full spec docs + working TUI. Unique angle (DSL + complexity-aware). Extremely demo-able: run the TUI, type a query, watch agents converge.
2. **MAKER — maker-million-step quest** — Published paper (arXiv:2511.09030), working TS impl, dramatic pitch ("million steps, zero errors, log-linear cost"). High novelty; complements RMP/CMP quests without overlap.
3. **whatsapp-agent — whatsapp-concierge quest** — Tiny codebase (Wassenger + Haiku), works end-to-end today, sub-30-min demo. Perfect "first real agentic app" quest.
4. **textmate — build-your-first-mcp-server quest** — Real MCP server (14 tools) that isn't a toy. Pairs naturally with mcp-from-zero but goes deeper (storage, templates, queue).
5. **HALCON — halcon-tour quest** — Production-grade React/TS (80% coverage, Swiss Ephemeris). Visual, distinctive, teaches full modern frontend stack in a memorable domain.
6. **luxor-notebooklm-course-factory-plugin (quest: codebase-to-course-in-a-day)** — NotebookLM MCP is rare; `codebase-to-course` skill already exists. High shareability — every instructor wants this.
7. **nanobanana — nanobanana-from-prompt-to-site quest** — Full block-composition pipeline (research → architecture → components → canvas → image → site) with 15K files of evidence. Visually stunning output.
8. **hekat-universal-business-os — universal-business-os-tour quest** — 8K files of production TS with specs/architecture/docs. Different angle from hekat-query-builder: applied business automation.
9. **discopy — discopy-for-nlp quest** — Course-ready (COURSE.md, AI_TUTOR, accessibility variants). Distinct from CMP foundations (which is meta-prompting, not NLP diagrams).
10. **luxor-linear-gsd-plugin (quest: gsd-first-milestone)** — 50+ existing `/gsd-*` commands = latent plugin worth tens of hours of docs. Teaches phase/milestone discipline that every quest implicitly uses.

**Honorable mentions (rank 11-14):** hkt-implementation (9-module category theory course, already structured), paper2agent (paper → agent spec pipeline), LUMOS (comonadic synthesis), calendar-availability-system (smallest possible agentic service — great 15-minute quest).

---

## Appendix — Plugin Anatomy (for reference)

From `luxor-claude-marketplace/plugins/*/`:
```
plugin-name/
├── .claude-plugin/plugin.json   # id, name, version, contents{skills[], commands[], agents[], workflows[]}
├── skills/<skill-name>/         # SKILL.md + assets
├── commands/*.md                # slash commands
├── agents/*.md                  # agent definitions
├── workflows/*.yaml             # orchestration specs
├── install.sh / uninstall.sh    # registry wiring
```
Marketplace root `.claude-plugin/marketplace.json` aggregates all plugins with category/tags/featured flags.

**Shipping checklist for any new cluster:**
1. Curate skills/agents/commands (reuse existing — don't re-author).
2. Write `plugin.json` with contents manifest.
3. Author `install.sh` (symlink into `~/.claude/skills|agents|commands`).
4. Add entry to `marketplace.json`.
5. Pair with a LUXOR-ACADEMY quest that demos the plugin end-to-end.
