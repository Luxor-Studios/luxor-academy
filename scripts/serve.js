#!/usr/bin/env node
/**
 * Zero-dependency static server for local preview + Playwright/Lighthouse.
 * Serves repo root, with proper MIME types + module extension resolution.
 */
import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { extname, resolve, join } from "node:path";

const PORT = Number(process.env.PORT || 4173);
const ROOT = resolve(process.cwd());

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".mjs": "application/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".ico": "image/x-icon",
  ".woff2": "font/woff2",
  ".txt": "text/plain; charset=utf-8",
};

const server = createServer(async (req, res) => {
  try {
    const url = new URL(req.url || "/", `http://localhost:${PORT}`);
    let filePath = decodeURIComponent(url.pathname);
    if (filePath.endsWith("/")) filePath += "index.html";
    // Prevent path traversal
    const abs = resolve(ROOT, "." + filePath);
    if (!abs.startsWith(ROOT)) {
      res.writeHead(403);
      res.end("Forbidden");
      return;
    }
    let stats;
    try {
      stats = await stat(abs);
    } catch {
      res.writeHead(404, { "content-type": "text/plain" });
      res.end("Not Found: " + filePath);
      return;
    }
    if (stats.isDirectory()) {
      const idx = join(abs, "index.html");
      const data = await readFile(idx);
      res.writeHead(200, { "content-type": MIME[".html"] });
      res.end(data);
      return;
    }
    const data = await readFile(abs);
    const mime = MIME[extname(abs).toLowerCase()] || "application/octet-stream";
    res.writeHead(200, {
      "content-type": mime,
      "cache-control": "no-store",
    });
    res.end(data);
  } catch (err) {
    res.writeHead(500);
    res.end(String(err));
  }
});

server.listen(PORT, () => {
  console.log(`luxor-academy: serving ${ROOT} on http://localhost:${PORT}`);
});
