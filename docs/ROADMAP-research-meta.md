# LUXOR Academy — Research Roadmap: Meta-Prompting, HEKAT, Agents

Generated: 2026-04-20

## Recon Inventory

### 1. Meta-Prompting Framework (`~/meta-prompting-framework/`)
- **Core thesis**: Recursive prompt improvement with real Claude API calls (not simulation), monadic refinement loops, token tracking, quality thresholds.
- **Top-level**: `agents/` (MARS, MERCURIO, mercurio-orchestrator, meta2), `skills/` (10 skills incl. `meta-prompt-iterate`, `analyze-complexity`, `assess-quality`, `extract-context`, `category-master`, `discopy-categorical-computing`, `nexus-tui-generator`, `pioneer-mastery`), `commands/` (`grok`, `meta-agent`, `meta-command`), `workflows/` (`meta-framework-generation`, `quick-meta-prompt`, `research-project-to-github`, `research-spec-generation`, `startup-execution-plan`), `theory/` (META-CUBED, META-META-PROMPTING), `meta-prompts/v1` & `v2`, `mastery-plan/`, `ai-engineer-mastery/`, `agent_composition/`, `knowledge_manager/`, `luxor_integration/`, `current-research/`.
- **Key artifact**: Real API validation — 6 calls, 3,998 tokens, 89.7s, "15-20% quality gain per iteration".

### 2. Categorical Meta-Prompting (`~/categorical-meta-prompting/`) — BEYOND `cmp-foundations`
- **Huge repo**: 40+ top-level docs, 61 files in `docs/`, 18 skill-sources, `mcp-server/` (TypeScript MCP server w/ template registry), `python-experiments/` (5 experiments: GraphQL subs, K8s operator, ZKP auth, anomaly detection, federated learning — all with results), `extensions/dynamic-prompt-registry/` (Python CLI + registry + selector), `PAF/` (Polymorphic Agent Framework with 4 iterations + MARS-validation), `baseline-validation-results/` (Stanford metrics + categorical metrics + TypeScript validation), `design-docs/dynamic-prompt-registry-v1/`, `artifacts/`.
- **Quest-worthy beyond foundations**: adjunctions, comonadic context propagation, Kan-extension stability, enriched categories for quality tracking, coalgebraic computation, dynamic prompt registry, PAF (Polymorphic Agent Framework), baseline benchmarks.

### 3. Meta-Prompting Plugin (`~/meta-prompting-plugin/`) — BEYOND `mcp-from-zero`
- **5 Commands**: `/meta`, `/rmp`, `/chain`, `/context`, `/transform` — 4 operators (`∘`, `→`, `⊗`, `>>=`).
- **10 Skills**: `recursive-meta-prompting`, `polynomial-functors`, `quality-enriched-prompting`, `prompt-benchmark`, `prompt-dsl`, `cc2-research-framework`, `meta-self`, `arxiv-categorical-ai`, `categorical-property-testing`, `integrations/`.
- **Tagline**: "Five commands. Four operators. Category theory under the hood."
- **Marketplace-ready** (v0.1.0, marketplace in v0.2).

### 4. HEKAT Universal Business OS (`~/PROJECTS/hekat-universal-business-os/`)
- **Vision**: Describe a business in plain English → complete system generates itself (DB, APIs, workflows, UI). Industry templates: `healthcare/`, `legal/`, `manufacturing/`, `retail/`, `services/`. Module templates: `common/`, `customers/`, `finance/`, `intelligence/`, `operations/`, `people/`.
- **Core**: TypeScript (`src/core/ubos-functions.ts`, `cc2-integration.ts`, `domain-types.ts`), Python workflow engine (~2,000 LOC: `core.py`, `events.py`, `tasks.py`, `state.py`), comprehensive docs (CATEGORICAL-ARCHITECTURE, COMONADIC-EXTRACT, MARS-SYNTHESIS, MERCURIO-THREE-PLANE, PHILOSOPHICAL-FOUNDATION, VISION-FOR-STAKEHOLDERS, WEEK-0 & WEEK-1 COMPLETION).
- **Validation**: Grok-practical + MARS-week0 + Mercurio-three-plane all passed.
- **Size**: Substantial — roughly 5,000+ LOC of templates + engine, ~18 design docs, 5 industry verticals, 6 modules.

