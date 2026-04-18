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
export function installKeyboardShortcuts() {
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
export { SHORTCUTS };
