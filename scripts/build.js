#!/usr/bin/env node
/**
 * Minimal build:
 * 1. Compile atlas/scripts/*.ts and atlas/components/*.ts to plain ESM JS using TypeScript's compiler API.
 * 2. Concat into a single atlas/dist/atlas.js so the page loads ONE script (cuts TTI in half on slow-4G).
 * 3. Verify total JS ≤ 50 KB (Phase 0.5 hard constraint).
 *
 * No bundler. No framework.
 */

import { createRequire } from "node:module";
import { readdirSync, statSync, readFileSync, writeFileSync, rmSync, mkdirSync, existsSync } from "node:fs";
import { resolve, dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);
const ts = require("typescript");

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const ATLAS = resolve(ROOT, "atlas");
const DIST = resolve(ATLAS, "dist");

function walk(dir, acc = []) {
  for (const name of readdirSync(dir)) {
    if (name === "dist") continue;
    const full = join(dir, name);
    const s = statSync(full);
    if (s.isDirectory()) walk(full, acc);
    else acc.push(full);
  }
  return acc;
}

const sources = walk(ATLAS)
  .filter((f) => f.endsWith(".ts"))
  .filter((f) => !f.endsWith(".d.ts"));

// Clean previously emitted .js next to .ts files
for (const src of sources) {
  const outPath = src.replace(/\.ts$/, ".js");
  try {
    rmSync(outPath);
  } catch {}
}

const compilerOptions = {
  target: ts.ScriptTarget.ES2022,
  module: ts.ModuleKind.ES2022,
  moduleResolution: ts.ModuleResolutionKind.Bundler,
  strict: true,
  esModuleInterop: true,
  skipLibCheck: true,
  lib: ["lib.es2022.d.ts", "lib.dom.d.ts", "lib.dom.iterable.d.ts"],
  removeComments: false,
  sourceMap: false,
  inlineSourceMap: false,
  alwaysStrict: false,
};

let totalIndividualBytes = 0;
let emitted = 0;
const program = ts.createProgram(sources, compilerOptions);
const diagHost = {
  getCurrentDirectory: () => ROOT,
  getNewLine: () => "\n",
  getCanonicalFileName: (x) => x,
};
const diagnostics = ts.getPreEmitDiagnostics(program);
if (diagnostics.length) {
  console.error(ts.formatDiagnosticsWithColorAndContext(diagnostics, diagHost));
}
const emittedFiles = new Map(); // outPath -> contents
const emitResult = program.emit(undefined, (fileName, data) => {
  writeFileSync(fileName, data);
  emittedFiles.set(fileName, data);
  totalIndividualBytes += Buffer.byteLength(data, "utf8");
  emitted++;
  console.log(`  ${relative(ROOT, fileName)} (${Buffer.byteLength(data, "utf8")} B)`);
});
if (emitResult.emitSkipped) {
  console.error("TypeScript emit was skipped due to errors.");
  process.exit(1);
}

/* ---- Concat into single bundle ----
 * Order: xp.js → keyboard.js → components/index.js
 * Strip every line starting with `import` (relative imports only resolve inside the build).
 * Strip `export {` / `export type` lines that are pure re-exports.
 * Strip `export ` keyword from declarations to keep them defined globally in the IIFE scope.
 */
