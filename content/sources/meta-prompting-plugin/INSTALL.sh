#!/usr/bin/env bash
# Meta-Prompting Plugin installer
# Idempotent: safe to re-run for updates.

set -euo pipefail

PLUGIN_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
CLAUDE_DIR="${CLAUDE_HOME:-$HOME/.claude}"
COMMANDS_DST="$CLAUDE_DIR/commands"
SKILLS_DST="$CLAUDE_DIR/skills"

say()   { printf '\033[36m==>\033[0m %s\n' "$*"; }
warn()  { printf '\033[33m!!\033[0m  %s\n' "$*" >&2; }
die()   { printf '\033[31mxx\033[0m  %s\n' "$*" >&2; exit 1; }

[ -d "$CLAUDE_DIR" ] || die "Claude Code dir not found at $CLAUDE_DIR. Is Claude Code installed?"

mkdir -p "$COMMANDS_DST" "$SKILLS_DST"

say "Installing from $PLUGIN_DIR"

install_link() {
    local src="$1" dst="$2"
    if [ -L "$dst" ]; then
        local current_target
        current_target="$(readlink "$dst")"
        if [ "$current_target" = "$src" ]; then
            return 0
        fi
        rm "$dst"
    elif [ -e "$dst" ]; then
        warn "  backing up existing $dst -> $dst.bak"
        mv "$dst" "$dst.bak"
    fi
    ln -s "$src" "$dst"
}

# Commands
say "Linking commands..."
for cmd in "$PLUGIN_DIR/commands"/*.md; do
    [ -f "$cmd" ] || continue
    name="$(basename "$cmd")"
    install_link "$cmd" "$COMMANDS_DST/$name"
    echo "    $name"
done

# Skills (core + integrations + meta-self)
say "Linking skills..."
link_skill_dir() {
    local dir="$1" name
    [ -d "$dir" ] || return 0
    [ -f "$dir/SKILL.md" ] || return 0
    name="$(basename "$dir")"
    install_link "$dir" "$SKILLS_DST/$name"
    echo "    $name"
}

for skill in "$PLUGIN_DIR/skills"/*/; do
    [ -d "$skill" ] || continue
    # skip the integrations dir itself; iterate below
    if [ "$(basename "$skill")" = "integrations" ]; then
        continue
    fi
    link_skill_dir "${skill%/}"
done

for skill in "$PLUGIN_DIR/skills/integrations"/*/; do
    link_skill_dir "${skill%/}"
done

say "Done."
echo
echo "    Installed to $CLAUDE_DIR"
echo "    Commands: $(find "$PLUGIN_DIR/commands" -name '*.md' -type f | wc -l | tr -d ' ')"
echo "    Skills:   $(find "$PLUGIN_DIR/skills" -name 'SKILL.md' -type f | wc -l | tr -d ' ')"
echo
echo "    Restart Claude Code, then try:  /meta \"<your task>\""
