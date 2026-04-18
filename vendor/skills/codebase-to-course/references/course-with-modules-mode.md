# course-with-modules Mode — Authoring Reference

This reference is for the `course-with-modules` mode of the `codebase-to-course` skill. Read it when the user has **already specified the curriculum** and wants the full multi-module course output without codebase analysis. For a codebase-driven course, use the default mode. For a single-page skill doc, use `skill-page`.

---

## Intent

Produce the full default-mode course artifact (multi-file directory with `index.html`, `styles.css`, `main.js`, modular HTML, briefs) but **skip Phase 1 (codebase analysis) entirely** — the user provides the module list, objectives, and content points directly. This mode is the fast path when the curriculum is already decided.

Every interactive element required by the default mode is still required here (group chat animation, message flow, code ↔ English, quizzes, glossary tooltips) — with one exception: modules with no code material are exempt from the code ↔ English requirement.

---

## Module Spec Parsing

The user provides module specs in one of three shapes. Accept any combination in the same invocation.

### Shape 1 — Inline text blocks

One block per module, separated by blank lines or explicit `---` dividers. Each block must contain:

- **Module name** (short title; will slug to `0N-<slug>.html`)
- **Learning objective** (one sentence: what the learner can do after this module)
- **Key content points** (3–6 bullet points of what to cover)
- *Optional:* code snippets, metaphor suggestion, interactive element hints

Example:

```
Module 1: What is an LLM?
Objective: Learners can explain tokens, embeddings, and attention in plain language.
Content:
  - What "tokens" actually are
  - How text becomes numbers (embeddings)
  - Why attention matters for long context
  - The transformer in 3 sentences
Metaphor: a library with a very attentive librarian (but don't use restaurants)
```

### Shape 2 — Markdown file refs

Paths like `./specs/01-intro.md`, `./specs/02-prompting.md`. Each file contains one module's spec in the same structure as Shape 1.

Read each file in order and treat it as a Shape 1 block.

### Shape 3 — Mixed

Any combination of inline blocks + file refs in the same prompt. Parse in the order given.

### Minimum required fields

Every module must have: name, objective, content points. If any are missing, ask the user to fill them in. **Do not invent content** — the whole point of this mode is that the user supplies the curriculum.

---

## Validation Before Generation

Before starting Phase 2.5, sanity-check the provided module list. Flag any of these for user confirmation:

| Issue | Example | Action |
|---|---|---|
| Out-of-order complexity | "Module 3: Intro to X" after "Module 2: Advanced X" | Ask: "Module 3 looks like an introduction; should it come earlier?" |
| Missing essentials | Module 2 has no learning objective | Ask the user to supply the missing field |
| Duplicate slugs | Two modules both named "Basics" | Ask the user to rename one |
| High count | 9+ modules | Confirm the user really wants that many (default mode caps at 6–8) |
| Contradictory objectives | Module 1 teaches X; Module 4's objective contradicts Module 1 | Flag for review |

**Do not silently reorder, rename, or drop modules.** If the user confirms the list as-is after flagging, proceed as specified.

---

## Process (Phases 2 → 2.5 → 3 → 4)

### Skip Phase 1

No codebase analysis. Jump straight to Phase 2.

### Phase 2 — Curriculum design

The curriculum IS the provided module list. The only design work here is:

- Slugify each module name for file paths (`Module 1: What is an LLM?` → `01-what-is-an-llm`).
- Pick the per-module accent rotation (actor-1, actor-2, …).
- Decide the course title (use `--title` if supplied; else derive from the first module or ask).
- Pick the overall palette (default = first actor color pair, same as default mode).

Do **not** re-scope modules. Do **not** merge or split. Do **not** add a "conclusion" module unless the user specified one.

### Phase 2.5 — Module briefs

Write one brief per module to `course-name/briefs/0N-slug.md` using `references/module-brief-template.md` as the template. Carry the user's content points verbatim into the brief. If the user supplied code snippets, include them in the "Pre-extracted code snippets" section. If the user supplied a metaphor, use it — otherwise pick one that fits (avoiding restaurants and anything reused across modules).

Key difference from default-mode briefs: the "Pre-extracted code snippets" section may be empty for conceptual modules. That's fine — mark the module as **conceptual-only** in the brief's header.

