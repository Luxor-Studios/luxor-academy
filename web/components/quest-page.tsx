import fs from "node:fs/promises";
import path from "node:path";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Nav } from "@/components/nav";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { GLYPH_MAP, type GlyphName } from "@/components/synergetics";
import { accentHex, accentRgb } from "@/lib/track-accents";
import { TIERS, type Tier, type Quest, type Track } from "@/lib/tiers";

const MODULES_ROOT = path.join(process.cwd(), "..", "modules");

interface ModuleManifest {
  meta: {
    id: string;
    title: string;
    xp_reward: number;
    estimated_minutes: number;
    tier: string;
  };
  slots: {
    primer: { key_insight: string };
    next: { ship_your_own: boolean };
  };
}

interface QuestManifest {
  id: string;
  title: string;
  subtitle: string;
  tier: string;
  glyph: GlyphName;
  description: string;
  modules: string[];
  module_count: number;
  total_xp: number;
  total_xp_deferred?: number;
  estimated_minutes: number;
  canonical_last_module: string;
  source_repo: {
    vendored_path: string;
    upstream_url: string;
    upstream_ref: string;
    readme_permalink: string;
  };
}

/** Build static params for a tier by walking its TIERS entry. */
export function generateQuestParamsFor(tier: Tier): { track: string; quest: string }[] {
  return TIERS[tier].tracks.flatMap((t) =>
    t.quests.map((q) => ({ track: t.id, quest: q.id })),
  );
}

async function tryLoadModules(track: string, quest: string) {
  const dir = path.join(MODULES_ROOT, track, quest);
  const manifestPath = path.join(dir, "quest.manifest.json");
  try {
    const qm = JSON.parse(await fs.readFile(manifestPath, "utf-8")) as QuestManifest;
    const modules = await Promise.all(
      qm.modules.map(async (id) =>
        JSON.parse(
          await fs.readFile(path.join(dir, `${id}.module.json`), "utf-8"),
        ) as ModuleManifest,
      ),
    );
    return { manifest: qm, modules };
  } catch {
    return null;
  }
}

function findQuestInTiers(
  tier: Tier,
  trackId: string,
  questId: string,
): { track: Track; quest: Quest } | null {
  const t = TIERS[tier].tracks.find((x) => x.id === trackId);
  if (!t) return null;
  const q = t.quests.find((x) => x.id === questId);
  if (!q) return null;
  return { track: t, quest: q };
}

export interface QuestPageProps {
  tier: Tier;
  track: string;
  quest: string;
}

