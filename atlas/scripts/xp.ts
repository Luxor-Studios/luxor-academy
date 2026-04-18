/**
 * LUXOR Academy — XP persistence (localStorage, sovereignty-first)
 *
 * Public API:
 *   XP.get()            → state
 *   XP.award(event)     → new total; emits "xp:awarded" CustomEvent
 *   XP.tier(total?)     → tier for given (or current) total
 *   XP.enabled()        → boolean (respects luxor-academy:xp-enabled)
 *   XP.toggle(on)       → flip enabled flag
 *   XP.export()         → JSON string
 *   XP.import(json)     → true|false
 *   XP.reset()          → wipes state (asks confirm)
 *
 * Source of truth for award values: HANDOFF.md §3.2 item 5.
 */

export type XpEventName =
  | "module:self-check:pass"
  | "module:interactive:complete"
  | "quest:boss-fight:pass"
  | "artifact:shipped";

export interface XpEvent {
  name: XpEventName;
  module_id?: string;
  quest_id?: string;
  verified?: boolean;
}

export interface XpState {
  total: number;
  events: Array<{ at: string; name: XpEventName; value: number; ref?: string }>;
  badges: string[];
  version: 1;
}

export type Tier = "Initiate" | "Adept" | "Journeyman" | "Master" | "Synergist";

const STORAGE_KEY = "luxor-academy:xp";
const TOGGLE_KEY = "luxor-academy:xp-enabled";

const AWARDS: Record<XpEventName, number> = {
  "module:self-check:pass": 50,
  "module:interactive:complete": 75,
  "quest:boss-fight:pass": 300,
  "artifact:shipped": 500,
};

const TIERS: Array<{ name: Tier; threshold: number }> = [
  { name: "Initiate", threshold: 0 },
  { name: "Adept", threshold: 500 },
  { name: "Journeyman", threshold: 2000 },
  { name: "Master", threshold: 8000 },
  { name: "Synergist", threshold: 20000 },
];

function emptyState(): XpState {
  return { total: 0, events: [], badges: [], version: 1 };
}

function read(): XpState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return emptyState();
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed.total !== "number") return emptyState();
    return parsed as XpState;
  } catch {
    return emptyState();
  }
}

function write(state: XpState): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function enabled(): boolean {
  const raw = localStorage.getItem(TOGGLE_KEY);
  if (raw === null) return true;
  return raw === "true";
}

function toggle(on?: boolean): boolean {
  const next = typeof on === "boolean" ? on : !enabled();
  localStorage.setItem(TOGGLE_KEY, String(next));
  document.dispatchEvent(new CustomEvent("xp:toggled", { detail: { enabled: next } }));
  return next;
}

function tierFor(total: number): Tier {
  let current: Tier = "Initiate";
  for (const t of TIERS) if (total >= t.threshold) current = t.name;
  return current;
}

function award(ev: XpEvent): number {
  if (!enabled()) return read().total;
  // Artifact-shipped requires verification bit (MERCURIO: badges only verified-artifact)
  if (ev.name === "artifact:shipped" && ev.verified !== true) return read().total;
  const value = AWARDS[ev.name];
  const state = read();
  const priorTier = tierFor(state.total);
  state.total += value;
  state.events.push({
    at: new Date().toISOString(),
    name: ev.name,
    value,
    ref: ev.module_id || ev.quest_id,
  });
  const newTier = tierFor(state.total);
  if (newTier !== priorTier && !state.badges.includes(`tier:${newTier}`)) {
    state.badges.push(`tier:${newTier}`);
  }
  write(state);
  document.dispatchEvent(
    new CustomEvent("xp:awarded", {
      detail: { event: ev, value, total: state.total, tier: newTier },
    }),
  );
  return state.total;
}

function exportJson(): string {
  return JSON.stringify(read(), null, 2);
}

function importJson(json: string): boolean {
  try {
    const parsed = JSON.parse(json);
    if (typeof parsed?.total !== "number" || !Array.isArray(parsed?.events)) return false;
    write(parsed as XpState);
    document.dispatchEvent(new CustomEvent("xp:imported", { detail: { total: parsed.total } }));
    return true;
  } catch {
    return false;
  }
}

function reset(): void {
  write(emptyState());
  document.dispatchEvent(new CustomEvent("xp:reset"));
}

function tiers(): typeof TIERS {
  return TIERS;
}

export const XP = {
  get: read,
  award,
  tier: (total?: number) => tierFor(total ?? read().total),
  enabled,
  toggle,
  export: exportJson,
  import: importJson,
  reset,
  tiers,
  AWARDS,
};

// Expose globally for non-module widget code and console debugging
declare global {
  interface Window {
    LuxorXP: typeof XP;
  }
}
if (typeof window !== "undefined") {
  window.LuxorXP = XP;
}
