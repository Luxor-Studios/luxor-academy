#!/usr/bin/env node
/**
 * sync-modules — copies self-contained module HTML files from
 * <repo-root>/modules/<track>/<quest>/*.html into web/public/modules/<track>/<quest>/,
 * so Next.js static-export can serve them alongside the shell.
 *
 * Invoked by `npm run prebuild:modules`, which the `prebuild` npm hook runs
 * automatically before `next build`. Idempotent — the destination tree is
 * cleared on each run to mirror the source exactly.
 *
 * Honors ARCHITECTURE-v2.md: shell owns routing, modules own content. This
 * script is the only bridge — everything stays static, no SSR.
 */

import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const WEB_ROOT = path.resolve(__dirname, "..");
const REPO_ROOT = path.resolve(WEB_ROOT, "..");
const SRC_ROOT = path.join(REPO_ROOT, "modules");
const DEST_ROOT = path.join(WEB_ROOT, "public", "modules");

/** Recursively collect files matching `predicate` under `dir`. */
async function walk(dir, predicate) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const found = [];
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) {
      found.push(...(await walk(full, predicate)));
    } else if (e.isFile() && predicate(full, e.name)) {
      found.push(full);
    }
  }
  return found;
}

async function main() {
  try {
    await fs.access(SRC_ROOT);
  } catch {
    console.warn(`[sync-modules] no source tree at ${SRC_ROOT} — nothing to sync.`);
    return;
  }

  // Wipe destination to keep it an exact mirror (no drifted files).
  await fs.rm(DEST_ROOT, { recursive: true, force: true });
  await fs.mkdir(DEST_ROOT, { recursive: true });

  const htmlFiles = await walk(SRC_ROOT, (_full, name) => name.endsWith(".html"));

  let copied = 0;
  for (const src of htmlFiles) {
    const rel = path.relative(SRC_ROOT, src);
    const dest = path.join(DEST_ROOT, rel);
    await fs.mkdir(path.dirname(dest), { recursive: true });
    await fs.copyFile(src, dest);
    copied += 1;
  }

  console.log(
    `[sync-modules] copied ${copied} module HTML file(s) into ${path.relative(WEB_ROOT, DEST_ROOT)}/`,
  );
}

main().catch((err) => {
  console.error("[sync-modules] failed:", err);
  process.exit(1);
});
