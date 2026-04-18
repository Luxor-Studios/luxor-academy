---
description: Natural transformation α: F ⇒ G for strategy switching between prompting functors
allowed-tools: Read, Grep, Glob, Bash(git log:*), Bash(git diff:*), TodoWrite
argument-hint: @from:[strategy] @to:[strategy] @verify:[bool] "task"
---

# Transform Command - Natural Transformations

This command implements **Natural Transformation α: F ⇒ G** for the categorical meta-prompting framework.

```
α: F ⇒ G
  - α_A: F(A) → G(A)  for each object A
  - Naturality: α_B ∘ F(f) = G(f) ∘ α_A  for all f: A → B
```

## Task
$ARGUMENTS

---

## Unified Syntax

```bash
/transform @from:[strategy] @to:[strategy] @verify:[bool] @preserve:[aspects] "task"
```

### Modifiers

| Modifier | Values | Default | Description |
|----------|--------|---------|-------------|
| `@from:` | strategy name | auto | Source functor/strategy |
| `@to:` | strategy name | auto | Target functor/strategy |
| `@verify:` | true, false | true | Verify naturality condition |
| `@preserve:` | structure, semantics, quality | all | What to preserve in transformation |
| `@mode:` | transform, compare, analyze | transform | Operation mode |

---

## Strategy Registry

### Available Strategies (Functors)

Each strategy is a functor F: Task → Prompt with specific characteristics:

```yaml
STRATEGY_REGISTRY:

  zero-shot:
    functor: F_ZS
    signature: Task → DirectPrompt
    characteristics:
      - No examples
      - Relies on model knowledge
      - Fast, minimal tokens
    quality_baseline: 0.65
    token_cost: low

  few-shot:
    functor: F_FS
    signature: Task → ExemplarPrompt
    characteristics:
      - 2-5 examples
      - Pattern demonstration
      - Higher accuracy
    quality_baseline: 0.78
    token_cost: medium

  chain-of-thought:
    functor: F_CoT
    signature: Task → ReasoningPrompt
    characteristics:
      - Step-by-step reasoning
      - Explicit thought process
      - Better for complex tasks
    quality_baseline: 0.85
    token_cost: medium-high

  tree-of-thought:
    functor: F_ToT
    signature: Task → BranchingPrompt
    characteristics:
      - Multiple reasoning paths
      - Backtracking capability
      - Best for search problems
    quality_baseline: 0.88
    token_cost: high

  meta-prompting:
    functor: F_Meta
    signature: Task → MetaPrompt
    characteristics:
      - Self-referential
      - Strategy selection
      - Adaptive approach
    quality_baseline: 0.90
    token_cost: variable

  self-consistency:
    functor: F_SC
    signature: Task → ConsensusPrompt
    characteristics:
      - Multiple samples
      - Majority voting
      - Robust to variance
    quality_baseline: 0.82
    token_cost: high

  react:
    functor: F_ReAct
    signature: Task → ActionPrompt
    characteristics:
      - Reasoning + Acting
      - Tool integration
      - Interactive
    quality_baseline: 0.84
    token_cost: variable
```

---

## Natural Transformation Operations

### @mode:transform (Default)

Apply the natural transformation α: F ⇒ G to convert between strategies.

```bash
/transform @from:zero-shot @to:chain-of-thought "explain sorting algorithm"
```

**Semantics**:
```
Given task T and prompt P = F_ZS(T):
  α_T: F_ZS(T) → F_CoT(T)

Transformation adds:
  - "Let's think step by step" framing
  - Reasoning structure
  - Intermediate checkpoints
```

**Implementation**:
```
α[from→to](prompt) = {
  1. Extract task semantics from source prompt
  2. Apply target strategy's functor
  3. Verify naturality condition (if @verify:true)
  4. Return transformed prompt
}
```

### @mode:compare

Compare how different strategies handle the same task.

```bash
/transform @mode:compare @from:zero-shot @to:chain-of-thought "task"
```

**Output**:
```yaml
COMPARISON:
  source:
    strategy: zero-shot
    prompt: "..."
    estimated_quality: 0.65
    token_cost: 120

  target:
    strategy: chain-of-thought
    prompt: "..."
    estimated_quality: 0.85
    token_cost: 350

  transformation:
    quality_delta: +0.20
    cost_delta: +230 tokens
    recommendation: "Use CoT for complex reasoning tasks"
```

### @mode:analyze

Analyze which transformation would be optimal for a task.

```bash
/transform @mode:analyze "complex multi-step problem"
```

**Output**:
```yaml
ANALYSIS:
  task_complexity: high
  task_type: reasoning

  recommended_transformations:
    1. zero-shot → chain-of-thought  (quality: +0.20)
    2. chain-of-thought → tree-of-thought  (quality: +0.03)

  optimal_strategy: chain-of-thought
  reason: "Balances quality improvement with token cost"
```

---

## Naturality Condition

### The Naturality Square

For transformation α: F ⇒ G to be natural, this diagram must commute:

