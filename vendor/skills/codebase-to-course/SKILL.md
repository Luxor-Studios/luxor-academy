---
name: codebase-to-course
description: "Turn any codebase into a beautiful, interactive single-page HTML course that teaches how the code works to non-technical people. Use this skill whenever someone wants to create an interactive course, tutorial, or educational walkthrough from a codebase or project. Also trigger when users mention 'turn this into a course,' 'explain this codebase interactively,' 'teach this code,' 'interactive tutorial from code,' 'codebase walkthrough,' 'learn from this codebase,' or 'make a course from this project.' Also triggers on 'make a plugin page,' 'batch skill pages,' 'make a course with these modules,' and 'make a github repo explainer page.' This skill produces a stunning, self-contained HTML file with scroll-based navigation, animated visualizations, embedded quizzes, and code-with-plain-English side-by-side translations."
---

# Codebase-to-Course

Transform any codebase into a stunning, interactive course. The output is a **directory** containing a pre-built `styles.css`, `main.js`, per-module HTML files, and an assembled `index.html` — open it directly in the browser with no setup required (only external dependency: Google Fonts CDN). The course teaches how the code works through scroll-based modules, animated visualizations, embedded quizzes, and plain-English translations of code.

## First-Run Welcome

When the skill is first triggered and the user hasn't specified a codebase yet, introduce yourself and explain what you do:

> **I can turn any codebase into an interactive course that teaches how it works — no coding knowledge required.**
>
> Just point me at a project:
> - **A local folder** — e.g., "turn ./my-project into a course"
> - **A GitHub link** — e.g., "make a course from https://github.com/user/repo"
> - **The current project** — if you're already in a codebase, just say "turn this into a course"
>
> I'll read through the code, figure out how everything fits together, and generate a beautiful single-page HTML course with animated diagrams, plain-English code explanations, and interactive quizzes. The whole thing runs in your browser — no setup needed.

If the user provides a GitHub link, clone the repo first (`git clone <url> /tmp/<repo-name>`) before starting the analysis. If they say "this codebase" or similar, use the current working directory.

## Who This Is For

The target learner is a **"vibe coder"** — someone who builds software by instructing AI coding tools in natural language, without a traditional CS education. They may have built this project themselves (without looking at the code), or they may have found an interesting open-source project on GitHub and want to understand how it's built. Either way, they don't yet understand what's happening under the hood.

**Assume zero technical background.** Every CS concept — from variables to APIs to databases — needs to be explained in plain language as if the learner has never encountered it. No jargon without definition. No "as you probably know." The tone should be like a smart friend explaining things, not a professor lecturing.

**Their goals are practical, not academic:**
- Have enough technical knowledge to effectively **steer AI coding tools** — make better architectural and tech stack decisions
- **Detect when AI is wrong** — spot hallucinations, catch bad patterns, know when something smells off
- **Intervene when AI gets stuck** — break out of bug loops, debug issues, unblock themselves
- Build more advanced software with **production-level quality and reliability**
- Be **technically fluent** enough to discuss decisions with engineers confidently
- **Acquire the vocabulary of software** — learn the precise technical terms so they can describe requirements clearly and unambiguously to AI coding agents (e.g., knowing to say "namespace package" instead of "shared folder thing")

**They are NOT trying to become software engineers.** They want coding as a superpower that amplifies what they're already good at. They don't need to write code from scratch — they need to *read* it, *understand* it, and *direct* it.

## Why This Approach Works

This skill inverts traditional CS education. The old model is: memorize concepts for years → eventually build something → finally see the point (most people quit before step 3). This model is: **build something first → experience it working → now understand how it works.**

The learner already has context that traditional students don't — they've *used* the app, they know what it does, they may have even described its features in natural language. The course meets them where they are: "You know that button you click? Here's what happens under the hood when you click it."

Every module answers **"why should I care?"** before "how does it work?" The answer to "why should I care?" is always practical: *because this knowledge helps you steer AI better, debug faster, or make smarter architectural decisions.*

The directory-based output is intentional: separating CSS/JS from content means AI never regenerates boilerplate, each module is written independently (keeping output size small and quality high), and the assembled `index.html` works offline with zero setup.

---

## The Process

### Phase 1: Codebase Analysis

Before writing course HTML, deeply understand the codebase. Read all the key files, trace the data flows, identify the "cast of characters" (main components/modules), and map how they communicate. Thoroughness here pays off — the more you understand, the better the course.

**What to extract:**
- The main "actors" (components, services, modules) and their responsibilities
- The primary user journey (what happens when someone uses the app end-to-end)
- Key APIs, data flows, and communication patterns
- Clever engineering patterns (caching, lazy loading, error handling, etc.)
- Real bugs or gotchas (if visible in git history or comments)
- The tech stack and why each piece was chosen

**Figure out what the app does yourself** by reading the README, the main entry points, and the UI code. Don't ask the user to explain the product — they may not be familiar with it either. The course should open by explaining what the app does in plain language (a brief "here's what this thing does and why it's interesting") before diving into how it works. The first module should start with a concrete user action — "imagine you paste a YouTube URL and click Analyze — here's what happens under the hood."

