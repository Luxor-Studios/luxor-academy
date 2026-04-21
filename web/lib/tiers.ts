/**
 * LUXOR Academy — tier curriculum data.
 *
 * Each tier → multiple tracks → each track → multiple quests → each quest → 4-6 modules.
 * Canonical last module of every quest = ship_your_own (launch-plan-v1.1 invariant).
 *
 * Source of truth lives in content/sources/ (vendored repos) and the master
 * launch plan at .planning/launch-plan-v1.1.md. This file is the shell's view.
 */

export type Tier = "novice" | "experienced" | "expert";

export interface Quest {
  id: string;
  title: string;
  description: string;
  moduleCount: number;
  estimatedMinutes: number;
  xpReward: number;
  xpReward_deferred?: number;
  sourceRepo: string;
  upstreamRepo?: string;
  status: "available" | "drafted" | "in-progress" | "locked";
}

export interface Track {
  id: string;
  title: string;
  description: string;
  glyph: "tetrahedron" | "octahedron" | "cuboctahedron" | "jitterbug" | "icosahedron" | "geodesic";
  quests: Quest[];
}

export interface TierData {
  id: Tier;
  label: string;
  tagline: string;
  outcome: string;
  anchorProjects: string[];
  coreSkills: string[];
  tracks: Track[];
}

