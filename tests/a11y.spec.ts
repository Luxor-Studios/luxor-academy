/**
 * axe-core accessibility test on Atlas — must return zero violations.
 */
import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test("axe-core: zero violations on Atlas", async ({ page }) => {
  await page.goto("/atlas/");
  await page.waitForFunction(() => !!customElements.get("atlas-map"));
  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
    .analyze();
  if (results.violations.length) {
    console.log("\nViolations:");
    for (const v of results.violations) {
      console.log(`  - [${v.impact}] ${v.id}: ${v.help}`);
      for (const node of v.nodes) console.log(`      ${node.html.slice(0, 200)}`);
    }
  }
  expect(results.violations).toEqual([]);
});
