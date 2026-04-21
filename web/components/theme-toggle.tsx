"use client";
import { useTheme } from "@/lib/theme";
import { cn } from "@/lib/utils";

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, toggle } = useTheme();
  const isParchment = theme === "parchment";
  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={isParchment ? "Switch to dark mode" : "Switch to parchment mode"}
      title={isParchment ? "Dark" : "Parchment"}
      className={cn(
        "inline-flex h-7 w-7 items-center justify-center rounded-full border border-border/60 bg-card/60 backdrop-blur-sm transition-colors hover:border-primary/60 hover:text-primary",
        className,
      )}
    >
      {isParchment ? (
        // Sun icon (we're on light mode, click to go dark — show moon would confuse; show sun to indicate current)
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
        </svg>
      ) : (
        // Moon
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
        </svg>
      )}
    </button>
  );
}
