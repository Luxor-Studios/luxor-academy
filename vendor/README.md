# Vendored Claude Code Resources

This directory contains Claude Code skills and agents needed to build / validate / extend the LUXOR Academy. They are vendored from `~/.claude/` so a remote contributor can work without the original developer's local setup.

## Layout

```
vendor/
├── skills/
│   ├── codebase-to-course/             # THE pipeline — repo → interactive HTML course
│   ├── categorical-meta-prompting-ts/  # Compositional prompt-engineering DSL
│   └── code-review-triage/             # Multi-perspective parallel code review
└── agents/
    ├── MERCURIO_AGENT_DEFINITION.md    # 3-plane validator (Mental/Physical/Spiritual)
    ├── mercurio-orchestrator.md        # Top-level orchestrator
    ├── mercurio-pragmatist.md          # Physical-plane lens
    ├── mercurio-synthesizer.md         # Mental-plane lens
    ├── MARS_AGENT_DEFINITION.md        # Systems-level architectural validator
    ├── MARS_QUICK_REFERENCE.md         # Cheat sheet
    ├── mars-architect.md               # Architecture sub-agent
    ├── mars-executor.md                # Execution sub-agent
    ├── mars-innovator.md               # Inversion / breakthrough sub-agent
    ├── libreui-orchestrator.md         # Seven Pillars orchestrator (UI work)
    ├── libreui-specialist.md           # Seven Pillars specialist
    ├── frontend-architect.md           # Frontend architecture guidance
    └── software-architect.md           # General architecture guidance
```

## How to use

### If you have Claude Code locally
Drop these into your own `~/.claude/skills/` and `~/.claude/agents/` and they're immediately invokable via the `Skill` and `Agent` tools.

### If you're on Claude Code on the web (or elsewhere)
Read them directly as Markdown. The skills include their own `README.md` describing capabilities; the agent definition files include system prompts you can paste into any LLM session as a starting brief.

## Why these specifically

- **codebase-to-course** — the engine that powers Phase 3 of the Academy launch plan. Without it, the codebase-to-quest pipeline doesn't exist. *Critical.*
- **categorical-meta-prompting-ts** — Track 1 of the Academy is *Categorical Wizardry*. This skill IS the curriculum for that track. *High value.*
- **code-review-triage** — used as a per-phase quality gate. *Useful.*
- **MERCURIO** + **MARS** — the two validators that gate every phase. The Academy plan calls them by name in its acceptance criteria. *Essential for governance.*
- **libreui-{orchestrator,specialist}** — Seven Pillars enforcement for every UI artifact in the Academy (Meaningful / Beautiful / Accessible / Secure / Performant / Tested / Documented). *Essential for build.*
- **frontend-architect** + **software-architect** — general architectural sounding boards. *Optional but useful.*

## Licensing

Each vendored item retains its original license from the source repo (`~/.claude/`). If publishing externally:
1. Audit each item for explicit LICENSE files
2. Preserve attribution
3. Keep this README acknowledging the vendor relationship

## Refreshing

To pull updates from the original `~/.claude/` source:

```bash
cp -R ~/.claude/skills/codebase-to-course vendor/skills/
cp -R ~/.claude/skills/categorical-meta-prompting-ts vendor/skills/
cp ~/.claude/agents/{MERCURIO,MARS,mercurio,mars,libreui,frontend,software}*.md vendor/agents/
git diff vendor/
```

Commit with a clear message like `chore: refresh vendored skills (date)` — never silently update.
