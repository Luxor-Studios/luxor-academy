# Vendored Source Artifacts

These directories contain minimal source bundles from the repos that the LUXOR Academy converts into courses. They are vendored **inside** this repo so the autonomous Academy Forge loop works in any sandbox where only a single repository is mounted (Vercel sandbox coding agent, GitHub Codespaces, Replit, Daytona, etc.).

## Why vendor instead of cloning?

A sandbox typically mounts ONE repo. Cloning sibling repos inside the sandbox requires network + auth + public visibility + maintenance of URLs. Vendoring inline eliminates all of those. Cost: ~1-5 MB of source excerpts. Benefit: the loop is fully self-contained and reentrant anywhere.

## What's vendored

| Directory | Source repo | Size | Used by (quests) |
|-----------|-------------|------|------------------|
| `barque/` | LUXOR/PROJECTS/BARQUE | ~480 KB | Forge BARQUE (Track: Build & Ship) |
| `halcon/` | LUXOR/PROJECTS/HALCON | ~588 KB | Deploy HALCON (Track: Build & Ship) |
| `meta-prompting-plugin/` | meta-prompting-plugin | ~400 KB | Build Your Plugin (Track: Categorical Wizardry) |

## What's excluded

- `.git/` — we only vendor code, not history
- `node_modules/`, `venv/`, `__pycache__/` — regeneratable
- `dist/`, `build/`, `.vite/`, `coverage/` — build artifacts
- Binary test outputs (`*.pdf`, `*.log`, etc.)

## Licensing

Each vendored bundle retains its original repo's LICENSE file (when present). When the Academy renders a module whose `artifact` slot excerpts vendored source, the GitHub permalink in the slot should point to the ORIGINAL repo's public URL (once published), not to this academy repo. That keeps attribution clean.

## Refresh policy

When an upstream source repo ships a new version, refresh with:

```bash
# from academy repo root
./scripts/refresh-sources.sh barque /path/to/LUXOR/PROJECTS/BARQUE
git diff content/sources/barque
```

Commit message: `chore(sources): refresh barque @ <upstream-sha>`. Never silently update.

## Provenance (as of initial vendoring 2026-04-18)

- BARQUE: daily-use PDF+email tool, venv/weasyprint/Resend stack, Python
- HALCON: React+TS cosmic-productivity platform, Vite, 54 tests passing, orbital UI
- meta-prompting-plugin: Claude Code plugin with compositional prompt DSL
