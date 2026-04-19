# plugin-page Mode — Authoring Reference

This reference is for the `plugin-page` mode of the `codebase-to-course` skill. Read it when producing a single aggregated HTML page for a Claude Code **plugin** — a bundle of skills, slash commands, and agents under one `plugin.json`. For a single skill, use `skill-page-mode.md` instead.

---

## Intent

Produce **one self-contained HTML file** that presents a whole plugin as a coherent body of work. Unlike `skill-page` (single sub-artifact), this mode explains how the plugin's skills + commands + agents fit together and shows worked examples that span multiple sub-artifacts. The reader finishes understanding both the individual pieces and their intended composition.

Audience is developers who want to adopt or audit the plugin. Technical; CLI-literate. Not familiar with this specific plugin yet.

---

## Input Analysis Phase

### Resolving the plugin path

| Input shape | Resolved path |
|---|---|
| Absolute path to plugin dir | Use as-is |
| Plugin name | Try `~/.claude/plugins/<name>/` first; then `./plugins/<name>/`; then ask |
| Path to `plugin.json` | Use the containing directory |

If neither location resolves, ask the user — do not invent.

### Reading the manifest

Parse `plugin.json` first. Expected fields:

- `name` — plugin slug
- `version` — semver string
- `description` — one-line summary (often marketing-flavoured; rewrite)
- `skills` — array of skill names or relative paths
- `commands` — array of command names or relative paths
- `agents` — array of agent names or relative paths
- `author`, `license`, `homepage` — optional metadata

If `plugin.json` is missing some fields, fall back to directory discovery:

```bash
ls <plugin-root>/skills/          # one dir per skill
ls <plugin-root>/commands/*.md    # one file per command
ls <plugin-root>/agents/*.md      # one file per agent
```

### Iterating sub-artifacts

For each declared skill: read `skills/<name>/SKILL.md`, extract frontmatter (`name`, `description`), the opening paragraph, the core axis (if the skill has one — levels, modes, phases), and 1–2 worked examples.

For each declared command: read `commands/<name>.md`, extract the trigger phrase and the one-sentence purpose. Commands are usually short.

For each declared agent: read `agents/<name>.md`, extract role, dispatch shape (one-shot vs. persistent), inputs, outputs.

### What to preserve verbatim

- Sub-artifact names and slugs (exactly as declared)
- Trigger phrases for commands
- Operator glyphs or DSL tokens used within any sub-artifact
- Version strings

### What to rewrite

- Marketing prose in `description` fields
- Duplicated explanations across skills (consolidate into the plugin overview)
- Inconsistent terminology across sub-artifacts — standardize only in connective tissue, not inside each sub-artifact's card

---

## Section-by-Section Output Spec

Nine sections. Terse mono-uppercase eyebrow labels (`OVERVIEW`, `AT A GLANCE`, `SKILLS`, …) above plain-English h2 titles.

### 1. Masthead

**Contents**: Eyebrow `A CLAUDE CODE PLUGIN`, h1 plugin name, one-sentence plain-English tagline, meta row with `version · updated · <N> skills · <N> commands · <N> agents`.

**Do**: Include real counts. Use the real version string.

**Don't**: Add hero graphic, gradient, or CTA button.

### 2. Plugin overview

**Contents**: 2 short paragraphs. Paragraph 1 — what problem the plugin solves as a bundle. Paragraph 2 — the common thread across its sub-artifacts (e.g., "every piece of `superpowers` enforces the verify-before-claim discipline" or "every piece of `gsd` advances a phase through discuss→plan→execute").

**Do**: Answer "why is this a plugin and not 12 separate things?"

**Don't**: List the skills here — that's section 3.

### 3. At a glance

**Contents**: A single visual index table. Columns: `Kind | Name | One-line purpose | Jump →`. Every sub-artifact gets exactly one row. `Kind` is `SKILL` / `COMMAND` / `AGENT` (mono-uppercase badge). `Jump` is an anchor link to that sub-artifact's card below.

