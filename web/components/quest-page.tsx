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

// Manifests carry optional _es sibling fields so future language work can light up
// without a schema migration. UI renders EN only for now.
interface ModuleManifest {
  meta: {
    id: string;
    title: string;
    title_es?: string;
    xp_reward: number;
    estimated_minutes: number;
    tier: string;
  };
  slots: {
    primer: { key_insight: string; key_insight_es?: string };
    next: { ship_your_own: boolean };
  };
}

interface PlannedModule {
  id: string;
  title: string;
  title_es?: string;
  teaser: string;
  teaser_es?: string;
  estimated_minutes: number;
  xp_reward: number;
  source_hint: string;
}

interface QuestManifest {
  id: string;
  title: string;
  title_es?: string;
  subtitle?: string;
  subtitle_es?: string;
  tier: string;
  glyph: GlyphName;
  description: string;
  description_es?: string;
  modules?: string[];
  modules_planned?: PlannedModule[];
  module_count: number;
  total_xp?: number;
  total_xp_planned?: number;
  total_xp_deferred?: number;
  estimated_minutes: number;
  canonical_last_module: string;
  source_repo: {
    vendored_path: string;
    upstream_url: string | null;
    upstream_ref: string;
    readme_permalink?: string | null;
  };
}

type LoadResult =
  | { kind: "LIVE"; manifest: QuestManifest; modules: ModuleManifest[] }
  | { kind: "ROADMAP"; manifest: QuestManifest }
  | { kind: "NONE" };

export function generateQuestParamsFor(tier: Tier): { track: string; quest: string }[] {
  return TIERS[tier].tracks.flatMap((t) =>
    t.quests.map((q) => ({ track: t.id, quest: q.id })),
  );
}

async function loadQuest(track: string, quest: string): Promise<LoadResult> {
  const dir = path.join(MODULES_ROOT, track, quest);
  const manifestPath = path.join(dir, "quest.manifest.json");
  let qm: QuestManifest;
  try {
    qm = JSON.parse(await fs.readFile(manifestPath, "utf-8")) as QuestManifest;
  } catch {
    return { kind: "NONE" };
  }
  if (qm.modules && qm.modules.length > 0) {
    try {
      const modules = await Promise.all(
        qm.modules.map(async (id) =>
          JSON.parse(
            await fs.readFile(path.join(dir, `${id}.module.json`), "utf-8"),
          ) as ModuleManifest,
        ),
      );
      return { kind: "LIVE", manifest: qm, modules };
    } catch {
      // Manifest lists modules but files aren't on disk — fall through to roadmap.
    }
  }
  if (qm.modules_planned && qm.modules_planned.length > 0) {
    return { kind: "ROADMAP", manifest: qm };
  }
  return { kind: "NONE" };
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

  const loaded = await loadQuest(track, quest);
  const qm = loaded.kind !== "NONE" ? loaded.manifest : null;

  const title = qm?.title ?? q.title;
  const subtitle = qm?.subtitle ?? null;
  const description = qm?.description ?? q.description;
  const totalModules = qm?.module_count ?? q.moduleCount;
  const totalMinutes = qm?.estimated_minutes ?? q.estimatedMinutes;
  const totalXp = qm?.total_xp ?? qm?.total_xp_planned ?? q.xpReward;
  const totalXpDeferred = qm?.total_xp_deferred ?? q.xpReward_deferred;
  const upstream = qm?.source_repo?.upstream_url ?? q.upstreamRepo ?? null;

  const badgeLabel =
    loaded.kind === "LIVE" ? "Content live" : loaded.kind === "ROADMAP" ? "Roadmap" : "Preview";

  return (
    <>
      <Nav />
      <main className="mx-auto w-full max-w-6xl px-6 py-16">
        <section
          className="relative mb-12 overflow-hidden rounded-3xl border border-border/60 bg-card/40 p-8 md:p-12"
          style={{
            background: `linear-gradient(135deg, color-mix(in oklab, var(--background) 82%, transparent) 0%, rgba(${rgb}, 0.08) 55%, rgba(255, 214, 176, 0.06) 100%)`,
          }}
        >
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 top-0 h-[2px]"
            style={{
              background: `linear-gradient(90deg, transparent, ${hex}, #FFD6B0, #00F5FF, transparent)`,
              opacity: 0.75,
            }}
          />

          <div className="flex flex-wrap items-center gap-4">
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
              {badgeLabel}
            </Badge>
          </div>

          <div className="mt-8 flex items-start gap-6">
            <Glyph
              size={72}
              className="shrink-0"
              style={{ color: hex, filter: `drop-shadow(0 0 14px rgba(${rgb}, 0.55))` }}
            />
            <div className="space-y-3">
              <h1 className="font-display text-4xl leading-[1.05] sm:text-5xl">{title}</h1>
              {subtitle ? (
                <p className="max-w-3xl text-lg italic text-muted-foreground">{subtitle}</p>
              ) : null}
            </div>
          </div>

          <p className="mt-6 max-w-3xl leading-relaxed text-muted-foreground">{description}</p>

          <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-border/40 pt-5 font-mono text-xs uppercase tracking-widest text-muted-foreground">
            <span>
              {totalModules} modules · {totalMinutes}m
            </span>
            <span style={{ color: hex }}>
              {totalXp} XP
              {totalXpDeferred ? (
                <span className="text-muted-foreground"> +{totalXpDeferred} deferred</span>
              ) : null}
            </span>
            {upstream ? (
              <a
                href={upstream}
                rel="noopener noreferrer"
                target="_blank"
                className="ml-auto text-muted-foreground transition-colors hover:text-primary"
              >
                ↗ {upstream.replace(/^https?:\/\//, "")}
              </a>
            ) : null}
          </div>
        </section>

        {loaded.kind === "LIVE" ? (
          <LiveModuleList
            track={track}
            quest={quest}
            modules={loaded.modules}
            hex={hex}
            rgb={rgb}
          />
        ) : loaded.kind === "ROADMAP" ? (
          <RoadmapList modules={loaded.manifest.modules_planned!} hex={hex} rgb={rgb} />
        ) : (
          <DraftFallback hex={hex} />
        )}
      </main>
    </>
  );
}

function LiveModuleList({
  track,
  quest,
  modules,
  hex,
  rgb,
}: {
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
                  ["--hover-border" as string]: `rgba(${rgb}, 0.55)`,
                  ["--hover-shadow" as string]: `0 0 32px rgba(${rgb}, 0.25)`,
                }}
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
      <footer className="mt-10 border-t border-border/40 pt-8 font-mono text-xs uppercase tracking-widest text-muted-foreground">
        Modules are self-contained HTML — they open in a new page and own their own XP writes through the atlas shell.
      </footer>
    </section>
  );
}

