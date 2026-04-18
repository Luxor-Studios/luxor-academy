#!/usr/bin/env bash
#
# LUXOR Academy — Autonomous Build Driver
#
# Runs the Academy Forge meta-prompt in a loop for up to N hours, recovering
# from per-iteration context-window exhaustion via fresh Claude invocations.
#
# Usage:
#   ./autonomy/run.sh [--hours 4] [--max-iterations 200] [--dry-run]
#
# Environment:
#   CLAUDE_CMD         command to invoke Claude Code (default: "claude")
#                      Vercel sandbox: "claude --print --dangerously-skip-permissions"
#   CLAUDE_MODEL       model id (default: "claude-opus-4-7")
#   REPO_DIR           repo root (default: current dir)
#   PROMPT_FILE        path to META-PROMPT.md (default: autonomy/META-PROMPT.md)
#   ITERATION_TIMEOUT  per-iteration timeout seconds (default: 480 / 8 min)
#   COOLDOWN_SECONDS   sleep between iterations (default: 5)

set -u

# ---------- Defaults ----------
HOURS="${HOURS:-4}"
MAX_ITERATIONS="${MAX_ITERATIONS:-200}"
CLAUDE_CMD="${CLAUDE_CMD:-claude}"
CLAUDE_MODEL="${CLAUDE_MODEL:-claude-opus-4-7}"
REPO_DIR="${REPO_DIR:-$(pwd)}"
PROMPT_FILE="${PROMPT_FILE:-autonomy/META-PROMPT.md}"
ITERATION_TIMEOUT="${ITERATION_TIMEOUT:-480}"
COOLDOWN_SECONDS="${COOLDOWN_SECONDS:-5}"
DRY_RUN="false"

# ---------- Arg parsing ----------
while [[ $# -gt 0 ]]; do
  case "$1" in
    --hours) HOURS="$2"; shift 2 ;;
    --max-iterations) MAX_ITERATIONS="$2"; shift 2 ;;
    --dry-run) DRY_RUN="true"; shift ;;
    --timeout) ITERATION_TIMEOUT="$2"; shift 2 ;;
    --help|-h)
      grep '^#' "$0" | sed 's/^# \{0,1\}//'
      exit 0
      ;;
    *) echo "Unknown arg: $1" >&2; exit 2 ;;
  esac
done

# ---------- Paths ----------
cd "$REPO_DIR" || { echo "cannot cd $REPO_DIR" >&2; exit 1; }
LOG_DIR="autonomy/logs"
mkdir -p "$LOG_DIR"
RUN_LOG="$LOG_DIR/run-$(date +%Y%m%d-%H%M%S).log"
STATE_FILE="autonomy/loop-state.json"
SEED_FILE="autonomy/loop-state.seed.json"
WORK_QUEUE="autonomy/work-queue/priorities.yaml"

# ---------- Preconditions ----------
echo "=== LUXOR Academy Forge — Autonomous Run ===" | tee -a "$RUN_LOG"
echo "Repo:           $REPO_DIR" | tee -a "$RUN_LOG"
echo "Prompt:         $PROMPT_FILE" | tee -a "$RUN_LOG"
echo "Claude cmd:     $CLAUDE_CMD" | tee -a "$RUN_LOG"
echo "Model:          $CLAUDE_MODEL" | tee -a "$RUN_LOG"
echo "Budget:         ${HOURS}h wall clock, ${MAX_ITERATIONS} iterations max" | tee -a "$RUN_LOG"
echo "Per-iteration:  ${ITERATION_TIMEOUT}s timeout, ${COOLDOWN_SECONDS}s cooldown" | tee -a "$RUN_LOG"
echo "Started:        $(date -u +%Y-%m-%dT%H:%M:%SZ)" | tee -a "$RUN_LOG"
echo "" | tee -a "$RUN_LOG"

for f in "$PROMPT_FILE" "$WORK_QUEUE" "$SEED_FILE"; do
  if [[ ! -f "$f" ]]; then
    echo "ERROR: missing required file: $f" | tee -a "$RUN_LOG"
    exit 1
  fi
done

# Bootstrap loop-state.json from seed if missing
if [[ ! -f "$STATE_FILE" ]]; then
  cp "$SEED_FILE" "$STATE_FILE"
  # stamp start time
  tmp=$(mktemp)
  jq --arg now "$(date -u +%Y-%m-%dT%H:%M:%SZ)" '.started_at = $now' "$STATE_FILE" > "$tmp" && mv "$tmp" "$STATE_FILE"
  echo "[bootstrap] seeded $STATE_FILE" | tee -a "$RUN_LOG"
fi

# ---------- Loop ----------
START_EPOCH=$(date +%s)
DEADLINE_EPOCH=$((START_EPOCH + HOURS * 3600))
ITERATION=0
NO_PROGRESS_COUNT=0
LAST_HEAD_SHA=""

cleanup() {
  echo "" | tee -a "$RUN_LOG"
  echo "=== Run ended: $(date -u +%Y-%m-%dT%H:%M:%SZ) ===" | tee -a "$RUN_LOG"
  echo "Iterations:     $ITERATION" | tee -a "$RUN_LOG"
  echo "Elapsed:        $(( ($(date +%s) - START_EPOCH) / 60 )) minutes" | tee -a "$RUN_LOG"
  echo "Last commit:    $(git -C "$REPO_DIR" log -1 --oneline 2>/dev/null || echo 'n/a')" | tee -a "$RUN_LOG"
  exit 0
}
trap cleanup INT TERM

