# repo-explainer Mode — Authoring Reference

This reference is for the `repo-explainer` mode of the `codebase-to-course` skill. Read it when producing a single-page explainer for a GitHub or local repo — lighter than a full course, heavier than a skill-page. For a multi-module interactive course, use the default mode. For a single Claude Code skill, use `skill-page`.

---

## Intent

Produce **one self-contained HTML file** that explains a repo to a reader who wants to understand it quickly. Answers four questions: what does this repo do, how is it built, how do I use it, what should I watch out for. If the user provides `focus_areas`, a fifth question is added: here's deep context on the subsystems you care about.

Audience is developers evaluating or onboarding onto a repo. Technical; familiar with Git, package managers, the relevant language. Not familiar with this specific repo.

The size cap is firm: **≤ 80 KB**. Large repos generate a lot of material — summarize aggressively rather than exceed the cap.

---

## Input Analysis Phase

### Input shapes

| Shape | Handling |
|---|---|
| GitHub URL (`https://github.com/owner/repo`) | Shallow clone to `/tmp/<repo-name>` |
| GitHub URL with `.git` suffix | Same as above |
| Local absolute path to a repo | Use directly, no clone |
| Local relative path | Resolve against cwd, no clone |

### Clone handling

For GitHub URLs:

```bash
REPO_URL="$1"
REPO_NAME=$(basename "$REPO_URL" .git)
CLONE_DIR="/tmp/$REPO_NAME"

# If already cloned, reuse (faster re-runs)
if [ -d "$CLONE_DIR/.git" ]; then
  git -C "$CLONE_DIR" fetch --depth=1 2>/dev/null
else
  git clone --depth=1 "$REPO_URL" "$CLONE_DIR"
fi
```

Report the clone path in the footer (`Cloned to /tmp/<repo-name>`). If the clone fails (private repo, network error), stop and tell the user — do not proceed with fabricated content.

### Read order

Read in this order, stopping when you have enough to write:

1. **`README.md`** — the primary narrative source.
2. **Manifest** — one of: `package.json`, `pyproject.toml` / `setup.py`, `go.mod`, `Cargo.toml`, `Gemfile`, `pom.xml`. Gives you the language, dependencies, entry point.
3. **Entry point** — the main file the manifest points to (e.g., `src/index.ts`, `main.py`, `cmd/main.go`). Skim for the top-level architecture.
4. **`LICENSE`** — extract the license name for the "Who made it" section.
5. **`.github/workflows/*.yml`** — optional; tells you about CI, release process.
6. **`CHANGELOG.md`** or recent `git log --oneline -20` — tells you about recent activity and version.
7. **Directory structure** — `ls -1` the root; lets you identify the "cast of characters".

Do **not** read every file. Skim, summarize, move on. For large repos, one pass of README + manifest + entry point is enough for a good explainer.

### Focus-area parsing

If `focus_areas` is provided (comma-separated list), for each area:

