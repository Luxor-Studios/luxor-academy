/**
 * Phase 0.5 performance budget assertion.
 *
 * Lighthouse CI (lhci) is run separately via `npm run test:perf`.
 * This Playwright spec asserts the JS budget by measuring transferred bytes
 * for module scripts requested by /atlas/, independently of network throttling.
 *
 * Hard constraint (HANDOFF §3.2 #1, §3.3): total Atlas JS ≤ 50 KB.
 */
import { test, expect } from "@playwright/test";

test("Atlas JS budget ≤ 50 KB", async ({ page }) => {
  const externalJsBytes: { url: string; bytes: number }[] = [];
  page.on("response", async (resp) => {
    const url = resp.url();
    if (!url.includes("/atlas/")) return;
    const ct = resp.headers()["content-type"] || "";
    if (!ct.includes("javascript")) return;
    try {
      const body = await resp.body();
      externalJsBytes.push({ url, bytes: body.length });
    } catch {
      /* ignore */
    }
  });
  await page.goto("/atlas/", { waitUntil: "networkidle" });
  // Inline scripts also count toward the budget — measure via DOM.
  const inlineBytes: number = await page.evaluate(() => {
    let total = 0;
    for (const s of Array.from(document.querySelectorAll("script:not([src])"))) {
      total += new Blob([s.textContent || ""]).size;
    }
    return total;
  });
  const externalTotal = externalJsBytes.reduce((a, b) => a + b.bytes, 0);
  const total = externalTotal + inlineBytes;
  console.log(`Atlas JS bytes:`);
  for (const x of externalJsBytes) console.log(`  external: ${x.bytes} B  ${x.url}`);
  console.log(`  inline:   ${inlineBytes} B`);
  console.log(`Total:    ${total} B (${(total / 1024).toFixed(2)} KB)`);
  expect(total).toBeLessThanOrEqual(50 * 1024);
});

test("Atlas first-paint readiness (smoke)", async ({ page }) => {
  const start = Date.now();
  await page.goto("/atlas/", { waitUntil: "domcontentloaded" });
  await page.waitForFunction(() => !!customElements.get("atlas-map"));
  const elapsed = Date.now() - start;
  console.log(`atlas-map registered in ${elapsed} ms (untrottled local)`);
  expect(elapsed).toBeLessThan(5000);
});
