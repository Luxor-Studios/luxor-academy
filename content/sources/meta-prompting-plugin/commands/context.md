---
description: Comonad W operations for context extraction, meta-observation, and context-aware transformations
allowed-tools: Read, Grep, Glob, Bash(git log:*), Bash(git diff:*), TodoWrite
argument-hint: @mode:[extract|duplicate|extend] @focus:[target] @depth:[n] "task"
---

# Context Command - Comonad W Operations

This command implements **Comonad W: History → Context** for the categorical meta-prompting framework.

```
W: History → Context
  - extract:   W(A) → A           (focus on current value)
  - duplicate: W(A) → W(W(A))     (create meta-observation)
  - extend:    (W(A) → B) → W(A) → W(B)  (context-aware transform)
```

## Task
$ARGUMENTS

---

## Unified Syntax

```bash
/context @mode:[extract|duplicate|extend] @focus:[target] @depth:[n] "task"
```

### Modifiers

| Modifier | Values | Default | Description |
|----------|--------|---------|-------------|
| `@mode:` | extract, duplicate, extend | extract | Comonad operation |
| `@focus:` | recent, all, file, conversation | recent | Context target |
| `@depth:` | 1-10 | 3 | History depth to consider |
| `@transform:` | summarize, analyze, synthesize | - | For extend mode |

---

## Comonad Operations

### @mode:extract - Focus on Current Value

**Categorical**: `ε: W(A) → A` (counit)

Extract the focused/relevant context from the execution history.

```bash
/context @mode:extract @focus:recent "get current task context"
/context @mode:extract @focus:file @depth:1 "extract from current file"
```

**Semantics**:
- Retrieves the most relevant context for the current task
- Filters noise, focuses on actionable information
- Returns a focused summary, not raw history

**Implementation**:
```
W.extract(history) = {
  1. Identify current focus (task, file, conversation)
  2. Filter history to relevant entries
  3. Extract key information
  4. Return focused context object
}
```

### @mode:duplicate - Create Meta-Observation

**Categorical**: `δ: W(A) → W(W(A))` (comultiplication)

Create a meta-level observation of the context itself - useful for reasoning about the reasoning process.

```bash
/context @mode:duplicate "observe the observation process"
/context @mode:duplicate @depth:5 "create meta-view of context evolution"
```

**Semantics**:
- Wraps the current context in another context layer
- Enables reasoning about HOW context was gathered
- Useful for debugging prompts and understanding failures

**Implementation**:
```
W.duplicate(history) = {
  1. Take current context W(A)
  2. Create observation of the context: W(W(A))
  3. Include: what was focused, what was filtered, why
  4. Return meta-context enabling self-reflection
}
```

### @mode:extend - Context-Aware Transformation

**Categorical**: `extend: (W(A) → B) → W(A) → W(B)`

Apply a transformation that has access to the full context, not just the focused value.

```bash
/context @mode:extend @transform:summarize "summarize with full context awareness"
/context @mode:extend @transform:analyze "analyze considering history"
```

**Semantics**:
- Applies a function that can see the ENTIRE context
- Unlike functor map, the function receives W(A), not just A
- Enables context-dependent transformations

**Implementation**:
```
W.extend(f)(history) = {
  1. For each position in history
  2. Apply f with full context visible
  3. Collect results into new contextualized structure
  4. Return W(B) with transformed content
}
```

---

## Comonad Laws (Enforced)

These laws MUST be satisfied for correct operation:

```
1. Left Identity:   extract ∘ duplicate = id
   - Duplicating then extracting returns original

2. Right Identity:  fmap extract ∘ duplicate = id
   - Duplicating then mapping extract over inner = original

3. Associativity:   duplicate ∘ duplicate = fmap duplicate ∘ duplicate
   - Order of duplication doesn't matter
```

**Verification**:
```yaml
LAW_CHECK:
  law_1: extract(duplicate(ctx)) == ctx  ✓
  law_2: fmap(extract)(duplicate(ctx)) == ctx  ✓
  law_3: duplicate(duplicate(ctx)) == fmap(duplicate)(duplicate(ctx))  ✓
```

---

## Focus Targets

### @focus:recent
Focus on the most recent context (last N interactions based on @depth:).

```bash
/context @mode:extract @focus:recent @depth:3 "what have we been working on?"
```

### @focus:all
Consider the entire available history.

```bash
/context @mode:extract @focus:all "get comprehensive context"
```

### @focus:file
Focus on context related to a specific file or set of files.

```bash
/context @mode:extract @focus:file "context for src/auth.ts"
```

### @focus:conversation
Focus on the conversation flow and decisions made.

```bash
/context @mode:extract @focus:conversation "how did we arrive at this design?"
```

---

## Composition Integration

### With → (Sequential)
```bash
/chain [/context @mode:extract → /meta → /review] "contextualized workflow"
```
Context extracted first, then passed to meta-prompting, then reviewed.

### With || (Parallel)
```bash
/chain [/context @focus:file || /context @focus:conversation] "gather multiple contexts"
```
Gather file and conversation context in parallel.

### With ⊗ (Tensor)
```bash
/chain [/context ⊗ /analyze] "context-enriched analysis"
```
Combine context with analysis, quality = min(q_context, q_analyze).

