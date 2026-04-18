#!/usr/bin/env node
/**
 * Minimal build: compile atlas/scripts/*.ts and atlas/components/*.ts to plain ESM JS
 * using TypeScript's compiler API. Emits files next to their sources as .js,
 * so the browser can fetch them directly as modules. No bundler, no framework.
 *
 * Output JS size is verified against 50KB budget (Phase 0.5 hard constraint).
 */

import { createRequire } from "node:module";
import { readdirSync, statSync, readFileSync, writeFileSync, rmSync } from "node:fs";
import { resolve, dirname, join, relative, extname } from "node:path";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);
const ts = require("typescript");

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const ATLAS = resolve(ROOT, "atlas");

function walk(dir, acc = []) {
  for (const name of readdirSync(dir)) {
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

// Clean previously emitted .js (except those that came from user-written .js)
for (const src of sources) {
  const outPath = src.replace(/\.ts$/, ".js");
  try {
    rmSync(outPath);
  } catch {
    /* ignore */
  }
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

let totalBytes = 0;
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
const emitResult = program.emit(undefined, (fileName, data) => {
  writeFileSync(fileName, data);
  totalBytes += Buffer.byteLength(data, "utf8");
  emitted++;
  console.log(`  ${relative(ROOT, fileName)} (${Buffer.byteLength(data, "utf8")} B)`);
});
if (emitResult.emitSkipped) {
  console.error("TypeScript emit was skipped due to errors.");
  process.exit(1);
}
console.log(`\nEmitted ${emitted} file(s), total ${totalBytes} B (${(totalBytes / 1024).toFixed(2)} KB).`);

const BUDGET = 50 * 1024;
if (totalBytes > BUDGET) {
  console.error(`JS budget exceeded: ${totalBytes} B > ${BUDGET} B (50 KB).`);
  process.exit(1);
}
console.log(`JS budget ✓  (${((BUDGET - totalBytes) / 1024).toFixed(2)} KB headroom)`);