**Do**: Group by kind (all skills first, then commands, then agents) or by topical cluster — pick whichever serves the plugin better.

**Don't**: Invent purposes. If the sub-artifact has no clear purpose, say so plainly.

### 4. Skills

**Contents**: One card per skill. Card structure: eyebrow `SKILL`, skill name, description (rewritten if marketing-heavy), core axis summary (if the skill has one — render as a small inline ruler or tier list), link to source path (`~/.claude/plugins/<plugin>/skills/<skill>/SKILL.md`).

Each card gets its own accent from the expanded rotation (see accent table below). Use `data-accent="N"` on the card and scope CSS variables accordingly.

**Do**: Keep cards dense but scannable. If a skill has many levels/operators, summarize — don't replicate the full table.

**Don't**: Make every card the same length. Some skills are small; show it.

### 5. Commands

**Contents**: A table, not cards — commands are usually one-liners. Columns: `Trigger | Purpose | Notes`. Trigger in mono font. One row per command.

**Do**: Include the exact trigger phrase (including any leading slash).

**Don't**: Pad one-line commands to look like full sections.

### 6. Agents

**Contents**: One card per agent. Card structure: eyebrow `AGENT`, agent name, dispatch pattern (one-shot / persistent / sub-agent), inputs, outputs, one real example of use.

**Do**: Show how the agent is invoked (what the caller passes) and what comes back.

**Don't**: Confuse agents with skills — agents are dispatched, skills are invoked.

### 7. Worked examples

**Contents**: 2–3 examples that cross **multiple** sub-artifacts. Each example is a card with: the scenario in plain English, the sequence of invocations (one mono-font line per step, labelled with which sub-artifact fires), the outcome.

**Do**: Pick examples where the composition matters — where the plugin is more than the sum of its parts. E.g., "run `/gsd-discuss-phase`, which dispatches the planning agent, which invokes the `plan-writer` skill".

**Don't**: Use three examples that each exercise only one sub-artifact — that contradicts the section's purpose.

### 8. Quick start

**Contents**: 3–5 copy-pasteable invocations, covering the plugin's most common entry point plus one invocation per major sub-artifact kind.

**Do**: Comment each line explaining what fires.

**Don't**: Require prior config steps not shown.

### 9. Footer

**Contents**: Attribution, source path (`~/.claude/plugins/<plugin-name>/plugin.json`), license (if declared), version, updated-on.

---

## CSS Inlining Guide

Identical to `skill-page-mode.md`. Lift the critical tokens, the component classes (`body`, `nav`, `nav-dot`, `progress-bar`, `animate-in`, `callout`, `badge-list`), and Catppuccin syntax highlight classes if you use code blocks. Google Fonts link the same three fonts (Bricolage Grotesque, DM Sans, JetBrains Mono).

**Additional classes specific to plugin-page:**

```css
/* At-a-glance table */
.at-a-glance { width: 100%; border-collapse: collapse; }
.at-a-glance th, .at-a-glance td {
  text-align: left; padding: var(--space-3) var(--space-4);
  border-bottom: 1px solid var(--color-border-light);
}
.kind-badge {
  font-family: var(--font-mono); font-size: var(--text-xs);
  letter-spacing: 0.08em; text-transform: uppercase;
  padding: 2px 8px; border-radius: var(--radius-sm);
  background: var(--color-accent-light); color: var(--color-accent);
}

/* Sub-artifact card */
.artifact-card {
  background: var(--color-surface-warm);
  border: 1px solid var(--color-border);
  border-left: 4px solid var(--color-accent);
  border-radius: var(--radius-md);
  padding: var(--space-6);
  box-shadow: var(--shadow-sm);
}
```

Scope per-card accent with `style="--color-accent: var(--color-actor-N);"`.

---

## Accent Rotation — Extended