### 5. Global Agents (~/.claude/agents/ — 96 files)
- **GSD family (24)**: `gsd-planner`, `gsd-executor`, `gsd-verifier`, `gsd-debugger`, `gsd-codebase-mapper`, `gsd-roadmapper`, `gsd-security-auditor`, `gsd-nyquist-auditor`, `gsd-ui-auditor`, `gsd-doc-writer`, `gsd-doc-verifier`, `gsd-integration-checker`, `gsd-plan-checker`, `gsd-phase-researcher`, `gsd-project-researcher`, `gsd-research-synthesizer`, `gsd-intel-updater`, `gsd-advisor-researcher`, `gsd-assumptions-analyzer`, `gsd-code-fixer`, `gsd-code-reviewer`, `gsd-user-profiler`, `gsd-ui-checker`, `gsd-ui-researcher` — a full spec-driven execution system.
- **MARS family (3 + 2 defs)**: architect, executor, innovator.
- **MERCURIO family (3 orchestrators)**: orchestrator, pragmatist, synthesizer.
- **LibreUI (2)**: orchestrator + specialist.
- **Meta/Framework (4)**: `meta2`, `ois` (Ontological Implementation System), `fpf-agent`, `categorical-paper-l7-orchestrator`.
- **HEKAT agents (1 dir + 1 md)**.
- **Dev-ops / coding (~15)**: code-craftsman, code-explorer, code-trimmer, debug-detective, developer, devops-github-expert, git-genius, github-workflow-expert, complexity-manager, coverage-analyzer, test-engineer, test-runner, practical-programmer, software-architect, tech-lead.
- **Research/Docs (~10)**: deep-researcher, researcher, context7-doc-reviewer, doc-rag-builder, docs-generator, tech-writer, youtube-summarizer, code-review-researcher, spec-driven-development-expert, symbolic-visualizer.
- **Specialized (~12)**: claude-sdk-expert, claude-plugin-marketplace-builder, deployment-orchestrator, project-orchestrator, mcp-integration-wizard, n8n-workflow-builder, flutter-app-builder, nanobanana, linear-mcp-orchestrator, wikijs-graphql-orchestrator, voice-mode-orchestrator, tax-analyst.
- **Research personas**: jupiter, grok, discopy-expert, skill-builder, memory-curator, task-memory-manager, unix-bash-expert, unix-command-master, api-architect, astro-data-manager, business-analyst, ci-bot, frontend-architect.

### 6. Global Commands (153) & Skills (75+)
Patterns beyond what's already used in quests:
- **Spec-Driven Dev (SDD)**: `/00-setup`, `/01-specify`, `/02-plan`, `/03-tasks`, `/04-implement`, `/05-document`, `/constitution` — full Kiro/GitHub Spec-Kit workflow.
- **Judge/Critique loop**: `/judge`, `/judge-with-debate`, `/critique`, `/meta-review`, `/review`.
- **Quality-gated meta**: `/rmp`, `/rmp-hard`, `/reflect`, `/memorize`, `/decay`, `/pre-compact`.
- **Orchestration primitives**: `/orch`, `/chain`, `/compose`, `/foreach`, `/do-in-parallel`, `/do-in-steps`, `/do-competitively`, `/tree-of-thoughts`, `/coord`, `/launch-sub-agent`.
- **PAF (Polymorphic Agent Framework)** `/paf` — distinct from MOE.
- **OIS (Ontological Implementation System)** `/ois-plan`, `/ois-compose`.
- **Kaizen family**: `/analyse-problem`, `/analyse`, `/cause-and-effect`, `/why`, `/plan-do-check-act`, `/root-cause-tracing`, `/propose-hypotheses` (FPF loop with hypotheses).
- **Superpowers plugin**: `/superpowers:brainstorming`, `/superpowers:writing-plans`, `/superpowers:executing-plans`, `/superpowers:subagent-driven-development`, `/superpowers:test-driven-development`, `/superpowers:verification-before-completion`, `/superpowers:systematic-debugging`, `/superpowers:dispatching-parallel-agents`, `/superpowers:using-git-worktrees`, `/superpowers:finishing-a-development-branch`.

---

## A. Quest Candidates (12 proposals)

### Novice (4)

1. **First Spec-Driven Feature** · Novice · source: global SDD commands + Superpowers plugin
   *Take a half-baked feature idea from vague sentence → `/01-specify` → `/02-plan` → `/03-tasks` → `/04-implement` → `/05-document`, all on a single toy project.* ~6 modules.

