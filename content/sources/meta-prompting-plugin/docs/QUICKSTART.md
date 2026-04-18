# Quickstart

Get productive in 5 minutes.

## Install

```bash
git clone https://github.com/manutej/meta-prompting-plugin ~/.claude/plugins/meta-prompting
cd ~/.claude/plugins/meta-prompting
./INSTALL.sh
```

Restart Claude Code.

## Verify

```
/meta --help
```

You should see the command frontmatter. If not, check that `~/.claude/commands/meta.md` is a symlink pointing into `~/.claude/plugins/meta-prompting/commands/meta.md`.

## The 30-second tour

### 1. `/meta` — pick a strategy for a task

```
/meta "write a parser for INI files with comments"
```

Under the hood: the command classifies the task into one of 7 complexity tiers (L1-L7) and picks a prompt template to match. You can force a tier with `@tier:L4`.

### 2. `/rmp` — iterate until quality is high enough

```
/rmp @quality:0.85 @max_iterations:5 "refactor this for clarity without changing behavior"
```

The loop runs: generate → evaluate → improve → repeat. Stops when quality ≥ threshold, or when iterations are exhausted (returns best seen).

### 3. `/context` — extract relevant context before prompting

```
/context @mode:extract @focus:src/auth @depth:2 "explain the session lifecycle"
```

Pulls the most relevant code/history from the target, then prompts with only that slice. Useful when Claude's window is getting crowded.

### 4. `/transform` — swap strategy without rewriting the task

```
/transform @from:chain-of-thought @to:debate "evaluate this architecture decision"
```

Keeps the task text, changes how it's approached. Good for getting a second-opinion view on the same problem.

### 5. `/chain` — compose commands like a pipeline

```
/chain [/meta→/rmp→/review] @quality:0.9 "ship the payment refund flow"
```

Output of `/meta` becomes input to `/rmp`, becomes input to `/review`. Quality degrades by `min(q₁, q₂)` across `→`, so the chain gates itself.

## Modifiers you'll use most

| Modifier | Example | Meaning |
|---|---|---|
| `@quality:N` | `@quality:0.85` | Quality threshold (0.0-1.0) |
| `@max_iterations:N` | `@max_iterations:5` | Cap for `/rmp` loops |
| `@mode:X` | `@mode:iterative` | `active`, `iterative`, `dry-run`, `spec` |
| `@tier:LN` | `@tier:L3` | Force complexity tier |
| `@catch:X` | `@catch:retry:3` | Error handling |
| `@quality:visualize` | `@quality:visualize` | Print quality flow chart |

## Next

- [`EXAMPLES.md`](EXAMPLES.md) — longer real-world recipes
- [`theory/foundations.md`](theory/foundations.md) — why the commands compose the way they do
- [`../skills/meta-self/SKILL.md`](../skills/meta-self/SKILL.md) — every modifier and operator in one place