while true; do
  NOW=$(date +%s)
  ITERATION=$((ITERATION + 1))

  # Termination checks
  if [[ $NOW -ge $DEADLINE_EPOCH ]]; then
    echo "[halt] wall-clock budget (${HOURS}h) exhausted at iteration $ITERATION" | tee -a "$RUN_LOG"
    cleanup
  fi
  if [[ $ITERATION -gt $MAX_ITERATIONS ]]; then
    echo "[halt] max iterations ($MAX_ITERATIONS) reached" | tee -a "$RUN_LOG"
    cleanup
  fi
  if compgen -G "$LOG_DIR/BLOCKER-*.md" > /dev/null 2>&1; then
    echo "[halt] BLOCKER file present — halting for human review" | tee -a "$RUN_LOG"
    ls "$LOG_DIR"/BLOCKER-*.md | tee -a "$RUN_LOG"
    cleanup
  fi
  NEXT_UNIT=$(jq -r '.next_unit // "idle"' "$STATE_FILE" 2>/dev/null || echo "idle")
  if [[ "$NEXT_UNIT" == "idle" ]]; then
    echo "[halt] queue drained: next_unit=idle" | tee -a "$RUN_LOG"
    cleanup
  fi
  if [[ $NO_PROGRESS_COUNT -ge 5 ]]; then
    echo "[halt] 5 consecutive no-progress iterations — possible infinite loop" | tee -a "$RUN_LOG"
    cleanup
  fi

  # Sync repo state before each iteration
  git fetch origin main --quiet 2>&1 | tee -a "$RUN_LOG" || true
  git pull --rebase --autostash origin main 2>&1 | tee -a "$RUN_LOG" || true

  # Compose the iteration prompt — combine META-PROMPT + current state
  ITER_PROMPT=$(mktemp)
  {
    echo "# Academy Forge — iteration $ITERATION"
    echo "# $(date -u +%Y-%m-%dT%H:%M:%SZ)"
    echo ""
    echo "## CURRENT STATE (read this, then execute META-PROMPT)"
    echo ""
    echo '```json'
    cat "$STATE_FILE"
    echo '```'
    echo ""
    echo "## META-PROMPT (your complete brief)"
    echo ""
    cat "$PROMPT_FILE"
    echo ""
    echo "## TARGET UNIT FOR THIS ITERATION"
    echo ""
    echo "next_unit = \"$NEXT_UNIT\""
    echo ""
    echo "Do ONE unit. Commit. Exit."
  } > "$ITER_PROMPT"

  echo "" | tee -a "$RUN_LOG"
  echo "=== Iteration $ITERATION — $(date -u +%H:%M:%S) ===" | tee -a "$RUN_LOG"
  echo "next_unit: $NEXT_UNIT" | tee -a "$RUN_LOG"
  echo "prompt:    $ITER_PROMPT ($(wc -l < "$ITER_PROMPT") lines)" | tee -a "$RUN_LOG"

  if [[ "$DRY_RUN" == "true" ]]; then
    echo "[dry-run] would invoke: $CLAUDE_CMD --model $CLAUDE_MODEL < $ITER_PROMPT (timeout ${ITERATION_TIMEOUT}s)" | tee -a "$RUN_LOG"
    rm -f "$ITER_PROMPT"
    sleep 1
    # simulate progress: advance queue_cursor for dry-run sanity
    tmp=$(mktemp)
    jq '.iteration += 1 | .next_unit = "idle"' "$STATE_FILE" > "$tmp" && mv "$tmp" "$STATE_FILE"
    continue
  fi

  # Invoke Claude with per-iteration timeout
  BEFORE_SHA=$(git -C "$REPO_DIR" rev-parse HEAD 2>/dev/null || echo "")
  set +e
  timeout "$ITERATION_TIMEOUT" $CLAUDE_CMD --model "$CLAUDE_MODEL" < "$ITER_PROMPT" >> "$RUN_LOG" 2>&1
  RC=$?
  set -e
  rm -f "$ITER_PROMPT"

  if [[ $RC -ne 0 ]]; then
    echo "[warn] Claude exited $RC (124=timeout). Continuing loop." | tee -a "$RUN_LOG"
  fi

  # Measure progress
  git pull --rebase --autostash origin main --quiet 2>&1 | tee -a "$RUN_LOG" || true
  AFTER_SHA=$(git -C "$REPO_DIR" rev-parse HEAD 2>/dev/null || echo "")

  if [[ "$BEFORE_SHA" != "$AFTER_SHA" ]]; then
    NO_PROGRESS_COUNT=0
    LAST_HEAD_SHA="$AFTER_SHA"
    echo "[progress] commit: $(git log -1 --oneline)" | tee -a "$RUN_LOG"
  else
    NO_PROGRESS_COUNT=$((NO_PROGRESS_COUNT + 1))
    echo "[no-progress] ${NO_PROGRESS_COUNT}/5 iterations without new commit" | tee -a "$RUN_LOG"
  fi

  sleep "$COOLDOWN_SECONDS"
done