```
      F(f)
F(A) ──────▶ F(B)
  │            │
α_A          α_B
  ▼            ▼
G(A) ──────▶ G(B)
      G(f)

Condition: α_B ∘ F(f) = G(f) ∘ α_A
```

### Verification Protocol

When `@verify:true` (default):

```yaml
NATURALITY_CHECK:
  # For sample morphisms f: A → B

  path_1:  # Top then right
    - Apply F(f) to source
    - Apply α_B to result
    result: R1

  path_2:  # Left then bottom
    - Apply α_A to source
    - Apply G(f) to result
    result: R2

  naturality_satisfied: R1 ≈ R2
  similarity_score: [0-1]
  threshold: 0.85
```

### Semantic Naturality

In the prompting context, naturality means:

```
"Transforming the prompt then refining"
    =
"Refining then transforming"

Practically:
- Strategy switch preserves task semantics
- Order of operations doesn't affect meaning
- Transformation is "uniform" across all tasks
```

---

## Transformation Rules

### Zero-Shot → Few-Shot
```yaml
α[ZS→FS]:
  add:
    - Example demonstrations (2-5)
    - Input/output patterns
  preserve:
    - Core task description
    - Output format requirements
  naturality: ✓ (adding examples commutes with task refinement)
```

### Zero-Shot → Chain-of-Thought
```yaml
α[ZS→CoT]:
  add:
    - "Let's think step by step"
    - Reasoning structure template
    - Intermediate checkpoints
  preserve:
    - Task semantics
    - Final output requirements
  naturality: ✓ (reasoning addition is uniform)
```

### Few-Shot → Chain-of-Thought
```yaml
α[FS→CoT]:
  transform:
    - Examples become reasoning traces
    - Pattern → Process
  preserve:
    - Number of demonstrations
    - Domain context
  naturality: ✓ (example transformation is uniform)
```

### Chain-of-Thought → Tree-of-Thought
```yaml
α[CoT→ToT]:
  add:
    - Branch points
    - Evaluation criteria
    - Backtracking markers
  transform:
    - Linear reasoning → Tree structure
  preserve:
    - Individual reasoning steps
    - Final goal
  naturality: ✓ (branching is uniform transformation)
```

### Any → Meta-Prompting
```yaml
α[*→Meta]:
  wrap:
    - Strategy selection layer
    - Self-reflection component
    - Adaptive routing
  preserve:
    - All source strategy capabilities
    - Task semantics
  naturality: ✓ (meta-wrapping is uniform)
```

---

## Composition of Transformations

Natural transformations compose:

```
α: F ⇒ G
β: G ⇒ H
─────────
β ∘ α: F ⇒ H
```

### Vertical Composition
```bash
/chain [/transform @from:ZS @to:CoT → /transform @from:CoT @to:ToT] "task"
```

Equivalent to:
```bash
/transform @from:zero-shot @to:tree-of-thought "task"
```

### Horizontal Composition (Whiskering)
```bash
/transform @from:F∘G @to:F∘H "composed functor transformation"
```

---

## Quality Propagation

```
quality(α_A(x)) = transform_factor × quality(x)

Where transform_factor depends on:
  - Source strategy baseline
  - Target strategy baseline
  - Task complexity match
```

### Transformation Quality Matrix

| From \ To | ZS | FS | CoT | ToT | Meta |
|-----------|-----|-----|------|------|-------|
| **ZS** | 1.0 | 1.15 | 1.25 | 1.30 | 1.35 |
| **FS** | 0.85 | 1.0 | 1.10 | 1.15 | 1.20 |
| **CoT** | 0.75 | 0.90 | 1.0 | 1.05 | 1.10 |
| **ToT** | 0.70 | 0.85 | 0.95 | 1.0 | 1.05 |
| **Meta** | 0.70 | 0.85 | 0.92 | 0.98 | 1.0 |

*Values > 1.0 indicate quality improvement*

---

## Checkpoint Format

```yaml
CHECKPOINT_TRANSFORM_[n]:
  command: /transform
  from_strategy: [source]
  to_strategy: [target]
  verify: [true|false]

  input:
    source_prompt: "[original]"
    source_quality: [0-1]
    token_count: [n]

  transformation:
    applied: α[from→to]
    naturality_verified: [true|false]
    naturality_score: [0-1]

  output:
    target_prompt: "[transformed]"
    target_quality: [0-1]
    token_count: [n]

  quality:
    transform_factor: [ratio]
    quality_delta: [+/-]
    cost_delta: [tokens]

  status: [TRANSFORMED | VERIFIED | FAILED_NATURALITY | ERROR]
```

---

## Examples

### Example 1: Basic Strategy Switch
```bash
/transform @from:zero-shot @to:chain-of-thought "explain quicksort"
```

**Input** (Zero-Shot):
```
Explain the quicksort algorithm.
```

**Output** (Chain-of-Thought):
```
Explain the quicksort algorithm.

Let's think through this step by step:

1. First, I'll describe the core concept
2. Then, I'll explain the partition operation
3. Next, I'll show the recursive structure
4. Finally, I'll analyze the complexity

[Reasoning proceeds...]
```

