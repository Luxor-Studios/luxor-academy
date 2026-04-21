import Link from "next/link";
import { Nav } from "@/components/nav";
import { Separator } from "@/components/ui/separator";
import { QuestCard } from "@/components/quest-card";
import { GLYPH_MAP } from "@/components/synergetics";
import { accentHex, accentRgb } from "@/lib/track-accents";
import { TIERS, type Tier } from "@/lib/tiers";

export function TierPage({ tier }: { tier: Tier }) {
  const data = TIERS[tier];

  return (
    <>
      <Nav />
      <main className="mx-auto w-full max-w-7xl px-6 py-16">
        {/* Hero */}
        <section className="mb-16 space-y-6">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="font-mono text-xs uppercase tracking-widest text-muted-foreground hover:text-primary"
            >
              ← Academy
            </Link>
            <Separator orientation="vertical" className="h-4" />
            <span className="font-mono text-xs uppercase tracking-widest text-accent">
              Tier · {data.label}
            </span>
          </div>
          <h1 className="max-w-4xl font-display text-5xl leading-[1.05] sm:text-6xl">
            {data.tagline}
          </h1>
          <p className="max-w-3xl text-lg leading-relaxed text-muted-foreground">
            {data.outcome}
          </p>

          <div className="flex flex-wrap items-center gap-6 pt-2">
            <div>
              <div className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
                Anchor projects
              </div>
              <div className="mt-2 flex flex-wrap gap-2">
                {data.anchorProjects.map((p) => (
                  <span
                    key={p}
                    className="rounded-md border border-border/60 bg-card/80 px-3 py-1 font-mono text-sm tracking-wide text-primary"
                  >
                    {p}
                  </span>
                ))}
              </div>
            </div>
            <Separator orientation="vertical" className="hidden h-16 sm:block" />
            <div>
              <div className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
                Core skills
              </div>
              <div className="mt-2 flex flex-wrap gap-2">
                {data.coreSkills.map((s) => (
                  <span
                    key={s}
                    className="font-mono text-sm text-muted-foreground"
                  >
                    <span className="text-accent">/</span>{s}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Tracks */}
        {data.tracks.map((track) => {
          const Glyph = GLYPH_MAP[track.glyph];
          const hex = accentHex(track.glyph);
          const rgb = accentRgb(track.glyph);
          return (
            <section key={track.id} className="mb-20 space-y-6">
              <div className="flex items-start gap-5">
                <Glyph
                  size={56}
                  className="shrink-0"
                  style={{ color: hex, filter: `drop-shadow(0 0 14px rgba(${rgb}, 0.45))` }}
                />
                <div className="space-y-2">
                  <div
                    className="font-mono text-xs uppercase tracking-widest"
                    style={{ color: hex }}
                  >
                    Track · {track.glyph}
                  </div>
                  <h2 className="font-display text-3xl leading-tight">{track.title}</h2>
                  <p className="max-w-3xl leading-relaxed text-muted-foreground">
                    {track.description}
                  </p>
                </div>
              </div>

              <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                {track.quests.map((q) => (
                  <QuestCard
                    key={q.id}
                    quest={q}
                    trackGlyph={track.glyph}
                    tierSlug={tier}
                    trackSlug={track.id}
                  />
                ))}
              </div>
            </section>
          );
        })}

        <footer className="mt-24 border-t border-border/40 pt-8 font-mono text-xs uppercase tracking-widest text-muted-foreground">
          Every quest's last module is <span className="text-primary">ship_your_own</span> — you bring your repo, the academy forges your personal permalink quest.
        </footer>
      </main>
    </>
  );
}