2. **Your First Judge Loop** · Novice · source: global `/judge`, `/judge-with-debate`, `/critique`
   *Learn to never ship unjudged work — wire a single-agent generator to a judge sub-agent, see scores, iterate, then upgrade to a debate-style judge for contested outputs.* ~4 modules.

3. **Claude Code Plugin from Scratch** · Novice · source: `claude-plugin-marketplace-builder` agent + `/plugin-builder`
   *Build and package a minimal 3-command Claude Code plugin, validate its manifest, and dry-run marketplace submission.* ~5 modules.

4. **GSD Starter: Plan → Execute → Verify** · Novice · source: global `gsd-*` agent family + `/gsd-*` skills
   *Use the 24-agent GSD system to take a single phase from idea to verified shipping code — learn the Plan/Execute/Verify loop on a real repo.* ~6 modules.

### Experienced (5)

5. **RMP Quality-Gated Loops** · Experienced · source: `meta-prompting-plugin/skills/recursive-meta-prompting` + `/rmp`, `/rmp-hard`
   *Implement recursive meta-prompting as fixed-point computation: evaluate → improve → repeat until quality ≥ threshold. Cover monadic state, convergence proofs, and the `/rmp-hard` escape hatch for HARD tasks.* ~7 modules.

6. **The 5-Command Plugin Authorship Quest** · Experienced · source: `meta-prompting-plugin` (`/meta`, `/rmp`, `/chain`, `/context`, `/transform`)
   *Build a categorical plugin in the same shape as meta-prompting-plugin: 4 operators (`∘ → ⊗ >>=`), shippable manifest, end-to-end chain demo.* ~8 modules.

7. **Polymorphic Agent Framework (PAF)** · Experienced · source: `categorical-meta-prompting/PAF/`
   *Learn PAF — agents parameterized over type-level strategies, 4 iteration cycles, MARS-validated. Build a PAF agent that runtime-switches strategies.* ~7 modules.

8. **Spec-Driven Development Mastery** · Experienced · source: `spec-driven-development-expert` agent + `/00-setup`..`/05-document` + `/constitution`
   *Run a full 9-principle constitutional spec-driven cycle: constitution → spec → plan → tasks → implement → document. Adversarial review via `gsd-plan-checker` and `gsd-nyquist-auditor`.* ~8 modules.

9. **Dynamic Prompt Registry** · Experienced · source: `categorical-meta-prompting/extensions/dynamic-prompt-registry/`
   *Build a runtime prompt registry with selector (`/select-prompt`), composition (`/compose`, `/build-prompt`), and registry CLI. Use it to swap prompts mid-workflow without redeploying.* ~6 modules.

### Expert (3)

10. **Recursive Meta-Prompting Deep Dive** · Expert · source: `recursive-meta-prompting` skill + `meta-prompting-framework/theory/META-META-PROMPTING-FRAMEWORK.md`
    *Fixed-point semantics, monadic laws, quality-enriched composition, meta²/meta³ layering, convergence guarantees. Requires categorical foundations (prereq: cmp-foundations).* ~9 modules.

11. **Polynomial Functors for Learners** · Expert · source: `meta-prompting-plugin/skills/polynomial-functors` + Spivak-Niu book
    *Implement Spivak-Niu polynomial functors: positions, directions, lenses, charts. Compose learning systems categorically. Bridge to compositional ML.* ~8 modules.

12. **Quality-Enriched Prompt Engineering** · Expert · source: `quality-enriched-prompting` skill + `ENRICHED-CATEGORIES-QUALITY-RESEARCH.md`
    *[0,1]-enriched categories for continuous quality optimization. Bradley's framework, gradient-based prompt search, quality degradation under composition.* ~8 modules.

### Bonus candidates (pick-list)
- **13. OIS (Ontological Implementation System)** · Experienced · `/ois-plan`, `/ois-compose`, `ois` agent — type-safe agent composition with ontology enforcement. ~7 modules.
- **14. The CC2.0 Seven-Function Cycle** · Experienced · `cc2-*` skills (observe/reason/create/learn/verify/deploy/collaborate) from `cc2-research-framework`. ~9 modules.
- **15. Categorical Benchmarking** · Expert · `prompt-benchmark` skill + `categorical-meta-prompting/baseline-validation-results/` — Stanford MATH/GSM8K benchmarks, categorical metrics, statistical validation. ~6 modules.

---