### Phase 3 — HTML assembly (identical to default mode)

Same four sub-steps as the default mode:

1. Create `course-name/` directory.
2. Copy `references/styles.css`, `references/main.js`, `references/_footer.html`, `references/build.sh` verbatim.
3. Customize `_base.html` (title, accent placeholders, nav dots).
4. Write module files to `course-name/modules/0N-slug.html`.

For **conceptual-only modules** (no code supplied by the user), skip the code ↔ English translation requirement — but every other mandatory interactive element still applies (group chat, message flow, quiz, glossary tooltips).

Path choice: simple (≤ 5 modules, all independent) → sequential writing; complex (6+ modules, or user supplied lots of content per module) → parallel dispatch via `superpowers:dispatching-parallel-agents` (batches of 3).

### Phase 4 — Review

Run `build.sh`. Open `index.html`. Same review process as default mode.

---

## What This Mode Inherits From the Default Mode

Everything except Phase 1. Specifically:

- **Design identity** — warm cream palette, Bricolage Grotesque display, alternating module backgrounds, dark code blocks, warm shadows.
- **Output structure** — `course-name/{styles.css, main.js, _base.html, _footer.html, build.sh, briefs/, modules/*.html, index.html}`.
- **Mandatory interactive elements** — group chat animation (≥ 1 across course), message flow animation (≥ 1 across course), code ↔ English translation (≥ 1 per module with code material), quizzes (≥ 1 per module), glossary tooltips (first use of each technical term per module).
- **Canonical files untouched** — `styles.css`, `main.js`, `_base.html`, `_footer.html`, `build.sh`, `design-system.md`, `content-philosophy.md`, `gotchas.md`, `interactive-elements.md`, `module-brief-template.md` are source of truth. Do not regenerate.

---

## Anti-Slop Rules

Same as default mode, plus:

- **Do not inject content the user didn't specify.** If a bullet isn't in the user's content points, don't teach it.
- **Do not add a bonus module.** The curriculum is frozen at the user's list.
- **Do not reframe objectives.** Use the user's objective verbatim in the module's opening screen.
- **Do not replace user-supplied metaphors** with a different metaphor — even if you think yours is better. If the user's metaphor is genuinely unworkable (e.g., reuses a metaphor from a sibling module), ask before switching.

---

## Example Invocations

**Natural language — inline specs (preferred):**

```
make a course with these modules:
  1) Intro to LLMs
     Objective: learners can explain the transformer architecture
     Content: tokens, embeddings, attention, next-token prediction
  2) Prompting basics
     Objective: learners can write a zero-shot prompt
     Content: system prompts, role framing, output format, worked example
  3) Tool use
     Objective: learners can describe when to give an LLM tools
     Content: function calling, tool schemas, the ReAct loop, error handling
```

**Natural language — file refs:**

```
build a course from these module specs:
  ./specs/01-intro.md
  ./specs/02-prompting.md
  ./specs/03-tool-use.md
title: "LLM Fundamentals"
```

**Natural language — mixed:**

```
make a course with these modules:
  ./specs/01-intro.md
  inline: Module 2 — Prompting basics. Objective: zero-shot prompts. Content: system, role, format.
  ./specs/03-tool-use.md
```

**Explicit:**

```
skill: codebase-to-course
intent: course-with-modules
arg: ./specs/*.md
--out-dir ./llm-fundamentals
--title "LLM Fundamentals"
```

Defaults:

- `--out-dir` → `./<slugified-title>/` in cwd (or `./course/` if no title)
- `--title` → inferred from the first module's framing, or the shared topic

If the target directory exists, confirm with the user before overwriting.

---

## Testing Checklist

Same as default mode's Phase 4 checklist, plus:

- [ ] Every user-provided module appears once and only once in `index.html`
- [ ] Module order matches the user's specification
- [ ] Every module's learning objective appears in its opening screen (grep objective text)
- [ ] Every content point the user listed is addressed in the module body
- [ ] Conceptual-only modules are clearly flagged in their briefs
- [ ] Nav dots count matches module count
- [ ] Mandatory interactive elements present per module (exempting code ↔ English for conceptual-only modules)
