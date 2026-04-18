# skill-page Mode — Authoring Reference

This reference is for the `skill-page` mode of the `codebase-to-course` skill. Read it when producing a single-page teaching/reference doc for a Claude Code skill, slash command, or agent. For the default (multi-module course from a codebase) mode, ignore this file.

---

## Intent

Produce **one self-contained HTML file** that teaches a developer how to use a specific Claude Code skill (or slash command or agent). The page covers: what the skill does, its DSL/operators, its activation patterns, two worked examples at contrasting complexity, and a decision table. The reader finishes knowing *when* to reach for the skill and *how* to invoke it — not just that it exists.

Audience is technical (CLI-literate, code-fluent) but not familiar with this specific skill. No hand-holding on basics; no marketing on the tool.

---

## Input Analysis Phase

### Where to look

Given an input name like `hekat`, `/hekat`, or `mercurio`, check all three locations and merge what you find:

| Kind | Path pattern |
|---|---|
| Slash command | `~/.claude/commands/<name>.md` |
| Skill | `~/.claude/skills/<name>/SKILL.md`, plus sibling `README.md` and `references/*.md` |
| Agent | `~/.claude/agents/<name>.md`, or `~/.claude/agents/<NAME>_AGENT_DEFINITION.md` |

If the user gave an absolute path, use that. If nothing resolves, ask — do **not** invent.

### What to extract (in read order)

1. **Frontmatter** — `name`, `description`, any `model`/`tools`/`allowed-tools` hints.
2. **One-paragraph plain-English description** — usually the `description` field or the opening paragraph. This becomes the masthead tagline; rewrite if it's marketing-heavy.
3. **Core axis** — the skill's primary dimension. Look for headings like "Complexity Levels", "Modes", "Phases", "Stages", "Strategies". This becomes section 3 (Core concept).
4. **Operators / glyphs / syntax** — tables or code fences listing the DSL tokens the skill accepts. Preserve **exact** glyphs (`→`, `||`, `×`, `⊗`, `@`, etc.). Do not paraphrase operator names.
5. **Hotkeys / shortcuts** — commands like `L3!`, `#tag`, `/exit`, toggle flags.
6. **Examples** — grab 2–3 that show the skill in use. Prefer examples that differ in complexity.
7. **Activation pattern** — one-shot vs. persistent, scope, how to exit.

### What to preserve verbatim

