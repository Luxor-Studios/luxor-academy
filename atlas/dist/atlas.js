// LUXOR Academy — atlas bundle (Phase 0.5). Built by scripts/build.js.
(function(){
'use strict';

/* ----- scripts/xp.js ----- */
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
const XP = {
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


/* ----- scripts/keyboard.js ----- */
/**
 * LUXOR Academy — global keyboard shortcuts
 *
 * Chord-aware (vim-style `g a`, `g t`, `g q`).
 * Respects input/textarea/contenteditable focus — shortcuts silent there except Escape + ?.
 * Emits CustomEvents so web components can react without tight coupling.
 *
 * Shortcuts:
 *   g a   → Atlas (navigate /)
 *   g t   → current Track (if data-track attribute present on <main>)
 *   g q   → current Quest (if data-quest attribute present on <main>)
 *   j / k → next / prev Module (emits keyboard:nav:{next,prev})
 *   x     → mark current module complete (emits keyboard:complete)
 *   /     → focus search / open command palette
 *   ?     → help overlay
 *   esc   → close overlay / zoom out one level (emits keyboard:escape)
 */
const CHORD_WINDOW_MS = 900;
const SHORTCUTS = [
    { keys: "g a", desc: "Atlas (home)" },
    { keys: "g t", desc: "Current Track" },
    { keys: "g q", desc: "Current Quest" },
    { keys: "j", desc: "Next module" },
    { keys: "k", desc: "Previous module" },
    { keys: "x", desc: "Mark module complete" },
    { keys: "/", desc: "Search / command palette" },
    { keys: "?", desc: "This help overlay" },
    { keys: "esc", desc: "Close overlay or zoom out" },
];
function isTypingContext(target) {
    if (!(target instanceof HTMLElement))
        return false;
    const tag = target.tagName;
    if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT")
        return true;
    if (target.isContentEditable)
        return true;
    return false;
}
function navigate(url) {
    if (window.location.pathname === url)
        return;
    window.location.assign(url);
}
function ensureHelpOverlay() {
    let overlay = document.getElementById("luxor-help-overlay");
    if (overlay)
        return overlay;
    overlay = document.createElement("div");
    overlay.id = "luxor-help-overlay";
    overlay.setAttribute("role", "dialog");
    overlay.setAttribute("aria-modal", "true");
    overlay.setAttribute("aria-labelledby", "luxor-help-title");
    overlay.hidden = true;
    const rows = SHORTCUTS.map((s) => `<tr><th scope="row"><kbd>${escapeHtml(s.keys)}</kbd></th><td>${escapeHtml(s.desc)}</td></tr>`).join("");
    overlay.innerHTML = `
    <div class="help-scrim" data-close="true"></div>
    <div class="help-panel">
      <h2 id="luxor-help-title">Keyboard Shortcuts</h2>
      <table>
        <thead><tr><th scope="col">Keys</th><th scope="col">Action</th></tr></thead>
        <tbody>${rows}</tbody>
      </table>
      <p class="help-hint">Press <kbd>esc</kbd> to close.</p>
      <button type="button" data-close="true" aria-label="Close help overlay">Close</button>
    </div>`;
    overlay.addEventListener("click", (ev) => {
        const t = ev.target;
        if (t.dataset && t.dataset.close === "true")
            closeHelp();
    });
    document.body.appendChild(overlay);
    return overlay;
}
function escapeHtml(s) {
    return s.replace(/[&<>"']/g, (c) => c === "&" ? "&amp;" : c === "<" ? "&lt;" : c === ">" ? "&gt;" : c === '"' ? "&quot;" : "&#39;");
}
let helpPrevFocus = null;
function openHelp() {
    const overlay = ensureHelpOverlay();
    helpPrevFocus = document.activeElement;
    overlay.hidden = false;
    overlay.classList.add("is-open");
    const btn = overlay.querySelector("button[data-close]");
    btn?.focus();
}
function closeHelp() {
    const overlay = document.getElementById("luxor-help-overlay");
    if (!overlay)
        return;
    overlay.classList.remove("is-open");
    overlay.hidden = true;
    if (helpPrevFocus instanceof HTMLElement)
        helpPrevFocus.focus();
}
function toggleHelp() {
    const overlay = document.getElementById("luxor-help-overlay");
    if (overlay && !overlay.hidden)
        closeHelp();
    else
        openHelp();
}
function emit(name, detail = {}) {
    document.dispatchEvent(new CustomEvent(name, { detail }));
}
function installKeyboardShortcuts() {
    let chord = null;
    let chordTimer;
    function clearChord() {
        chord = null;
        if (chordTimer !== undefined) {
            clearTimeout(chordTimer);
            chordTimer = undefined;
        }
    }
    function startChord(prefix) {
        chord = prefix;
        if (chordTimer !== undefined)
            clearTimeout(chordTimer);
        chordTimer = window.setTimeout(clearChord, CHORD_WINDOW_MS);
    }
    function handler(ev) {
        // Always allow ?/Esc even in inputs
        const typing = isTypingContext(ev.target);
        const key = ev.key;
        // Escape always works
        if (key === "Escape") {
            const overlay = document.getElementById("luxor-help-overlay");
            if (overlay && !overlay.hidden) {
                ev.preventDefault();
                closeHelp();
                return;
            }
            emit("keyboard:escape");
            return;
        }
        // ? overlay even when typing in some contexts — but skip for typed inputs
        if (key === "?" && !typing) {
            ev.preventDefault();
            toggleHelp();
            return;
        }
        if (typing)
            return;
        if (ev.metaKey || ev.ctrlKey || ev.altKey)
            return;
        // Chord resolution
        if (chord === "g") {
            if (key === "a") {
                ev.preventDefault();
                clearChord();
                emit("keyboard:goto", { target: "atlas" });
                navigate("/");
                return;
            }
            if (key === "t") {
                ev.preventDefault();
                clearChord();
                emit("keyboard:goto", { target: "track" });
                const main = document.querySelector("main[data-track]");
                const slug = main?.getAttribute("data-track");
                if (slug)
                    navigate(`/tracks/${slug}/`);
                return;
            }
            if (key === "q") {
                ev.preventDefault();
                clearChord();
                emit("keyboard:goto", { target: "quest" });
                const main = document.querySelector("main[data-quest]");
                const slug = main?.getAttribute("data-quest");
                if (slug)
                    navigate(`/quests/${slug}/`);
                return;
            }
            clearChord();
            return;
        }
        // Prefix start
        if (key === "g") {
            startChord("g");
            return;
        }
        // Single-key shortcuts
        switch (key) {
            case "j":
                ev.preventDefault();
                emit("keyboard:nav", { direction: "next" });
                return;
            case "k":
                ev.preventDefault();
                emit("keyboard:nav", { direction: "prev" });
                return;
            case "x":
                ev.preventDefault();
                emit("keyboard:complete");
                return;
            case "/":
                ev.preventDefault();
                emit("keyboard:palette:open");
                return;
        }
    }
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
}
// Auto-install when imported into a page
if (typeof document !== "undefined") {
    const boot = () => {
        ensureHelpOverlay();
        installKeyboardShortcuts();
    };
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", boot, { once: true });
    }
    else {
        boot();
    }
}


/* ----- components/index.js ----- */
/**
 * LUXOR Academy — web-components bundle
 *
 * One renderer, three zoom levels (atlas|quest|module).
 * Per MARS round-1: the same custom-element tree is used at every scale;
 * <module-root data-zoom="..."> switches presentation via CSS attribute selectors.
 *
 * Vanilla customElements — no framework. Kept under the 50KB JS budget.
 */
/* ------------------------------------------------------------
 * Shared zoom attribute observer base
 * ------------------------------------------------------------ */
class LuxorElement extends HTMLElement {
    static get observedAttributes() {
        return ["data-zoom"];
    }
    attributeChangedCallback() {
        this.render();
    }
    connectedCallback() {
        this.render();
    }
    get zoom() {
        const z = this.getAttribute("data-zoom");
        return z === "atlas" || z === "quest" ? z : "module";
    }
}
/* ------------------------------------------------------------
 * <module-root> — the single shared renderer
 * ------------------------------------------------------------ */
class ModuleRoot extends HTMLElement {
    connectedCallback() {
        const zoom = this.getAttribute("data-zoom") || "module";
        this.setAttribute("role", "region");
        if (!this.hasAttribute("aria-label")) {
            this.setAttribute("aria-label", `Module (${zoom} view)`);
        }
    }
}
/* ------------------------------------------------------------
 * Slot elements — structural contract enforcement
 * Each one asserts a unique tag exists in the DOM so that
 * "HTML parse = contract check" (MARS).
 * ------------------------------------------------------------ */
class SlotElement extends HTMLElement {
    static slotName = "base";
    connectedCallback() {
        this.setAttribute("role", "region");
        if (!this.hasAttribute("aria-label")) {
            this.setAttribute("aria-label", this.constructor.slotName);
        }
    }
}
class ModulePrimer extends SlotElement {
    static slotName = "Primer";
}
class ModuleVisual extends SlotElement {
    static slotName = "Visual";
}
class ModuleInteractive extends SlotElement {
    static slotName = "Interactive";
    connectedCallback() {
        super.connectedCallback();
        // sandbox_policy assertion: in Phase 0.5, we emit a warning if a child iframe
        // is present without a sandbox attribute (schema enforces it, but DOM-time check
        // is our dev-warning channel — MARS "one schema, four consumers").
        const iframe = this.querySelector("iframe");
        if (iframe && !iframe.hasAttribute("sandbox")) {
            console.warn("[LUXOR] <module-interactive> iframe is missing `sandbox` attribute. See slots.schema.json#sandbox_policy.iframe_sandbox.");
        }
    }
}
class ModuleArtifact extends SlotElement {
    static slotName = "Artifact";
}
class ModuleSelfCheck extends SlotElement {
    static slotName = "Self-check";
}
class ModuleNext extends SlotElement {
    static slotName = "Next";
}
/* ------------------------------------------------------------
 * <atlas-map> — IVM lattice background + 12 VE vertices
 * ------------------------------------------------------------ */
class AtlasMap extends HTMLElement {
    connectedCallback() {
        this.setAttribute("role", "navigation");
        this.setAttribute("aria-label", "Atlas — 12 vector equilibrium vertices");
        this.classList.add("atlas-map");
        if (this.childElementCount === 0)
            this.render();
    }
    render() {
        // 12 vertex positions projecting a cuboctahedron hexagonally.
        // Each vertex is a <quest-island> with aria-label + data attrs.
        const vertices = [
            { x: 50, y: 8, label: "Build & Ship", slug: "build-and-ship", live: true, questSlug: "forge-barque" },
            { x: 78, y: 18, label: "Agent Mastery", slug: "agent-mastery" },
            { x: 92, y: 40, label: "Categorical Wizardry", slug: "categorical-wizardry" },
            { x: 92, y: 60, label: "Verification & Rigor", slug: "verification-and-rigor" },
            { x: 78, y: 82, label: "Infrastructure", slug: "infrastructure" },
            { x: 50, y: 92, label: "Synergetic Systems", slug: "synergetic-systems" },
            { x: 22, y: 82, label: "Data & Knowledge", slug: "data-and-knowledge" },
            { x: 8, y: 60, label: "Interface Crafting", slug: "interface-crafting" },
            { x: 8, y: 40, label: "Signals & Rendering", slug: "signals-and-rendering" },
            { x: 22, y: 18, label: "Code Archaeology", slug: "code-archaeology" },
            { x: 35, y: 50, label: "Documentation Craft", slug: "documentation-craft" },
            { x: 65, y: 50, label: "The Grimoire", slug: "grimoire" },
        ];
        const svgNs = "http://www.w3.org/2000/svg";
        const svg = document.createElementNS(svgNs, "svg");
        svg.setAttribute("viewBox", "0 0 100 100");
        svg.setAttribute("preserveAspectRatio", "xMidYMid meet");
        svg.setAttribute("class", "atlas-map-svg");
        svg.setAttribute("aria-hidden", "true");
        // Lattice struts (VE edges) — cosmetic background
        const strutPairs = [
            [0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 7], [7, 8], [8, 9], [9, 0],
            [10, 11], [0, 10], [5, 11], [10, 2], [11, 8], [10, 3], [11, 7],
        ];
        for (const [a, b] of strutPairs) {
            const line = document.createElementNS(svgNs, "line");
            line.setAttribute("x1", String(vertices[a].x));
            line.setAttribute("y1", String(vertices[a].y));
            line.setAttribute("x2", String(vertices[b].x));
            line.setAttribute("y2", String(vertices[b].y));
            line.setAttribute("class", "atlas-strut");
            svg.appendChild(line);
        }
        this.appendChild(svg);
        // Vertices as real DOM (foreign links) — these are the focusable nav targets.
        const nav = document.createElement("ul");
        nav.className = "atlas-vertices";
        nav.setAttribute("role", "list");
        for (let i = 0; i < vertices.length; i++) {
            const v = vertices[i];
            const li = document.createElement("li");
            li.className = "atlas-vertex";
            li.style.setProperty("--x", `${v.x}%`);
            li.style.setProperty("--y", `${v.y}%`);
            if (v.live) {
                const a = document.createElement("a");
                a.className = "atlas-vertex-link is-live";
                const questSlug = v.questSlug || "forge-barque";
                a.href = `/quests/${questSlug}/`;
                a.setAttribute("aria-label", `${v.label} track — enter flagship quest`);
                a.dataset.track = v.slug;
                a.innerHTML = `<span class="vertex-num" aria-hidden="true">${String(i + 1).padStart(2, "0")}</span><span class="vertex-label">${v.label}</span>`;
                li.appendChild(a);
            }
            else {
                const span = document.createElement("span");
                span.className = "atlas-vertex-link is-placeholder";
                span.setAttribute("role", "link");
                span.setAttribute("aria-disabled", "true");
                span.setAttribute("tabindex", "0");
                span.dataset.track = v.slug;
                span.setAttribute("aria-label", `${v.label} track — coming soon`);
                span.innerHTML = `<span class="vertex-num" aria-hidden="true">${String(i + 1).padStart(2, "0")}</span><span class="vertex-label">${v.label}</span>`;
                li.appendChild(span);
            }
            nav.appendChild(li);
        }
        this.appendChild(nav);
    }
}
/* ------------------------------------------------------------
 * <quest-island> — a single vertex content payload
 * ------------------------------------------------------------ */
class QuestIsland extends HTMLElement {
    connectedCallback() {
        if (!this.hasAttribute("role"))
            this.setAttribute("role", "article");
        const title = this.getAttribute("data-title");
        if (title && !this.hasAttribute("aria-label"))
            this.setAttribute("aria-label", `Quest: ${title}`);
    }
}
/* ------------------------------------------------------------
 * <xp-bar> — shows current XP, tier, export controls
 * ------------------------------------------------------------ */
class XpBar extends HTMLElement {
    unsub = null;
    connectedCallback() {
        this.setAttribute("role", "status");
        this.setAttribute("aria-live", "polite");
        this.setAttribute("aria-label", "Experience progress");
        this.render();
        const listener = () => this.render();
        document.addEventListener("xp:awarded", listener);
        document.addEventListener("xp:imported", listener);
        document.addEventListener("xp:reset", listener);
        document.addEventListener("xp:toggled", listener);
        this.unsub = () => {
            document.removeEventListener("xp:awarded", listener);
            document.removeEventListener("xp:imported", listener);
            document.removeEventListener("xp:reset", listener);
            document.removeEventListener("xp:toggled", listener);
        };
    }
    disconnectedCallback() {
        this.unsub?.();
    }
    render() {
        const state = XP.get();
        const tier = XP.tier(state.total);
        const tiers = XP.tiers();
        const idx = tiers.findIndex((t) => t.name === tier);
        const next = tiers[idx + 1];
        const pct = next
            ? Math.max(0, Math.min(100, ((state.total - tiers[idx].threshold) / (next.threshold - tiers[idx].threshold)) * 100))
            : 100;
        const enabled = XP.enabled();
        this.innerHTML = `
      <div class="xp-bar ${enabled ? "" : "is-disabled"}">
        <span class="xp-tier" aria-label="Current tier">${tier}</span>
        <span class="xp-total"><b>${state.total}</b> XP</span>
        <span class="xp-progress" aria-hidden="true"><span class="xp-progress-fill" style="width:${pct.toFixed(1)}%"></span></span>
        <span class="xp-next">${next ? `${next.threshold - state.total} to ${next.name}` : "Synergist ✧"}</span>
        <button type="button" class="xp-export" aria-label="Export XP as JSON">Export JSON</button>
        <button type="button" class="xp-import" aria-label="Import XP from JSON">Import</button>
        <button type="button" class="xp-toggle" aria-pressed="${enabled}" aria-label="Toggle XP tracking">${enabled ? "XP: on" : "XP: off"}</button>
      </div>`;
        this.querySelector(".xp-export")?.addEventListener("click", () => this.doExport());
        this.querySelector(".xp-import")?.addEventListener("click", () => this.doImport());
        this.querySelector(".xp-toggle")?.addEventListener("click", () => {
            XP.toggle();
            this.render();
        });
    }
    doExport() {
        const data = XP.export();
        const blob = new Blob([data], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `luxor-academy-xp-${new Date().toISOString().replace(/[:.]/g, "-")}.json`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
    }
    doImport() {
        const input = document.createElement("input");
        input.type = "file";
        input.accept = "application/json";
        input.addEventListener("change", async () => {
            const file = input.files?.[0];
            if (!file)
                return;
            const text = await file.text();
            const ok = XP.import(text);
            if (!ok)
                alert("Invalid XP JSON — nothing imported.");
        });
        input.click();
    }
}
/* ------------------------------------------------------------
 * <badge-display> — shows earned tier badges
 * ------------------------------------------------------------ */
class BadgeDisplay extends HTMLElement {
    connectedCallback() {
        this.render();
        document.addEventListener("xp:awarded", () => this.render());
        document.addEventListener("xp:imported", () => this.render());
        document.addEventListener("xp:reset", () => this.render());
    }
    render() {
        const state = XP.get();
        if (!state.badges.length) {
            this.innerHTML = `<p class="badge-empty" aria-label="No badges yet">Earn badges by advancing tiers.</p>`;
            return;
        }
        this.innerHTML = `
      <ul class="badge-list" aria-label="Earned badges">
        ${state.badges.map((b) => `<li class="badge"><span>${b.replace(/^tier:/, "")}</span></li>`).join("")}
      </ul>`;
    }
}
/* ------------------------------------------------------------
 * <command-palette> — ⌘K fuzzy palette (skeleton, static list)
 * ------------------------------------------------------------ */
class CommandPalette extends HTMLElement {
    open = false;
    connectedCallback() {
        this.setAttribute("role", "dialog");
        this.setAttribute("aria-modal", "true");
        this.setAttribute("aria-label", "Command palette");
        this.hidden = true;
        document.addEventListener("keyboard:palette:open", () => this.show());
        document.addEventListener("keyboard:escape", () => this.hide());
        window.addEventListener("keydown", (ev) => {
            if ((ev.metaKey || ev.ctrlKey) && ev.key.toLowerCase() === "k") {
                ev.preventDefault();
                this.toggle();
            }
        });
    }
    render() {
        this.innerHTML = `
      <div class="cp-scrim" data-close="true"></div>
      <div class="cp-panel">
        <label class="cp-label" for="cp-input">Jump to…</label>
        <input id="cp-input" type="text" placeholder="Search quests, modules, skills…" autocomplete="off" autocapitalize="off" spellcheck="false"/>
        <ul class="cp-results" role="listbox">
          <li role="option"><a href="/">Atlas</a></li>
          <li role="option"><a href="/quests/forge-barque/">Quest · Forge BARQUE</a></li>
        </ul>
        <p class="cp-hint"><kbd>esc</kbd> close · <kbd>↵</kbd> select</p>
      </div>`;
        this.querySelector(".cp-scrim")?.addEventListener("click", () => this.hide());
        const input = this.querySelector("#cp-input");
        input?.focus();
    }
    show() {
        if (this.open)
            return;
        this.render();
        this.hidden = false;
        this.open = true;
    }
    hide() {
        if (!this.open)
            return;
        this.hidden = true;
        this.open = false;
        this.innerHTML = "";
    }
    toggle() {
        this.open ? this.hide() : this.show();
    }
}
/* ------------------------------------------------------------
 * Registry — names match HANDOFF §3.2 item 6
 * ------------------------------------------------------------ */
const registry = [
    ["module-root", ModuleRoot],
    ["module-primer", ModulePrimer],
    ["module-visual", ModuleVisual],
    ["module-interactive", ModuleInteractive],
    ["module-artifact", ModuleArtifact],
    ["module-self-check", ModuleSelfCheck],
    ["module-next", ModuleNext],
    ["atlas-map", AtlasMap],
    ["quest-island", QuestIsland],
    ["xp-bar", XpBar],
    ["badge-display", BadgeDisplay],
    ["command-palette", CommandPalette],
];
for (const [name, ctor] of registry) {
    if (!customElements.get(name))
        customElements.define(name, ctor);
}
// Silence unused-var linter for the base class that subclasses consume
void LuxorElement;

})();
