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
const STORAGE_KEY = "luxor-academy:xp";
const TOGGLE_KEY = "luxor-academy:xp-enabled";
const AWARDS = {
    "module:self-check:pass": 50,
    "module:interactive:complete": 75,
    "quest:boss-fight:pass": 300,
    "artifact:shipped": 500,
};
const TIERS = [
    { name: "Initiate", threshold: 0 },
    { name: "Adept", threshold: 500 },
    { name: "Journeyman", threshold: 2000 },
    { name: "Master", threshold: 8000 },
    { name: "Synergist", threshold: 20000 },
];
function emptyState() {
    return { total: 0, events: [], badges: [], version: 1 };
}
function read() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw)
            return emptyState();
        const parsed = JSON.parse(raw);
        if (!parsed || typeof parsed.total !== "number")
            return emptyState();
        return parsed;
    }
    catch {
        return emptyState();
    }
}
function write(state) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}
function enabled() {
    const raw = localStorage.getItem(TOGGLE_KEY);
    if (raw === null)
        return true;
    return raw === "true";
}
function toggle(on) {
    const next = typeof on === "boolean" ? on : !enabled();
    localStorage.setItem(TOGGLE_KEY, String(next));
    document.dispatchEvent(new CustomEvent("xp:toggled", { detail: { enabled: next } }));
    return next;
}
function tierFor(total) {
    let current = "Initiate";
    for (const t of TIERS)
        if (total >= t.threshold)
            current = t.name;
    return current;
}
function award(ev) {
    if (!enabled())
        return read().total;
    // Artifact-shipped requires verification bit (MERCURIO: badges only verified-artifact)
    if (ev.name === "artifact:shipped" && ev.verified !== true)
        return read().total;
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
    document.dispatchEvent(new CustomEvent("xp:awarded", {
        detail: { event: ev, value, total: state.total, tier: newTier },
    }));
    return state.total;
}
function exportJson() {
    return JSON.stringify(read(), null, 2);
}
function importJson(json) {
    try {
        const parsed = JSON.parse(json);
        if (typeof parsed?.total !== "number" || !Array.isArray(parsed?.events))
            return false;
        write(parsed);
        document.dispatchEvent(new CustomEvent("xp:imported", { detail: { total: parsed.total } }));
        return true;
    }
    catch {
        return false;
    }
}
function reset() {
    write(emptyState());
    document.dispatchEvent(new CustomEvent("xp:reset"));
}
function tiers() {
    return TIERS;
}
export const XP = {
    get: read,
    award,
    tier: (total) => tierFor(total ?? read().total),
    enabled,
    toggle,
    export: exportJson,
    import: importJson,
    reset,
    tiers,
    AWARDS,
};
if (typeof window !== "undefined") {
    window.LuxorXP = XP;
}
