#!/usr/bin/env node
/**
 * Inject (or refresh) the LUXOR Diagram Kit CSS into every module HTML's
 * <style> block. Idempotent — strips ALL prior kit blocks first, then
 * injects a single fresh copy. Use --force to re-run after kit changes.
 *
 * Usage:  node scripts/inject-diagram-kit.mjs [--force]
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const KIT_PATH = path.join(ROOT, "modules/_shared/diagram-kit.css");
const MARKER_START = "/* LUXOR-DIAGRAM-KIT-INJECTED */";
const MARKER_END = "/* END-LUXOR-DIAGRAM-KIT */";

const force = process.argv.includes("--force");
const kitCss = fs.readFileSync(KIT_PATH, "utf-8");

// Escape regex metachars so the markers (which contain `*` and `/`) match literally.
function escapeRegex(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
const stripPattern = new RegExp(
  `\\n?${escapeRegex(MARKER_START)}[\\s\\S]*?${escapeRegex(MARKER_END)}\\n?`,
  "g",
);

function walk(dir) {
  const out = [];
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) out.push(...walk(p));
    else if (e.isFile() && e.name.endsWith(".html") && !p.includes("_shared")) out.push(p);
  }
  return out;
}

const htmls = walk(path.join(ROOT, "modules"));
let injected = 0;
let stripped = 0;
let skipped = 0;

for (const p of htmls) {
  let html = fs.readFileSync(p, "utf-8");
  const hadKit = stripPattern.test(html);
  if (hadKit && !force) {
    // Already has it and we're not refreshing — leave alone.
    skipped++;
    continue;
  }
  if (hadKit) {
    // Reset lastIndex (test() advances it on global regex) and strip ALL copies.
    stripPattern.lastIndex = 0;
    const before = html.length;
    html = html.replace(stripPattern, "\n");
    if (html.length < before) stripped++;
  }
  const idx = html.lastIndexOf("</style>");
  if (idx === -1) {
    console.error(`[skip-no-style] ${p}`);
    continue;
  }
  const injection = `\n${MARKER_START}\n${kitCss.trim()}\n${MARKER_END}\n`;
  html = html.slice(0, idx) + injection + html.slice(idx);
  fs.writeFileSync(p, html, "utf-8");
  injected++;
}

console.log(
  `[inject-diagram-kit] injected=${injected} stripped=${stripped} skipped=${skipped} total=${htmls.length}`,
);
