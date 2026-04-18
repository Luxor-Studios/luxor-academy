# Theoretical Foundations

> You do not need this document to use the plugin. Read it if you want to understand why the commands compose the way they do.

## The one-line summary

Every command in this plugin is a **categorical structure in disguise**. Prompts and tasks form a category; the commands are functors, monads, comonads, and natural transformations between them. Composition works because category theory guarantees it.

## The primary objects

- **Task `T`** — a goal in natural language: "implement X", "summarize Y".
- **Prompt `P`** — the string we actually send to the model.
- **Context `C`** — the surrounding state: history, code, tool outputs.
- **Quality `q ∈ [0,1]`** — a scalar we track alongside every transformation.

## The primary morphisms (commands)

### `/meta` — Functor `F : Task → Prompt`

A functor is a structure-preserving map. `/meta` takes a task and produces a prompt such that:

- **Identity:** `F(id_T) = id_P` — the "do nothing" task maps to the "do nothing" prompt.
- **Composition:** `F(g ∘ f) = F(g) ∘ F(f)` — composing two tasks first and then mapping equals mapping each and then composing.

In practice: complexity classification is a functor. Tier `L3` tasks always produce `L3`-shaped prompts.

### `/rmp` — Monad `M : Prompt →ⁿ Prompt`

A monad is a way to chain computations that carry extra context. `M = (Prompt, return, bind)`:

- `return : Prompt → M(Prompt)` — wrap a prompt in quality-tracking context.
- `bind : M(Prompt) × (Prompt → M(Prompt)) → M(Prompt)` — refine, carrying quality forward.

**Laws:**
- Left identity: `return >=> f = f`
- Right identity: `f >=> return = f`
- Associativity: `(f >=> g) >=> h = f >=> (g >=> h)`

In practice: RMP iterates `refine >=> refine >=> ...` until `quality ≥ threshold`.

### `/context` — Comonad `W : History → Context`

A comonad is the dual of a monad: instead of lifting into context, you extract from it.

- `extract : W(A) → A` — focus on the current value.
- `duplicate : W(A) → W(W(A))` — create a meta-observation (context-of-context).
- `extend : (W(A) → B) → W(A) → W(B)` — context-aware transform.

**Laws:**
- `extract ∘ duplicate = id`
- `duplicate ∘ duplicate = fmap duplicate ∘ duplicate`

In practice: `/context @mode:extract` gives you a focused slice. `@mode:duplicate` gives you a view-of-views for meta-reasoning.

### `/transform` — Natural Transformation `α : F ⇒ G`

If `F` and `G` are both functors `Task → Prompt` (different strategies), a natural transformation `α` converts one to the other while preserving task structure.

**Naturality:**
```
α_B ∘ F(f) = G(f) ∘ α_A     for all f : A → B
```

In practice: `/transform @from:chain-of-thought @to:debate` swaps strategies without changing the task.

### `/chain` — Composition

Four composition operators with different quality rules:

| Operator | Composition | Quality rule |
|---|---|---|
| `→` | Sequential (Kleisli) | `min(q₁, q₂)` — weakest link |
| `\|\|` | Parallel (concurrent) | `mean(q₁, q₂, ...)` — average |
| `⊗` | Tensor (degrading combination) | `min(q₁, q₂)` — but degrades further with compound effect |
| `>=>` | Kleisli refinement | Improves iteratively — monotone |

## Enrichment: `[0,1]`-categories

Instead of a set of morphisms between two objects, we have a *number* in `[0,1]` — the quality of the best transformation from A to B:

```
Hom_Q(A, B) = [0,1]
```

**Quality monotonicity:** `quality(A ⊗ B) ≤ min(quality(A), quality(B))`.

This is why chains degrade: composing lossy steps compounds loss.

## Why this matters operationally

Category theory isn't decoration — it gives you three practical guarantees:

1. **Composition always type-checks.** If `f : A → B` and `g : B → C` both respect the functor/monad structure, `g ∘ f : A → C` does too.
2. **Laws enable refactoring.** Associativity of `>=>` means `(f >=> g) >=> h = f >=> (g >=> h)` — you can rearrange pipelines without changing behavior.
3. **Quality is principled.** Enrichment gives you a consistent way to track degradation across arbitrarily long chains.

## Further reading

See [`further-reading.md`](further-reading.md) for foundational papers (Gavranović et al., de Wynter et al., Bradley, Spivak-Niu).
