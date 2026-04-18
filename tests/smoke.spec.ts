/**
 * Atlas smoke tests — Playwright
 * Asserts: page loads · custom elements register · keyboard nav works · no console errors.
 */
import { test, expect } from "@playwright/test";

test.describe("atlas smoke", () => {
  test("loads with no console errors and registers custom elements", async ({ page }) => {
    const errors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") errors.push(msg.text());
    });
    page.on("pageerror", (err) => errors.push(err.message));
    await page.goto("/atlas/");
    await expect(page).toHaveTitle(/LUXOR Academy/);
    await expect(page.locator("atlas-map")).toBeVisible();
    await expect(page.locator("xp-bar")).toBeVisible();
    // Wait a tick for module to register and render
    await page.waitForFunction(() => !!customElements.get("atlas-map"));
    const registered = await page.evaluate(() =>
      [
        "module-root",
        "module-primer",
        "module-visual",
        "module-interactive",
        "module-artifact",
        "module-self-check",
        "module-next",
        "atlas-map",
        "quest-island",
        "xp-bar",
        "badge-display",
        "command-palette",
      ].every((n) => !!customElements.get(n)),
    );
    expect(registered).toBe(true);
    // No errors (font preload warnings are 'warning' type, not 'error')
    expect(errors, errors.join("\n")).toEqual([]);
  });

  test("keyboard ? toggles help overlay", async ({ page }) => {
    await page.goto("/atlas/");
    await page.waitForFunction(() => !!document.getElementById("luxor-help-overlay"));
    const overlay = page.locator("#luxor-help-overlay");
    await expect(overlay).toBeHidden();
    await page.keyboard.press("?");
    await expect(overlay).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(overlay).toBeHidden();
  });

  test("keyboard traversal: tab into atlas reaches a placeholder vertex", async ({ page }) => {
    await page.goto("/atlas/");
    await page.waitForFunction(() => !!customElements.get("atlas-map"));
    // Activate skip link by tabbing
    await page.keyboard.press("Tab"); // skip link
    // Press repeatedly until we focus a vertex link
    let focusedVertex = false;
    for (let i = 0; i < 25; i++) {
      await page.keyboard.press("Tab");
      const cls = await page.evaluate(() => document.activeElement?.className || "");
      if (typeof cls === "string" && cls.includes("atlas-vertex-link")) {
        focusedVertex = true;
        break;
      }
    }
    expect(focusedVertex).toBe(true);
  });

  test("XP export produces valid JSON; toggling persists", async ({ page }) => {
    await page.goto("/atlas/");
    await page.waitForFunction(() => !!(window as any).LuxorXP);
    // Award some XP via the global (verified mode)
    await page.evaluate(() => {
      (window as any).LuxorXP.award({ name: "module:self-check:pass", module_id: "smoke-test" });
    });
    const exported = await page.evaluate(() => (window as any).LuxorXP.export());
    const parsed = JSON.parse(exported);
    expect(parsed.total).toBeGreaterThan(0);
    expect(Array.isArray(parsed.events)).toBe(true);

    // Toggle off and verify award is suppressed
    await page.evaluate(() => (window as any).LuxorXP.toggle(false));
    const before = await page.evaluate(() => (window as any).LuxorXP.get().total);
    await page.evaluate(() => {
      (window as any).LuxorXP.award({ name: "module:self-check:pass" });
    });
    const after = await page.evaluate(() => (window as any).LuxorXP.get().total);
    expect(after).toEqual(before);
  });

  test("g-a chord navigates to atlas root", async ({ page }) => {
    await page.goto("/atlas/?probe=1");
    // Listen for the keyboard:goto event with target=atlas
    const triggered = page.evaluate(
      () =>
        new Promise<boolean>((res) => {
          const t = setTimeout(() => res(false), 1500);
          document.addEventListener(
            "keyboard:goto",
            (ev: Event) => {
              const detail = (ev as CustomEvent).detail;
              if (detail && detail.target === "atlas") {
                clearTimeout(t);
                res(true);
              }
            },
            { once: true },
          );
        }),
    );
    await page.keyboard.press("g");
    await page.keyboard.press("a");
    expect(await triggered).toBe(true);
  });
});
