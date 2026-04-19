# Further Reading

Papers that shaped the design of this plugin.

## Foundational — categorical structure for AI/prompting

- **Gavranović, B. et al.** (ICML 2024). *Categorical Deep Learning.*
  Framework for thinking about neural networks as categorical constructions. Motivates treating prompts as morphisms.

- **de Wynter, A. et al.** (2025). *On Meta-Prompting.*
  Empirical treatment of prompts-that-generate-prompts. Validates the functorial `Task → Prompt` framing.

- **Bradley, T.** (2021). *Enriched Category Theory of Language.*
  Motivates `[0,1]`-enrichment for quality-weighted composition.

- **Spivak, D. & Niu, N.** *Polynomial Functors: A Mathematical Theory of Interaction.*
  Backbone for the `polynomial-functors` skill. Learner composition as polynomial functors.

## Secondary — composition patterns

- **Rompf & Amin.** *Lightweight Modular Staging.* Applied to prompt templates: staged metaprogramming for prompts.

- **Awodey, S.** *Category Theory* (2nd ed., Oxford). Canonical textbook. Chapters on functors, monads, comonads, adjunctions directly applicable.

- **MacLane, S.** *Categories for the Working Mathematician.* The reference. Natural transformations, Kleisli composition.

## Tooling backdrop

- **DSPy** (Khattab et al.). Compositional prompt programming. Inspires the `/chain` design.
- **LMQL** (Beurer-Kellner et al.). Constraint-guided generation. Influences the `prompt-dsl` skill.
- **Guidance** (Microsoft). Grammar-constrained prompts. See `guidance-grammars` integration skill.
- **LangGraph** (LangChain). Stateful multi-agent graphs. See `langgraph-orchestration` integration skill.
- **@effect/ai** (Effect-TS). Typed AI composition in TypeScript. See `effect-ts-ai` integration skill.

## Code references

- **fp-ts** (gcanti/fp-ts) — canonical fp-ts patterns for TypeScript functional programming. `categorical-property-testing` uses fast-check for property-based verification of the laws.

## Historical notes

This plugin is extracted from the `categorical-meta-prompting` research repo (private) which has 40+ design documents, 15+ ArXiv paper pattern summaries, and extensive validation studies against MATH, GSM8K, and Game of 24 benchmarks. Ask @manutej for access if you're doing research.
