/**
 * Fuller synergetics glyphs — the hierarchy icon system.
 *
 * Tetrahedron = Module · Octahedron = Quest · Cuboctahedron (VE) = Track
 * Jitterbug = transitions · Icosahedron = Mastery · Geodesic = Atlas
 *
 * SVG only (launch-plan-v1.1 invariant: no WebGL).
 * Canonical versions also live at atlas/icons/synergetics/*.svg for module pages.
 */

type GlyphProps = React.SVGProps<SVGSVGElement> & { size?: number };

const base = (size: number, extra: React.SVGProps<SVGSVGElement> = {}) => ({
  width: size,
  height: size,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  ...extra,
});

export function Tetrahedron({ size = 24, ...props }: GlyphProps) {
  return (
    <svg {...base(size, props)}>
      <path d="M12 2 L22 20 L2 20 Z" />
      <path d="M12 2 L12 20" />
      <path d="M12 20 L12 14 L22 20" />
      <path d="M12 14 L2 20" />
    </svg>
  );
}

export function Octahedron({ size = 24, ...props }: GlyphProps) {
  return (
    <svg {...base(size, props)}>
      <path d="M12 2 L22 12 L12 22 L2 12 Z" />
      <path d="M2 12 L22 12" />
      <path d="M12 2 L12 22" />
    </svg>
  );
}

export function Cuboctahedron({ size = 24, ...props }: GlyphProps) {
  return (
    <svg {...base(size, props)}>
      <path d="M12 2 L20 6 L20 14 L12 18 L4 14 L4 6 Z" />
      <path d="M12 2 L12 10" />
      <path d="M4 6 L12 10 L20 6" />
      <path d="M4 14 L12 10 L20 14" />
      <path d="M8 4 L16 4 M8 20 L16 20" opacity="0.5" />
    </svg>
  );
}

export function Jitterbug({ size = 24, ...props }: GlyphProps) {
  return (
    <svg {...base(size, props)}>
      <path d="M12 3 L20 9 L16 19 L8 19 L4 9 Z" />
      <path d="M12 3 L12 19" />
      <path d="M4 9 L20 9" />
      <path d="M8 19 L16 9 M16 19 L8 9" opacity="0.6" />
    </svg>
  );
}

export function Icosahedron({ size = 24, ...props }: GlyphProps) {
  return (
    <svg {...base(size, props)}>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12 L21 12" />
      <path d="M12 3 L12 21" />
      <path d="M5 6 L19 18 M5 18 L19 6" opacity="0.6" />
      <circle cx="12" cy="12" r="3" opacity="0.4" />
    </svg>
  );
}

export function Geodesic({ size = 24, ...props }: GlyphProps) {
  return (
    <svg {...base(size, props)}>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12 L21 12" />
      <path d="M12 3 L12 21" />
      <path d="M5.6 5.6 L18.4 18.4 M5.6 18.4 L18.4 5.6" opacity="0.6" />
      <circle cx="12" cy="12" r="5" opacity="0.5" />
      <circle cx="12" cy="12" r="2" opacity="0.7" />
    </svg>
  );
}

export const GLYPH_MAP = {
  tetrahedron: Tetrahedron,
  octahedron: Octahedron,
  cuboctahedron: Cuboctahedron,
  jitterbug: Jitterbug,
  icosahedron: Icosahedron,
  geodesic: Geodesic,
} as const;

export type GlyphName = keyof typeof GLYPH_MAP;