## B. HEKAT Assessment (one paragraph)

**HEKAT is a full TRACK, not a single quest — and arguably a plugin-scale product in its own right.** It's a Universal Business OS that combines (a) a natural-language business-description intake, (b) 5 industry templates (healthcare / legal / manufacturing / retail / services), (c) 6 module templates (common / customers / finance / intelligence / operations / people), (d) a ~2,000-LOC Python workflow engine with L1–L7 orchestration + saga + event bus + Celery + Redis/Postgres state, (e) a TypeScript core layer, and (f) extensive categorical + philosophical + MARS/Mercurio validation docs. A reasonable academy plan is a 4-quest track: **(1) HEKAT Foundations** (Novice, ~5 modules — describe a business, generate schema, run one workflow), **(2) HEKAT Modules & Industry Templates** (Experienced, ~7 — customize a vertical + module), **(3) HEKAT Workflow Engine Deep Dive** (Experienced, ~8 — L1–L7 patterns, saga, event bus), **(4) HEKAT Categorical Architecture** (Expert, ~8 — comonadic-extract, MARS-synthesis, three-plane validation). Depth is high — the repo has 18 design docs and real validation reports, enough for a capstone track.

---

## C. Agent Clusters (6 clusters) + 4 agent-focused quest proposals

### Clusters

1. **Orchestration** (~10): mercurio-orchestrator, mars-architect, project-orchestrator, deployment-orchestrator, categorical-paper-l7-orchestrator, libreui-orchestrator, linear-mcp-orchestrator, voice-mode-orchestrator, wikijs-graphql-orchestrator, meta2. *Theme: coordinate multiple sub-agents toward a goal.*
2. **Verification / Audit** (~12): gsd-verifier, gsd-plan-checker, gsd-nyquist-auditor, gsd-security-auditor, gsd-ui-auditor, gsd-doc-verifier, gsd-integration-checker, coverage-analyzer, test-engineer, test-runner, code-review-researcher, fpf-agent. *Theme: check before ship.*
3. **Research / Synthesis** (~8): deep-researcher, researcher, gsd-phase-researcher, gsd-project-researcher, gsd-advisor-researcher, gsd-research-synthesizer, context7-doc-reviewer, grok. *Theme: ingest + synthesize.*
4. **Execution / Coding** (~15): developer, code-craftsman, code-trimmer, code-explorer, gsd-executor, gsd-code-fixer, mars-executor, mars-innovator, debug-detective, git-genius, github-workflow-expert, practical-programmer, software-architect, tech-lead, complexity-manager. *Theme: actually write/refactor code.*
5. **Docs / Communication** (~8): docs-generator, tech-writer, gsd-doc-writer, doc-rag-builder, symbolic-visualizer, youtube-summarizer, memory-curator, task-memory-manager. *Theme: produce artifacts for humans.*
6. **Specialized Integrations** (~10): claude-sdk-expert, claude-plugin-marketplace-builder, mcp-integration-wizard, n8n-workflow-builder, flutter-app-builder, nanobanana, tax-analyst, astro-data-manager, unix-bash-expert, unix-command-master. *Theme: bind to an external surface.*

### Agent-focused quest proposals (4)

- **AGT-1. GSD Track: Planning to Shipping** · Experienced · ~9 modules · Master the 24-agent GSD suite — PROJECT.md bootstrapping, phase authoring, `gsd-planner`/`gsd-executor`/`gsd-verifier`, adversarial review via `gsd-nyquist-auditor`, milestone completion. Pair with `/gsd-*` commands.
- **AGT-2. Multi-Perspective Code Review** · Experienced · ~5 modules · Wire `/meta-review` + `code-review-triage` skill + `gsd-code-reviewer` + `code-review-researcher` — parallel reviewers produce independent findings, synthesizer merges, triage ranks. Compare against `/critique`.
- **AGT-3. Building Your Own Agent** · Novice · ~6 modules · `/meta-agent` + `skill-builder` agent + `/create-command` → design-your-own-agent from YAML frontmatter → test → deploy to `~/.claude/agents/`. Pair with `/aprof` for profiling.
- **AGT-4. The JUPITER + Grok Dialogue Pattern** · Expert · ~6 modules · `jupiter.md` + `grok.md` + `/grok`/`/grok-list`/`/grok-export` — reciprocal categorical exchange across two frontier models. Design cross-model debate and synthesis.

---

## D. Meta-Prompting Beyond CMP (3 Expert Proposals)