### With >=> (Kleisli)
```bash
/chain [/context @mode:extract >=> /rmp] "extract then refine with context"
```
Context extraction feeds into quality-gated refinement.

---

## Quality Propagation

```
quality(extract(W(A))) ≤ quality(W(A))
  - Extraction may lose some context, quality can degrade

quality(duplicate(W(A))) = quality(W(A))
  - Duplication preserves quality (no information lost)

quality(extend(f)(W(A))) = quality(f(W(A)))
  - Quality depends on the transformation function
```

---

## Checkpoint Format

```yaml
CHECKPOINT_CONTEXT_[n]:
  command: /context
  mode: [extract|duplicate|extend]
  focus: [target]
  depth: [n]

  input:
    history_size: [entries]
    relevant_entries: [count]

  output:
    context_type: [focused|meta|transformed]
    context_size: [tokens]
    key_elements: [list]

  quality:
    relevance: [0-1]      # How relevant is extracted context?
    completeness: [0-1]   # Did we capture necessary info?
    clarity: [0-1]        # Is context clear and usable?
    aggregate: [0-1]

  comonad_laws:
    law_1_satisfied: [true|false]
    law_2_satisfied: [true|false]
    law_3_satisfied: [true|false]

  status: [EXTRACTED | DUPLICATED | EXTENDED | ERROR]
```

---

## Examples

### Example 1: Extract Recent Context
```bash
/context @mode:extract @focus:recent @depth:5 "summarize what we've accomplished"
```

**Output**: Focused summary of last 5 significant interactions, highlighting accomplishments and current state.

### Example 2: Meta-Observation for Debugging
```bash
/context @mode:duplicate "why did the last prompt fail?"
```

**Output**: Meta-level analysis showing what context was available, what was focused on, and what might have been missed.

### Example 3: Context-Aware Summary
```bash
/context @mode:extend @transform:summarize "create executive summary"
```

**Output**: Summary that considers the full context of the work, not just the final result.

### Example 4: Pipeline with Context
```bash
/chain [/context @mode:extract → /meta @tier:L4 → /review] "implement with context"
```

**Output**: Implementation that leverages extracted context, then reviewed.

### Example 5: Parallel Context Gathering
```bash
/chain [/context @focus:file || /context @focus:conversation] → /synthesize "comprehensive view"
```

**Output**: Synthesized view combining file-level and conversation-level context.

---

## Aliases

For convenience, common patterns have aliases:

```bash
/extract = /context @mode:extract
/focus   = /context @mode:extract @depth:1
```

Usage:
```bash
/extract @focus:recent "get current context"
/focus "what's the immediate focus?"
```

---

## Error Handling

### Insufficient History
```yaml
ERROR: INSUFFICIENT_HISTORY
reason: "Requested depth exceeds available history"
action: "Reduce @depth: or use @focus:all"
fallback: "Return available context with warning"
```

### No Relevant Context
```yaml
ERROR: NO_RELEVANT_CONTEXT
reason: "No context matches the focus criteria"
action: "Broaden @focus: or reduce specificity"
fallback: "Return empty context with guidance"
```

---

## Implementation Notes

### Context Store Structure
```python
@dataclass
class ContextStore:
    """Comonadic context store."""
    entries: List[ContextEntry]
    focus_index: int
    metadata: Dict[str, Any]

    def extract(self) -> Context:
        """W.extract: Get focused value."""
        return self.entries[self.focus_index].context

    def duplicate(self) -> 'ContextStore':
        """W.duplicate: Create meta-observation."""
        return ContextStore(
            entries=[ContextEntry(context=self, ...)],
            focus_index=0,
            metadata={"level": "meta", "original": self}
        )

    def extend(self, f: Callable[['ContextStore'], B]) -> 'ContextStore':
        """W.extend: Context-aware transformation."""
        new_entries = []
        for i in range(len(self.entries)):
            shifted = self._shift_focus(i)
            new_entries.append(ContextEntry(context=f(shifted), ...))
        return ContextStore(entries=new_entries, ...)
```

### Comonad Law Verification
```python
def verify_comonad_laws(ctx: ContextStore) -> bool:
    """Verify all comonad laws hold."""
    # Law 1: extract . duplicate = id
    law1 = ctx.duplicate().extract() == ctx

    # Law 2: fmap extract . duplicate = id
    law2 = ctx.duplicate().fmap(lambda w: w.extract()) == ctx

    # Law 3: duplicate . duplicate = fmap duplicate . duplicate
    law3 = ctx.duplicate().duplicate() == ctx.duplicate().fmap(lambda w: w.duplicate())

    return law1 and law2 and law3
```

---

## References

- **Categorical Foundation**: `categorical-meta-prompting` skill
- **Unified Syntax**: `meta-self` skill
- **Composition**: `ORCHESTRATION-SPEC.md`
- **Quality Tracking**: `quality-enriched-prompting` skill

---

## Version

**Command Version**: 1.0
**Framework Compatibility**: 2.0+
**Categorical Structure**: Comonad W
**Laws Verified**: ✓ All 3 comonad laws
