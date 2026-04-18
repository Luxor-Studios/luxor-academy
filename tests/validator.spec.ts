/**
 * Validator golden-file tests — runs node validators/run-fixtures.js and asserts exit 0.
 * Also asserts validator CLI exits 0 on a valid fixture and ≠0 on an invalid one.
 */
import { test, expect } from "@playwright/test";
import { spawnSync } from "node:child_process";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ROOT = resolve(__dirname, "..");

test("golden fixtures: 3 valid pass + 3 invalid fail", () => {
  const r = spawnSync("node", ["validators/run-fixtures.js"], { cwd: ROOT, encoding: "utf8" });
  expect(r.status).toBe(0);
  expect(r.stdout).toContain("6 passed, 0 failed");
});

test("CLI: valid fixture exits 0", () => {
  const r = spawnSync(
    "node",
    ["validators/six-slots.js", "validators/fixtures/valid-1-venv-shebang.json"],
    { cwd: ROOT, encoding: "utf8" },
  );
  expect(r.status).toBe(0);
});

test("CLI: invalid fixture exits 1", () => {
  const r = spawnSync(
    "node",
    ["validators/six-slots.js", "validators/fixtures/invalid-1-missing-slot.json"],
    { cwd: ROOT, encoding: "utf8" },
  );
  expect(r.status).toBe(1);
});

test("CLI: --format json emits parseable JSON on failure", () => {
  const r = spawnSync(
    "node",
    [
      "validators/six-slots.js",
      "validators/fixtures/invalid-2-bad-id-and-version.json",
      "--format",
      "json",
    ],
    { cwd: ROOT, encoding: "utf8" },
  );
  expect(r.status).toBe(1);
  const parsed = JSON.parse(r.stdout);
  expect(parsed.valid).toBe(false);
  expect(parsed.error_count).toBeGreaterThan(0);
});
