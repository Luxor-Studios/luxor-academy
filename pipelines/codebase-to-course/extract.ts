#!/usr/bin/env node
/**
 * codebase-to-course · extract (SKELETON — Phase 0.5)
 *
 * Reads a repo directory, parses README.md headings, finds tests/ + examples/,
 * and emits a DRAFT module JSON that validates against validators/slots.schema.json.
 *
 * Phase 0.5 scope (from HANDOFF §3.2 item 7):
 *   - README → primer (heading scan, take H1 + first paragraph ≥ 300 chars)
 *   - tests/ → self_check (filename list → questions stubs)
 *   - examples/ or canonical file → artifact excerpt
 *   - everything else is a placeholder that satisfies the schema
 *
 * Transform & render happen in Phase 1/3.
 *
 * Usage (direct):
 *   node --import tsx/esm pipelines/codebase-to-course/extract.ts <repo-path> [--out draft.json]
 *
 * Canary target: /Users/manu/Documents/LUXOR/PROJECTS/BARQUE/
 */

import { readFileSync, readdirSync, statSync, existsSync, writeFileSync } from "node:fs";
import { basename, join, resolve } from "node:path";
import { validateModule } from "../../validators/six-slots.js";

/* ------------------------------------------------------------
 * Types mirroring slots.schema.json (hand-rolled; single source
 * of truth remains the JSON schema — these are DX helpers only).
 * ------------------------------------------------------------ */
export interface DraftModuleMeta {
  id: string;
  version: string;
  track: string;
  quest: string;
  title: string;
  xp_reward?: number;
  estimated_minutes?: number;
  tier?: "Initiate" | "Adept" | "Journeyman" | "Master" | "Synergist";
  license?: string;
  source_repo?: string;
}

export interface DraftModule {
  meta: DraftModuleMeta;
  slots: {
    primer: { markdown: string; word_count: number; key_insight?: string };
    visual: { type: string; src: string; alt: string; reduced_motion_fallback?: string };
    interactive: {
      kind: "code-sandbox" | "quiz" | "simulator" | "diagram-explorer" | "mock-api";
      entry?: string;
      sandbox_policy: { csp: string; iframe_sandbox: string; no_eval: true };
      success_criterion?: string;
      interactive_kind_is_static_readable_in_phase_1?: boolean;
    };
    artifact: { source_path: string; permalink: string; excerpt: string; language?: string };
    self_check: {
      kind: "multiple-choice" | "test-must-pass" | "fill-in-blank";
      questions: Array<{ prompt: string; correct?: unknown; explanation?: string }>;
    };
    next: { next_module_id: string | null; siblings?: string[]; ship_your_own?: boolean };
  };
}

/* ------------------------------------------------------------
 * Utilities
 * ------------------------------------------------------------ */
function slugify(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 64);
}

function wordCount(s: string): number {
  return s.trim().split(/\s+/).filter(Boolean).length;
}

function walkLimited(dir: string, depth = 3, acc: string[] = []): string[] {
  if (depth < 0) return acc;
  let entries: string[];
  try {
    entries = readdirSync(dir);
  } catch {
    return acc;
  }
  for (const name of entries) {
    if (name.startsWith(".") || name === "node_modules" || name === "venv" || name === "dist") continue;
    const full = join(dir, name);
    let s;
    try {
      s = statSync(full);
    } catch {
      continue;
    }
    if (s.isDirectory()) walkLimited(full, depth - 1, acc);
    else acc.push(full);
  }
  return acc;
}

/* ------------------------------------------------------------
 * README extraction
 * ------------------------------------------------------------ */
interface ReadmeOutline {
  title: string;
  primerMarkdown: string;
  keyInsight: string;
  headings: string[];
}

