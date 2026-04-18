# Contributing

We used this plugin to build this plugin. Here's the recipe.

## The self-application workflow

Before writing any new skill, command, or doc, apply the plugin's own operators to the work:

### Step 1 — `/meta` on the task itself

Classify complexity, pick a strategy:

```
/meta @tier:auto "add a skill for <topic>"
```

Most skill authorship lands at **L3-L5** (moderate algorithm + doc + cross-reference).

### Step 2 — `/rmp` the draft

Iterate with a quality gate:

```
/rmp @quality:0.85 @max_iterations:5 "<draft of the skill>"
```

Quality dimensions: **correctness (0.40) · clarity (0.25) · completeness (0.20) · efficiency (0.15)**.

Skills don't ship until they hit 0.85. READMEs don't ship until they hit 0.85.

### Step 3 — `/context` to check for consistency

```
/context @mode:extract @focus:skills/meta-self "does this new skill use consistent modifier syntax?"
```

Catches drift between skills.

### Step 4 — `/transform` for voice

```
/transform @from:research @to:product "<draft>"
```

Research voice ("we explored") → product voice ("you can"). Run on every doc that a user will read.

### Step 5 — `/chain` to compose the above for major changes

```
/chain [/meta→/rmp→/transform→/review] @quality:0.9 "ship skill X"
```

## Plumbing rules

- **No heredoc commit bodies.** Keep commit messages short and specific. `git commit -m "add X skill"` not a 10-line essay.
- **No new top-level files without a reason.** Docs go in `docs/`. Skills go in `skills/`.
- **Integration skills live under `skills/integrations/`** and must state their `requires:` in the description.
- **Theory lives in `docs/theory/`**, not in user-facing skill bodies. Skill bodies start with *what the user can do*, then optionally link to theory.

## Frontmatter contract for skills

```yaml
---
name: <kebab-case-name>
description: "<single sentence, ≤150 chars, user-facing. Start with a verb or 'Use when...'>"
---
```

If the skill requires an external library, prefix the description with `(requires: <install-cmd>)`.

## PR checklist

- [ ] Skill/command/doc passes `/rmp @quality:0.85`
- [ ] No heredoc commit messages
- [ ] `docs/CHANGELOG.md` updated under `[Unreleased]`
- [ ] `INSTALL.sh` still idempotent (re-run in a test account)
- [ ] No secrets in `.env`, `*.log`, or `*.json` config

## Design docs

Significant changes start with a design doc under `docs/plans/YYYY-MM-DD-<topic>-design.md`. Keep them short. The design doc for this repo's initial extraction lives at `docs/plans/2026-04-18-meta-prompting-plugin-design.md` (in the upstream research repo).

## Issues & discussions

Use the GitHub issue tracker. Tag with `skill:`, `command:`, `docs:`, `install:` prefixes for routing.
