import Link from "next/link";
import { TIER_ORDER, TIERS } from "@/lib/tiers";

export function Nav() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-6">
        <Link
          href="/"
          className="flex items-center gap-3 font-display text-lg tracking-wide"
          aria-label="LUXOR Academy home"
        >
          <span aria-hidden="true" className="text-primary">✦</span>
          <span>
            LUXOR <span className="text-primary">Academy</span>
          </span>
        </Link>

        <nav className="flex items-center gap-1 text-sm font-mono uppercase tracking-widest">
          {TIER_ORDER.map((tier) => (
            <Link
              key={tier}
              href={`/${tier}`}
              className="rounded-md px-3 py-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-primary focus-visible:bg-secondary focus-visible:text-primary"
            >
              {TIERS[tier].label}
            </Link>
          ))}
          <Link
            href="/atlas"
            className="ml-2 rounded-md border border-border/60 px-3 py-2 text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
          >
            Atlas
          </Link>
        </nav>
      </div>
    </header>
  );
}
