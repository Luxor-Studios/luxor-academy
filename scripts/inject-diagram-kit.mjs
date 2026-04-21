#!/usr/bin/env node
/**
 * Inject the LUXOR Diagram Kit CSS into every module HTML's <style> block.
 *
 * Idempotent — detects a sentinel marker to avoid double-injection on re-runs.
 * Self-contained HTML is preserved (no external link added).
 *
 * Usage:  node scripts/inject-diagram-kit.mjs [--force]
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const KIT_PATH = path.join(ROOT, "modules/_shared/diagram-kit.css");
const MARKER = "/* LUXOR-DIAGRAM-KIT-INJECTED */";

const force = process.argv.includes("--force");

const kitCss = fs.readFileSync(KIT_PATH, "utf-8");

function walk(dir) {
  const out = [];
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) out.push(...walk(p));
    else if (e.isFile() && e.name.endsWith(".html") && !p.includes("_shared")) out.push(p);
  }
  return out;
}

const modulesDir = path.join(ROOT, "modules");
const htmls = walk(modulesDir);
let injected = 0;
let skipped = 0;

for (const p of htmls) {
  let html = fs.readFileSync(p, "utf-8");
  if (html.includes(MARKER) && !force) {
    skipped++;
    continue;
  }
  // Strip any previous injection before re-applying (force path).
  if (html.includes(MARKER)) {
    html = html.replace(
      new RegExp(`\\n?${MARKER}[\\s\\S]*?/\\* END-LUXOR-DIAGRAM-KIT \\*/\\n?`),
      "",
    );
  }
  // Insert before the LAST </style> (every module has exactly one).
  const idx = html.lastIndexOf("</style>");
  if (idx === -1) {
    console.error(`[skip-no-style] ${p}`);
    continue;
  }
  const injection = `\n${MARKER}\n${kitCss.trim()}\n/* END-LUXOR-DIAGRAM-KIT */\n`;
  html = html.slice(0, idx) + injection + html.slice(idx);
  fs.writeFileSync(p, html, "utf-8");
  injected++;
}

console.log(`[inject-diagram-kit] injected=${injected} skipped=${skipped} total=${htmls.length}`);
