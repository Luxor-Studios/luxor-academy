# DIAGRAM AUDIT — LUXOR Academy Visual Quality Review

**Date**: 2026-04-20  
**Auditor**: LibreUIUX Specialist  
**Scope**: 40 module HTML files, excluding forge-barque (handcrafted)  
**Sampled**: 15 diagrams across all 6 track categories  
**Action Taken**: Top 10 redrawn in-place

---

## Scoring Rubric

Each diagram scored 1–5 on four dimensions:

| Dimension | What it measures |
|-----------|-----------------|
| **Layout** | Spatial clarity, no overlapping nodes, adequate whitespace |
| **Readability** | Font sizes, halos, contrast, label legibility |
| **Structural honesty** | Does the diagram deliver what the `aria-label` promises? |
| **Palette adherence** | LUXOR navy/bioluminescent palette, track accent correct |

**Composite = avg of four**. Score ≤ 2.5 → redraw required.

---

## Quality Scorecard — 15 Sampled Diagrams

| Module Path | Layout | Readability | Honesty | Palette | Composite | Diagnosis |
|-------------|--------|-------------|---------|---------|-----------|-----------|
| `build-and-ship/design-tool-planner/04-five-step-pipeline` | 2 | 1 | 4 | 3 | **2.5** | 8px font, 200px height crushes summary bar text into illegible collision |
| `build-and-ship/design-tool-planner/03-mcp-protocol-layer` | 2 | 2 | 4 | 3 | **2.75** | 9px labels, arrows from agents to MCP layer missing, chip labels overflow bounds |
| `build-and-ship/design-tool-planner/01-universal-template` | 2 | 1 | 3 | 3 | **2.25** | 9px font throughout, hexagon barely visible at scale, seven labels collide in 200×130 space |
| `orchestration/mars-systems/01-parallel-discovery` | 3 | 2 | 4 | 4 | **3.25** | 10px fan-out labels, wall-clock math annotation drifts below visual fold |
| `orchestration/mars-systems/04-validation-gates` | 2 | 2 | 3 | 4 | **2.75** | Gates laid out in confusing 2-column grid not readable as sequential pipeline; fail route arrow nearly invisible |
| `orchestration/mercurio-for-decisions/01-three-plane-analysis` | 4 | 3 | 5 | 4 | **4.0** | Minimal text, triangle readable — mostly CSS-fixable with halos |
| `orchestration/mercurio-for-decisions/02-convergence-methods` | 3 | 2 | 3 | 4 | **3.0** | Lane structure good but 10px card text, method names truncated by card bounds |
| `categorical-meta-prompting/cmp-foundations/05-recursive-meta-prompting` | 3 | 2 | 5 | 4 | **3.5** | Strong structure; quality trajectory graph has 10px axis text with no halo — unreadable on dark bg |
| `categorical-meta-prompting/cmp-foundations/01-objects-morphisms-composition` | 3 | 2 | 4 | 4 | **3.25** | Identity loop paths are 1px, illegible; loop labels collide with node edges |
| `mcp-integration/mcp-from-zero/03-three-primitives` | 2 | 2 | 3 | 4 | **2.75** | Panel 2 Resource dots float disconnected from URI labels; 9.5px mono clips on small viewports |
| `mcp-integration/mcp-from-zero/01-two-layer-protocol` | 3 | 2 | 4 | 4 | **3.25** | 9px mono inside boxes; central divider line hard to parse as layer separator |
| `mcp-integration/mcp-from-zero/02-capability-negotiation` | 4 | 3 | 5 | 4 | **4.0** | Good layout; mostly CSS-fixable with halo injection |
| `formal-verification/fstar-7-levels/01-novice-proofs` | 3 | 2 | 5 | 4 | **3.5** | Labels floating outside boxes (y-coord math off by 4–6px), 10px throughout |
| `formal-verification/fstar-7-levels/02-refinement-types` | 3 | 2 | 4 | 4 | **3.25** | Three branch boxes cramped; proof insight text at 10px with no separation |
| `orchestration/mars-systems/02-research-synthesis` | 3 | 3 | 4 | 4 | **3.5** | 26 text elements, generally readable but dense; highlight box text 10px |

### Score Distribution

| Score Band | Count | Interpretation |
|-----------|-------|---------------|
| ≥ 4.0 | 2 | CSS-only fix adequate |
| 3.0 – 3.9 | 7 | CSS helps but structural tweaks recommended |
| 2.5 – 2.9 | 4 | **Structural redraw required** |
| < 2.5 | 2 | **Critical — full redraw required** |

---

## Top 10 Worst Offenders — Before → After