- Operator glyphs and their exact names
- Level/mode/phase labels (spelled exactly as the skill uses them)
- Syntax examples (don't "clean them up" — copy them)
- Filenames and paths referenced by the skill

### What to rewrite

- Marketing-heavy description sentences (flatten to plain descriptive prose)
- Aspirational tone ("powerful", "seamless", "intelligent") — strike
- Emoji in section headers — remove or reduce to zero
- Duplicated prose across sections — consolidate

---

## Section-by-Section Output Spec

Ten sections. Each has a terse mono-uppercase eyebrow label (`OVERVIEW`, `DSL REFERENCE`, `HOTKEY SYSTEM`, …) above a plain-English h2 title.

### 1. Masthead

**Contents**: Eyebrow (e.g. `A CLAUDE CODE SKILL`), h1 with the skill's name, one-sentence plain-English tagline, meta row with version + updated date + estimated read time.

**Do**: Keep it under 6 lines. Use the real version if the skill has one.

**Don't**: Add a hero graphic, a gradient, a CTA button, a "Get Started" link, or social proof.

### 2. What it is

**Contents**: 2 short paragraphs. Paragraph 1: what the skill produces and when you'd reach for it. Paragraph 2: the mental model — how does it think about the problem.

**Do**: Write like documentation for a Unix tool. Concrete verbs. Concrete nouns.

**Don't**: Write marketing ("empowers you to…", "unlock the power of…"). Don't claim capabilities the skill doesn't actually have.

### 3. Core concept

**Contents**: The skill's primary axis rendered as a visual table. For level-based skills (HEKAT L1–L7): a horizontal ruler with one cell per level. For mode-based skills (courseware stages): a column for each stage. For strategy-based skills (meta-prompting): a grid of strategy cards.

**Do**: Use color-coded cells (map each item to one of the 5 actor colors; see accent rotation table below). Keep each cell's copy to 1–2 lines.

**Don't**: Turn this into a bulleted list. The whole point is visual scannability.

### 4. Operators / syntax reference

**Contents**: A table with columns `Glyph | Name | Meaning | Example`. One row per operator. If the skill uses @-annotations or other structured syntax, a second sub-table below.

**Do**: Preserve glyphs exactly as the skill spells them. Show a real one-line example for each operator. Render glyphs in monospace (JetBrains Mono).

**Don't**: Paraphrase operator names. Don't merge distinct operators into one row because they "feel similar."

### 5. Hotkey / shortcut system

**Contents**: Table or badge list of shortcuts. E.g., `L3!` = force-level, `#tag` = add meta-tag, `/exit` = exit persistent mode.

**Skip** this section entirely if the skill has no hotkeys. Do **not** fabricate hotkeys to fill the slot.

### 6. Worked examples

**Contents**: Two examples of the **same task** done at contrasting complexity. Each example is a card with: the invocation (code block), a 1–2 line description of what happens, and a one-line footer explaining why this level is appropriate for this task.

**Do**: Pick a task that meaningfully benefits from the higher-complexity version (so the contrast is real). Show the simple version first.

**Don't**: Use two unrelated tasks — the whole pedagogical point is that the *same* task can be done at different levels. Don't hide the invocation syntax behind prose.

### 7. Activation / invocation

**Contents**: Describe persistent mode vs. one-shot. For persistent: how to enter, how to exit, what carries over. For one-shot: how per-turn state works. For agents: how they're dispatched, what context they receive.

**Do**: Use a two-column comparison when both modes exist. Include the exact entry/exit commands.

**Don't**: Describe activation in wall-of-text form. This is a reference section — it should be scannable.

### 8. Decision table

**Contents**: A table mapping task shapes to recommended levels/operators/variants. Minimum two columns: `Task shape` and `Recommended`. Optional third column: `Why`.

**Do**: 5–10 rows. Cover the common cases, including the "too simple — don't use this skill" case.

**Don't**: Write abstract task descriptions ("complex analytical tasks" is useless). Use concrete shapes the user will recognise ("classify a single short email", "orchestrate a 4-agent research pipeline").

### 9. Quick start

**Contents**: 3–5 copy-pasteable commands. The minimum-viable invocation + one realistic usage + the exit/reset if persistent.

**Do**: Make every line runnable as-is. Include comments explaining what each line does.

**Don't**: Use placeholder tokens like `<YOUR_THING_HERE>` without defining them nearby. Don't require prior config steps you haven't shown.

### 10. Footer

**Contents**: Attribution (built with Claude Code), link back to the source file path (`~/.claude/skills/<name>/SKILL.md` or similar), version + last-updated.

**Do**: Keep to one line. No social links, no "made with love", no sitemap.

---

## CSS Inlining Guide

The single-file constraint means everything from `references/styles.css` that this page uses must live in an inline `<style>` block inside `<head>`. You do **not** inline the whole stylesheet — lift only the tokens and the component classes you actually use.

### Critical tokens (always include)

```css
:root {
  /* Backgrounds */
  --color-bg:             #FAF7F2;
  --color-bg-warm:        #F5F0E8;
  --color-bg-code:        #1E1E2E;
  --color-surface:        #FFFFFF;
  --color-surface-warm:   #FDF9F3;

  /* Text */
  --color-text:           #2C2A28;
  --color-text-secondary: #6B6560;
  --color-text-muted:     #9E9790;

  /* Borders */
  --color-border:         #E5DFD6;
  --color-border-light:   #EEEBE5;

  /* Accent (default = first actor, rotate per section in practice) */
  --color-accent:         #D94F30;
  --color-accent-hover:   #C4432A;
  --color-accent-light:   #FDEEE9;
  --color-accent-muted:   #E8836C;

  /* Actor palette (use for accent rotation) */
  --color-actor-1:        #D94F30;   /* vermillion (warm orange) */
  --color-actor-2:        #2A7B9B;   /* teal */
  --color-actor-3:        #7B6DAA;   /* muted plum */
  --color-actor-4:        #D4A843;   /* gold */
  --color-actor-5:        #2D8B55;   /* forest green */

  /* Fonts */
  --font-display: 'Bricolage Grotesque', Georgia, serif;
  --font-body:    'DM Sans', -apple-system, sans-serif;
  --font-mono:    'JetBrains Mono', 'Fira Code', 'Consolas', monospace;

  /* Type scale (lift as many as you use) */
  --text-xs:   0.75rem;
  --text-sm:   0.875rem;
  --text-base: 1rem;
  --text-lg:   1.125rem;
  --text-xl:   1.25rem;
  --text-2xl:  1.5rem;
  --text-4xl:  2.25rem;
  --text-6xl:  3.75rem;

  /* Spacing */
  --space-2: 0.5rem;  --space-3: 0.75rem;  --space-4: 1rem;
  --space-6: 1.5rem;  --space-8: 2rem;     --space-12: 3rem;
  --space-16: 4rem;

  /* Radii */
  --radius-sm: 8px;  --radius-md: 12px;  --radius-lg: 16px;  --radius-full: 9999px;

  /* Shadows — warm-tinted, never black */
  --shadow-sm: 0 1px 2px rgba(44,42,40,0.05);
  --shadow-md: 0 4px 12px rgba(44,42,40,0.08);
  --shadow-lg: 0 8px 24px rgba(44,42,40,0.10);

  /* Motion */
  --ease-out:        cubic-bezier(0.16,1,0.3,1);
  --duration-slow:   500ms;
  --stagger-delay:   120ms;
}
```

### Component classes to lift

From `references/styles.css`, copy the rules for the classes you actually use. Typical set:

- `body`, `html`, `*/::before/::after` reset
- `::-webkit-scrollbar*`
- `pre`, `code` globals (`white-space: pre-wrap; word-break: break-word;`)
- `.nav`, `.nav-inner`, `.nav-title`, `.nav-dots`, `.nav-dot`, `.progress-bar`
- `.animate-in`, `.stagger-children > .animate-in`
- `.callout`, `.callout-*`
- `.badge-list`, `.badge-item`, `.badge-code`, `.badge-desc` (for hotkey tables)
- Any Catppuccin syntax-highlight classes you use in code blocks (`.code-keyword`, `.code-string`, etc.)

**Do not** lift course-specific classes like `.quiz-*`, `.dnd-*`, `.flow-animation`, `.chat-*` — they're useless on a skill page.

### Google Fonts link in `<head>`

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,400;12..96,600;12..96,700;12..96,800&family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet">
```

---

## Accent Rotation Table

Rotate the accent per section so the page has visual rhythm and so operators/levels can be colour-coded consistently with the section they're explained in.

| Position | Token | Hex | Suggested section |
|---|---|---|---|
| 1 | `--color-actor-2` | `#2A7B9B` | Section 3 — Core concept (first "real" content after overview) |
| 2 | `--color-actor-1` | `#D94F30` | Section 4 — Operators / syntax |
| 3 | `--color-actor-4` | `#D4A843` | Section 5 — Hotkeys |
| 4 | `--color-actor-5` | `#2D8B55` | Section 6 — Worked examples |
| 5 | `--color-actor-3` | `#7B6DAA` | Section 7 — Activation / invocation |
| (repeat) | 1 → teal | | Section 8 — Decision table |
| | 2 → orange | | Section 9 — Quick start |

**Cross-reference to levels/operators:** if the skill has N levels or N operators, map them to the same five-colour palette in order (level 1 → actor-1, level 2 → actor-2, …, level 6 → actor-1 again). This gives the reader visual memory: the teal cell in the L1–L7 ruler is the same teal used in the section 4 table cell for its associated operator.

**Per-section accent override** pattern:

```html
<section style="--color-accent: var(--color-actor-2); --color-accent-light: #E4F2F7;">
  ...
</section>
```

If the user passes `--accent <hex>`, pin the whole page to that accent (skip rotation).

---

## JavaScript Patterns to Inline

All JS is embedded in a single `<script>` block before `</body>`. No external libraries.

### 1. IntersectionObserver fade-in (with stagger)

```js
(function () {
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) {
    document.querySelectorAll('.animate-in').forEach(el => el.classList.add('visible'));
    return;
  }

  // Apply stagger index to children of .stagger-children
  document.querySelectorAll('.stagger-children').forEach(parent => {
    [...parent.children].forEach((child, i) => child.style.setProperty('--stagger-index', i));
  });

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        io.unobserve(entry.target);
      }
    });
  }, { rootMargin: '0px 0px -10% 0px', threshold: 0.1 });

  document.querySelectorAll('.animate-in').forEach(el => io.observe(el));
})();
```

### 2. Nav-dot scroll progress bar

```js
(function () {
  const bar = document.getElementById('progress-bar');
  const dots = [...document.querySelectorAll('.nav-dot')];
  const sections = dots.map(d => document.getElementById(d.dataset.target)).filter(Boolean);

  function update() {
    const scrolled = window.scrollY;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    if (bar) bar.style.width = Math.min(100, (scrolled / max) * 100) + '%';

    // Mark active/visited nav dots
    let activeIdx = 0;
    sections.forEach((s, i) => { if (s.getBoundingClientRect().top < window.innerHeight * 0.4) activeIdx = i; });
    dots.forEach((d, i) => {
      d.classList.toggle('active', i === activeIdx);
      d.classList.toggle('visited', i < activeIdx);
    });
  }

  window.addEventListener('scroll', () => requestAnimationFrame(update), { passive: true });
  dots.forEach(d => d.addEventListener('click', () => {
    const target = document.getElementById(d.dataset.target);
    if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }));
  update();
})();
```

### 3. Copy-to-clipboard on code blocks

```js
document.querySelectorAll('pre.copy-me').forEach(pre => {
  const btn = document.createElement('button');
  btn.className = 'copy-btn';
  btn.textContent = 'copy';
  btn.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(pre.innerText);
      btn.textContent = 'copied';
      setTimeout(() => btn.textContent = 'copy', 1500);
    } catch { btn.textContent = 'err'; }
  });
  pre.appendChild(btn);
});
```

### 4. `prefers-reduced-motion` guard

Already handled in pattern 1. Also ensure any `animation:` CSS rules are wrapped:

```css
@media (prefers-reduced-motion: no-preference) {
  .some-class { animation: fadeIn 500ms var(--ease-out) both; }
}
```

---

## Testing Checklist

Before reporting done:

- [ ] File exists at the expected path
- [ ] `wc -c` reports size ≤ 80 KB
- [ ] Opens in browser with no console errors
- [ ] Google Fonts load (check Network tab — Bricolage Grotesque, DM Sans, JetBrains Mono)
- [ ] HTML validates (no unclosed tags; `tidy -e <file>` or W3C validator)
- [ ] Nav-dot bar visible at top, dots scroll smoothly to targets
- [ ] Fade-in motion on scroll (once), not looping
- [ ] Accent rotates across sections (inspect 3+ sections, 3+ distinct actor colors)
- [ ] Responsive at 375 px (no horizontal scroll; stacks cleanly)
- [ ] Responsive at 1440 px (content width caps, no stretched lines)
- [ ] `prefers-reduced-motion: reduce` disables scroll animations (test in DevTools)
- [ ] Page still legible with JS disabled (progressive enhancement — content readable, motion absent)
- [ ] WCAG AA: text contrast ≥ 4.5:1 on `--color-bg`, ≥ 3:1 for large headings
- [ ] All code blocks wrap (no horizontal scrollbar on any `pre`)

---

## Example Invocations

**Natural language (preferred):**

```
make a single-page teaching doc for the /hekat skill, save to ./hekat-page.html
```

```
build a dev docs page for the mercurio agent
```

```
single-page reference for codebase-to-course itself, accent teal
```

**Explicit:**

```
skill: codebase-to-course
intent: skill-page
arg: hekat
--out ./hekat-page.html
```

```
skill: codebase-to-course
intent: skill-page
arg: mercurio
--out ./docs/mercurio.html
--accent #2A7B9B
```

Defaults:

- `--out` → `./<name>-page.html` in cwd
- `--accent` → unset = use rotating per-section accents (recommended)

If the target path already exists, confirm with the user before overwriting.
