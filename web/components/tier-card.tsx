import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TIERS, type Tier } from "@/lib/tiers";
import { Cuboctahedron, Octahedron, Icosahedron, type GlyphName } from "@/components/synergetics";
import { accentHex, accentRgb } from "@/lib/track-accents";

const GLYPH: Record<Tier, React.ComponentType<{ size?: number; className?: string; style?: React.CSSProperties }>> = {
  novice: Cuboctahedron,
  experienced: Octahedron,
  expert: Icosahedron,
};

const GLYPH_NAME: Record<Tier, GlyphName> = {
  novice: "cuboctahedron",
  experienced: "octahedron",
  expert: "icosahedron",
};

export function TierCard({ tier }: { tier: Tier }) {
  const data = TIERS[tier];
  const Glyph = GLYPH[tier];
  const hex = accentHex(GLYPH_NAME[tier]);
  const rgb = accentRgb(GLYPH_NAME[tier]);
  const totalQuests = data.tracks.reduce((n, t) => n + t.quests.length, 0);
  const totalXp = data.tracks.reduce(
    (n, t) => n + t.quests.reduce((m, q) => m + q.xpReward, 0),
    0,
  );

  return (
    <Link
      href={`/${tier}`}
      className="group block transition-transform will-change-transform hover:-translate-y-1"
    >
      <Card
        className="relative h-full overflow-hidden border-border/60 bg-card/70 backdrop-blur-sm transition-all duration-300"
        style={{
          ["--tier-hover-border" as string]: `rgba(${rgb}, 0.6)`,
          ["--tier-hover-shadow" as string]: `0 0 34px rgba(${rgb}, 0.4)`,
        }}
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-[3px] opacity-60 transition-opacity duration-300 group-hover:opacity-100"
          style={{
            background: `linear-gradient(90deg, transparent 0%, ${hex} 50%, transparent 100%)`,
          }}
        />
        <div className="group-hover:[&]:border-[color:var(--tier-hover-border)] group-hover:[&]:shadow-[var(--tier-hover-shadow)]">
          <CardHeader className="space-y-4 pt-7">
            <div className="flex items-start justify-between">
              <span className="font-mono text-xs uppercase tracking-widest" style={{ color: hex }}>
                Tier · {data.label}
              </span>
              <Glyph
                size={32}
                style={{ color: hex, filter: `drop-shadow(0 0 10px rgba(${rgb}, 0.6))` }}
                className="transition-transform duration-500 group-hover:rotate-45"
              />
            </div>
            <CardTitle className="font-display text-3xl leading-tight text-foreground">
              {data.tagline}
            </CardTitle>
            <CardDescription className="text-base leading-relaxed text-muted-foreground">
              {data.outcome}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {data.anchorProjects.map((p) => (
                <Badge key={p} variant="secondary" className="font-mono text-xs tracking-wider">
                  {p}
                </Badge>
              ))}
            </div>
            <div className="flex items-center justify-between border-t border-border/40 pt-4 font-mono text-xs uppercase tracking-widest text-muted-foreground">
              <span>
                {data.tracks.length} tracks · {totalQuests} quests
              </span>
              <span style={{ color: hex }}>{totalXp.toLocaleString()} XP →</span>
            </div>
          </CardContent>
        </div>
      </Card>
    </Link>
  );
}
