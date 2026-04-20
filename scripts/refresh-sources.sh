#!/usr/bin/env bash
# refresh-sources — pin a vendored source repo to a real commit SHA.
#
# Clones the upstream, reads its HEAD SHA, replaces the vendored snapshot
# under content/sources/<repo-name>/ with a clean .git-free tree, and
# atomically rewrites content/sources/VENDOR.json so the SHA is pinned.
#
# Every module .json that cites this upstream has its `/blob/main/`
# permalinks rewritten to `/blob/<SHA>/`. Every quest.manifest.json whose
# `source_repo.upstream_url` matches gets `source_repo.upstream_ref` set
# to the pinned SHA.
#
# Usage:
#   scripts/refresh-sources.sh <repo-name> <upstream-url>
#
# Example:
#   scripts/refresh-sources.sh barque https://github.com/manutej/luxor-barque
#
# Honors ARCHITECTURE-v2.md: every technical claim in a module must cite
# a pinned file or SHA. This script closes the `sha_is_placeholder: true`
# gap flagged by MERCURIO (Physical plane).
#
# Requirements: git, jq, tar, perl.

set -euo pipefail

NAME="${1:?Usage: refresh-sources.sh <repo-name> <upstream-url>}"
URL="${2:?Usage: refresh-sources.sh <repo-name> <upstream-url>}"

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
VENDOR_JSON="$ROOT_DIR/content/sources/VENDOR.json"
TARGET_DIR="$ROOT_DIR/content/sources/$NAME"
MODULES_DIR="$ROOT_DIR/modules"
TMP_DIR="$(mktemp -d)"
trap 'rm -rf "$TMP_DIR"' EXIT

log() { printf '[refresh-sources] %s\n' "$*"; }

log "$NAME → $URL"

git clone --depth 1 --quiet "$URL" "$TMP_DIR/$NAME"
SHA="$(git -C "$TMP_DIR/$NAME" rev-parse HEAD)"
TODAY="$(date -u +%Y-%m-%d)"
log "  HEAD SHA: $SHA"

# Replace the vendored tree atomically: rename-away, populate, delete-old.
TARGET_BAK="${TARGET_DIR}.bak.$$"
if [[ -d "$TARGET_DIR" ]]; then
  mv "$TARGET_DIR" "$TARGET_BAK"
fi
mkdir -p "$TARGET_DIR"
git -C "$TMP_DIR/$NAME" archive HEAD | tar -x -C "$TARGET_DIR"
if [[ -d "${TARGET_BAK:-}" ]]; then
  rm -rf "$TARGET_BAK"
fi
log "  vendored $(find "$TARGET_DIR" -type f | wc -l | tr -d ' ') file(s) into content/sources/$NAME/"

# Update VENDOR.json atomically.
jq --arg name "$NAME" \
   --arg sha "$SHA" \
   --arg url "$URL" \
   --arg date "$TODAY" \
   '.vendored[$name] = ((.vendored[$name] // {}) + {
      upstream: $url,
      sha: $sha,
      sha_is_placeholder: false,
      last_updated: $date,
      reason: "Pinned by scripts/refresh-sources.sh"
    })' "$VENDOR_JSON" > "$VENDOR_JSON.tmp"
mv "$VENDOR_JSON.tmp" "$VENDOR_JSON"
log "  VENDOR.json pinned"

# Rewrite module + quest permalinks to the pinned SHA.
PERMALINK_FILES_REWRITTEN=0
UPSTREAM_REF_FILES_REWRITTEN=0
if [[ -d "$MODULES_DIR" ]]; then
  # Files that cite this upstream somewhere — grep across *.json.
  while IFS= read -r F; do
    [[ -z "$F" ]] && continue
    if perl -i -pe 'BEGIN{$url=shift @ARGV; $sha=shift @ARGV} s|\Q${url}\E/blob/main/|${url}/blob/${sha}/|g' "$URL" "$SHA" "$F"; then
      PERMALINK_FILES_REWRITTEN=$((PERMALINK_FILES_REWRITTEN + 1))
    fi

    # If it is a quest.manifest.json whose source_repo.upstream_url matches,
    # jq-rewrite source_repo.upstream_ref.
    if [[ "$(basename "$F")" == "quest.manifest.json" ]]; then
      MATCH="$(jq -r --arg url "$URL" '.source_repo.upstream_url == $url' "$F")"
      if [[ "$MATCH" == "true" ]]; then
        jq --arg sha "$SHA" '.source_repo.upstream_ref = $sha' "$F" > "$F.tmp"
        mv "$F.tmp" "$F"
        UPSTREAM_REF_FILES_REWRITTEN=$((UPSTREAM_REF_FILES_REWRITTEN + 1))
      fi
    fi
  done < <(grep -rl -F "$URL" "$MODULES_DIR" --include='*.json' || true)
fi

log "  rewrote /blob/main/ → /blob/$SHA/ in $PERMALINK_FILES_REWRITTEN file(s)"
log "  rewrote source_repo.upstream_ref in $UPSTREAM_REF_FILES_REWRITTEN quest manifest(s)"
log "done."
