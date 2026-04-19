import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TIERS, type Tier } from "@/lib/tiers";
import { Cuboctahedron, Octahedron, Icosahedron } from "@/components/synergetics";

const GLYPH: Record<Tier, React.ComponentType<{ size?: number; className?: string }>> = {
  novice: Cuboctahedron,
  experienced: Octahedron,
  expert: Icosahedron,
};

export function TierCard({ tier }: { tier: Tier }) {
  const data = TIERS[tier];
  const Glyph = GLYPH[tier];
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
      <Card className="h-full border-border/60 bg-card/70 backdrop-blur-sm transition-all duration-300 group-hover:border-primary/60 group-hover:shadow-[0_0_30px_rgba(233,185,73,0.35)]">
        <CardHeader className="space-y-4">
          <div className="flex items-start justify-between">
            <span className="font-mono text-xs uppercase tracking-widest text-accent">
              Tier · {data.label}
            </span>
            <Glyph size={32} className="text-primary transition-transform duration-500 group-hover:rotate-45" />
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
            <span>{data.tracks.length} tracks · {totalQuests} quests</span>
            <span className="text-primary">{totalXp.toLocaleString()} XP →</span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
