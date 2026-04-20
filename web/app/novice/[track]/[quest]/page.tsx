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

const MODULES_ROOT = path.join(process.cwd(), "..", "modules");

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
  total_xp_deferred_unlocks_at?: string;
  estimated_minutes: number;
  live_interactive_module?: string;
  canonical_last_module: string;
  source_repo: {
    vendored_path: string;
    upstream_url: string;
    upstream_ref: string;
    readme_permalink: string;
  };
}

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

export async function generateStaticParams(): Promise<
  { track: string; quest: string }[]
> {
  const params: { track: string; quest: string }[] = [];
  const tracks = await fs.readdir(MODULES_ROOT, { withFileTypes: true });
  for (const t of tracks) {
    if (!t.isDirectory()) continue;
    const trackDir = path.join(MODULES_ROOT, t.name);
    const quests = await fs.readdir(trackDir, { withFileTypes: true });
    for (const q of quests) {
      if (!q.isDirectory()) continue;
      try {
        await fs.access(path.join(trackDir, q.name, "quest.manifest.json"));
        params.push({ track: t.name, quest: q.name });
      } catch {
        // no manifest → not a quest dir
      }
    }
  }
  return params;
}

async function loadQuest(track: string, quest: string) {
  const dir = path.join(MODULES_ROOT, track, quest);
  const manifestPath = path.join(dir, "quest.manifest.json");
  const qm = JSON.parse(await fs.readFile(manifestPath, "utf-8")) as QuestManifest;
  const modules = await Promise.all(
    qm.modules.map(async (id) =>
      JSON.parse(
        await fs.readFile(path.join(dir, `${id}.module.json`), "utf-8"),
      ) as ModuleManifest,
    ),
  );
  return { quest: qm, modules };
}

export default async function QuestPage({
  params,
}: {
  params: Promise<{ track: string; quest: string }>;
}) {
  const { track, quest } = await params;

  let data;
  try {
    data = await loadQuest(track, quest);
  } catch {
    notFound();
  }

  const { quest: qm, modules } = data!;
  const Glyph = GLYPH_MAP[qm.glyph] ?? GLYPH_MAP.octahedron;

  return (
    <>
      <Nav />
      <main className="mx-auto w-full max-w-6xl px-6 py-16">
        <section className="mb-12 space-y-6">
          <div className="flex items-center gap-4">
            <Link
              href="/novice"
              className="font-mono text-xs uppercase tracking-widest text-muted-foreground hover:text-primary"
            >
              ← Novice
            </Link>
            <Separator orientation="vertical" className="h-4" />
            <span className="font-mono text-xs uppercase tracking-widest text-accent">
              Track · {track}
            </span>
            <Separator orientation="vertical" className="h-4" />
            <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
              Quest · {qm.tier}
            </span>
          </div>

          <div className="flex items-start gap-5">
            <Glyph size={64} className="shrink-0 text-primary" />
            <div className="space-y-3">
              <h1 className="font-display text-4xl leading-[1.1] sm:text-5xl">
                {qm.title}
              </h1>
              <p className="max-w-3xl text-lg italic text-muted-foreground">
                {qm.subtitle}
              </p>
            </div>
          </div>

          <p className="max-w-3xl leading-relaxed text-muted-foreground">
            {qm.description}
          </p>

          <div className="flex flex-wrap items-center gap-6 border-t border-border/40 pt-6 font-mono text-xs uppercase tracking-widest text-muted-foreground">
            <span>
              {qm.module_count} modules · {qm.estimated_minutes}m
            </span>
            <span className="text-primary">
              {qm.total_xp} XP
              {qm.total_xp_deferred ? (
                <>
                  {" "}
                  <span className="text-accent">
                    + {qm.total_xp_deferred} deferred
                  </span>
                </>
              ) : null}
            </span>
            <a
              href={qm.source_repo.upstream_url}
              rel="noopener noreferrer"
              target="_blank"
              className="ml-auto text-muted-foreground hover:text-primary"
            >
              ↗ Source: {qm.source_repo.upstream_url.replace(/^https?:\/\//, "")}
            </a>
          </div>
        </section>

        <section className="space-y-5">
          <h2 className="font-mono text-xs uppercase tracking-widest text-accent">
            Modules
          </h2>
          <div className="grid gap-5 md:grid-cols-2">
            {modules.map((m, idx) => {
              const href = `/modules/${track}/${quest}/${m.meta.id}.html`;
              const isShipYourOwn = m.slots.next.ship_your_own;
              return (
                <Link key={m.meta.id} href={href} className="block">
                  <Card className="h-full border-border/60 bg-card/60 transition-all duration-300 hover:border-primary/60 hover:shadow-[0_0_24px_rgba(233,185,73,0.25)]">
                    <CardHeader className="space-y-3">
                      <div className="flex items-start justify-between">
                        <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
                          Module {String(idx + 1).padStart(2, "0")}
                        </span>
                        {isShipYourOwn ? (
                          <Badge
                            variant="outline"
                            className="border-accent/40 bg-accent/15 font-mono text-[10px] uppercase tracking-widest text-accent"
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
                        <span className="text-primary">
                          {m.meta.xp_reward} XP
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </section>

        <footer className="mt-20 border-t border-border/40 pt-8 font-mono text-xs uppercase tracking-widest text-muted-foreground">
          Module HTMLs are self-contained — they open in a new page and own their own XP writes through the atlas shell.
        </footer>
      </main>
    </>
  );
}
