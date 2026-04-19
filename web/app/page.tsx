import { Nav } from "@/components/nav";
import { TierCard } from "@/components/tier-card";
import { TIER_ORDER } from "@/lib/tiers";

export default function LandingPage() {
  return (
    <>
      <Nav />
      <main>
        {/* Hero */}
        <section className="mx-auto w-full max-w-7xl px-6 pt-24 pb-16 sm:pt-32 sm:pb-20">
          <div className="max-w-4xl space-y-8">
            <span className="inline-block font-mono text-xs uppercase tracking-[0.2em] text-accent">
              LUXOR · Academy · v0.5
            </span>
            <h1 className="font-display text-5xl leading-[1.02] tracking-tight sm:text-7xl">
              Walk through the <span className="text-primary">knowledge-ware library</span> of the cutting-edge future.
            </h1>
            <p className="max-w-3xl text-xl leading-relaxed text-muted-foreground">
              169 Claude skills. 55 agents. 103 commands. A decade of shippable repos. Turned into a
              gamified, playable atlas of your own mind. Pick a tier. Enter a Quest. Ship a real artifact.
            </p>
            <div className="flex flex-wrap gap-4 pt-2 font-mono text-xs uppercase tracking-widest text-muted-foreground">
              <span>Atlas → Tracks → Quests → Modules</span>
              <span className="text-primary">·</span>
              <span>Every module = a real file in a real repo</span>
              <span className="text-primary">·</span>
              <span>Every quest ends with <span className="text-primary">ship_your_own</span></span>
            </div>
          </div>
        </section>

        {/* Three tiers */}
        <section className="mx-auto w-full max-w-7xl px-6 pb-24">
          <div className="mb-10 flex items-end justify-between">
            <div>
              <div className="font-mono text-xs uppercase tracking-widest text-accent">
                § Choose your tier
              </div>
              <h2 className="mt-2 font-display text-4xl leading-tight sm:text-5xl">
                Three doors, one atlas.
              </h2>
            </div>
          </div>
          <div className="grid gap-6 lg:grid-cols-3">
            {TIER_ORDER.map((tier) => (
              <TierCard key={tier} tier={tier} />
            ))}
          </div>
        </section>

        {/* Provenance strip */}
        <section className="border-y border-border/40 bg-card/40">
          <div className="mx-auto w-full max-w-7xl px-6 py-12">
            <div className="grid gap-8 md:grid-cols-3">
              <div>
                <div className="font-mono text-xs uppercase tracking-widest text-accent">Provenance</div>
                <p className="mt-3 leading-relaxed text-muted-foreground">
                  Every module cites a real file at a real commit SHA. No synthetic examples. If you can
                  run the code, you can read the line you learned from.
                </p>
              </div>
              <div>
                <div className="font-mono text-xs uppercase tracking-widest text-accent">Sovereignty</div>
                <p className="mt-3 leading-relaxed text-muted-foreground">
                  XP lives in your browser (localStorage + one-click export). No accounts. No tracking.
                  Your progress is yours.
                </p>
              </div>
              <div>
                <div className="font-mono text-xs uppercase tracking-widest text-accent">Validation</div>
                <p className="mt-3 leading-relaxed text-muted-foreground">
                  Every module passes a 6-slot contract, axe-core a11y, Lighthouse budgets, and a
                  MERCURIO+MARS agentic review before it ships.
                </p>
              </div>
            </div>
          </div>
        </section>

        <footer className="mx-auto w-full max-w-7xl px-6 py-12 font-mono text-xs uppercase tracking-widest text-muted-foreground">
          LUXOR Studios · <span className="text-primary">academy.luxorstudios.ai</span> · Built with Claude Code
        </footer>
      </main>
    </>
  );
}
