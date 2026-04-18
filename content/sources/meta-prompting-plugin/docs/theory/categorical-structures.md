# Categorical Structures Used in the Plugin

Quick reference. For motivation and laws see [`foundations.md`](foundations.md).

## Functor F

```
F : Task → Prompt
F(id_T) = id_P
F(g ∘ f) = F(g) ∘ F(f)
```

**Command:** `/meta`
**Use when:** you want task complexity to drive strategy selection.

## Monad M

```
M = (Prompt, return, bind)
return : Prompt → M(Prompt)
bind   : M(Prompt) × (Prompt → M(Prompt)) → M(Prompt)
```

**Command:** `/rmp`
**Use when:** you want iterative refinement with quality convergence.

**Laws:**
- `return >=> f = f`
- `f >=> return = f`
- `(f >=> g) >=> h = f >=> (g >=> h)`

## Comonad W

```
W = (Context, extract, duplicate)
extract   : W(A) → A
duplicate : W(A) → W(W(A))
extend    : (W(A) → B) → W(A) → W(B)
```

**Command:** `/context`
**Use when:** you need context-aware prompting or meta-observation.

**Laws:**
- `extract ∘ duplicate = id`
- `duplicate ∘ duplicate = fmap duplicate ∘ duplicate`

## Natural Transformation α

```
α : F ⇒ G
α_X : F(X) → G(X)   for each object X
α_B ∘ F(f) = G(f) ∘ α_A   (naturality)
```

**Command:** `/transform`
**Use when:** swapping strategy without changing task.

## Exception Monad E

```
E(A) = Either<Error, A> = Left(Error) | Right(A)
catch : E(A) × (Error → E(A)) → E(A)
```

**Modifiers:** `@catch:`, `@fallback:`
**Use when:** pipelines involve unreliable steps.

**Laws:**
- `catch(Right(a), h) = Right(a)`
- `catch(Left(e), h) = h(e)`

## [0,1]-Enriched Category

```
Hom_Q(A, B) = [0,1]
```

**Modifiers:** `@quality:`, `@quality:visualize`
**Use when:** you want quality gating or flow visualization.

**Monotonicity:** `quality(A ⊗ B) ≤ min(quality(A), quality(B))`