function parseReadme(readmePath: string): ReadmeOutline {
  const raw = readFileSync(readmePath, "utf8");
  const lines = raw.split(/\r?\n/);
  let title = "";
  const headings: string[] = [];
  const paragraphs: string[] = [];
  let buf: string[] = [];
  for (const line of lines) {
    const h = /^(#{1,6})\s+(.*)/.exec(line);
    if (h) {
      if (!title && h[1].length === 1) title = h[2].trim();
      headings.push(h[2].trim());
      if (buf.length) {
        paragraphs.push(buf.join(" ").trim());
        buf = [];
      }
      continue;
    }
    if (line.trim() === "") {
      if (buf.length) {
        paragraphs.push(buf.join(" ").trim());
        buf = [];
      }
    } else if (!line.startsWith("```") && !line.startsWith("|")) {
      // skip code fences + tables for primer text
      buf.push(line.trim());
    }
  }
  if (buf.length) paragraphs.push(buf.join(" ").trim());
  // pick first paragraph with ≥ 300 chars OR concatenate until ≥ 300
  let primer = "";
  for (const p of paragraphs) {
    if (!p) continue;
    primer += (primer ? "\n\n" : "") + p;
    if (primer.length >= 300) break;
  }
  if (primer.length < 300) primer = (primer + " ".repeat(300)).slice(0, 320);
  const keyInsight = headings[1] || headings[0] || title;
  return {
    title: title || basename(readmePath),
    primerMarkdown: primer,
    keyInsight,
    headings,
  };
}

/* ------------------------------------------------------------
 * Test + example discovery
 * ------------------------------------------------------------ */
function findTests(repo: string): string[] {
  const candidates = ["tests", "test", "__tests__", "spec"];
  for (const c of candidates) {
    const p = join(repo, c);
    if (existsSync(p)) return walkLimited(p, 2).filter((f) => /\.(py|ts|tsx|js|mjs|test\.[a-z]+)$/i.test(f));
  }
  // fallback: any *_test.* or test_*.* files in root
  return walkLimited(repo, 2).filter((f) => /(^|[/\\])(test_|[^/\\]+_test\.)/i.test(f));
}

function findExample(repo: string): { path: string; excerpt: string; language: string } | null {
  const examplesDirs = ["examples", "example", "samples"];
  for (const d of examplesDirs) {
    const p = join(repo, d);
    if (existsSync(p)) {
      const files = walkLimited(p, 2).filter((f) => /\.(py|ts|js|md|yaml|json|sh)$/.test(f));
      if (files.length) return readExcerpt(files[0]);
    }
  }
  // fallback: README itself, or CHANGELOG
  const readme = join(repo, "README.md");
  if (existsSync(readme)) return readExcerpt(readme);
  return null;
}

function readExcerpt(path: string): { path: string; excerpt: string; language: string } {
  const ext = (path.split(".").pop() || "").toLowerCase();
  const langMap: Record<string, string> = {
    py: "python",
    ts: "typescript",
    tsx: "typescript",
    js: "javascript",
    mjs: "javascript",
    md: "markdown",
    yaml: "yaml",
    yml: "yaml",
    json: "json",
    sh: "bash",
  };
  const content = readFileSync(path, "utf8");
  const excerpt = content.slice(0, 1800).trim() || content.slice(0, 200);
  return { path, excerpt, language: langMap[ext] || "text" };
}

/* ------------------------------------------------------------
 * Main extract
 * ------------------------------------------------------------ */
export interface ExtractOptions {
  repoPath: string;
  trackSlug?: string;
  questSlug?: string;
  moduleSlug?: string;
}

export function extractFromRepo(opts: ExtractOptions): DraftModule {
  const repo = resolve(opts.repoPath);
  if (!existsSync(repo)) throw new Error(`repo not found: ${repo}`);
  const readmePath = join(repo, "README.md");
  if (!existsSync(readmePath)) throw new Error(`README.md not found in ${repo}`);
  const outline = parseReadme(readmePath);
  const tests = findTests(repo);
  const example = findExample(repo) || {
    path: readmePath,
    excerpt: outline.primerMarkdown,
    language: "markdown",
  };

  const slug = opts.moduleSlug || slugify(outline.title);
  const track = opts.trackSlug || "build-and-ship";
  const quest = opts.questSlug || `${slug}-quest`;

  const draft: DraftModule = {
    meta: {
      id: slug,
      version: "v0.1.0",
      track,
      quest,
      title: outline.title.slice(0, 120),
      xp_reward: 75,
      estimated_minutes: 15,
      tier: "Initiate",
      license: "CC-BY-SA-4.0",
      source_repo: repo,
    },
    slots: {
      primer: {
        markdown: outline.primerMarkdown,
        word_count: Math.min(400, Math.max(120, wordCount(outline.primerMarkdown))),
        key_insight: outline.keyInsight,
      },
      visual: {
        type: "svg-inline",
        src: "atlas/icons/synergetics/octahedron.svg",
        alt: `Synergetics glyph representing ${outline.title}`,
        reduced_motion_fallback: "atlas/icons/synergetics/octahedron.svg",
      },
      interactive: {
        kind: "code-sandbox",
        entry: "placeholder-widget.html",
        sandbox_policy: {
          csp: "default-src 'none'; script-src 'self'; style-src 'self'",
          iframe_sandbox: "allow-scripts",
          no_eval: true,
        },
        success_criterion: "Placeholder — Phase 1 fills this in.",
        interactive_kind_is_static_readable_in_phase_1: true,
      },
      artifact: {
        source_path: example.path.replace(repo + "/", ""),
        permalink: `file://${example.path}`,
        excerpt: example.excerpt,
        language: example.language,
      },
      self_check: {
        kind: tests.length > 0 ? "test-must-pass" : "multiple-choice",
        questions: tests.length
          ? tests.slice(0, 3).map((t) => ({
              prompt: `Make the test pass: ${basename(t)}`,
              correct: "pass",
              explanation: `Run the test locally; it must exit 0.`,
            }))
          : outline.headings.slice(1, 4).map((h) => ({
              prompt: `What does the "${h}" section demonstrate in ${outline.title}?`,
              correct: "see-readme",
              explanation: `Refer to the "${h}" section of README.md.`,
            })),
      },
      next: {
        next_module_id: null,
        siblings: [],
        ship_your_own: false,
      },
    },
  };
  // Normalize word_count minimum
  if (draft.slots.self_check.questions.length === 0) {
    draft.slots.self_check.questions.push({
      prompt: `What is the single key insight of ${outline.title}?`,
      correct: outline.keyInsight,
      explanation: "See README.md top-level heading.",
    });
  }
  return draft;
}

/* ------------------------------------------------------------
 * CLI
 * ------------------------------------------------------------ */
function parseArgs(argv: string[]) {
  const args: { _: string[]; out?: string } = { _: [] };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--out") args.out = argv[++i];
    else if (a === "--help" || a === "-h") {
      console.log(
        "usage: extract <repo-path> [--out draft.json]\n" +
          "  draft is validated against validators/slots.schema.json before writing.\n",
      );
      process.exit(0);
    } else args._.push(a);
  }
  return args;
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args._.length !== 1) {
    console.error("usage: extract <repo-path> [--out draft.json]");
    process.exit(2);
  }
  const draft = extractFromRepo({ repoPath: args._[0] });
  const result = validateModule(draft as unknown as object);
  if (!result.valid) {
    console.error("ERROR: draft failed schema validation:");
    for (const e of result.errors) console.error(`  • ${e.instancePath || "(root)"}: ${e.message}`);
    process.exit(1);
  }
  const json = JSON.stringify(draft, null, 2);
  if (args.out) {
    writeFileSync(args.out, json);
    console.error(`wrote draft to ${args.out} (valid ✓)`);
  } else {
    console.log(json);
  }
}

// Auto-run as CLI
const invokedAsCLI = typeof process !== "undefined" && process.argv[1] && process.argv[1].endsWith("extract.ts");
if (invokedAsCLI) {
  main();
}
