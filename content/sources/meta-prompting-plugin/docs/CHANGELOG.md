# Changelog

All notable changes to this project will be documented here.

Format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).
Versioning follows [SemVer](https://semver.org/).

## [0.1.0] — 2026-04-18

Initial public extraction from the `categorical-meta-prompting` research repo.

### Added
- 5 commands: `/meta`, `/rmp`, `/context`, `/transform`, `/chain`
- 9 core skills: `meta-self`, `recursive-meta-prompting`, `quality-enriched-prompting`, `prompt-dsl`, `prompt-benchmark`, `categorical-property-testing`, `polynomial-functors`, `cc2-research-framework`, `arxiv-categorical-ai`
- 8 integration skills under `skills/integrations/` for DSPy, LMQL, LangGraph, Guidance, DisCoPy, @effect/ai, VoltAgent, MCP
- `INSTALL.sh` one-command installer (symlinks commands + skills into `~/.claude/`)
- `docs/theory/` with foundations, categorical structures, composition operators, further-reading
- Niche-language references (Hasktorch, LLM4S) moved to `docs/theory/language-implementations/`

### Deferred to v0.2
- TypeScript library (`@categorical-meta-prompting/core` with fp-ts)
- MCP server
- Marketplace distribution

### Dropped vs. source repo
- 392MB of `python-experiments/`
- `baseline-validation-results/` (kept as theory summary only)
- `k8s-spark-pipeline/`, `spark-k8s-security/` (research infra, not plugin-relevant)
- 30+ top-level session summaries, implementation plans, progress logs
- Brand change: "Categorical Meta-Prompting Framework v2.4.0" → "Meta-Prompting Plugin v0.1.0"

## [Unreleased]

- Dogfood feedback from Phase 1 — iterate on friction
- TypeScript library ship (v0.2)
- MCP server ship (v0.2)
- Marketplace submission
