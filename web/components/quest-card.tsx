import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { GLYPH_MAP, type GlyphName } from "@/components/synergetics";
import { accentHex, accentRgb } from "@/lib/track-accents";
import type { Quest } from "@/lib/tiers";
import { cn } from "@/lib/utils";

const STATUS_LABEL: Record<Quest["status"], string> = {
  available: "Ready",
  drafted: "Preview",
  "in-progress": "In progress",
  locked: "Locked",
};

const STATUS_CLASS: Record<Quest["status"], string> = {
  available: "bg-primary/20 text-primary border-primary/40",
  drafted: "bg-accent/15 text-accent border-accent/40",
  "in-progress": "bg-secondary text-secondary-foreground border-secondary",
  locked: "bg-muted text-muted-foreground border-border",
};

export function QuestCard({
  quest,
  trackGlyph,
  tierSlug,
  trackSlug,
}: {
  quest: Quest;
  trackGlyph: GlyphName;
  tierSlug: string;
  trackSlug: string;
}) {
  const Glyph = GLYPH_MAP[trackGlyph];
  const href = `/${tierSlug}/${trackSlug}/${quest.id}`;
  const hex = accentHex(trackGlyph);
  const rgb = accentRgb(trackGlyph);

  // Inline styles so each card can carry its own per-track glow without
  // inflating the Tailwind arbitrary-value compiler output.
  const glyphStyle = { color: hex } as const;
  const hoverStyle = {
    "--hover-border": `rgba(${rgb}, 0.55)`,
    "--hover-shadow": `0 0 32px rgba(${rgb}, 0.28)`,
  } as React.CSSProperties;

  return (
    <Link href={href} className="group block">
      <Card
        style={hoverStyle}
        className={cn(
          "relative h-full overflow-hidden border-border/60 bg-card/60 transition-all duration-300",
          "hover:border-[color:var(--hover-border)] hover:shadow-[var(--hover-shadow)]",
        )}
      >
        {/* retro top stripe — lights up on hover with track accent */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-[3px] opacity-60 transition-opacity duration-300 group-hover:opacity-100"
          style={{
            background: `linear-gradient(90deg, transparent, ${hex} 35%, ${hex} 65%, transparent)`,
          }}
        />
        <CardHeader className="space-y-3 pt-6">
          <div className="flex items-start justify-between">
            <Glyph size={26} style={glyphStyle} className="drop-shadow-[0_0_10px_var(--glyph-glow,transparent)] transition-all duration-300 group-hover:[--glyph-glow:currentColor]" />
            <Badge variant="outline" className={cn("font-mono text-[10px] uppercase tracking-widest", STATUS_CLASS[quest.status])}>
              {STATUS_LABEL[quest.status]}
            </Badge>
          </div>
          <CardTitle className="font-display text-xl leading-snug">{quest.title}</CardTitle>
          <CardDescription className="leading-relaxed text-muted-foreground">
            {quest.description}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between border-t border-border/40 pt-4 font-mono text-xs uppercase tracking-widest text-muted-foreground">
            <span>
              {quest.moduleCount} modules · {quest.estimatedMinutes}m
            </span>
            <span style={{ color: hex }}>
              {quest.xpReward} XP
              {quest.xpReward_deferred ? (
                <span className="text-muted-foreground"> +{quest.xpReward_deferred}</span>
              ) : null}
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
