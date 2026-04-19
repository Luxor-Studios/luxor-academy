# LUXOR Academy — Autonomous Build (Academy Forge)

A **reentrant 4-hour autonomous course-build loop** that runs in any sandbox where one git repo is mounted (Vercel sandbox coding agent, GitHub Codespaces, Replit, Daytona, etc.).

## How it works

```
┌──────────────────────────────────────────────────────────┐
│  run.sh (driver — bash, never restarts)                  │
│  ┌────────────────────────────────────────────────────┐  │
│  │ while budget > 0 && next_unit != "idle":           │  │
│  │   1. git pull --rebase                              │  │
│  │   2. compose iter prompt = META-PROMPT + state     │  │
│  │   3. claude < iter_prompt  (fresh context)         │  │
│  │   4. measure progress (new commit?)                │  │
│  │   5. sleep 5s                                       │  │
│  └────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────┘
            │
            ▼  invokes once per iteration
┌──────────────────────────────────────────────────────────┐
│  Claude (fresh session, cold context per iteration)      │
│  Reads: META-PROMPT.md + loop-state.json + work-queue    │
│  Does: ONE atomic unit (per §5 of META-PROMPT)           │
│  Writes: module files + git commit + updated state       │
│  Exits.                                                   │
└──────────────────────────────────────────────────────────┘
```

The loop survives context-window exhaustion because **state is on disk, not in memory**. Each Claude invocation is a fresh session that re-reads the meta-prompt and the state file. The atomic unit is one module — small enough to fit in a single context window comfortably.

## Files

| File | Role |
|------|------|
| `META-PROMPT.md` | The prompt Claude reads each iteration. Self-contained, reentrant. |
| `work-queue/priorities.yaml` | Prioritized list of atomic units to build. Drained top-down. |
| `loop-state.seed.json` | Initial state. `run.sh` copies this to `loop-state.json` on first run. |
| `loop-state.json` | Live state. Rewritten by Claude every iteration. |
| `run.sh` | Driver. Loops Claude invocations with timeouts + progress detection. |
| `logs/` | Per-iteration logs + bootstrap report + any BLOCKER files. |

## Prerequisites

- `bash` (4+), `git`, `jq`, `node` (for validators), `timeout` (GNU coreutils)
- Claude Code CLI installed and authenticated, OR `claude-agent-sdk` Node bindings
- Network: just GitHub (origin remote) for push/pull
- The repo cloned at the path you'll pass to `run.sh`
- `content/sources/` populated (already vendored — see `content/sources/README.md`)
- `vendor/skills/` and `vendor/agents/` populated (already done)

## Running it

### Vercel sandbox coding agent (recommended)

In the Vercel sandbox terminal:

```bash
git clone https://github.com/Luxor-Studios/luxor-academy
cd luxor-academy
git checkout landing/coming-soon   # autonomy is on this branch until merged
./autonomy/run.sh --hours 4
```

The driver will:
1. Bootstrap `loop-state.json` from the seed
2. Loop Claude invocations, one atomic unit per iteration, ~6 min timeout each
3. Push commits to `origin/main` after each successful unit
4. Halt at: 4h elapsed, or queue drained, or blocker file present, or 5 no-progress iterations

### Local dry-run (no Claude, just sanity-check the driver)

```bash
./autonomy/run.sh --dry-run --hours 1
```

### Custom config

```bash
HOURS=8 \
MAX_ITERATIONS=300 \
ITERATION_TIMEOUT=600 \
CLAUDE_CMD="claude --print --dangerously-skip-permissions" \
CLAUDE_MODEL="claude-opus-4-7" \
./autonomy/run.sh
```

## Watching progress

```bash
# in another shell on the same sandbox
tail -f autonomy/logs/run-*.log
git log --oneline origin/main      # commits as they land
cat autonomy/loop-state.json | jq  # current state, completed list
```

## Stopping it

- `Ctrl-C` → driver cleanup runs, prints summary
- `touch autonomy/logs/BLOCKER-manual-stop.md` → driver halts on next iteration
- Edit `loop-state.json` and set `next_unit: "idle"` → next iteration exits

## What gets built

The `work-queue/priorities.yaml` defines:

**critical_path** (Phase 1 — BARQUE flagship Quest)
- Track + Quest scaffolds
- 3 BARQUE modules + "Ship Your Own"
- Atlas vertex activation
- MERCURIO + MARS validation round
- Human gate

**phase_2** (build-and-ship Quest 2 + agent-mastery Quest 1)
- HALCON deploy 4 modules + Ship Your Own
- Compose Parallel Agents 3 modules + Ship Your Own
- Atlas vertex
- Validation

**phase_3** (categorical-wizardry + verification-and-rigor)
- Your First DSL 4 modules + Ship Your Own
- The Six-Slot Contract 3 modules + Ship Your Own
- Atlas vertices + validation

**phase_4_and_beyond** (placeholders, populated opportunistically)

A 4-hour run typically completes critical_path + most of phase_2 (~8-10 modules + scaffolding + validation). Phase 3 spills to a second run.

## Hard guarantees

1. **Atomic commits** — every successful iteration produces exactly one git commit. No partial states pushed.
2. **Validator-gated** — no module enters main without passing `validators/six-slots.js`.
3. **No confabulation** — every technical claim cited to a file or spec; if the agent can't cite, it removes the claim.
4. **Anti-loop** — 5 consecutive no-progress iterations = automatic halt.
5. **Wall-clock budget** — 4-hour cap prevents runaway cost.
6. **Human gate** — phase boundaries pause the loop pending sign-off.

## When something goes wrong

Look at:
1. `autonomy/logs/run-<timestamp>.log` — full stdout from every iteration
2. `autonomy/logs/BLOCKER-*.md` — diagnostic files written by Claude when it can't proceed
3. `autonomy/logs/skipped-<date>.md` — units skipped with reasons
4. `git log --oneline` — what actually got committed
5. `autonomy/loop-state.json` — what the loop thinks it's doing

To resume after fixing a blocker:
```bash
rm autonomy/logs/BLOCKER-*.md
# optionally edit loop-state.json to skip the blocked unit
./autonomy/run.sh --hours 3   # resumes from current state
```