export async function QuestPage({ tier, track, quest }: QuestPageProps) {
  const fromTiers = findQuestInTiers(tier, track, quest);
  if (!fromTiers) {
    notFound();
  }
  const { track: tk, quest: q } = fromTiers!;
  const hex = accentHex(tk.glyph);
  const rgb = accentRgb(tk.glyph);
  const Glyph = GLYPH_MAP[tk.glyph];
  const tierLabel = TIERS[tier].label;

  const modulesBundle = await tryLoadModules(track, quest);

  return (
    <>
      <Nav />
      <main className="mx-auto w-full max-w-6xl px-6 py-16">
        <section
          className="relative mb-12 overflow-hidden rounded-3xl border border-border/60 bg-card/40 p-8 md:p-12"
          style={{
            // Retro sunset gradient tinted by the track's accent — very subtle.
            background: `linear-gradient(135deg, rgba(10,22,40,0.25) 0%, rgba(${rgb}, 0.08) 55%, rgba(255, 214, 176, 0.06) 100%)`,
          }}
        >
          {/* Horizon stripe — the boardwalk cue */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 top-0 h-[2px]"
            style={{
              background: `linear-gradient(90deg, transparent, ${hex}, #FFD6B0, #00F5FF, transparent)`,
              opacity: 0.7,
            }}
          />

          <div className="flex items-center gap-4">
            <Link
              href={`/${tier}`}
              className="font-mono text-xs uppercase tracking-widest text-muted-foreground hover:text-primary"
            >
              ← {tierLabel}
            </Link>
            <Separator orientation="vertical" className="h-4" />
            <span className="font-mono text-xs uppercase tracking-widest" style={{ color: hex }}>
              Track · {tk.title}
            </span>
            <Separator orientation="vertical" className="h-4" />
            <Badge
              variant="outline"
              className="border-border/60 bg-transparent font-mono text-[10px] uppercase tracking-widest"
              style={{ color: hex, borderColor: `rgba(${rgb}, 0.5)` }}
            >
              {modulesBundle ? "Content live" : "Preview"}
            </Badge>
          </div>

          <div className="mt-8 flex items-start gap-6">
            <Glyph
              size={72}
              className="shrink-0"
              style={{ color: hex, filter: `drop-shadow(0 0 14px rgba(${rgb}, 0.55))` }}
            />
            <div className="space-y-3">
              <h1 className="font-display text-4xl leading-[1.05] sm:text-5xl">
                {modulesBundle?.manifest.title ?? q.title}
              </h1>
              {modulesBundle ? (
                <p className="max-w-3xl text-lg italic text-muted-foreground">
                  {modulesBundle.manifest.subtitle}
                </p>
              ) : null}
            </div>
          </div>

          <p className="mt-6 max-w-3xl leading-relaxed text-muted-foreground">
            {modulesBundle?.manifest.description ?? q.description}
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-border/40 pt-5 font-mono text-xs uppercase tracking-widest text-muted-foreground">
            <span>
              {modulesBundle?.manifest.module_count ?? q.moduleCount} modules ·{" "}
              {modulesBundle?.manifest.estimated_minutes ?? q.estimatedMinutes}m
            </span>
            <span style={{ color: hex }}>
              {modulesBundle?.manifest.total_xp ?? q.xpReward} XP
              {(modulesBundle?.manifest.total_xp_deferred ?? q.xpReward_deferred) ? (
                <span className="text-muted-foreground">
                  {" "}
                  +{modulesBundle?.manifest.total_xp_deferred ?? q.xpReward_deferred} deferred
                </span>
              ) : null}
            </span>
            {q.upstreamRepo ? (
              <a
                href={q.upstreamRepo}
                rel="noopener noreferrer"
                target="_blank"
                className="ml-auto text-muted-foreground transition-colors hover:text-primary"
              >
                ↗ {q.upstreamRepo.replace(/^https?:\/\//, "")}
              </a>
            ) : null}
          </div>
        </section>

        {modulesBundle ? (
          <LiveModuleList
            tier={tier}
            track={track}
            quest={quest}
            modules={modulesBundle.modules}
            hex={hex}
            rgb={rgb}
          />
        ) : (
          <DraftPreview quest={q} track={tk} hex={hex} rgb={rgb} />
        )}
      </main>
    </>
  );
}

function LiveModuleList({
  tier,
  track,
  quest,
  modules,
  hex,
  rgb,
}: {
  tier: Tier;
  track: string;
  quest: string;
  modules: ModuleManifest[];
  hex: string;
  rgb: string;
}) {
  return (
    <section className="space-y-5">
      <h2 className="font-mono text-xs uppercase tracking-widest" style={{ color: hex }}>
        Modules
      </h2>
      <div className="grid gap-5 md:grid-cols-2">
        {modules.map((m, idx) => {
          const href = `/modules/${track}/${quest}/${m.meta.id}.html`;
          const isShipYourOwn = m.slots.next.ship_your_own;
          return (
            <Link key={m.meta.id} href={href} className="group block">
              <Card
                className="relative h-full overflow-hidden border-border/60 bg-card/60 transition-all duration-300"
                style={{
                  // Applied only on hover via CSS var consumption in className.
                  ["--hover-border" as string]: `rgba(${rgb}, 0.55)`,
                  ["--hover-shadow" as string]: `0 0 32px rgba(${rgb}, 0.25)`,
                }}
                data-hover
              >
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-x-0 top-0 h-[2px] opacity-50 transition-opacity duration-300 group-hover:opacity-100"
                  style={{ background: `linear-gradient(90deg, transparent, ${hex}, transparent)` }}
                />
                <CardHeader className="space-y-3 pt-6 group-hover:border-[color:var(--hover-border)] group-hover:shadow-[var(--hover-shadow)]">
                  <div className="flex items-start justify-between">
                    <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
                      Module {String(idx + 1).padStart(2, "0")}
                    </span>
                    {isShipYourOwn ? (
                      <Badge
                        variant="outline"
                        className="font-mono text-[10px] uppercase tracking-widest"
                        style={{
                          color: hex,
                          borderColor: `rgba(${rgb}, 0.4)`,
                          backgroundColor: `rgba(${rgb}, 0.12)`,
                        }}
                      >
                        Ship your own
                      </Badge>
                    ) : null}
                  </div>
                  <CardTitle className="font-display text-xl leading-snug">
                    {m.meta.title}
                  </CardTitle>
                  <CardDescription className="leading-relaxed text-muted-foreground">
                    {m.slots.primer.key_insight}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between border-t border-border/40 pt-4 font-mono text-xs uppercase tracking-widest text-muted-foreground">
                    <span>{m.meta.estimated_minutes}m</span>
                    <span style={{ color: hex }}>{m.meta.xp_reward} XP</span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
      <footer
        className="mt-10 border-t border-border/40 pt-8 font-mono text-xs uppercase tracking-widest text-muted-foreground"
        suppressHydrationWarning
      >
        Modules are self-contained HTML — they open in a new page and own their own XP writes through the atlas shell.
      </footer>
    </section>
  );
}

function DraftPreview({
  quest,
  track,
  hex,
  rgb,
}: {
  quest: Quest;
  track: Track;
  hex: string;
  rgb: string;
}) {
  return (
    <section className="space-y-6">
      <h2 className="font-mono text-xs uppercase tracking-widest" style={{ color: hex }}>
        Preview
      </h2>

      <Card className="border-border/60 bg-card/50">
        <CardHeader className="space-y-3">
          <CardTitle className="font-display text-2xl leading-snug">
            Drafted — content will be forged in a future wave
          </CardTitle>
          <CardDescription className="text-base leading-relaxed text-muted-foreground">
            Modules for this quest have not been generated yet. What you see below is the
            pedagogical skeleton drawn from <code className="rounded bg-muted px-1 py-0.5 font-mono text-[13px]">{quest.sourceRepo}</code> — a sketch of what
            the finished quest will cover. It will be rendered into {quest.moduleCount}{" "}
            interactive modules following the same six-slot contract that powers the{" "}
            <Link
              href="/novice/build-and-ship/forge-barque"
              className="underline decoration-dotted underline-offset-4 transition-colors hover:text-primary"
              style={{ color: hex }}
            >
              Forge BARQUE
            </Link>{" "}
            quest (the one already live, for reference).
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <div className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
                Track context
              </div>
              <p className="leading-relaxed text-muted-foreground">{track.description}</p>
            </div>
            <div className="space-y-2">
              <div className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
                What you'll walk away with
              </div>
              <ul className="space-y-1.5 leading-relaxed text-muted-foreground">
                <li>
                  <span style={{ color: hex }}>▸</span>{" "}
                  {quest.moduleCount} modules of primer + visual + interactive + artifact + self-check + next
                </li>
                <li>
                  <span style={{ color: hex }}>▸</span>{" "}
                  {quest.xpReward} XP banked into your sovereign export
                </li>
                <li>
                  <span style={{ color: hex }}>▸</span>{" "}
                  A <em>ship your own</em> finale — paste your repo URL, walk away with a permalink
                </li>
              </ul>
            </div>
          </div>

          <div
            className="rounded-2xl border p-5"
            style={{
              borderColor: `rgba(${rgb}, 0.35)`,
              background: `linear-gradient(135deg, rgba(${rgb}, 0.06), rgba(${rgb}, 0.02))`,
            }}
          >
            <div className="font-mono text-xs uppercase tracking-widest" style={{ color: hex }}>
              Pipeline status
            </div>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              This quest is queued for the <span className="font-mono text-foreground">codebase-to-course</span> pipeline.
              Phase 1 ships Forge BARQUE as the canonical reference; this quest will follow the same pattern once its
              source repo has been spelunked and its six slots extracted. If you want to pressure-test the idea before
              modules land, open the source repo link above and skim the README.
            </p>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
