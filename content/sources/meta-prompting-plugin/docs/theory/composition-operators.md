# Composition Operators

The four ways commands combine in `/chain`.

## Summary

| Symbol | Unicode | Name | Semantics | Quality rule |
|---|---|---|---|---|
| `→` | U+2192 | Sequential (Kleisli) | Output of left → input of right | `min(q₁, q₂)` |
| `\|\|` | — | Parallel | Run concurrently, aggregate | `mean(q₁, q₂, ...)` |
| `⊗` | U+2297 | Tensor | Combine state, degrading quality | `min(q₁, q₂)` with compound loss |
| `>=>` | — | Kleisli monadic refinement | Monadic bind with quality gates | Monotone — improves iteratively |

## Sequential `→`

```
/chain [/meta → /rmp] @quality:0.85 "<task>"
```

`output_of_meta → input_of_rmp`. The quality of the chain is the min of its parts — one weak stage drags the whole chain down.

## Parallel `||`

```
/chain [/meta || /meta || /meta] "<task>"
```

Three independent runs aggregated into one output. Use for exploration, voting, or diversity. Quality is the mean across branches.

## Tensor `⊗`

```
/chain [/meta ⊗ /context] "<task>"
```

Combines state from both branches into a product. Semantically stronger than sequential but quality degrades because both branches' errors compound.

## Kleisli `>=>`

```
/chain [f >=> g >=> h] "<task>"
```

Monadic bind chain. Each step returns a monadic value (with quality context); the next step continues the refinement. Unlike `→` where quality can only degrade, `>=>` is designed for monotone improvement — the quality gate in `/rmp` is a natural fit.

## Associativity

`>=>` is associative: `(f >=> g) >=> h = f >=> (g >=> h)`. Same holds for `→` over Kleisli composition. This means you can parenthesize chains freely:

```
/chain [/meta → (/rmp → /review)] "<task>"
# ≡
/chain [(/meta → /rmp) → /review] "<task>"
```

## Identity

`return` / `/meta` with an identity task is the identity morphism. Composing with identity is a no-op:

```
/chain [/meta → id] = /meta
```

## When to use which

- **→** — default for sequential pipelines.
- **||** — you want multiple perspectives, vote on best.
- **⊗** — combining two independent state streams, and you accept quality compound loss.
- **>=>** — refinement loops (`/rmp` internal).
