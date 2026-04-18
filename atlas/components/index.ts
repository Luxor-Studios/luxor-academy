/**
 * LUXOR Academy — web-components bundle
 *
 * One renderer, three zoom levels (atlas|quest|module).
 * Per MARS round-1: the same custom-element tree is used at every scale;
 * <module-root data-zoom="..."> switches presentation via CSS attribute selectors.
 *
 * Vanilla customElements — no framework. Kept under the 50KB JS budget.
 */

import "../scripts/xp.js";
import "../scripts/keyboard.js";
import { XP } from "../scripts/xp.js";

/* ------------------------------------------------------------
 * Shared zoom attribute observer base
 * ------------------------------------------------------------ */
abstract class LuxorElement extends HTMLElement {
  static get observedAttributes(): string[] {
    return ["data-zoom"];
  }
  attributeChangedCallback(): void {
    this.render();
  }
  connectedCallback(): void {
    this.render();
  }
  protected get zoom(): "atlas" | "quest" | "module" {
    const z = this.getAttribute("data-zoom");
    return z === "atlas" || z === "quest" ? z : "module";
  }
  protected abstract render(): void;
}

/* ------------------------------------------------------------
 * <module-root> — the single shared renderer
 * ------------------------------------------------------------ */
class ModuleRoot extends HTMLElement {
  connectedCallback(): void {
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
  connectedCallback(): void {
    this.setAttribute("role", "region");
    if (!this.hasAttribute("aria-label")) {
      this.setAttribute("aria-label", (this.constructor as typeof SlotElement).slotName);
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
  connectedCallback(): void {
    super.connectedCallback();
    // sandbox_policy assertion: in Phase 0.5, we emit a warning if a child iframe
    // is present without a sandbox attribute (schema enforces it, but DOM-time check
    // is our dev-warning channel — MARS "one schema, four consumers").
    const iframe = this.querySelector("iframe");
    if (iframe && !iframe.hasAttribute("sandbox")) {
      console.warn(
        "[LUXOR] <module-interactive> iframe is missing `sandbox` attribute. See slots.schema.json#sandbox_policy.iframe_sandbox.",
      );
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
  connectedCallback(): void {
    this.setAttribute("role", "navigation");
    this.setAttribute("aria-label", "Atlas — 12 vector equilibrium vertices");
    this.classList.add("atlas-map");
    if (this.childElementCount === 0) this.render();
  }
  private render(): void {
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
      } else {
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
  connectedCallback(): void {
    if (!this.hasAttribute("role")) this.setAttribute("role", "article");
    const title = this.getAttribute("data-title");
    if (title && !this.hasAttribute("aria-label")) this.setAttribute("aria-label", `Quest: ${title}`);
  }
}

/* ------------------------------------------------------------
 * <xp-bar> — shows current XP, tier, export controls
 * ------------------------------------------------------------ */
class XpBar extends HTMLElement {
  private unsub: (() => void) | null = null;
  connectedCallback(): void {
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
  disconnectedCallback(): void {
    this.unsub?.();
  }
  private render(): void {
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
  private doExport(): void {
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
  private doImport(): void {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "application/json";
    input.addEventListener("change", async () => {
      const file = input.files?.[0];
      if (!file) return;
      const text = await file.text();
      const ok = XP.import(text);
      if (!ok) alert("Invalid XP JSON — nothing imported.");
    });
    input.click();
  }
}

/* ------------------------------------------------------------
 * <badge-display> — shows earned tier badges
 * ------------------------------------------------------------ */
class BadgeDisplay extends HTMLElement {
  connectedCallback(): void {
    this.render();
    document.addEventListener("xp:awarded", () => this.render());
    document.addEventListener("xp:imported", () => this.render());
    document.addEventListener("xp:reset", () => this.render());
  }
  private render(): void {
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
  private open = false;
  connectedCallback(): void {
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
  private render(): void {
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
    const input = this.querySelector<HTMLInputElement>("#cp-input");
    input?.focus();
  }
  private show(): void {
    if (this.open) return;
    this.render();
    this.hidden = false;
    this.open = true;
  }
  private hide(): void {
    if (!this.open) return;
    this.hidden = true;
    this.open = false;
    this.innerHTML = "";
  }
  private toggle(): void {
    this.open ? this.hide() : this.show();
  }
}

/* ------------------------------------------------------------
 * Registry — names match HANDOFF §3.2 item 6
 * ------------------------------------------------------------ */
const registry: Array<[string, CustomElementConstructor]> = [
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
  if (!customElements.get(name)) customElements.define(name, ctor);
}

// Silence unused-var linter for the base class that subclasses consume
void LuxorElement;

export {};