### Example 2: With Verification
```bash
/transform @from:few-shot @to:chain-of-thought @verify:true "classify sentiment"
```

**Naturality Check**:
```yaml
NATURALITY_VERIFICATION:
  test_morphism: "add negation handling"

  path_1_result: "CoT prompt with negation examples"
  path_2_result: "CoT prompt with negation examples"

  paths_equivalent: true
  naturality_satisfied: ✓
```

### Example 3: Analysis Mode
```bash
/transform @mode:analyze "solve this differential equation: dy/dx = 2xy"
```

**Output**:
```yaml
TASK_ANALYSIS:
  complexity: medium-high
  type: mathematical_reasoning
  requires: step-by-step derivation

RECOMMENDATION:
  optimal_path: zero-shot → chain-of-thought
  reason: "Mathematical problems benefit from explicit reasoning steps"
  quality_improvement: +0.25
  cost_increase: +180 tokens
```

### Example 4: Chained Transformation
```bash
/chain [/transform @from:ZS @to:FS → /transform @from:FS @to:CoT] "complex task"
```

**Execution**:
```
1. ZS → FS: Add examples (α₁)
2. FS → CoT: Convert to reasoning traces (α₂)
3. Result: α₂ ∘ α₁ = α[ZS→CoT] with examples
```

### Example 5: Pipeline Integration
```bash
/chain [/context @mode:extract → /transform @from:auto @to:CoT → /rmp @quality:0.85] "adaptive task"
```

**Execution**:
```
1. Extract context (Comonad W)
2. Auto-detect current strategy, transform to CoT (Natural Transformation α)
3. Refine until quality ≥ 0.85 (Monad M)
```

---

## Composition Integration

### With → (Sequential)
```bash
/chain [/transform @from:ZS @to:CoT → /review] "transform then review"
```

### With || (Parallel)
```bash
/chain [/transform @to:CoT || /transform @to:ToT] @mode:compare "compare strategies"
```

### With ⊗ (Tensor)
```bash
/chain [/transform ⊗ /context] "context-aware transformation"
```

### With >=> (Kleisli)
```bash
/chain [/transform @to:CoT >=> /rmp] "transform then refine"
```

---

## Error Handling

### Invalid Strategy
```yaml
ERROR: INVALID_STRATEGY
reason: "Unknown strategy: 'xyz'"
valid_strategies: [zero-shot, few-shot, chain-of-thought, tree-of-thought, meta-prompting, self-consistency, react]
action: "Use a valid strategy name"
```

### Naturality Violation
```yaml
ERROR: NATURALITY_VIOLATED
reason: "Transformation paths produce different results"
similarity_score: 0.62
threshold: 0.85
action: "Use @verify:false to skip verification, or choose different transformation"
```

### Incompatible Transformation
```yaml
WARNING: SUBOPTIMAL_TRANSFORMATION
from: tree-of-thought
to: zero-shot
quality_loss: -0.30
recommendation: "Consider if simplification is intentional"
```

---

## Implementation Notes

### Strategy Detection
```python
def detect_strategy(prompt: str) -> Strategy:
    """Auto-detect the prompting strategy used."""
    if "step by step" in prompt.lower():
        return Strategy.CHAIN_OF_THOUGHT
    if "Example:" in prompt or "Input:" in prompt:
        return Strategy.FEW_SHOT
    if "evaluate" in prompt and "branches" in prompt:
        return Strategy.TREE_OF_THOUGHT
    # ... more heuristics
    return Strategy.ZERO_SHOT
```

### Transformation Application
```python
def apply_transformation(
    prompt: str,
    from_strategy: Strategy,
    to_strategy: Strategy,
    verify: bool = True
) -> TransformResult:
    """Apply natural transformation α: F ⇒ G."""

    # Get transformation rule
    alpha = TRANSFORMATION_REGISTRY[(from_strategy, to_strategy)]

    # Apply transformation
    transformed = alpha.transform(prompt)

    # Verify naturality if requested
    if verify:
        naturality_score = verify_naturality(prompt, transformed, alpha)
        if naturality_score < NATURALITY_THRESHOLD:
            raise NaturalityViolation(naturality_score)

    return TransformResult(
        prompt=transformed,
        naturality_verified=verify,
        naturality_score=naturality_score if verify else None
    )
```

---

## Aliases

For common transformations:

```bash
/cot    = /transform @to:chain-of-thought
/tot    = /transform @to:tree-of-thought
/meta   = /transform @to:meta-prompting  # Note: different from /meta command
```

---

## References

- **Categorical Foundation**: `categorical-structure-builder` skill (Template 4)
- **Unified Syntax**: `meta-self` skill
- **Strategy Patterns**: `recursive-meta-prompting` skill
- **Quality Tracking**: `quality-enriched-prompting` skill
- **Composition**: `ORCHESTRATION-SPEC.md`

---

## Version

**Command Version**: 1.0
**Framework Compatibility**: 2.1+
**Categorical Structure**: Natural Transformation α: F ⇒ G
**Laws Verified**: ✓ Naturality condition
**Strategies Supported**: 7 (ZS, FS, CoT, ToT, Meta, SC, ReAct)