export const TIERS: Record<Tier, TierData> = {
  novice: {
    id: "novice",
    label: "Novice",
    tagline: "Build & ship real projects with AI as a coding partner",
    outcome:
      "You can go from a README to a shipped CLI, emailed PDFs, or a branded design tool — with AI handling 80% of the typing while you make the architectural calls.",
    anchorProjects: ["BARQUE", "DESIGN-TOOL-PLANNER", "NanoBanana"],
    coreSkills: ["superpowers", "brainstorming", "codebase-to-course", "claude-api"],
    tracks: [
      {
        id: "build-and-ship",
        title: "Build & Ship",
        description:
          "From 'I have an idea' to 'I emailed the first version to a user'. Each quest walks one shippable repo end-to-end.",
        glyph: "cuboctahedron",
        quests: [
          {
            id: "forge-barque",
            title: "Forge BARQUE — Markdown to emailed PDF",
            description:
              "Turn Markdown into beautifully themed dual-light/dark PDFs, sent via Resend. Four modules, one live interactive simulator.",
            moduleCount: 4,
            estimatedMinutes: 57,
            xpReward: 325,
            xpReward_deferred: 350,
            sourceRepo: "content/sources/barque",
            upstreamRepo: "https://github.com/manutej/luxor-barque",
            status: "available",
          },
          {
            id: "design-tool-planner",
            title: "Design-Tool Planner — orchestrate Canva + NanoBanana",
            description:
              "Plan, implement, and ship an AI-powered design tool using the universal two-agent pattern (validated 9.5/10).",
            moduleCount: 5,
            estimatedMinutes: 90,
            xpReward: 750,
            sourceRepo: "content/sources/design-tool-planner",
            status: "drafted",
          },
        ],
      },
      {
        id: "first-agent",
        title: "Your first agent",
        description:
          "The Claude Agent SDK from zero. Build a real CLI agent that does something useful on day one.",
        glyph: "tetrahedron",
        quests: [
          {
            id: "hello-agent",
            title: "Hello, Agent — SDK in 60 minutes",
            description:
              "Scaffold, tool-use, streaming, and your first production agent with real prompt caching.",
            moduleCount: 6,
            estimatedMinutes: 60,
            xpReward: 600,
            sourceRepo: "vendor/skills/claude-api",
            status: "drafted",
          },
        ],
      },
    ],
  },
  experienced: {
    id: "experienced",
    label: "Experienced",
    tagline: "Orchestrate multi-agent systems with verification gates",
    outcome:
      "You can compose MERCURIO + MARS + specialist subagents into production workflows with MCP integration, parallel research, and human gates that actually catch failure modes.",
    anchorProjects: ["MERCURIO", "MARS", "CRDT", "LibreUIUX"],
    coreSkills: [
      "hekat",
      "comonad",
      "ois-orchestrator",
      "categorical-meta-prompting-ts",
      "voltagent-multiagent",
    ],
    tracks: [
      {
        id: "orchestration",
        title: "Orchestration",
        description:
          "Multi-agent systems with convergence. MOE, MERCURIO, MARS, HEKAT — patterns that scale from 2 to 20 agents.",
        glyph: "octahedron",
        quests: [
          {
            id: "mercurio-for-decisions",
            title: "MERCURIO for high-stakes decisions",
            description:
              "Three-plane analysis (Mental/Physical/Spiritual), 4 convergence methods, confidence thresholds. Prevent $100k mistakes.",
            moduleCount: 5,
            estimatedMinutes: 75,
            xpReward: 900,
            sourceRepo: "content/sources/mercurio",
            status: "drafted",
          },
          {
            id: "mars-systems",
            title: "MARS for systems-level architecture",
            description:
              "Parallel discovery, synthesis, validation. Use when the challenge demands SpaceX-level innovation, not just tool selection.",
            moduleCount: 5,
            estimatedMinutes: 80,
            xpReward: 950,
            sourceRepo: "content/sources/mars",
            status: "drafted",
          },
        ],
      },
      {
        id: "mcp-integration",
        title: "MCP integration",
        description:
          "Model Context Protocol from scratch. Build servers that agents can call, and clients that use them in production.",
        glyph: "jitterbug",
        quests: [
          {
            id: "mcp-from-zero",
            title: "MCP from zero — server + client + registry",
            description:
              "The two-layer protocol, transport lifecycle, primitives (tools/resources/prompts), capability negotiation.",
            moduleCount: 6,
            estimatedMinutes: 120,
            xpReward: 1100,
            sourceRepo: "content/sources/meta-prompting-plugin",
            status: "drafted",
          },
        ],
      },
    ],
  },
  expert: {
    id: "expert",
    label: "Expert",
    tagline: "Design categorical frameworks and formally verified prompt systems",
    outcome:
      "You can build meta-prompt frameworks with mathematical guarantees: compositional DSLs, polynomial functors, F* verification, and recursive optimization loops that prove convergence.",
    anchorProjects: ["categorical-meta-prompting", "fstar-framework", "discopy-nlp"],
    coreSkills: [
      "recursive-meta-prompting",
      "polynomial-functors",
      "fstar-verification",
      "discopy-nlp",
      "category-theory-foundations",
    ],
    tracks: [
      {
        id: "categorical-meta-prompting",
        title: "Categorical meta-prompting",
        description:
          "Prompts as morphisms. Composition laws. Natural transformations. DSLs with provable correctness.",
        glyph: "icosahedron",
        quests: [
          {
            id: "cmp-foundations",
            title: "CMP foundations — from category to prompt",
            description:
              "Objects, morphisms, composition. Why prompts form a category. The CMP Query Language and the recursive fixed point.",
            moduleCount: 6,
            estimatedMinutes: 150,
            xpReward: 1400,
            sourceRepo: "content/sources/meta-prompting-plugin",
            status: "drafted",
          },
        ],
      },
      {
        id: "formal-verification",
        title: "Formal verification",
        description:
          "F* dependent types for prompts and agent protocols. When you need proofs, not benchmarks.",
        glyph: "geodesic",
        quests: [
          {
            id: "fstar-7-levels",
            title: "F* 7-level framework",
            description:
              "From L1 novice to L7 genius. 42 verification examples, 7 categorical proofs. Prompts that can't lie.",
            moduleCount: 7,
            estimatedMinutes: 210,
            xpReward: 1800,
            sourceRepo: "content/sources/fstar-framework",
            status: "drafted",
          },
        ],
      },
    ],
  },
};

export const TIER_ORDER: Tier[] = ["novice", "experienced", "expert"];