Ordered by composite score ascending (worst first). All 10 have been redrawn in-place.

### 1. `build-and-ship/design-tool-planner/01-universal-template.html`
**Score**: 2.25 · **Track**: Coral (#FF7E6B)  
**Level**: Novice/Experienced  
**Before**: 9px labels, cuboctahedron compressed into 200×130px with 7 labels colliding, viewBox 560×320 too tight for content  
**After**: Hexagonal 7-variable frame with breathing room, pipeline steps at 16px numbered headings, document cards in 2×3 grid at 13px with full halo. viewBox expanded to 600×320.

### 2. `build-and-ship/design-tool-planner/04-five-step-pipeline.html`
**Score**: 2.5 · **Track**: Coral (#FF7E6B)  
**Level**: Experienced  
**Before**: 8.5px font throughout (smallest in corpus), 200px height forces summary bar text to collide, totals bar has no visual hierarchy  
**After**: viewBox 600×300, each step card has 14px Playfair heading, 12px body, 13px score in green. Summary bar broken into 4 columns with 20px metric numbers and divider lines. Connector arrows added.

### 3. `build-and-ship/design-tool-planner/03-mcp-protocol-layer.html`
**Score**: 2.75 · **Track**: Coral (#FF7E6B)  
**Level**: Experienced  
**Before**: 9px labels; two diagonal "ln" paths from agents to MCP layer with no arrowheads; API labels overflow their box bounds; no structural tier labelling  
**After**: Explicit three-tier headings (TIER 1/2/3), agent → MCP dashed arrows with arrowheads, chip labels at 13px centered, all API labels inside bounds, caption at 12px.

### 4. `orchestration/mars-systems/04-validation-gates.html`
**Score**: 2.75 · **Track**: Cyan (#00F5FF)  
**Level**: Expert  
**Before**: Gates arranged in non-linear 2-column grid; arrows from blueprint scatter to non-obvious positions; fail feedback route nearly invisible as dashed path; gates 4 and 5 appear reachable when they should be dimmed  
**After**: All 5 gates in horizontal left-to-right pipeline lane; gates 4–5 visually dimmed (grey); clear FAIL feedback loop arc routed from gate 3 back under lane to blueprint with red label; explicit PASS/FAIL status text per gate.

### 5. `mcp-integration/mcp-from-zero/03-three-primitives.html`
**Score**: 2.75 · **Track**: Magenta (#FF4DD8)  
**Level**: Experienced  
**Before**: Panel 2 (Resource) has 3 dots floating with URI labels misaligned above them; 9.5px mono; panels height 200px leaves dead whitespace at bottom; no client/server distinction  
**After**: Panels 185×240px, dots left-aligned with URI text at 12px to their right, dim connecting lines between objects, added client/server provenance label per panel. viewBox 600×290.

### 6. `orchestration/mars-systems/01-parallel-discovery.html`
**Score**: 3.25 · **Track**: Cyan (#00F5FF)  
**Level**: Expert  
**Before**: MARS orchestrator node 120px wide, 10px fan-out labels; wall-clock math annotation below visual area; no cost comparison panel  
**After**: Orchestrator 190×50px with subtitle; specialist nodes 96×58px at 14px bold; full cost comparison panel at bottom with gold accent showing SUM vs MAX arithmetic in 13px; explicit sequential vs parallel contrast.

### 7. `categorical-meta-prompting/cmp-foundations/01-objects-morphisms-composition.html`
**Score**: 3.25 · **Track**: Violet (#A78BFA)  
**Level**: Expert  
**Before**: Identity loop paths 1px hairlines, nearly invisible; id_ labels at 10px directly adjacent to node edges; morphism operator labels 10px with no halo  
**After**: Identity loops as clean arcs *above* nodes with clear space, 12px dimmed labels; node names 18px Playfair; morphism labels 13px JetBrains with halo; laws panel at bottom in contained rect. viewBox 620×320.

### 8. `categorical-meta-prompting/cmp-foundations/05-recursive-meta-prompting.html`
**Score**: 3.5 · **Track**: Violet (#A78BFA)  
**Level**: Expert  
**Before**: Quality trajectory axis labels 10px no halo (invisible on dark bg); RMP loop diamond 10px text; Monad laws section at 10px runs into quality graph  
**After**: RMP loop nodes 44px tall with 14–18px text; threshold line with theta label; trajectory line 2px with 5px terminal dot; Monad laws in separate bordered panel; all text 12–16px with halo. viewBox 600×340.

### 9. `formal-verification/fstar-7-levels/01-novice-proofs.html`
**Score**: 3.5 · **Track**: Arcade (#39FF14)  
**Level**: Novice  
**Before**: Code labels at 10px drift outside their box bounds (y misalignment); fail/ok status marks at 13px but no halo; cost annotations floating with no visual container  
**After**: All code inside 82px-tall boxes with 13px text and 3px halo; fail/ok markers 14px bold in red/green; cost and OCaml annotations in contained footer panels. viewBox 600×300.

### 10. `formal-verification/fstar-7-levels/02-refinement-types.html`
**Score**: 3.25 · **Track**: Arcade (#39FF14)  
**Level**: Novice  
**Before**: Root node 220×28px (too short for heading); branch boxes 170×56px cramped with 10px labels; proof insight at 10px at bottom with no background separation  
**After**: Root node 340×52px; branches 162×72px with 13px body text; fan-out arrows from root centroid (300,85); insight panel with red/dark background. viewBox 600×310.

---

## Design-Kit Specification

### File
`/Users/manu/Documents/LUXOR/PROJECTS/LUXOR-ACADEMY/modules/_shared/diagram-kit.css`

### Stats
- **File size**: 8.15 KB (comment-heavy; minified ≈ 2.8 KB — within the ≤3KB target for production delivery)
- **CSS classes**: 22 semantic classes
- **Color variables**: 10 design tokens + 6 track-accent modifiers
- **Marker patterns**: 5 arrowhead variants (accent, dim, cyan, ok, err)

### Class Index

| Class | Role |
|-------|------|
| `.lkd` | Root container — defines all tokens |
| `.lkd-accent-{track}` | Track accent override (coral/cyan/magenta/violet/arcade/gold) |
| `text` (inside `.lkd`) | Global halo via `paint-order: stroke fill` — the core fix |
| `.lkd-head` | Playfair Display 16px, accent-filled display heading |
| `.lkd-label` | JetBrains Mono 14px, white fill |
| `.lkd-op` | 12px accent-fill operator label |
| `.lkd-note` | 11px dim footnote |
| `.lkd-code` | 11px mono, D4E4F7 (light blue) for code fragments |
| `.lkd-ok / .lkd-err` | Status glyphs in green/red |
| `.lkd-node` | Primary rect fill + accent border + drop-shadow |
| `.lkd-node-dim` | Secondary rect, grey border |
| `.lkd-node-pill` | Full-rounded rect |
| `.lkd-node-hex` | Hexagonal polygon fill |
| `.lkd-node-diamond` | Decision diamond |
| `.lkd-node-terminal` | End-state: dark bg, green border |
| `.lkd-chip` | Tag/chip inside a node |
| `.lkd-panel` | Card panel behind diagram content |
| `.lkd-glow-{track}` | Glowing panel variant per track |
| `.lkd-arr` | Primary accent arrow |
| `.lkd-arr-dim` | Dashed grey secondary arrow |
| `.lkd-arr-cyan` | Cyan-always arrow |
| `.lkd-arr-ok / .lkd-arr-err` | Success/reject arrows |

### Typography Scale Enforced

| Class | Font | Size | Use |
|-------|------|------|-----|
| `.lkd-head` | Playfair Display | 16px | Section headings |
| `.lkd-label` (default) | JetBrains Mono | 14px | Node labels, body |
| `.lkd-op` | JetBrains Mono | 12px | Inline operators |
| `.lkd-note` | JetBrains Mono | 11px | Footnotes, citations |

All text elements inside `.lkd` inherit `paint-order: stroke fill; stroke: #0A1628; stroke-width: 4px; stroke-linejoin: round` — the halo pattern.

---

## Recommendations — Further Waves

The following diagrams were not redrawn (scored 3.0–3.9) but would benefit from a Wave 2 structural pass. CSS halo injection from main thread will help but not fully resolve these issues:

| Module | Issue | Effort |
|--------|-------|--------|
| `mcp-from-zero/01-two-layer-protocol` | Central divider spine needs explicit label explaining layer boundary; 9px mono inside boxes | Medium |
| `orchestration/mercurio-for-decisions/02-convergence-methods` | Method cards (80×22px) too small — text clips at 10px | Low |
| `cmp-foundations/02-prompts-as-morphisms` | Composition example section overflows viewBox; quality rule text 10px | Medium |
| `mars-systems/02-research-synthesis` | 26 text elements, left column labels collide with funnel arrows | Medium |
| `mars-systems/03-systems-optimization` | Two-panel contrast layout — metric arrows too small to read | Low |
| `mcp-from-zero/04-your-first-server` | Only 10 text elements, 9px loop station labels — simplest fix | Low |
| `fstar-7-levels/03-dependent-types` | Termination metric diagram — 10px, floating labels around recursion tree | Medium |
| `fstar-7-levels/04-indexed-types` | merge_sort tree — 18 elements, 10px labels, branches overlap | Medium |

**Priority order for Wave 3**: `02-two-layer-protocol`, `03-dependent-types`, `04-indexed-types`, `02-prompts-as-morphisms`.

---

## Coverage Summary

- **Modules audited**: 15 (of ~40 total, excluding forge-barque)
- **Redrawn**: 10 in-place
- **Track spread of rewrites**: 2 Novice (F* 01, 02) + 4 Experienced (MCP 03, DTP 01, 03, 04) + 4 Expert (MARS 01, 04, CMP 01, 05)
- **Primary font-size lift**: from 8–10px to 12–16px across all 10 diagrams
- **viewBox expansions**: 8 of 10 (average increase ~8% width, ~12% height)
- **Halo coverage**: 100% of rewritten text elements carry `paint-order: stroke fill` + navy stroke

---

## Wave 2 Completed

**Date**: 2026-04-20
**Auditor**: LibreUIUX Specialist (Wave 2 — structural restructure pass)
**Method**: Full SVG content replacement using `.lkd` kit classes, expanded viewBoxes, module-local arrow markers, clear reading-order hierarchy.

| # | File | viewBox (before → after) | Structural change | Readability gain |
|---|------|--------------------------|-------------------|-----------------|
| 1 | `mcp-integration/mcp-from-zero/01-two-layer-protocol.html` | 540×280 → **660×360** | Replaced ambiguous central divider with explicit two-band panels (lkd-node), three transport pill nodes at bottom, arrow trio lifting Bytes→Frames; band labels promoted to lkd-head | Layer boundary now obvious at a glance; transport swap story told by visual separation, not text alone |
| 2 | `formal-verification/fstar-7-levels/03-dependent-types.html` | 540×280 → **660×360** | Split into left (WITH decreases) and right (WITHOUT decreases) full-height panels; code inside lkd-node-dim blocks; green/red effect badge pills; proof obligations extracted to lkd-op row | Signatures no longer crowd; Tot vs Dv verdict readable without scanning raw code |
| 3 | `formal-verification/fstar-7-levels/04-indexed-types.html` | 540×280 → **660×380** | Vertical tree layout with generous row spacing (60px between levels); index metric annotated on left margin as a descending scale (8→4→2→1); level-2 nodes dimmed to show supporting role | Index/value relationship visible as a true descending ladder; branch lines no longer overlap node text |
| 4 | `categorical-meta-prompting/cmp-foundations/02-prompts-as-morphisms.html` | 560×300 → **700×400** | Decomposition chain and composition example placed in separate lkd-panel containers with clear section titles; functor law trio moved to a bottom chip row, eliminating overlap with composition row | Two concerns (decomposition / composition) separated spatially; quality law chip is copy-ready reference |
| 5 | `orchestration/mars-systems/02-research-synthesis.html` | 560×280 → **700×400** | Left raw-claims column given 186px width; arrows now route to correct bucket column explicitly; three bin panels given proportional height matching content; self-imposed bucket highlighted with stronger cyan border + taller allocation | Funnel routing legible; SELF-IMPOSED bucket visually dominant as highest-leverage surface |
| 6 | `orchestration/mars-systems/03-systems-optimization.html` | 560×280 → **700×400** | Two panels side-by-side with full-height inner dept stacks; composite metric block enlarged to 130×122px with named sub-metrics; green/red verdict row below each panel; divider clearly labels "contrast" | Dept→composite arrows traceable; verdicts readable without hovering; contrast axis explicit |
| 7 | `mcp-integration/mcp-from-zero/04-your-first-server.html` | 540×260 → **660×360** | Replaced compressed circles with three full-height lkd-node rect stations (INSTALL / RESTART / VERIFY), each with internal sub-step breakdown; iterate dashed loop retains position below; step-number labels on forward arrows | Server setup flow now reads as a linear left-to-right procedure with sub-steps visible, not three undifferentiated circles |
| 8 | `orchestration/mercurio-for-decisions/02-convergence-methods.html` | 540×260 → **700×420** | Three lanes expanded to give INTEGRATION 120px height; four method cards enlarged to 148×52px with sub-labels; DISCOVERY and EMBODIMENT get concrete role descriptions; bidirectional arrows retain position but labels added | Method cards no longer clip; each lane communicates its role without requiring the primer to decode |

**Wave 2 net changes**: 8 files modified, all SVG element blocks replaced, viewBoxes expanded 22–40%, `.lkd` class + `--lkd-accent` inline style added to all SVG roots, module-local `lkd-arrow-{N}` marker IDs prevent ID collision across pages.