function RoadmapList({
  modules,
  hex,
  rgb,
}: {
  modules: PlannedModule[];
  hex: string;
  rgb: string;
}) {
  return (
    <section className="space-y-6">
      <div className="flex items-baseline justify-between gap-4">
        <h2 className="font-mono text-xs uppercase tracking-widest" style={{ color: hex }}>
          Roadmap
        </h2>
        <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
          {modules.length} modules planned
        </span>
      </div>

      <Card className="border-border/60 bg-card/40">
        <CardHeader className="space-y-3">
          <CardTitle className="font-display text-2xl leading-snug">
            Drafted — the path is mapped, the modules will be forged next
          </CardTitle>
          <CardDescription className="text-base leading-relaxed text-muted-foreground">
            What you see below is the pedagogical roadmap for this quest, drawn from the source repo.
            Each module will be generated into an interactive page following the same six-slot
            contract that powers the{" "}
            <Link
              href="/novice/build-and-ship/forge-barque"
              className="underline decoration-dotted underline-offset-4 transition-colors hover:text-primary"
              style={{ color: hex }}
            >
              Forge BARQUE
            </Link>{" "}
            quest (live for reference). Source hints point to the real files each module will excerpt.
          </CardDescription>
        </CardHeader>
      </Card>

      <ol className="space-y-4">
        {modules.map((m, idx) => {
          const isShipYourOwn = m.id.includes("ship-your-own");
          return (
            <li
              key={m.id}
              className="relative rounded-2xl border border-border/60 p-6 transition-colors"
              style={{
                background: `linear-gradient(135deg, color-mix(in oklab, var(--card) 85%, transparent) 0%, rgba(${rgb}, 0.04) 100%)`,
              }}
            >
              <div
                aria-hidden
                className="pointer-events-none absolute left-0 top-6 h-[calc(100%-48px)] w-[3px] rounded-r"
                style={{ background: hex, opacity: 0.55 }}
              />
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-3">
                    <span
                      className="inline-flex h-6 w-6 items-center justify-center rounded-full border font-mono text-[10px]"
                      style={{
                        color: hex,
                        borderColor: `rgba(${rgb}, 0.5)`,
                        backgroundColor: `rgba(${rgb}, 0.1)`,
                      }}
                    >
                      {String(idx + 1).padStart(2, "0")}
                    </span>
                    <h3 className="font-display text-lg leading-tight">{m.title}</h3>
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
                  <p className="max-w-2xl pl-9 leading-relaxed text-muted-foreground">{m.teaser}</p>
                </div>
                <div className="flex flex-col items-end gap-1 pt-1 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                  <span>{m.estimated_minutes}m</span>
                  <span style={{ color: hex }}>{m.xp_reward} XP</span>
                </div>
              </div>
              <div className="mt-3 pl-9 font-mono text-[11px] text-muted-foreground">
                <span style={{ color: hex }}>▸</span> source:{" "}
                <code className="rounded bg-muted/60 px-1.5 py-0.5 text-[11px]">
                  {m.source_hint}
                </code>
              </div>
            </li>
          );
        })}
      </ol>
    </section>
  );
}

function DraftFallback({ hex }: { hex: string }) {
  return (
    <section className="space-y-5">
      <h2 className="font-mono text-xs uppercase tracking-widest" style={{ color: hex }}>
        Preview
      </h2>
      <Card className="border-border/60 bg-card/50">
        <CardHeader className="space-y-3">
          <CardTitle className="font-display text-2xl leading-snug">
            Drafted — content will be forged in a future wave
          </CardTitle>
          <CardDescription className="text-base leading-relaxed text-muted-foreground">
            Modules for this quest have not been outlined yet. Check back soon — or open the source
            repo link above and skim the README to pressure-test the idea.
          </CardDescription>
        </CardHeader>
      </Card>
    </section>
  );
}