1. Search the repo for files/directories whose name matches the focus area (case-insensitive substring).
2. Read the most relevant 1–3 files (usually one dir's entry point + any README in that dir).
3. Extract: what it does, how it's structured, how it connects to the rest of the repo.

Focus areas are the user's explicit interest. Give them depth; treat the rest of the architecture as summary.

### What to preserve verbatim

- Repo name + owner (exactly as on GitHub)
- License name (MIT, Apache-2.0, GPL-3.0, etc.)
- Version string from the manifest or latest tag
- Entry point file paths
- Focus area names (use the user's spelling in section headings)

### What to rewrite

- README marketing prose ("The blazing fast, developer-friendly…") — flatten to plain description
- Stock "Features" bullet lists — consolidate into the architecture overview
- Installation instructions — boil down to the minimum viable invocation

---

## Section-by-Section Output Spec

### 1. Masthead

**Contents**: Eyebrow `REPO EXPLAINER`, h1 repo name (or `owner/repo` if it disambiguates), one-sentence plain-English tagline derived from README's opening paragraph, meta row: `<language> · <license> · <version or latest commit date>`.

**Do**: Use the README's opening sentence as source material but rewrite if marketing-heavy.

**Don't**: Include star counts unless the user supplied them. Don't add a "Clone now!" CTA.

### 2. What it does

**Contents**: 2 short paragraphs. Paragraph 1 — the problem the repo solves in plain English. Paragraph 2 — who uses it (real user archetypes, not "developers who want X").

### 3. Who made it + context

**Contents**: Single card or row with: author/org, license (with one-line license summary for non-standard licenses), project age (from first commit or package metadata), last-commit date. If the user supplied star count, repo age, or download stats, include them; otherwise skip.

**Don't**: Fabricate popularity metrics. Don't invent an "Awards" field.

### 4. Architecture overview

**Contents**: The cast of characters — the major modules/services/components and how they fit. Render as a diagram (ASCII-art boxes in a `<pre>` works; or an SVG if you can keep it under budget), a directory tree, or a table. Pick whichever fits the repo.

**Do**: Name specific files and directories. `src/core/` isn't self-explanatory; "the runtime engine, in `src/core/`" is.

**Don't**: Wall-of-text the architecture. This should be visually scannable in 10 seconds.

### 5. Focus-area deep-dives (conditional)

**Contents**: **If `focus_areas` provided**, one section per area. Each area gets its own accent color from the actor rotation. For each area: eyebrow `FOCUS: <AREA>`, h3 with plain-English framing, 2–3 paragraphs of depth, one code block showing the key call site or definition, one-sentence pointer to the rest of the codebase showing where this area is invoked from.

**If NOT provided**, skip this section entirely. Don't generate a "here are some interesting subsystems" section to fill the gap — rely on the architecture overview.

**Do**: Tie each focus area to the main architecture. "This area sits between X and Y and is called on every request."

**Don't**: Use every focus area as an excuse for a feature tour. Only explain what's there; don't speculate about future direction.

### 6. How to use it

**Contents**: Install (one line if possible — `npm install <name>` or `pip install <name>`), minimum-viable invocation (copy-pasteable), one realistic example. Include language-appropriate syntax highlighting.

### 7. Gotchas

**Contents**: Real gotchas visible in the repo. Required env vars (from `.env.example`), platform caveats (from README), known issues from `CHANGELOG` or recent issues (if user surfaced any). Phrase each as "If you do X, you'll hit Y."

**Don't**: Invent gotchas. If you can't find real ones, keep the section short or skip it.

### 8. Footer

**Contents**: Source path (`Cloned to /tmp/<repo-name>` for URL input, or the local path), license, last-updated date of the explainer itself, attribution (`Generated with codebase-to-course · repo-explainer mode`).

---

## CSS Inlining Guide

Identical to `skill-page-mode.md`. Lift the critical tokens (backgrounds, text, borders, accent, actor palette, fonts, type scale, spacing, radii, shadows, motion) and component classes (`body`, `nav`, `nav-dot`, `progress-bar`, `animate-in`, `callout`, `badge-list`). Google Fonts link the same three families.

**Additional classes specific to repo-explainer:**

```css
/* Focus-area section with dedicated accent stripe */
.focus-area {
  border-left: 4px solid var(--color-accent);
  padding-left: var(--space-6);
  margin-block: var(--space-8);
}

/* Directory tree / architecture diagram in a pre */
.arch-tree {
  font-family: var(--font-mono);
  font-size: var(--text-sm);
  background: var(--color-surface-warm);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: var(--space-6);
  white-space: pre-wrap;
  word-break: break-word;
  line-height: 1.5;
}

/* Gotchas list */
.gotcha-item {
  border-left: 3px solid var(--color-actor-4); /* gold — attention */
  padding: var(--space-3) var(--space-4);
  background: var(--color-surface-warm);
  margin-block: var(--space-3);
  border-radius: 0 var(--radius-sm) var(--radius-sm) 0;
}
```

---

## Accent Rotation

Sections 1–4, 6, 8 use the standard 5-color rotation (actor-2, actor-1, actor-4, actor-5, actor-3, repeat).

**Focus areas get dedicated accents**, one per area, in order. If the user supplies 3 focus areas, they map to actor-1, actor-2, actor-3 respectively. This gives the reader a visual handle — the "auth" section is always teal, the "caching" section is always vermillion, etc.

If the user passes `--accent <hex>`, pin every non-focus section to that accent, but still rotate focus-area accents (otherwise focus-area sections become indistinguishable).

---

## JavaScript Patterns to Inline

Identical to `skill-page-mode.md`:

1. IntersectionObserver fade-in with stagger + `prefers-reduced-motion` guard.
2. Nav-dot progress bar with scroll sync.
3. Copy-to-clipboard on `pre.copy-me` code blocks.
4. Optional smooth-scroll anchor handler for focus-area cross-links.

---

## Size Management (80 KB Cap)

Large repos will blow past 80 KB if you try to be complete. Strategies, in order of preference:

1. **Summarize secondary subsystems to one-liners.** If the architecture overview lists 12 components, give each a one-line role and stop. Don't explain every one in depth.
2. **Depth only where asked.** Focus areas get paragraphs; everything else gets bullets.
3. **Omit sections that would require speculation.** If the repo has no CHANGELOG, no `.env.example`, and no visible env var handling, skip the Gotchas section entirely rather than invent content to fill it.
4. **Collapse the architecture diagram.** If a directory tree is too big, show only the top two levels.
5. **Keep code blocks short.** One code block per focus area, 10–20 lines max. If a function is longer, paraphrase in prose and link to the line range.
6. **Trim the README's marketing.** If the README has 15 paragraphs of marketing, your rewrite is 2 paragraphs.

If you've applied all of the above and still can't fit, flag it in the report — don't silently ship an oversized file.

---

## Anti-Slop Rules

Same list as `skill-page`: no purple gradients, no glassmorphism, no SaaS hero copy, no emoji-laden headers, no stock illustrations, no "Get Started" CTAs, no infinite animations.

**Additional for repo-explainer:**

- Do not fabricate star counts, download counts, or popularity metrics.
- Do not claim the repo does things not shown in the code.
- Do not invent "Common questions" or FAQ entries — only include real issues visible in the repo.
- Do not preserve marketing tone from the README — flatten to plain description.
- Do not use "blazing fast", "developer-friendly", "revolutionary", "seamless" or similar boosterism.

---

## Testing Checklist

- [ ] File exists at expected path
- [ ] `wc -c` reports size ≤ 80 KB
- [ ] Opens in browser with no console errors
- [ ] Google Fonts load (Bricolage Grotesque, DM Sans, JetBrains Mono)
- [ ] HTML validates (no unclosed tags)
- [ ] Nav-dot bar visible, dots scroll smoothly
- [ ] Fade-in on scroll (once, not looping)
- [ ] Section accent rotates (≥ 3 distinct actor colors)
- [ ] If `focus_areas` provided: every focus area appears as a distinct section (grep each name)
- [ ] Focus-area accents are distinct (each one gets a different actor color)
- [ ] If input was a GitHub URL: clone path appears in footer
- [ ] License shown in masthead meta row + footer
- [ ] No fabricated metrics (manual eyeball)
- [ ] Anti-slop greps clean (no purple gradients, glass, SaaS copy, stock art)
- [ ] Responsive at 375 px (no horizontal scroll)
- [ ] Responsive at 1440 px (content width caps cleanly)
- [ ] `prefers-reduced-motion: reduce` disables scroll animations

---

## Example Invocations

**Natural language (preferred):**

```
make a github repo explainer page for https://github.com/anthropics/claude-code,
save to ./claude-code-explainer.html
```

```
explain this repo in a page: ./my-local-repo, with focus areas: auth, caching, tool-use
```

```
repo explainer for https://github.com/fastapi/fastapi
with focus areas: dependency injection, pydantic integration
```

**Explicit:**

```
skill: codebase-to-course
intent: repo-explainer
arg: https://github.com/owner/repo
--out ./owner-repo-explainer.html
--focus-areas auth,caching,tool-use
```

```
skill: codebase-to-course
intent: repo-explainer
arg: ./my-local-repo
--accent #2A7B9B
```

Defaults:

- `--out` → `./<repo-name>-explainer.html` in cwd
- `--focus-areas` → unset (skip focus-area section)
- `--accent` → unset = use rotating per-section accents

If the target path exists, confirm with the user before overwriting.
