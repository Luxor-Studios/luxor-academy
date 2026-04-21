# LUXOR Academy — Design Decisions & Feedback Log

**Purpose:** Durable record of design principles, user feedback, and the rationale behind visual/pedagogical choices. Subagents forging future content MUST read this before starting.

---

## 2026-04-21 · User feedback round #2 — visual polish bar

**Context:** User reviewed the 44-module live site after Wave 1 + Wave 2 diagram work. Kit injection + 18 structural SVG rewrites had landed.

### What's still not working (direct quotes + screenshots reviewed)

> "The live diagrams really could use a lot more work, as there is a lot of overlapping text. They're not at a level of refinement that the rest of the platform and skill set are up to."

> "There is just a lot of text, and I think that we could consider incorporating a couple more visuals, even to break up the text. Include things like more call out boxes as well as neatly indented coding blocks..."

> "Less is more, and breaking up walls of text with visuals is highly effective as a pedagogical technique for learning when reading educational content."

### Specific live issues the user surfaced via screenshots

1. **`design-tool-planner/01-universal-template`** (Wave 1 rewrite) — heptagon vertex labels overlap "FIVE-STEP PIPELINE" header; pipeline card labels ("analyzeresearcharchitec…") are crammed/truncated; bottom validation summary bleeds over document cards.
2. **`design-tool-planner/04-five-step-pipeline`** (Wave 1 rewrite) — totals-row labels fuse ("avg quallines out" — "quality" and "lines" collide because they sit in adjacent columns without enough padding).
3. **`design-tool-planner/05-ship-your-own`** (generator stub) — central "5-step pipeline" circle overlaps surrounding text; labels below circle run off viewBox.
4. **Hand-crafted forge-barque modules (images 5–7)** are explicitly held up as the reference standard — no overlapping text, distinct column structure, integrated callouts, polished code blocks.

### Root cause analysis

1. **Label anti-collision is not just a halo problem.** The kit's `paint-order: stroke fill` halo fixes text-on-arrow readability, but when two text ELEMENTS are positioned at overlapping coordinates, halos don't help — the letters still land in the same pixels. **Fix:** SVG structure MUST place labels at non-overlapping positions, with measured text-length padding.
2. **Subagents are optimizing for information density over pedagogy.** They pack every datum into one diagram (heptagon + pipeline + doc grid + totals bar in a single viewBox). **Fix:** Enforce a rule — each `visual` slot shows ONE primary relationship. Additional data goes in supplementary callouts or gets its own sub-diagram.
3. **Primer sections are walls of prose.** 200+ words of uninterrupted paragraph is poor pedagogy. **Fix:** Break primer text with callout boxes, inline mini-diagrams, and compact code snippets. The forge-barque hand-crafted modules already do this — mimic that pattern structurally.
4. **Code blocks need polish.** Current `<pre><code>` is functional but plain. **Fix:** Improve visual container — leading line-number gutter, language badge, copy-to-clipboard UI, inset padding.

---

## Design principles for all future module work

### Visuals (the `visual` slot)

- **One relationship per diagram.** If you need two, make two diagrams. If the aria-label promises more than one primary relationship, split it.
- **ViewBox discipline.** Measure text lengths before placing labels. Leave at least `1em` of empty space between label boundaries. Default to larger viewBox (700×400+) rather than tight fits.
- **Hierarchy first.** Section titles (`.lkd-head`) must be at least 2× the size of supporting labels and clearly separated vertically.
- **Honest aria-labels.** If aria-label says "three tiers fan out to five specialists with cost annotations," the diagram must show exactly that — not a decorative summary.
- **Always static-readable first.** Motion/interactivity is a bonus. If the static SVG is unclear, the whole module fails.

### Primer section (the `primer` slot, rendered text)

- **200-word budget is soft, not rigid.** Better 140 words + callout + mini-diagram than 260 words of prose.
- **Require at least one `.callout` per primer** unless the primer is <120 words. Callout types:
  - `.callout--insight` — aha-moment framing
  - `.callout--warning` — gotcha / anti-pattern
  - `.callout--ref` — cross-link to another module or file
  - `.callout--math` — formula with readable notation
