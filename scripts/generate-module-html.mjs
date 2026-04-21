#!/usr/bin/env node
/**
 * Generates a minimal self-contained HTML file from a module.json when the
 * subagent pipeline couldn't write one (e.g., rate-limited mid-flight).
 *
 * Usage:
 *   node scripts/generate-module-html.mjs <path/to/module.json> [--accent #HEX] [--quest-url /tier/track/quest/]
 *
 * Writes the HTML alongside the .module.json file (same dir, same basename
 * swapping .module.json → .html). Idempotent: refuses to overwrite unless --force.
 */

import fs from "node:fs";
import path from "node:path";

const argv = process.argv.slice(2);
if (argv.length === 0) {
  console.error("Usage: generate-module-html.mjs <module.json> [--accent HEX] [--quest-url URL] [--force]");
  process.exit(2);
}

const modulePath = argv[0];
const force = argv.includes("--force");
const accentIdx = argv.indexOf("--accent");
const accent = accentIdx >= 0 ? argv[accentIdx + 1] : "#E9B949";
const questUrlIdx = argv.indexOf("--quest-url");
const questUrl = questUrlIdx >= 0 ? argv[questUrlIdx + 1] : "/";

const outPath = modulePath.replace(/\.module\.json$/, ".html");
if (fs.existsSync(outPath) && !force) {
  console.error(`[skip] exists: ${outPath} (use --force to overwrite)`);
  process.exit(0);
}

const mod = JSON.parse(fs.readFileSync(modulePath, "utf-8"));
const m = mod.meta ?? {};
const s = mod.slots ?? {};