### Phase 2: Curriculum Design

Structure the course as **4-6 modules**. Most courses need 4-6. Only go to 7-8 if the codebase genuinely has that many distinct concepts worth teaching. Fewer, better modules beat more, thinner ones.

The arc always starts from what the learner already knows (the user-facing behavior) and moves toward what they don't (the code underneath). Think of it as zooming in: start wide with the experience, then progressively peel back layers.

| Module Position | Purpose | Why it matters for a vibe coder |
|---|---|---|
| 1 | "Here's what this app does — and what happens when you use it" | Start with the product (what it does, why it's interesting), then trace a core user action into the code. Grounds everything in something concrete. |
| 2 | Meet the actors | Know which components exist so you can tell AI "put this logic in X, not Y" |
| 3 | How the pieces talk | Understand data flow so you can debug "it's not showing up" problems |
| 4 | The outside world (APIs, databases) | Know what's external so you can evaluate costs, rate limits, and failure modes |
| 5 | The clever tricks | Learn patterns (caching, chunking, error handling) so you can request them from AI |
| 6 | When things break | Build debugging intuition so you can escape AI bug loops |
| 7 | The big picture | See the full architecture so you can make better decisions about what to build next |

This is a **menu, not a checklist**. Pick the modules that serve the codebase — a simple CLI tool needs 4, not 7. Adapt the arc to the codebase's complexity.

**The key principle:** Every module should connect back to a practical skill — steering AI, debugging, making decisions. If a module doesn't help the learner DO something better, cut it or reframe it until it does.

**Each module should contain:**
- 3-6 screens (sub-sections that flow within the module)
- At least one code-with-English translation
- At least one interactive element (quiz, visualization, or animation)
- One or two "aha!" callout boxes with universal CS insights
- A metaphor that grounds the technical concept in everyday life — but NEVER reuse the same metaphor across modules, and NEVER default to the "restaurant" metaphor (it's overused). Pick metaphors that organically fit the specific concept. The best metaphors feel *inevitable* for the concept, not forced.

**Mandatory interactive elements (every course must include ALL of these):**
- **Group Chat Animation** — at least one across the course. These are the iMessage/WeChat-style conversations between components. They're one of the most engaging elements and must always appear, even if you have to creatively frame a module's concept as a conversation between actors.
- **Message Flow / Data Flow Animation** — at least one across the course. The step-by-step packet animation between actors. If the codebase has any kind of request/response, data pipeline, or multi-step process, animate it. Every codebase has data flowing somewhere — find it.
- **Code ↔ English Translation Blocks** — at least one per module (already required above, but reiterating: this is non-negotiable).
- **Quizzes** — at least one per module (multiple-choice, scenario, drag-and-drop, or spot-the-bug — any quiz type counts).
- **Glossary Tooltips** — on every technical term, first use per module.

These five element types are the backbone of every course. Other interactive elements (architecture diagrams, layer toggles, pattern cards, etc.) are optional and should be added when they fit. But the five above must ALWAYS be present — no exceptions.

**Do NOT present the curriculum for approval — just build it.** The user wants a course, not a planning document. Design the curriculum internally, then go straight to building. If they want changes, they'll tell you after seeing the result.

**After designing the curriculum, decide which build path to use:**

- **Simple codebase** (single-purpose CLI, small web app, library, one clear entry point, 5 or fewer modules) → go directly to Phase 3 Sequential.
- **Complex codebase** (full-stack app, multiple services, content-heavy site, monorepo, or 6+ modules) → go to Phase 2.5 first, then Phase 3 Parallel.

### Phase 2.5: Module Briefs (complex codebases only)

For complex codebases, write a brief for each module before writing any HTML. This is the critical step that enables parallel writing — each brief gives an agent everything it needs without re-reading the codebase.

Read `references/module-brief-template.md` for the template structure. Read `references/content-philosophy.md` for the content rules that should guide brief writing.

**For each module, write a brief to `course-name/briefs/0N-slug.md` containing:**
- Teaching arc (metaphor, opening hook, key insight)
- Pre-extracted code snippets (copy-pasted from the codebase with file paths and line numbers)
- Interactive elements checklist with enough detail to build them
- Which sections of which reference files the writing agent needs
- What the previous and next modules cover (for transitions)

The code snippets are the critical token-saving step. By pre-extracting them into the brief, writing agents never need to read the codebase at all.

### Phase 3: Build the Course

The course output is a **directory**, not a single file. All CSS and JS are pre-built reference files — never regenerate them. Your job is to write only the HTML content.

**Output structure:**
```
course-name/
  styles.css       ← copied verbatim from references/styles.css
  main.js          ← copied verbatim from references/main.js
  _base.html       ← customized shell (title, accent color, nav dots)
  _footer.html     ← copied verbatim from references/_footer.html
  build.sh         ← copied verbatim from references/build.sh
  briefs/          ← module briefs (complex codebases only, can delete after build)
  modules/
    01-intro.html
    02-actors.html
    ...
  index.html       ← assembled by build.sh (do not write manually)
```

**Step 1 (both paths): Setup** — Create the course directory. Copy these four files verbatim using Read + Write (do not regenerate their contents):
- `references/styles.css` → `course-name/styles.css`
- `references/main.js` → `course-name/main.js`
- `references/_footer.html` → `course-name/_footer.html`
- `references/build.sh` → `course-name/build.sh`

**Step 2 (both paths): Customize `_base.html`** — Read `references/_base.html`, then write it to `course-name/_base.html` with exactly three substitutions:
- Both instances of `COURSE_TITLE` → the actual course title
- The four `ACCENT_*` placeholders → the chosen accent color values (pick one palette from the comments in `_base.html`)
- `NAV_DOTS` → one `<button class="nav-dot" ...>` per module

**Step 3: Write modules** — This is where the paths diverge.

#### Sequential path (simple codebases)

Read `references/content-philosophy.md` and `references/gotchas.md`. Then write modules one at a time. For each module, write `course-name/modules/0N-slug.html` containing only the `<section class="module" id="module-N">` block and its contents. Do not include `<html>`, `<head>`, `<body>`, `<style>`, or `<script>` tags.

Read `references/interactive-elements.md` for HTML patterns for each interactive element type. Read `references/design-system.md` for visual conventions.

#### Parallel path (complex codebases)

Dispatch modules to subagents in batches of up to 3. Each agent receives:
- Its module brief (from `course-name/briefs/`)
- `references/content-philosophy.md` and `references/gotchas.md`
- Only the sections of `references/interactive-elements.md` and `references/design-system.md` listed in the brief

Each agent writes its module file(s) to `course-name/modules/`. Short modules (3 screens, one quiz) can be paired — two briefs given to one agent.

**What agents do NOT receive:** the full codebase (snippets are in the brief), SKILL.md, other modules' briefs, or unneeded reference file sections.

After all agents finish, do a quick consistency check in the main context: nav dots match modules, transitions between modules are coherent, no obvious tone shifts.

**Step 4 (both paths): Assemble** — Run `build.sh` from the course directory:
```bash
cd course-name && bash build.sh
```
This produces `index.html`. Open it in the browser.

**Critical rules:**
- **Never regenerate** `styles.css` or `main.js` — always copy from references
- Module files contain only `<section>` content — no boilerplate
- Use CSS `scroll-snap-type: y proximity` (NOT `mandatory`)
- Use `min-height: 100dvh` with `100vh` fallback on `.module`
- Interactive element JS is in `main.js`; wire up via `data-*` attributes and CSS class names as shown in `references/interactive-elements.md`
- Chat containers need `id` attributes; flow animations need `data-steps='[...]'` JSON on `.flow-animation`

### Phase 4: Review and Open

After running `build.sh`, open `index.html` in the browser. Walk the user through what was built and ask for feedback on content, design, and interactivity.

---

## Design Identity

The visual design should feel like a **beautiful developer notebook** — warm, inviting, and distinctive. Read `references/design-system.md` for the full token system, but here are the non-negotiable principles:

- **Warm palette**: Off-white backgrounds (like aged paper), warm grays, NO cold whites or blues
- **Bold accent**: One confident accent color (vermillion, coral, teal — NOT purple gradients)
- **Distinctive typography**: Display font with personality for headings (Bricolage Grotesque, or similar bold geometric face — NEVER Inter, Roboto, Arial, or Space Grotesk). Clean sans-serif for body (DM Sans or similar). JetBrains Mono for code.
- **Generous whitespace**: Modules breathe. Max 3-4 short paragraphs per screen.
- **Alternating backgrounds**: Even/odd modules alternate between two warm background tones for visual rhythm
- **Dark code blocks**: IDE-style with Catppuccin-inspired syntax highlighting on deep indigo-charcoal (#1E1E2E)
- **Depth without harshness**: Subtle warm shadows, never black drop shadows

---

## Mode: skill-page

Everything above describes the **default mode** — a multi-module course built from a codebase. This section describes a second mode: `skill-page`. The two modes share the same design system (tokens, fonts, motion), but produce different artefacts.

### When to use this mode

Use `skill-page` when the source is **a Claude Code skill, a slash command, or an agent** — not a codebase — and the goal is a single-page teaching/reference doc for developers and students who want to *use* that skill. Example triggers:

- "make a page for the `/hekat` skill"
- "turn this command into a teaching page"
- "build a dev docs page for the `mercurio` agent"
- "single-page reference for the `codebase-to-course` skill itself"

Do **not** use this mode for a whole codebase — use the default mode for that. Do **not** use the default mode for a single skill — the multi-module scaffold is too heavy.

### Audience

Developers and students learning how to use the skill. More technical than the default mode's "vibe coder" target — assume familiarity with CLI, code, and AI tooling, but **not** familiarity with this specific skill. Explain the DSL, the operators, the composition patterns, the worked examples. Teach the tool; don't sell it.

### Input discovery

Given a name like `hekat`, `/hekat`, or `mercurio`, look in all three standard locations (multiple hits are fine — merge them):

| Source kind | Path |
|---|---|
| Slash command | `~/.claude/commands/<name>.md` |
| Skill | `~/.claude/skills/<name>/SKILL.md` (plus `references/` and `README.md` if present) |
| Agent | `~/.claude/agents/<name>.md` (or `<NAME>_AGENT_DEFINITION.md`) |

If the user passes an absolute path, read that instead. If nothing is found, ask the user for the path — do not guess.

**Read order within the source:** frontmatter → description → main process/body → examples → any references.

### Required output sections

Adapt these ten sections from the input. Section labels should be terse all-caps eyebrows (e.g. `OVERVIEW`, `DSL REFERENCE`), section titles are plain-English sentences.

1. **Masthead** — name + one-line plain-English tagline + version/date meta row (e.g. `v5.2 · updated 2026-04-17 · 3 min read`). No hero illustration, no gradient, no CTA button.
2. **What it is** — 2 short paragraphs. No marketing tone. No "empowers you to…" language. Answer: what does it produce, and when would you reach for it?
3. **Core concept** — the skill's primary axis. Most skills have one: HEKAT has L1–L7 complexity levels; `courseware` has pipeline stages; `meta-prompting` has strategies. Render it as a table, a ruler, or a tier list — something visually scannable, not a bulleted paragraph.
4. **Operators / syntax reference** — a table of the DSL tokens or glyphs the skill uses (e.g. `→`, `||`, `×`, `⊗` for OIS; `@scope`, `@depth` for context skills). Columns: Glyph, Name, Meaning, Example. Preserve exact glyphs and names — do not translate them.
5. **Hotkey / shortcut system** — if the skill has one (HEKAT `L3!`, `#tag`, persistent-mode toggles). Skip the section if the skill has no hotkeys. Do not fabricate one.
6. **Worked examples** — two examples at contrasting complexity, same task. E.g., "classify this email" done at L2 vs. L6. Show the invocation, the expected behaviour, and one line on why the simpler version is often enough.
7. **Activation / invocation** — persistent mode vs. one-shot, how to enter/exit, scope (per-turn, per-session, per-repo). For agents: how they're dispatched.
8. **Decision table** — "if your task is X, use Y." Two columns minimum: *Task shape* and *Recommended level/operator/variant*. This is the section users jump to — make it skimmable.
9. **Quick start** — 3–5 commands a user can copy-paste right now. Include the minimum-viable invocation and one realistic example.
10. **Footer** — attribution (built with Claude Code, or similar), link back to the source file, version + updated-on.

### Design system rules

Inherit everything from `references/design-system.md`. Specifically:

- **Typography**: Bricolage Grotesque (display), DM Sans (body), JetBrains Mono (labels + code). No Oswald, no Inter, no system-ui.
- **Palette**: Warm cream background (`--color-bg: #FAF7F2`), charcoal text (`--color-text: #2C2A28`), warm-tinted borders. No cold whites, no dark-mode-only palettes.
- **Accent rotation**: Use all five actor colors as per-section accents — don't pin the whole page to one accent. Rotate: section 1 teal, section 2 warm orange, section 3 gold, section 4 forest green, section 5 muted plum, then repeat. Map operators or levels onto the same five actor colors so users get visual consistency when they cross-reference.
- **Motion**: Identical fade-in on scroll (IntersectionObserver, 120ms stagger, `prefers-reduced-motion` guard). Nav-dot progress bar across the top.
- **Shadows**: Warm-tinted RGBA (44,42,40,alpha) — never pure black.
- **Code blocks**: Dark IDE-style on `#1E1E2E` with Catppuccin tokens, wrapping enabled, no horizontal scroll.

See `references/skill-page-mode.md` for the CSS-inlining procedure and the full accent-rotation table.

### Single-file constraint

The output is **one `.html` file**. Not a directory. All CSS and JS are embedded inline. The only external dependency is the Google Fonts CDN link in `<head>`. No `build.sh`, no `styles.css`, no `main.js`, no module partials.

- **Size ceiling**: ≤ 80 KB. If you're over, you're padding — cut.
- **No external JS libraries.** No Alpine, no htmx, no Prism, no Chart.js. Hand-written vanilla only.
- **No build step.** `open file.html` must work.

### Anti-slop rules

Do **not** produce any of the following — they are disqualifying:

- Purple-to-blue gradients, rainbow gradients, any gradient behind text
- Glassmorphism / frosted-blur cards
- Emoji-laden headers (at most one small glyph per section, used deliberately)
- Generic SaaS hero ("Supercharge your workflow with AI!")
- Icon-card feature grids with vague benefit copy ("⚡ Fast · 🎯 Accurate · 🔒 Secure")
- Stock illustrations, undraw.co figures, 3D-render hero graphics
- CTA buttons labelled "Get Started" with no target
- Auto-playing animations that loop forever (fade-in once is fine; infinite pulse is not)

### Invocation patterns

Both shapes are supported:

**Natural language** (preferred):

> "make a single-page teaching doc for the `/hekat` skill, save it to `./hekat-page.html`"

**Explicit**:

```
skill: codebase-to-course
intent: skill-page
arg: <skill-or-command-or-agent-name>
--out <path>      (optional; default ./<name>-page.html)
--accent <hex>    (optional; overrides the rotating accent default — pins to one accent)
```

If `--out` is omitted, write to `./<name>-page.html` in the current working directory. If the target path already exists, confirm with the user before overwriting.

### Quality gates

Before reporting done, the agent **must** verify all of the following. If any fails, fix before handing back:

```bash
# 1. File exists and is under 80KB
ls -lh "$OUT_PATH"                              # size must be ≤ 80K
test -f "$OUT_PATH" || echo "MISSING"

# 2. Fonts loaded correctly
grep -q "Bricolage+Grotesque" "$OUT_PATH"       # must match
grep -q "DM+Sans"             "$OUT_PATH"       # must match
grep -q "JetBrains+Mono"      "$OUT_PATH"       # must match

# 3. Anti-slop grep (all must return zero matches)
grep -iE "linear-gradient.*purple|gradient.*rainbow" "$OUT_PATH"   # no purple gradients
grep -iE "backdrop-filter.*blur|glassmorphism"       "$OUT_PATH"   # no glass
grep -iE "Get Started|Supercharge|Empowers you"      "$OUT_PATH"   # no SaaS copy
grep -iE "undraw\.co|stock-illustration"             "$OUT_PATH"   # no stock art

# 4. Accent rotation present (at least 3 distinct actor colors used)
grep -cE "#D94F30|#2A7B9B|#7B6DAA|#D4A843|#2D8B55" "$OUT_PATH"     # must be ≥ 3

# 5. Motion infrastructure present
grep -q "IntersectionObserver"    "$OUT_PATH"
grep -q "prefers-reduced-motion"  "$OUT_PATH"
grep -q "nav-dot\|progress-bar"   "$OUT_PATH"
```

Open the file in the browser and eyeball the result: nav dots present, accent rotates across sections, no layout breakage at 375 px, fonts render (not fallback). If any of those fail, fix and re-verify.

### Reference file for this mode

Read `references/skill-page-mode.md` when running this mode. It contains the CSS-inlining procedure, the accent-rotation table, the JavaScript patterns to embed, and section-by-section authoring guidance.

---

## Mode: plugin-page

A single aggregated HTML page that showcases an entire Claude Code **plugin** — not a single skill. A plugin bundles multiple skills, slash commands, and agents under one `plugin.json`; this mode teaches them as a coherent whole.

### When to use

Trigger on: "make a plugin page", "make a page for plugin X", "turn this plugin into a page", "single page for the `<plugin>` plugin". Do **not** use `skill-page` for a plugin — the plugin has multiple sub-artifacts that need unified navigation, cross-references between sub-skills, and worked examples that span multiple skills.

### Input discovery

Input is either a path or a plugin name. Resolution order:

| Input shape | Resolved path |
|---|---|
| Absolute path | Use as-is |
| Plugin name | `~/.claude/plugins/<name>/` first, then `./plugins/<name>/` |

Inside the plugin directory, read in this order:

1. `plugin.json` — authoritative manifest (name, version, description, declared skills/commands/agents).
2. `skills/<skill-name>/SKILL.md` for each declared skill — extract name, description, core axis.
3. `commands/<name>.md` for each declared command — extract trigger and purpose.
4. `agents/<name>.md` for each declared agent — extract role and dispatch shape.
5. `README.md` if present — use for overall plugin narrative.

If `plugin.json` is missing, fall back to directory discovery (`ls skills/`, `ls commands/`, `ls agents/`). If ambiguous, ask the user before guessing.

### Required output sections

One file: `./<plugin-name>-page.html`. Sections:

1. **Masthead** — plugin name, one-line tagline, version + updated-on meta row.
2. **Plugin overview** — 2 short paragraphs: what the plugin delivers as a bundle, and the common thread across its sub-artifacts.
3. **At a glance** — a visual index table: `Kind | Name | One-line purpose | Jump →`. Covers all skills, commands, agents.
4. **Skills** — one card per skill with: name, eyebrow (`SKILL`), description, core axis summary, link to source path. Each card gets its own accent from the rotation.
5. **Commands** — one row per command: trigger phrase, signature, one-line purpose.
6. **Agents** — one card per agent: dispatch pattern, inputs, outputs.
7. **Worked examples** — 2–3 examples that **cross** multiple sub-artifacts (e.g., "run command X, which dispatches agent Y, which uses skill Z"). This is the value-add vs. N separate skill pages.
8. **Quick start** — 3–5 copy-pasteable invocations, one per major sub-artifact.
9. **Footer** — attribution, source path (`~/.claude/plugins/<name>/plugin.json`), version, updated-on.

### Design system

Inherit everything from the main skill + skill-page mode. Warm cream bg (`#FAF7F2`), Bricolage Grotesque + DM Sans + JetBrains Mono, warm-tinted shadows, IntersectionObserver fade-in, nav-dot progress bar. **Accent rotation is expanded to 6–7 colors** (five actor colors + two extensions) so plugins with many sub-artifacts still get visual separation — see `references/plugin-page-mode.md` for the extended palette.

### Single-file constraint

One `.html` file. ≤ 80 KB. Everything inlined. No external JS. No build step. Same constraints as `skill-page`.

### Anti-slop rules

Same list as `skill-page`: no purple-to-blue gradients, no glassmorphism, no SaaS hero copy, no emoji-laden headers, no stock illustrations, no "Get Started" CTAs, no infinite-loop animations.

### Invocation patterns

**Natural language:**

> "make a plugin page for the `superpowers` plugin, save to `./superpowers-page.html`"
> "turn the gsd plugin into a page"

**Explicit:**

```
skill: codebase-to-course
intent: plugin-page
arg: <plugin-name-or-path>
--out <path>     (optional; default ./<plugin-name>-page.html)
```

### Quality gates

Same checklist as `skill-page`: file exists, size ≤ 80 KB, fonts load, anti-slop greps clean, accent rotation present (≥ 3 distinct actor colors), IntersectionObserver + prefers-reduced-motion guard present, nav dots render. **Additional gates**: every sub-artifact declared in `plugin.json` must appear in the rendered page (grep each name), and the "At a glance" table must be present (`grep -q "at-a-glance\|At a glance"`).

### Reference file for this mode

Read `references/plugin-page-mode.md` when running this mode.

---

## Mode: batch-skill-page

Generate **N separate skill pages** in one invocation, plus an `index.html` navigator. Each generated page is identical in shape to `skill-page` output — this mode parallelizes the work.

### When to use

Trigger on: "batch skill pages", "make pages for X, Y, Z skills", "make skill pages for all these", "generate skill pages for [list]". Use when the user has a concrete list of skills and wants one HTML per skill — not one aggregated page (that's `plugin-page`).

### Input discovery

Input is a list of skill names. Accept:

- Comma-separated inline: `hekat, mercurio, codebase-to-course`
- Newline-separated inline: one per line in the prompt body
- A path to a file containing the list (one per line): `./skills.txt`

For each name, resolve using the same lookup as `skill-page` (commands/skills/agents directories).

### Required output

A directory (default `./skill-pages/`) containing:

- `<skill-name-1>.html`, `<skill-name-2>.html`, … — one file per input, each identical in shape to `skill-page` output.
- `index.html` at the root — a navigator page (plugin-page aesthetic) showing all generated pages as cards. Each card: skill name, tagline (pulled from the generated page's masthead), link.

### Design system

Each per-skill page inherits the `skill-page` design system unchanged. The navigator `index.html` uses the **plugin-page aesthetic**: warm cream bg, card grid with per-card accent rotation, same typography and motion.

### Parallelization

**This mode must dispatch parallel sub-agents — one per skill.** Use the `superpowers:dispatching-parallel-agents` skill. Cap at **5 concurrent agents** to avoid rate limits; if the list is longer, batch in waves of 5.

Each dispatched agent receives:
- The skill name + resolved source path
- Its output path (`./skill-pages/<skill-name>.html`)
- Instructions to produce a single page per `references/skill-page-mode.md`

After all agents complete, the main context generates the `index.html` navigator (no parallel dispatch needed — it's a single lightweight page).

### Multi-file constraint

**N single-files + 1 index.** Each per-skill page is a self-contained ≤ 80 KB HTML file (same `skill-page` constraint). The navigator is also a single HTML file, typically ≤ 40 KB. No shared CSS file — each page inlines its own.

### Failure handling

If any per-skill agent fails (source not found, write error), the navigator still generates with the successful pages. Failed skills are listed in a "Skipped" section at the bottom of the navigator with the reason. The main context reports the failure count but does **not** block the whole batch on one missing skill.

### Anti-slop rules

Same as `skill-page`, applied per-page. The navigator is also subject to the same rules.

### Invocation patterns

**Natural language:**

> "batch skill pages for hekat, mercurio, codebase-to-course — save to `./docs/skills/`"
> "make skill pages for all the skills in `./skill-list.txt`"

**Explicit:**

```
skill: codebase-to-course
intent: batch-skill-page
arg: <comma-list-or-file-path>
--out-dir <path>   (optional; default ./skill-pages/)
--concurrency <n>  (optional; default 5, max 5)
```

### Quality gates

Before reporting done:
- Output directory exists and contains one HTML per input name.
- Each per-skill HTML passes the `skill-page` quality gates (size, fonts, anti-slop, motion infra).
- `index.html` exists at the directory root, lists all generated pages (grep each name in `index.html`), and links resolve (`href="./<name>.html"` for each).
- Skipped skills reported with reason.

### Reference file for this mode

Read `references/batch-skill-page-mode.md` when running this mode.

---

## Mode: course-with-modules

Generate the full multi-module course output (same shape as default mode) from an **explicit user-provided module list** — skipping Phase 1 codebase analysis entirely.

### When to use

Trigger on: "make a course with these modules: …", "build a course from modules X Y Z", "turn these topics into a course", "course from this outline". Use when the user already knows the curriculum and wants to skip the analysis phase. Do **not** use when the user points at a codebase — that's the default mode.

### Input discovery

Input is a list of module specifications. Accept:

- **Inline text blocks** — one block per module in the prompt, with module name + objective + key content points.
- **Markdown file refs** — paths like `./module-specs/01-intro.md`, each containing one module's spec.
- **Mixed** — any combination.

Each module spec must contain, at minimum: **module name**, **learning objective**, **key content points** (3–6 bullets). If a spec is missing one of these, ask the user to fill it in — do not invent content.

### Process

**Skip Phase 1** (codebase analysis). Go directly to:

- **Phase 2 (Curriculum Design)** — use the provided module list as the curriculum. Do not re-scope or re-order. Sanity-check only: if user provides contradictions (e.g., "Module 3: intro to X" after "Module 2: advanced X"), flag the contradiction and ask before generating.
- **Phase 2.5 (Module Briefs)** — write briefs using the user-provided content points. Since there's no codebase to pre-extract snippets from, briefs carry the content points verbatim + any code snippets the user supplied. If no code snippets are supplied and the topic needs them, the module is **conceptual-only** — that's fine, it just means no code-translation block is required for that module (but every other interactive element still is).
- **Phase 3 (HTML Assembly)** — identical to default mode. Copy `styles.css`, `main.js`, `_base.html`, `_footer.html`, `build.sh` verbatim from references. Write module files from briefs. Run `build.sh`.
- **Phase 4 (Review)** — identical to default mode.

### Validation

Before Phase 2.5, validate the module list:

- **Contradictions** — "intro" after "advanced", "conclusion" before "setup". Flag and ask.
- **Missing essentials** — any module without a learning objective. Flag and ask.
- **Duplicate names** — two modules with the same slug. Flag and ask.
- **Count** — if > 8 modules, confirm the user really wants that many.

### Multi-file constraint

**Multi-file directory output**, same shape as default mode: `course-name/{styles.css, main.js, _base.html, _footer.html, build.sh, briefs/, modules/*.html, index.html}`. This is **not** a single-file mode.

### Design system

Inherit from the default mode — no changes. Every module's interactive elements (group chat animation, message flow, code↔English, quizzes, glossary tooltips) are still mandatory where applicable. For conceptual-only modules without code, drop the code-translation requirement but keep the rest.

### Anti-slop rules

Same as default mode. Do not inject content the user didn't specify. Do not add a "bonus module" to round out the arc. Respect the provided curriculum exactly.

### Invocation patterns

**Natural language:**

> "make a course with these modules: 1) Intro to LLMs — objective: learners can explain the transformer architecture; content: tokens, embeddings, attention. 2) Prompting basics — objective: learners can write a zero-shot prompt; content: system prompts, role framing, output format. …"
> "build a course from these module specs: `./specs/01.md`, `./specs/02.md`, `./specs/03.md`"

**Explicit:**

```
skill: codebase-to-course
intent: course-with-modules
arg: <inline-spec-or-file-list>
--out-dir <path>   (optional; default ./<slugified-title>/)
--title <string>   (optional; default inferred from modules)
```

### Quality gates

Same as default mode: `index.html` renders, all nav dots match module count, each module contains mandatory interactive elements (chat, flow, code↔English where applicable, quiz, glossary). Plus: every user-provided module appears once and only once, in the user-specified order.

### Reference file for this mode

Read `references/course-with-modules-mode.md` when running this mode.

---

## Mode: repo-explainer

A single HTML page that explains a GitHub (or local) repo — lighter weight than a full course, heavier than a skill-page. Tuned for a reader who wants to understand a repo quickly, optionally with **focus areas** the user cares about.

### When to use

Trigger on: "make a github repo explainer page", "explain this repo in a page", "repo explainer for <URL>", "single page explaining <repo>", with optional "with focus areas: X Y Z". Use when the user wants a **reference-style single page** about a repo, not a full multi-module interactive course (that's the default mode).

### Input discovery

Input is a GitHub URL **or** a local repo path. Optional: `focus_areas` — a comma-separated list of subsystems/topics the reader cares about.

- **GitHub URL** — `git clone <url> /tmp/<repo-name>` before analysis (shallow clone OK: `--depth=1`). Report clone path in the footer.
- **Local path** — use directly, no clone.

Read in this order: `README.md`, `package.json` / `pyproject.toml` / `go.mod` / `Cargo.toml` (whichever exists), entry point source file(s), `LICENSE`, `.github/workflows/*.yml` if present.

### Required output sections

One file: `./<repo-name>-explainer.html`. Sections:

1. **Masthead** — repo name, one-line tagline (derived from README, NOT the raw GitHub blurb), owner/author, version or last-commit date.
2. **What it does** — 2 paragraphs in plain English. What problem it solves, who uses it.
3. **Who made it + context** — author/org, license, project age, star count if the user supplied it (don't fabricate).
4. **Architecture overview** — the "cast of characters" and how they fit together. A diagram or table, not a wall of text.
5. **Focus-area deep-dives** — **if `focus_areas` provided**, one section per area with its own accent color and deeper explanation. If **not** provided, skip this block and rely on the architecture overview.
6. **How to use it** — install + minimal invocation + one realistic usage.
7. **Gotchas** — known issues, required env vars, platform caveats. Only include real ones visible in the repo; do not fabricate.
8. **Footer** — source path (clone path if cloned, or local path), license, attribution.

### Design system

Inherit from `skill-page` mode: warm cream bg, Bricolage Grotesque + DM Sans + JetBrains Mono, rotating per-section accents, warm shadows, IntersectionObserver motion, nav-dot progress bar. **Focus-area sections get dedicated accents** from the actor palette — each focus area maps to one actor color in order, so cross-references stay consistent.

### Single-file constraint

One `.html` file. **≤ 80 KB hard cap.** If analysis produces too much content (common for large repos), summarize aggressively: collapse secondary subsystems to one-liners, keep depth only where the user asked (focus areas) or where the architecture is load-bearing.

### Anti-slop rules

Same as `skill-page`. **Additional**: do not invent star counts, download counts, or endorsements. Do not claim the repo does things it doesn't do. If the README is marketing-heavy, flatten to plain description — do not preserve marketing tone.

### Invocation patterns

**Natural language:**

> "make a github repo explainer page for https://github.com/anthropics/claude-code, save to `./claude-code-explainer.html`"
> "explain this repo in a page: `./my-local-repo`, with focus areas: auth, caching, tool-use"
> "repo explainer for https://github.com/fastapi/fastapi with focus areas: dependency injection, pydantic integration"

**Explicit:**

```
skill: codebase-to-course
intent: repo-explainer
arg: <github-url-or-path>
--out <path>            (optional; default ./<repo-name>-explainer.html)
--focus-areas <list>    (optional; comma-separated)
--accent <hex>          (optional; pins page to one accent, skips rotation)
```

### Quality gates

Same as `skill-page` (file exists, ≤ 80 KB, fonts load, anti-slop greps, motion infra, accent rotation). **Additional gates**: if `focus_areas` were provided, each one must appear as a distinct section in the output (grep each focus-area name). If the input was a GitHub URL, the clone path must appear in the footer.

### Reference file for this mode

Read `references/repo-explainer-mode.md` when running this mode.

---

## Reference Files

The `references/` directory contains detailed specs. **Read them only when you reach the relevant phase** — not upfront. This keeps context lean.

- **`references/content-philosophy.md`** — Visual density rules, metaphor guidelines, quiz design, tooltip rules, code translation guidance. Read during Phase 2.5 (briefs) and Phase 3 (writing modules).
- **`references/gotchas.md`** — Common failure points checklist. Read during Phase 3 and Phase 4 (review).
- **`references/module-brief-template.md`** — Template for Phase 2.5 module briefs. Read only for complex codebases using the parallel path.
- **`references/design-system.md`** — Complete CSS custom properties, color palette, typography scale, spacing system, shadows, animations, scrollbar styling. Read during Phase 3 when writing module HTML.
- **`references/interactive-elements.md`** — Implementation patterns for every interactive element: drag-and-drop quizzes, multiple-choice quizzes, code↔English translations, group chat animations, message flow visualizations, architecture diagrams, pattern cards, callout boxes. Read the relevant sections during Phase 3.
- **`references/skill-page-mode.md`** — Full spec for the `skill-page` mode: input-analysis procedure, section-by-section authoring guidance, CSS-inlining guide, accent-rotation table, JavaScript patterns to embed, testing checklist. Read only when running the `skill-page` mode.
- **`references/plugin-page-mode.md`** — Full spec for the `plugin-page` mode: plugin manifest parsing, sub-artifact iteration, section-by-section authoring, extended 6–7 accent rotation for plugins with many sub-artifacts, cross-skill worked example patterns, testing checklist. Read only when running the `plugin-page` mode.
- **`references/batch-skill-page-mode.md`** — Full spec for the `batch-skill-page` mode: parallel dispatch strategy (≤ 5 concurrent), input list parsing, output directory shape, navigator `index.html` design, per-skill failure handling, testing checklist. Read only when running the `batch-skill-page` mode.
- **`references/course-with-modules-mode.md`** — Full spec for the `course-with-modules` mode: module spec parsing (inline or file refs), skipping Phase 1, leveraging Phases 2–4 of the default mode, contradiction detection, conceptual-only module handling, testing checklist. Read only when running the `course-with-modules` mode.
- **`references/repo-explainer-mode.md`** — Full spec for the `repo-explainer` mode: GitHub URL vs. local path discovery, clone handling, focus-area parsing and section generation, 80 KB summarization strategy, testing checklist. Read only when running the `repo-explainer` mode.
