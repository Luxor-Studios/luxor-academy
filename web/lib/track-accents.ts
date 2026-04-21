/**
 * Retro-boardwalk accent palette — one color per synergetic glyph.
 *
 * LUXOR's foundation is navy + gold (see globals.css :root). This module
 * layers a secondary palette on top — each track gets a distinct neon-ish
 * accent color that tints its glyph, hover glow, and badge highlight.
 *
 * Aesthetic target: 80s-90s arcade-pier nostalgia (sunset coral, neon
 * teal, hot magenta, dusk violet, arcade green, soft peach) anchored to
 * LUXOR's Playfair + Inter + JetBrains Mono typography. No gradient-text
 * headline ambushes; the color shows up on icons, rings, and glows.
 */

import type { GlyphName } from "@/components/synergetics";

export interface TrackAccent {
  hex: string;
  /** rgba triplet (no alpha) for `rgba(var(--…), alpha)` composition in shadow-utils. */
  rgb: string;
  /** Friendly label for internal reference / tooling. */
  label: string;
}

export const TRACK_ACCENT: Record<GlyphName, TrackAccent> = {
  cuboctahedron: {
    hex: "#FF7E6B",
    rgb: "255, 126, 107",
    label: "sunset coral",
  },
  tetrahedron: {
    hex: "#E9B949",
    rgb: "233, 185, 73",
    label: "luxor gold",
  },
  octahedron: {
    hex: "#00F5FF",
    rgb: "0, 245, 255",
    label: "cyan phosphor",
  },
  jitterbug: {
    hex: "#FF4DD8",
    rgb: "255, 77, 216",
    label: "hot magenta",
  },
  icosahedron: {
    hex: "#A78BFA",
    rgb: "167, 139, 250",
    label: "dusk violet",
  },
  geodesic: {
    hex: "#39FF14",
    rgb: "57, 255, 20",
    label: "arcade green",
  },
};

/** Hex accent for a glyph; falls back to LUXOR gold when the glyph is unknown. */
export function accentHex(glyph: GlyphName): string {
  return TRACK_ACCENT[glyph]?.hex ?? "#E9B949";
}

/** rgba triplet (no alpha) — use in inline style for compositing glows. */
export function accentRgb(glyph: GlyphName): string {
  return TRACK_ACCENT[glyph]?.rgb ?? "233, 185, 73";
}