Plugins often have more than 5 sub-artifacts. Expand the rotation to 7 accents so every card gets a distinct color before repeating. The two extensions are warm variants of existing actor colors; they sit inside the same warm-palette constraint.

| # | Token | Hex | Notes |
|---|---|---|---|
| 1 | `--color-actor-2` | `#2A7B9B` | Teal |
| 2 | `--color-actor-1` | `#D94F30` | Vermillion |
| 3 | `--color-actor-4` | `#D4A843` | Gold |
| 4 | `--color-actor-5` | `#2D8B55` | Forest green |
| 5 | `--color-actor-3` | `#7B6DAA` | Muted plum |
| 6 | `--color-actor-6` | `#B8552E` | Burnt sienna (extension) |
| 7 | `--color-actor-7` | `#3E6E7F` | Deep slate teal (extension) |

Add these two to `:root`:

```css
--color-actor-6: #B8552E;
--color-actor-7: #3E6E7F;
```

**Section-level rotation** (same as `skill-page`): each of the 9 output sections gets an accent, rotating through the 7-color palette in order.

**Card-level rotation** (new): within the Skills section, each skill card gets its own accent, starting fresh from actor-1. Same for Agents. This gives the reader a visual handle on each sub-artifact that stays consistent if they scroll back.

If the user passes `--accent <hex>`, pin every section to that accent but still rotate card-level accents (otherwise the skills/agents become an undifferentiated wall).

---

## JavaScript Patterns to Inline

Identical to `skill-page-mode.md`:

1. IntersectionObserver fade-in with stagger + `prefers-reduced-motion` guard
2. Nav-dot progress bar with scroll sync
3. Copy-to-clipboard on `pre.copy-me` elements

**Additional pattern for plugin-page — anchor-link smooth scroll:**

The "At a glance" table's Jump column uses anchor links. Ensure smooth scroll even when users click rapidly:

```js
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', (e) => {
    const id = a.getAttribute('href').slice(1);
    const target = document.getElementById(id);
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    history.replaceState(null, '', '#' + id);
  });
});
```

---

## Testing Checklist

- [ ] File exists at expected path
- [ ] `wc -c` reports size ≤ 80 KB
- [ ] Opens in browser with no console errors
- [ ] Google Fonts load (all three families in Network tab)
- [ ] HTML validates (no unclosed tags)
- [ ] Nav-dot bar visible, dots scroll smoothly to sections
- [ ] Fade-in motion on scroll (once), not looping
- [ ] Section accent rotates (inspect 3+ sections, 3+ distinct actor colors)
- [ ] Each skill card has a distinct accent within the Skills section
- [ ] At-a-glance table lists **every** sub-artifact declared in `plugin.json`
- [ ] Every sub-artifact name in `plugin.json` appears somewhere in the rendered page (grep each)
- [ ] Anchor links in the At-a-glance table resolve to real section IDs
- [ ] Responsive at 375 px (table wraps or stacks cleanly)
- [ ] `prefers-reduced-motion: reduce` disables scroll animations
- [ ] WCAG AA contrast on all accent-on-cream combos

---

## Example Invocations

**Natural language (preferred):**

```
make a plugin page for the superpowers plugin, save to ./superpowers-page.html
```

```
turn the gsd plugin into a page
```

```
make a plugin page for ~/.claude/plugins/my-plugin, accent teal
```

**Explicit:**

```
skill: codebase-to-course
intent: plugin-page
arg: superpowers
--out ./superpowers-page.html
```

```
skill: codebase-to-course
intent: plugin-page
arg: /Users/manu/.claude/plugins/custom-plugin
--out ./docs/custom-plugin.html
--accent #D94F30
```

Defaults:

- `--out` → `./<plugin-name>-page.html` in cwd
- `--accent` → unset = rotating per-section + per-card accents (recommended)

If the target path exists, confirm with the user before overwriting.
