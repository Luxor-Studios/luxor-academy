import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { GLYPH_MAP, type GlyphName } from "@/components/synergetics";
import type { Quest } from "@/lib/tiers";
import { cn } from "@/lib/utils";

const STATUS_LABEL: Record<Quest["status"], string> = {
  available: "Available",
  drafted: "Drafted · human gate",
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
  const locked = quest.status === "locked";
  const href = locked ? "#" : `/${tierSlug}/${trackSlug}/${quest.id}`;

  const content = (
    <Card
      className={cn(
        "h-full border-border/60 bg-card/60 transition-all duration-300",
        !locked && "hover:border-primary/60 hover:shadow-[0_0_24px_rgba(233,185,73,0.25)]",
        locked && "opacity-70",
      )}
    >
      <CardHeader className="space-y-3">
        <div className="flex items-start justify-between">
          <Glyph size={24} className="text-primary" />
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
          <span>{quest.moduleCount} modules · {quest.estimatedMinutes}m</span>
          <span className="text-primary">{quest.xpReward} XP</span>
        </div>
      </CardContent>
    </Card>
  );

  return locked ? (
    <div aria-disabled="true">{content}</div>
  ) : (
    <Link href={href} className="block">
      {content}
    </Link>
  );
}
