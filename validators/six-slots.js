#!/usr/bin/env node
/**
 * LUXOR Academy — Six-Slot Module Validator
 *
 * Single source of truth: validators/slots.schema.json
 * Consumers: build-time CI, codebase-to-course pipeline, dev-mode browser warnings,
 * Playwright assertion suite. (MARS round-1 consolidation.)
 *
 * Usage:
 *   node validators/six-slots.js <module.json> [--format json|pretty]
 *
 * Exit codes:
 *   0 — module passes schema
 *   1 — module fails schema (or file unreadable)
 *   2 — usage / argument error
 */

import { readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import Ajv2020 from "ajv/dist/2020.js";
import addFormats from "ajv-formats";

const __dirname = dirname(fileURLToPath(import.meta.url));
const SCHEMA_PATH = resolve(__dirname, "slots.schema.json");

function parseArgs(argv) {
  const args = { _: [], format: "pretty" };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--format") {
      const v = argv[++i];
      if (v !== "json" && v !== "pretty") {
        usage(`Unknown --format value: ${v}`);
        process.exit(2);
      }
      args.format = v;
    } else if (a === "--help" || a === "-h") {
      usage();
      process.exit(0);
    } else if (a.startsWith("--")) {
      usage(`Unknown flag: ${a}`);
      process.exit(2);
    } else {
      args._.push(a);
    }
  }
  return args;
}

function usage(msg) {
  if (msg) console.error(`error: ${msg}\n`);
  console.error(
    "usage: node validators/six-slots.js <module.json> [--format json|pretty]\n" +
      "  exits 0 if valid, 1 if invalid, 2 on usage error\n",
  );
}

export function loadSchema() {
  const raw = readFileSync(SCHEMA_PATH, "utf8");
  return JSON.parse(raw);
}

export function buildValidator() {
  const schema = loadSchema();
  const ajv = new Ajv2020({
    allErrors: true,
    strict: false,
    verbose: true,
  });
  addFormats(ajv);
  return ajv.compile(schema);
}

/**
 * Validate a module object against slots.schema.json.
 * @param {object} moduleObj
 * @returns {{ valid: boolean, errors: object[] }}
 */
export function validateModule(moduleObj) {
  const validate = buildValidator();
  const valid = validate(moduleObj);
  return { valid, errors: validate.errors || [] };
}

function formatPretty(filePath, result) {
  const lines = [];
  if (result.valid) {
    lines.push(`\u001b[32m✓\u001b[0m ${filePath} — PASS`);
  } else {
    lines.push(`\u001b[31m✗\u001b[0m ${filePath} — FAIL (${result.errors.length} error${result.errors.length === 1 ? "" : "s"})`);
    for (const err of result.errors) {
      const path = err.instancePath || "(root)";
      lines.push(`  • ${path}: ${err.message}`);
      if (err.params && Object.keys(err.params).length) {
        const params = Object.entries(err.params)
          .map(([k, v]) => `${k}=${JSON.stringify(v)}`)
          .join(" ");
        lines.push(`      ${params}`);
      }
    }
  }
  return lines.join("\n");
}

function formatJson(filePath, result) {
  return JSON.stringify(
    {
      file: filePath,
      valid: result.valid,
      error_count: result.errors.length,
      errors: result.errors.map((e) => ({
        path: e.instancePath || "",
        keyword: e.keyword,
        message: e.message,
        params: e.params,
      })),
    },
    null,
    2,
  );
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args._.length !== 1) {
    usage("expected exactly one input file");
    process.exit(2);
  }
  const filePath = args._[0];
  let raw;
  try {
    raw = readFileSync(filePath, "utf8");
  } catch (err) {
    console.error(`error: cannot read ${filePath}: ${err.message}`);
    process.exit(1);
  }
  let moduleObj;
  try {
    moduleObj = JSON.parse(raw);
  } catch (err) {
    console.error(`error: invalid JSON in ${filePath}: ${err.message}`);
    process.exit(1);
  }
  const result = validateModule(moduleObj);
  const out = args.format === "json" ? formatJson(filePath, result) : formatPretty(filePath, result);
  console.log(out);
  process.exit(result.valid ? 0 : 1);
}

// Only run main when invoked as CLI, not when imported.
const invokedAsCLI = import.meta.url === `file://${process.argv[1]}`;
if (invokedAsCLI) {
  main();
}