- **Inline code gets first-class treatment.** `<code>` tags styled distinctly (background, slight padding, accent border).
- **Mini-diagrams inline with prose.** A two-box arrow diagram between paragraphs is often clearer than "in contrast, X goes to Y."

### Artifact section (the `artifact` slot, the code excerpt)

- **Line-number gutter** on the left (dim, 2-char wide).
- **Language badge** top-right of the code block (accent color).
- **Permalink styling**: the "source" line above the code is a pill with glyph + path + commit SHA (not a raw URL).
- **Syntax hints at minimum**: style keywords, strings, comments distinctly. Full syntax highlighting is aspirational.

### Code blocks anywhere else

- Same visual container as the artifact code block — consistency across the module page.

### Self-check section (MCQs)

- Already mostly fine. Improvements: reveal-animation respects `prefers-reduced-motion`; option buttons visually match the module's accent; explanation section has the `.callout--insight` treatment.

### Next section

- `ship-your-own` form gets its own distinctive treatment (already accented). Non-ship-your-own "next module" link should be a prominent call-to-action card, not a small text link.

---

## The "Break up text walls" pattern — spec for subagents

Before writing primer markdown, choose **one** of these structural patterns based on the content:

| Pattern | When to use | Structure |
|---|---|---|
| **Prose + 1 callout** | Short primer (120-180 words), single insight | Opening paragraph → `.callout--insight` pulling the key line → closing paragraph |
| **Contrast pair** | Two competing approaches | Intro paragraph → two-column `.callout--compare` panel ("Before" / "After" or "X" / "Y") → resolution paragraph |
| **Walkthrough** | Step-by-step process | Intro paragraph → ordered list with inline code + 1 mini-diagram per step |
| **Anchored code** | Learning a specific syntax pattern | Intro → inline code sample with annotation → `.callout--ref` to the artifact → brief prose |
| **Anti-pattern callout** | Teaching what NOT to do | Prose → `.callout--warning` with the anti-pattern → fix prose |

Every primer must declare which pattern it used at the top of the markdown as a comment: `<!-- primer-pattern: contrast-pair -->`.

---

## What this means for Wave 3 and beyond

### Immediate (Wave 3)

1. **Re-redraw the 3 modules the user specifically flagged** (design-tool-planner/01, 04, 05) with tighter viewBox discipline and the "one relationship per diagram" rule.
2. **Sweep the Wave 2 modules** to check for similar density issues — spot-audit and fix.
3. **Extend the diagram kit** with callout-box CSS classes (`.lkd-callout`, `.lkd-callout-insight`, etc.) for use in the primer section, not just inside SVGs.
4. **Upgrade the code-block container** — add line-number gutter CSS, language badge pattern.

### Phase D (future session)

5. **Primer-section refactor across all 40 subagent-generated modules.** Each primer gets re-worked to use one of the 5 structural patterns above. Target: break every >200-word primer with at least one callout or mini-diagram.
6. **Artifact-section upgrade across all modules.** Apply the line-number-gutter + language-badge treatment uniformly.

---

## Reference: forge-barque as the gold standard

The 4 hand-crafted `forge-barque` modules are the benchmark. Before shipping a new module, compare side-by-side against the nearest forge-barque equivalent. If the new module isn't at least 80% as polished, iterate.

What forge-barque does right:
- Distinct column structure in visuals (no overlapping text)
- Meaningful hierarchy between section titles and data labels
- Content-rich callouts inline with primer (not just walls of prose)
- Polished code block styling
- Diagrams that commit to one clear relationship

---

## Subagent briefs — required additions

From now on, every subagent forging or refactoring module content MUST receive:

1. Link to this `decisions.md` file at the top of the brief.
2. The "One relationship per diagram" rule restated.
3. The 5 primer structural patterns table.
4. Explicit comparison target: "Your output should be at least 80% as polished as `modules/build-and-ship/forge-barque/01-venv-shebang-trap.html`."

---

## User's bar

> "The UI and the functionality are the first impression that people have of us, so we need to make sure it's top-notch and locked in."

Every visual, every callout, every code block is being graded against this. Polish is not optional.