const esc = (x) =>
  String(x ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");

// Basic markdown → HTML. Handles paragraphs, **bold**, *italic*, `code`, headings.
function md2html(md) {
  if (!md) return "";
  const lines = md.split("\n");
  const blocks = [];
  let cur = [];
  for (const line of lines) {
    if (line.trim() === "") {
      if (cur.length) blocks.push(cur.join("\n")), (cur = []);
    } else cur.push(line);
  }
  if (cur.length) blocks.push(cur.join("\n"));

  return blocks
    .map((block) => {
      if (/^#{1,3}\s/.test(block)) {
        const m = block.match(/^(#{1,3})\s+(.*)/);
        const level = m[1].length + 2; // # → h3, ## → h4, ### → h5
        return `<h${level}>${inline(m[2])}</h${level}>`;
      }
      return `<p>${inline(block.replace(/\n/g, " "))}</p>`;
    })
    .join("\n");
}
function inline(text) {
  return esc(text)
    .replace(/`([^`]+)`/g, "<code>$1</code>")
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/(^|[^*])\*([^*]+)\*(?!\*)/g, "$1<em>$2</em>");
}

// Self-check renderer
const mcqHtml = (s.self_check?.questions ?? [])
  .map((q, qi) => {
    const prompt = inline(q.prompt ?? "");
    const options = Array.isArray(q.options)
      ? q.options
          .map((opt, i) => {
            const text = typeof opt === "string" ? opt : opt.text ?? "";
            return `<li data-i="${i}">${inline(text)}</li>`;
          })
          .join("")
      : "";
    const correct = Number(q.correct ?? 0);
    const expl = inline(q.explanation ?? "");
    return `<li class="q" data-correct="${correct}">
      <p class="prompt"><strong>Q${qi + 1}.</strong> ${prompt}</p>
      <ul class="options">${options}</ul>
      <details><summary>Show explanation</summary><p>${expl}</p></details>
    </li>`;
  })
  .join("");

// Next renderer
let nextHtml;
const nextInfo = s.next ?? {};
if (nextInfo.ship_your_own) {
  nextHtml = `<form class="ship-your-own-form" onsubmit="event.preventDefault();alert('Queued — your repo URL will enter the Phase 3 pipeline when it is live.');this.reset();">
    <label for="repoUrl">Paste your repo URL</label>
    <input type="url" id="repoUrl" name="repoUrl" placeholder="https://github.com/your/repo" required>
    <button type="submit">Queue for the pipeline</button>
    <p class="hint">Your submission is stored in-browser only (Phase 1). When the <code>codebase-to-course</code> pipeline goes live (Phase 3), it runs through your URL and mints a permalink quest with your name on the attribution line.</p>
  </form>`;
} else if (nextInfo.next_module_id) {
  nextHtml = `<a class="next-link" href="${esc(nextInfo.next_module_id)}.html">Next module → ${esc(nextInfo.next_module_id)}</a>`;
} else {
  nextHtml = `<p>You have reached the end of this quest.</p>`;
}

const title = esc(m.title ?? mod.id ?? "Module");
const keyInsight = esc(s.primer?.key_insight ?? "");
const primerHtml = md2html(s.primer?.markdown ?? "");
const sourcePath = esc(s.artifact?.source_path ?? "");
const permalink = esc(s.artifact?.permalink ?? "#");
const excerpt = esc(s.artifact?.excerpt ?? "");
const language = esc(s.artifact?.language ?? "");
const questName = esc(m.quest ?? "");
const tier = esc(m.tier ?? "");
const xp = Number(m.xp_reward ?? 0);
const minutes = Number(m.estimated_minutes ?? 0);

const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src 'unsafe-inline' https://fonts.googleapis.com; script-src 'unsafe-inline'; img-src data:; font-src https://fonts.gstatic.com; connect-src 'none'; frame-ancestors 'self'">
<title>${title} · LUXOR Academy</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;600&display=swap">
<style>
:root{--bg:#0A1628;--surface-1:#111D33;--surface-2:#162440;--primary:#E9B949;--accent:${accent};--text:#fff;--text-dim:#94A3B8;--border:rgba(233,185,73,0.22);--font-display:'Playfair Display',Georgia,serif;--font-body:'Inter',system-ui,sans-serif;--font-mono:'JetBrains Mono',Consolas,monospace}
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
body{background:var(--bg);color:var(--text);font-family:var(--font-body);line-height:1.6;min-height:100vh;background-image:linear-gradient(rgba(233,185,73,0.025) 1px,transparent 1px),linear-gradient(90deg,rgba(233,185,73,0.025) 1px,transparent 1px);background-size:32px 32px;padding:2rem 1.25rem 4rem}
a{color:var(--accent);text-decoration:none;border-bottom:1px solid transparent;transition:border-color 150ms}
a:hover{border-bottom-color:var(--accent)}
:focus-visible{outline:2px solid var(--primary);outline-offset:3px;box-shadow:0 0 16px rgba(233,185,73,0.45)}
.shell{max-width:720px;margin:0 auto}
.topbar{border-bottom:1px solid var(--border);padding-bottom:1.5rem;margin-bottom:2.5rem}
.crumb{font-family:var(--font-mono);font-size:0.72rem;letter-spacing:0.18em;color:var(--accent);text-transform:uppercase}
h1{font-family:var(--font-display);font-size:2.25rem;margin:0.5rem 0;color:var(--text);line-height:1.1}
.subtitle{color:var(--text-dim);font-style:italic;font-size:1.05rem}
.meta{font-family:var(--font-mono);font-size:0.72rem;letter-spacing:0.1em;color:var(--text-dim);text-transform:uppercase;margin-top:1rem;display:flex;gap:1rem;flex-wrap:wrap}
.meta span{display:inline-flex;align-items:center;gap:0.4rem}
h2{font-family:var(--font-display);font-size:1.5rem;margin-bottom:1rem;color:var(--accent);font-weight:700}
section{margin-bottom:3rem}
.primer p,.primer h3,.primer h4,.primer h5{margin-bottom:1rem}
.primer code{background:var(--surface-1);padding:0.1em 0.4em;border-radius:3px;font-family:var(--font-mono);font-size:0.9em;color:var(--accent)}
.key-insight{border-left:3px solid var(--accent);padding:0.5rem 1rem;margin:1.5rem 0;color:#F5D06B;font-style:italic;background:rgba(233,185,73,0.04)}
.artifact .source{color:var(--text-dim);font-family:var(--font-mono);font-size:0.75rem;margin-bottom:0.5rem}
.artifact .source code{color:var(--primary)}
.artifact pre{background:var(--surface-1);border:1px solid var(--border);padding:1rem;border-radius:6px;overflow-x:auto;font-family:var(--font-mono);font-size:0.85rem;line-height:1.5}
.mcq{list-style:none}
.mcq li.q{background:var(--surface-1);padding:1.5rem;border-radius:8px;margin-bottom:1rem;border:1px solid var(--border)}
.mcq .prompt{font-weight:500;margin-bottom:0.75rem;color:var(--text)}
.mcq .options{list-style:none;margin-left:0}
.mcq .options li{padding:0.5rem 0.75rem;border-left:2px solid transparent;cursor:pointer;transition:all 150ms;font-size:0.95rem}
.mcq .options li:hover{border-left-color:var(--accent);background:rgba(255,255,255,0.02)}
.mcq details{margin-top:0.75rem;color:var(--text-dim);font-size:0.9rem;padding:0.75rem;border-left:2px solid var(--border)}
.mcq summary{cursor:pointer;color:var(--accent);font-family:var(--font-mono);font-size:0.75rem;letter-spacing:0.1em;text-transform:uppercase}
.ship-your-own-form{background:var(--surface-1);padding:1.5rem;border-radius:8px;border:1px solid var(--accent)}
.ship-your-own-form label{display:block;font-family:var(--font-mono);font-size:0.75rem;letter-spacing:0.1em;text-transform:uppercase;color:var(--accent);margin-bottom:0.5rem}
.ship-your-own-form input{width:100%;padding:0.75rem;background:var(--bg);border:1px solid var(--border);color:var(--text);border-radius:4px;font-family:var(--font-mono);margin-bottom:1rem;font-size:0.9rem}
.ship-your-own-form input:focus{outline:none;border-color:var(--accent)}
.ship-your-own-form button{background:var(--accent);color:var(--bg);padding:0.75rem 1.5rem;border:none;border-radius:4px;font-family:var(--font-mono);font-weight:600;letter-spacing:0.1em;text-transform:uppercase;cursor:pointer;font-size:0.85rem}
.ship-your-own-form .hint{margin-top:1rem;color:var(--text-dim);font-size:0.85rem;line-height:1.5}
.ship-your-own-form .hint code{background:var(--bg);padding:0.1em 0.4em;border-radius:3px;font-family:var(--font-mono);font-size:0.85em;color:var(--accent)}
.next-link{font-family:var(--font-mono);color:var(--accent);letter-spacing:0.1em;text-transform:uppercase;font-size:0.85rem}
.back{display:inline-block;color:var(--text-dim);text-decoration:none;font-family:var(--font-mono);font-size:0.75rem;letter-spacing:0.1em;text-transform:uppercase;margin-top:3rem;border-top:1px solid var(--border);padding-top:1.5rem;width:100%}
.back:hover{color:var(--accent)}
</style>
</head>
<body>
<div class="shell">
<div class="topbar">
<div class="crumb">← ${questName} · ${tier}</div>
<h1>${title}</h1>
<p class="subtitle">${keyInsight}</p>
<div class="meta"><span>◆ ${xp} XP</span><span>◆ ${minutes} min</span><span>◆ ${tier}</span></div>
</div>
<section class="primer">
<h2>Primer</h2>
${primerHtml}
<blockquote class="key-insight">${keyInsight}</blockquote>
</section>
<section class="artifact">
<h2>Artifact</h2>
<div class="source"><code>${sourcePath}</code>${permalink && permalink !== "#" ? ` · <a href="${permalink}" target="_blank" rel="noopener noreferrer">commit permalink ↗</a>` : ""}</div>
<pre><code class="language-${language}">${excerpt}</code></pre>
</section>
<section class="self-check">
<h2>Self-check</h2>
<ol class="mcq">
${mcqHtml}
</ol>
</section>
<section class="next">
<h2>Next</h2>
${nextHtml}
</section>
<a href="${questUrl}" class="back">← Back to quest</a>
</div>
<script>
document.querySelectorAll('.mcq li.q').forEach(q => {
  const correct = Number(q.dataset.correct);
  q.querySelectorAll('.options li').forEach(opt => {
    opt.addEventListener('click', () => {
      const i = Number(opt.dataset.i);
      opt.style.background = (i === correct) ? 'rgba(57,255,20,0.15)' : 'rgba(255,59,59,0.10)';
      opt.style.borderLeftColor = (i === correct) ? '#39FF14' : '#FF3B3B';
      const d = q.querySelector('details'); if (d) d.setAttribute('open', '');
    });
  });
});
</script>
</body>
</html>
`;

fs.writeFileSync(outPath, html, "utf-8");
console.log(`[write] ${outPath}`);
