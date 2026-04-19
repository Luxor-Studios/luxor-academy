# batch-skill-page Mode — Authoring Reference

This reference is for the `batch-skill-page` mode of the `codebase-to-course` skill. Read it when generating many per-skill pages in one invocation. For a single skill, use `skill-page-mode.md`. For an aggregated page covering a whole plugin, use `plugin-page-mode.md`.

---

## Intent

Given a list of N skill names, produce **N self-contained HTML files** (one per skill, each identical in shape to `skill-page` output) plus a single `index.html` navigator at the output directory root. The navigator lets the reader browse all generated pages at a glance. This mode exists because generating N pages serially wastes time and context; parallelizing via sub-agents is dramatically faster.

Each per-skill page obeys the full `skill-page` spec (10 sections, ≤ 80 KB, inlined CSS/JS, rotating accents). The navigator obeys a smaller spec documented below.

---

## Input Parsing

### Accepted shapes

| Shape | Example |
|---|---|
| Comma-separated inline | `hekat, mercurio, codebase-to-course` |
| Newline-separated inline | lines in the prompt body, one name per line |
| File path | `./skills.txt` — one name per line, `#` comments allowed |

### Normalization

For each raw name:

1. Strip leading slash if present (`/hekat` → `hekat`).
2. Lowercase + trim whitespace.
3. Dedupe (keep first occurrence).
4. For each normalized name, resolve the source path the same way `skill-page` does — check `~/.claude/commands/<name>.md`, `~/.claude/skills/<name>/SKILL.md`, `~/.claude/agents/<name>.md`.
5. If a name cannot be resolved, flag it for the failure-handling path (don't abort the whole batch).

---

## Output Directory Structure

Default output directory: `./skill-pages/`. Inside it:

```
skill-pages/
├── index.html                 ← navigator (main artifact, ≤ 40 KB)
├── hekat.html                 ← one per resolved skill
├── mercurio.html
├── codebase-to-course.html
└── …
```

No shared CSS file. Each per-skill HTML inlines its own tokens and components (same constraint as standalone `skill-page`). Trade-off: duplicated bytes across files. Benefit: every file is self-contained and portable (e.g., move one out of the directory, it still works).

If a target file already exists, confirm with the user before overwriting the whole batch.

---

## Parallel Dispatch Strategy

**Use the `superpowers:dispatching-parallel-agents` skill.** This mode is its canonical use case.

### Concurrency cap

Cap at **5 concurrent sub-agents**. The limit is empirical — higher concurrency runs into API rate limits and degrades tail latency. If N > 5, batch in waves of 5 (wait for a wave to finish before launching the next).

### Per-agent brief

Each dispatched sub-agent receives a minimal brief:

```
Task: Generate a single-page HTML teaching/reference doc for the `<skill-name>` skill.

Source path: <resolved-path-from-input-analysis>
Output path: <out-dir>/<skill-name>.html

Follow the full spec in references/skill-page-mode.md. This is the skill-page mode of the
codebase-to-course skill — single file, ≤ 80 KB, inline CSS/JS, rotating per-section accents,
warm cream palette, Bricolage Grotesque + DM Sans + JetBrains Mono, anti-slop rules enforced.

Produce ONLY the HTML file. Do not write any ancillary files. Report back the final file path
and size when done.
```

The agent does not receive: SKILL.md, other skills' briefs, the full batch list, or the navigator spec. Keeping the brief small keeps context focused.

### What NOT to dispatch

The `index.html` navigator is NOT built by a sub-agent. Generate it in the main context after all sub-agents return, when you have the list of successful pages + their taglines.

---

## Navigator `index.html` Design

The navigator uses the **plugin-page aesthetic** — it's a simpler sibling of `plugin-page`.

### Sections

1. **Masthead** — eyebrow `SKILL PAGE INDEX`, h1 (e.g. "Skill Reference"), one-line meta row with count + date.
2. **Skill grid** — responsive grid of cards, one per generated page. Each card: skill name, tagline (lifted from the generated page's masthead), link (`href="./<name>.html"`), per-card accent from rotation.
3. **Skipped (conditional)** — appears only if any skills failed to resolve/generate. Lists each skipped name with the reason.
4. **Footer** — attribution, generation date, generator name.

### Style

Inherit the full warm palette + typography. Inline CSS. Cards use `.artifact-card` pattern from the plugin-page mode (border-left accent stripe, subtle warm shadow). Each card gets an accent cycling through the 5-color actor palette.

### Size target

≤ 40 KB. The navigator is lighter than a full skill page because it doesn't need the 10-section spec or operator tables.

### Accent rotation on cards

Rotate through actor-1 … actor-5 in order across cards. If there are more than 5 cards, repeat from actor-1. This is deterministic — don't randomize.

---

## Failure Handling (per-skill)

A sub-agent can fail for several reasons:

| Failure | Handling |
|---|---|
| Source path unresolved (skill not found) | Record in "Skipped" list with reason "source not found". Do not dispatch an agent. |
| Agent returns error | Record in "Skipped" list with the error message (truncated to 200 chars). Move on. |
| Agent writes an oversized file (> 80 KB) | Record as "oversized" in Skipped. Keep the file but flag it so the user knows to trim. |
| Agent writes but file fails quality gates (anti-slop grep hits) | Record as "failed quality gates" with the specific gate. Keep the file; flag for user review. |

**Do not block the entire batch on one failure.** The navigator lists successes and skipped entries; the user decides what to do with the skipped list.

---

## Quality Gates

### Per-file gates (applied to each generated `.html`)

Same as `skill-page`:
- File exists and size ≤ 80 KB
- Fonts loaded (Bricolage Grotesque, DM Sans, JetBrains Mono)
- Anti-slop greps clean (no purple gradients, glassmorphism, SaaS hero copy, stock illustrations)
- ≥ 3 distinct actor colors present
- IntersectionObserver + prefers-reduced-motion + nav-dot infrastructure

### Batch-level gates

- Output directory exists
- `index.html` exists at directory root
- Every successful generation appears as a card in `index.html` (grep each name)
- Every card link resolves (`href="./<name>.html"` → file exists)
- Skipped section present iff any failures occurred
- `index.html` size ≤ 40 KB

### Verification commands

```bash
OUT_DIR="./skill-pages"

# Count generated files
ls -1 "$OUT_DIR"/*.html | wc -l

# Navigator exists and is under 40 KB
[ -f "$OUT_DIR/index.html" ] && ls -lh "$OUT_DIR/index.html"

# Every per-skill page is under 80 KB
find "$OUT_DIR" -name "*.html" ! -name "index.html" -size +80k

# Every expected name appears in the navigator
for name in hekat mercurio codebase-to-course; do
  grep -q "$name" "$OUT_DIR/index.html" || echo "MISSING: $name"
done
```

---

## Reporting

After the batch completes, report in the main context:

- Total requested: N
- Successful: M (with file paths + sizes)
- Skipped: K (with names + reasons)
- Navigator path + size
- Any quality-gate flags

Keep the report tight — the user wants to know what landed and what didn't.

---

## Example Invocations

**Natural language (preferred):**

```
batch skill pages for hekat, mercurio, codebase-to-course — save to ./docs/skills/
```

```
make skill pages for all the skills listed in ./skill-list.txt
```

```
generate pages for these skills:
  hekat
  mercurio
  brainstorming
output to ./docs/
```

**Explicit:**

```
skill: codebase-to-course
intent: batch-skill-page
arg: hekat,mercurio,codebase-to-course
--out-dir ./docs/skills
--concurrency 5
```

```
skill: codebase-to-course
intent: batch-skill-page
arg: ./skill-list.txt
--out-dir ./skill-pages
```

Defaults:

- `--out-dir` → `./skill-pages/` in cwd
- `--concurrency` → 5 (max: 5)

If any target file exists, confirm with the user before overwriting the whole batch.
