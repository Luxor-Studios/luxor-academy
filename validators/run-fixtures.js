#!/usr/bin/env node
/**
 * Golden-file runner for the six-slots validator.
 * Asserts: all fixtures/valid-*.json pass; all fixtures/invalid-*.json fail.
 * Exit 0 = expected results; exit 1 = at least one fixture mismatched expectation.
 */

import { readdirSync, readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { validateModule } from "./six-slots.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const FIXTURE_DIR = resolve(__dirname, "fixtures");

function run() {
  const files = readdirSync(FIXTURE_DIR).filter((f) => f.endsWith(".json"));
  let passed = 0;
  let failed = 0;
  for (const file of files) {
    const expectValid = file.startsWith("valid-");
    const expectInvalid = file.startsWith("invalid-");
    if (!expectValid && !expectInvalid) continue;
    const raw = readFileSync(resolve(FIXTURE_DIR, file), "utf8");
    const obj = JSON.parse(raw);
    const result = validateModule(obj);
    const ok = expectValid ? result.valid : !result.valid;
    if (ok) {
      passed++;
      console.log(`\u001b[32m✓\u001b[0m ${file} (${expectValid ? "valid" : "invalid"} as expected)`);
    } else {
      failed++;
      console.log(
        `\u001b[31m✗\u001b[0m ${file} expected ${expectValid ? "valid" : "invalid"} but got ${result.valid ? "valid" : "invalid"}`,
      );
      if (!result.valid) {
        for (const e of result.errors) {
          console.log(`    - ${e.instancePath || "(root)"}: ${e.message}`);
        }
      }
    }
  }
  console.log(`\n${passed} passed, ${failed} failed (out of ${passed + failed})`);
  process.exit(failed === 0 ? 0 : 1);
}

run();