### MPX-1. Recursive Meta-Prompting as Fixed-Point Computation
- **Tier**: Expert. **Prereqs**: cmp-foundations.
- **Source**: `meta-prompting-plugin/skills/recursive-meta-prompting/SKILL.md` + `meta-prompting-framework/theory/META-META-PROMPTING-FRAMEWORK.md` + `CATEGORY-THEORY-META-PROMPTING-SYNTHESIS.md`.
- **Teaser**: Treat prompt improvement as `F: Prompt → Prompt` and iterate until `Fix(F)`. Prove convergence. Layer `meta²` and `meta³` (prompts that generate prompts that generate prompts).
- **~9 modules**.

### MPX-2. Polynomial Functors for Learner Composition
- **Tier**: Expert. **Prereqs**: cmp-foundations + functional-programming basics.
- **Source**: `meta-prompting-plugin/skills/polynomial-functors/SKILL.md` + Spivak-Niu text.
- **Teaser**: Model LLM pipelines as polynomial functors `p(y) = Σ y^A(s)`. Use lenses for bidirectional data flow and charts for dynamics. Compose learners the way category theory says you should.
- **~8 modules**.

### MPX-3. Quality-Enriched Prompting
- **Tier**: Expert. **Prereqs**: cmp-foundations.
- **Source**: `meta-prompting-plugin/skills/quality-enriched-prompting/SKILL.md` + `categorical-meta-prompting/docs/ENRICHED-CATEGORIES-QUALITY-RESEARCH.md`.
- **Teaser**: Upgrade `Hom(A,B)` from a set to a `[0,1]`-value (Bradley's enriched category theory). Compose quality under multiplication/min. Gradient-optimize over prompt space.
- **~8 modules**.

### Bonus MPX-4. Prompt DSL Authorship
- **Tier**: Expert. **Source**: `prompt-dsl` skill + `meta-prompting-composition` skill + `/blocks`, `/compose`, `/transform`, `/build-prompt`.
- **Teaser**: Design a domain-specific language for categorical prompt composition. Atomic blocks → molecules → workflows. Ship a mini-DSL with a grammar-constrained parser (via `guidance-grammars` or `lmql-constraints`).
- **~7 modules**.

---

## Summary Table

| # | Title | Tier | Source | Modules |
|---|---|---|---|---|
| 1 | First Spec-Driven Feature | Novice | SDD + Superpowers | ~6 |
| 2 | Your First Judge Loop | Novice | /judge, /judge-with-debate | ~4 |
| 3 | Claude Code Plugin from Scratch | Novice | plugin-marketplace-builder | ~5 |
| 4 | GSD Starter: Plan/Execute/Verify | Novice | gsd-* family | ~6 |
| 5 | RMP Quality-Gated Loops | Experienced | recursive-meta-prompting | ~7 |
| 6 | 5-Command Plugin Authorship | Experienced | meta-prompting-plugin | ~8 |
| 7 | Polymorphic Agent Framework | Experienced | CMP/PAF | ~7 |
| 8 | SDD Mastery | Experienced | sdd-expert | ~8 |
| 9 | Dynamic Prompt Registry | Experienced | CMP/extensions | ~6 |
| 10 | RMP Deep Dive | Expert | RMP theory | ~9 |
| 11 | Polynomial Functors | Expert | polynomial-functors skill | ~8 |
| 12 | Quality-Enriched Prompting | Expert | quality-enriched skill | ~8 |
| 13 | OIS | Experienced | ois agent | ~7 |
| 14 | CC2.0 Seven-Function Cycle | Experienced | cc2-research-framework | ~9 |
| 15 | Categorical Benchmarking | Expert | prompt-benchmark + baselines | ~6 |
| AGT-1 | GSD Track | Experienced | gsd-* | ~9 |
| AGT-2 | Multi-Perspective Code Review | Experienced | /meta-review + code-review-triage | ~5 |
| AGT-3 | Build Your Own Agent | Novice | /meta-agent + skill-builder | ~6 |
| AGT-4 | JUPITER + Grok Dialogue | Expert | jupiter + grok | ~6 |
| HEKAT-1..4 | HEKAT Track (4 quests) | Nov→Exp | hekat-universal-business-os | ~5+7+8+8 |

**Total proposed**: 15 quests + 4 agent-quests + 4 HEKAT-track quests = **23 candidates** on top of the 8 live.