function readEmitted(rel) {
  const abs = resolve(ATLAS, rel);
  const data = emittedFiles.get(abs);
  if (!data) throw new Error(`expected emitted: ${rel}`);
  return data;
}
function stripModuleSyntax(src) {
  return src
    .split("\n")
    .filter((l) => !/^\s*import\s/.test(l))
    .map((l) => l.replace(/^\s*export\s+(class|function|const|let|var|interface|type)\s/, "$1 "))
    .filter((l) => !/^\s*export\s*\{/.test(l))
    .filter((l) => !/^\s*export\s+default\s/.test(l))
    .filter((l) => !/^\s*export\s+\*\s/.test(l))
    .join("\n");
}

const order = ["scripts/xp.js", "scripts/keyboard.js", "components/index.js"];
const banner = "// LUXOR Academy — atlas bundle (Phase 0.5). Built by scripts/build.js.\n";
const iifeOpen = "(function(){\n'use strict';\n";
const iifeClose = "\n})();\n";
const bundle =
  banner +
  iifeOpen +
  order
    .map((rel) => `\n/* ----- ${rel} ----- */\n` + stripModuleSyntax(readEmitted(rel)))
    .join("\n") +
  iifeClose;

if (!existsSync(DIST)) mkdirSync(DIST, { recursive: true });
const bundlePath = join(DIST, "atlas.js");
writeFileSync(bundlePath, bundle);
const bundleBytes = Buffer.byteLength(bundle, "utf8");
console.log(`\n  bundle: ${relative(ROOT, bundlePath)} (${bundleBytes} B = ${(bundleBytes / 1024).toFixed(2)} KB)`);

const BUDGET = 50 * 1024;
if (bundleBytes > BUDGET) {
  console.error(`JS budget exceeded: ${bundleBytes} B > ${BUDGET} B (50 KB).`);
  process.exit(1);
}
console.log(`JS budget ✓  (${((BUDGET - bundleBytes) / 1024).toFixed(2)} KB headroom)`);
console.log(`Emitted ${emitted} module file(s) (${totalIndividualBytes} B raw) + 1 concat bundle.`);

/* ---- Inline CSS into atlas/index.html ----
 * tokens.css + atlas.css concatenated into a single <style> in <head>,
 * removing the 2 render-blocking <link rel="stylesheet" href="./..."> tags.
 * Original sources stay on disk so devs can edit them; the build re-inlines.
 */
const TOKENS = readFileSync(resolve(ATLAS, "tokens/tokens.css"), "utf8");
const STYLES = readFileSync(resolve(ATLAS, "styles/atlas.css"), "utf8");
const inlineCss = `<style id="luxor-inline-css">/* tokens.css + atlas.css inlined for first-paint perf */\n${TOKENS}\n${STYLES}</style>`;

const HTML_PATH = resolve(ATLAS, "index.html");
let html = readFileSync(HTML_PATH, "utf8");
// Strip any existing inline block + the two link rels
html = html.replace(/<style id="luxor-inline-css"[\s\S]*?<\/style>\s*/g, "");
html = html.replace(/<link[^>]+href="\.\/tokens\/tokens\.css"[^>]*>\s*/g, "");
html = html.replace(/<link[^>]+href="\.\/styles\/atlas\.css"[^>]*>\s*/g, "");
// Insert inline before favicon link (or before closing head)
if (html.includes("<link rel=\"icon\"")) {
  html = html.replace("<link rel=\"icon\"", inlineCss + "\n  <link rel=\"icon\"");
} else {
  html = html.replace("</head>", inlineCss + "\n</head>");
}

/* ---- Inline JS into atlas/index.html ----
 * Replace <script defer src="./dist/atlas.js"></script> with an inline copy.
 * Saves one RTT on the critical path and lets parse run during HTML stream.
 */
const inlineJs = `<script id="luxor-inline-js">/* atlas bundle inlined for first-paint perf — mirrors atlas/dist/atlas.js */\n${bundle}</script>`;
html = html.replace(/<script id="luxor-inline-js"[\s\S]*?<\/script>\s*/g, "");
html = html.replace(/<script\s+defer\s+src="\.\/dist\/atlas\.js"[^>]*>\s*<\/script>\s*/g, "");
// Place at end of <body> so DOM is parsed first; bundle still reaches DOMContentLoaded handlers.
html = html.replace("</body>", `  ${inlineJs}\n</body>`);

writeFileSync(HTML_PATH, html);
console.log(
  `Inlined CSS (${TOKENS.length + STYLES.length} B) + JS (${bundleBytes} B) into atlas/index.html`,
);

/* ---- Update vercel.json CSP with the inline script hash ----
 * CSP spec: script-src can include 'sha256-<base64>' for an exact <script>...</script> body.
 * Without this, our inline JS would be blocked when served from Vercel.
 */
import { createHash } from "node:crypto";
const inlineScriptBody = `/* atlas bundle inlined for first-paint perf — mirrors atlas/dist/atlas.js */\n${bundle}`;
const scriptHash = createHash("sha256").update(inlineScriptBody, "utf8").digest("base64");
const VERCEL_PATH = resolve(ROOT, "vercel.json");
const vercel = JSON.parse(readFileSync(VERCEL_PATH, "utf8"));
const updatedCsp =
  "default-src 'self'; " +
  `script-src 'self' 'sha256-${scriptHash}'; ` +
  "style-src 'self' https://fonts.googleapis.com 'unsafe-inline'; " +
  "font-src 'self' https://fonts.gstatic.com; " +
  "img-src 'self' data:; " +
  "connect-src 'self'; " +
  "frame-ancestors 'none'; " +
  "base-uri 'self'; " +
  "form-action 'self'";
let touched = false;
for (const block of vercel.headers) {
  if (block.source !== "/(.*)") continue;
  for (const h of block.headers) {
    if (h.key === "Content-Security-Policy") {
      h.value = updatedCsp;
      touched = true;
    }
  }
}
if (touched) {
  writeFileSync(VERCEL_PATH, JSON.stringify(vercel, null, 2) + "\n");
  console.log(`Updated vercel.json CSP with sha256-${scriptHash.slice(0, 12)}…`);
}

