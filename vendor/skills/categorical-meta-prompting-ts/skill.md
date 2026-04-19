---
name: categorical-meta-prompting-v2
description: "TypeScript implementation of categorical meta-prompting using fp-ts. Provides Functor M: T -> P for task-to-prompt mapping, RMP Writer Monad for iterative refinement with EditScript tracking, and Env/Store Comonads for context extraction. Dual-mode: ClaudeCodeProvider (no API key) or AnthropicProvider/OpenAIProvider. All categorical laws verified with property-based tests."
tags:
  - category-theory
  - meta-prompting
  - functor
  - monad
  - comonad
  - typescript
  - fp-ts
  - prompt-engineering
triggers:
  - categorical meta-prompting
  - functor task prompt
  - rmp monad refinement
  - comonad context extraction
  - prompt engineering typescript
---

# Categorical Meta-Prompting v2 (TypeScript)

Package: `@categorical-meta-prompting/core` (v2.0.0)

## Categorical Pipeline

```
Task --> [Functor M] --> Prompt --> [RMP Monad] --> Refined Prompt --> [Observe Comonad] --> Contextualized Output
         T -> P           Writer<EditScript>           Env/Store
```

## Quick Start

```typescript
import {
  task, createMetaPromptFunctor,
  of, addStep, setQuality, runRMP,
  observe, initialContext, extractObservation, qualityTrend, getContext,
} from '@categorical-meta-prompting/core';

// 1. Define a Task (category T)
const myTask = task(
  'solve-puzzle', 'mathematical',
  { numbers: [8, 3, 8, 3], target: 24 },
  { inputType: 'number[]', outputType: 'string',
    constraints: ['Use all numbers once'], steps: ['Try operations', 'Verify'] },
  { complexity: 'moderate', domain: 'puzzles', tags: ['math'] }
);

// 2. Apply Functor M: T -> P
const M = createMetaPromptFunctor();
const prompt = M.mapObject(myTask);

// 3. Refine with RMP Monad (Writer over EditScript)
const refined = setQuality(
  addStep(of(prompt), { name: 'verify', description: 'Double-check result', order: 10 }),
  0.95
);
const [finalPrompt, editHistory] = runRMP(refined);

// 4. Extract context with Observe Comonad
const observed = observe(initialContext(), finalPrompt);
console.log(qualityTrend(getContext(observed)));
```

## Dual-Mode Providers

```typescript
// Claude Code mode (no API key needed, runs inside Claude Code)
import { ClaudeCodeProvider } from '@categorical-meta-prompting/core/providers';
const provider = new ClaudeCodeProvider();

// npm mode with Anthropic
import { AnthropicProvider } from '@categorical-meta-prompting/core/providers';
const provider = new AnthropicProvider(); // uses ANTHROPIC_API_KEY

// npm mode with OpenAI
import { OpenAIProvider } from '@categorical-meta-prompting/core/providers';
const provider = new OpenAIProvider(); // uses OPENAI_API_KEY
```

## Key Exports

### Core Category Theory (`@categorical-meta-prompting/core`)

| Export | Purpose |
|--------|---------|
| `Morphism`, `compose`, `identity` | Categorical morphisms and composition |
| `Functor`, `Monad`, `Comonad` | Type class interfaces |
| `NaturalTransformation`, `Adjunction` | Higher categorical structures |
| `Monoid`, `monoid`, `fold` | Algebraic monoid abstraction |

### Domain Types

| Export | Purpose |
|--------|---------|
| `Task`, `task`, `TaskMorphism` | Objects and morphisms in category T |
| `Prompt`, `prompt`, `PromptMorphism` | Objects and morphisms in category P |
| `EditScript`, `editScriptMonoid` | Monoid for refinement tracking |

### Functor M: T -> P

| Export | Purpose |
|--------|---------|
| `createMetaPromptFunctor()` | Create functor instance with `mapObject` and `mapMorphism` |
| `metaPrompt(task)` | Direct task-to-prompt mapping |
| `verifyIdentityLaw`, `verifyCompositionLaw` | Law verification helpers |

### RMP Monad (Writer over EditScript)

| Export | Purpose |
|--------|---------|
| `of(prompt)` | Lift prompt into RMP (unit/return) |
| `flatMap`, `chain`, `map` | Monadic operations |
| `addStep`, `modifyTemplate`, `addConstraint` | Prompt refinement operations |
| `setQuality`, `setFormat` | Metadata operations |
| `runRMP`, `evalRMP` | Extract result and edit history |
| `refineUntilQuality(threshold)` | Quality-gated refinement loop |
| `composeStrategies(...fns)` | Compose multiple refinement strategies |
| `Do`, `bind`, `bindTo` | Do-notation for monadic pipelines |

### Observe Comonad (Env + Store)

| Export | Purpose |
|--------|---------|
| `env`, `extract`, `duplicate`, `extend` | Env comonad operations |
| `store`, `peek`, `seek`, `pos` | Store comonad operations |
| `observe(context, value)` | Create observation from context |
| `extractObservation`, `getContext` | Access observation data |
| `deriveInsight`, `qualityTrend` | Context-aware analysis |
| `withContext`, `extendObservation` | Comonadic transformations |

## Verified Laws

All categorical laws verified with property-based tests (fast-check):

| Structure | Laws | Status |
|-----------|------|--------|
| Functor M | Identity, Composition | Verified |
| RMP Monad | Left Identity, Right Identity, Associativity | Verified |
| Observe Comonad | extract . duplicate = id, fmap extract . duplicate = id, Coassociativity | Verified |
| EditScript Monoid | Left Identity, Right Identity, Associativity | Verified |

## References

- Zhang et al. "Meta Prompting for AI Systems" (arXiv:2311.11482)
- Mac Lane "Categories for the Working Mathematician"
- fp-ts type class hierarchy
