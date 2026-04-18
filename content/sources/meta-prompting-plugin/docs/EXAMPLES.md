# Examples

Real recipes that use the five commands together.

---

## 1. Ship a feature end-to-end

**Goal:** implement a feature, iterate until good, then review before merge.

```
/chain [/meta→/rmp→/review] @quality:0.9 "add rate limiting to /api/login with exponential backoff"
```

- `/meta` picks a strategy based on complexity (likely L4 — algorithm + integration).
- `/rmp` iterates until the implementation scores ≥ 0.9 on the quality rubric.
- `/review` does a final safety pass.

Chain quality rule: `min(q_meta, q_rmp, q_review)` — weakest link gates the output.

---

## 2. Second-opinion review of a tough decision

**Goal:** you've drafted a plan; you want a different angle before committing.

```
/transform @from:chain-of-thought @to:debate "should we migrate from REST to GraphQL for the v3 API?"
```

`/transform` keeps the task but swaps the reasoning approach — debate-style surfaces tradeoffs CoT would smooth over.

---

## 3. Focused code explanation

**Goal:** explain a subsystem without dumping the whole repo into the prompt.

```
/context @mode:extract @focus:src/auth @depth:2 "walk me through session invalidation"
```

`/context` (comonad W) extracts the relevant slice. Depth controls how far to follow imports.

---

## 4. Benchmark a prompt before shipping it

**Goal:** you have a prompt that handles math problems; you want to know if it beats the baseline.

```
/meta @domain:ALGORITHM "write a prompt that solves GSM8K problems step by step"
```

Then use the `prompt-benchmark` skill to run it against GSM8K and get a pass-rate.

---

## 5. Self-refining research pipeline

**Goal:** summarize 10 arxiv papers and converge on a cross-cutting theme.

```
/rmp @quality:0.85 @max_iterations:3 "summarize these 10 papers and identify the shared categorical structure"
```

RMP iterates: draft summary → critique for missed patterns → refine → stop when cross-paper coverage ≥ 0.85.

---

## 6. Parallel exploration with aggregation

**Goal:** generate three independent approaches, pick the strongest.

```
/chain [/meta||/meta||/meta] @mode:iterative "implement a cache with sliding TTL"
```

`||` runs three meta-prompts concurrently, aggregates with `mean(q₁, q₂, q₃)`. Best output wins.

---

## 7. Visualize quality flow

**Goal:** see which stage of a chain degraded quality.

```
/chain [/meta→/rmp→/review] @quality:visualize "ship the payment refund flow"
```

Prints a bar chart showing quality at each stage — you can see where the pipeline lost points.

---

## 8. Error-handled pipeline

**Goal:** a flaky external call shouldn't blow up the whole chain.

```
/chain [/meta→/rmp] @catch:retry:3 @fallback:return-best "scrape and summarize this URL"
```

`@catch:retry:3` retries transient failures; `@fallback:return-best` returns the best partial result if all retries fail.

---

## Self-application example

This is how we used the plugin to build the plugin:

```
/meta @tier:L5 "extract shippable plugin from 1.2GB research repo"
  └─ picked strategy: modular extraction with progressive disclosure
/context @focus:plugin,skills,commands @depth:1
  └─ extracted 17 skills + 5 commands + curated theory docs
/rmp @quality:0.85 "write the README"
  └─ 3 iterations until it landed
/transform @from:research @to:product
  └─ rewrote every doc's voice
```

See [`../CONTRIBUTING.md`](../CONTRIBUTING.md) for the full dogfooding workflow.
