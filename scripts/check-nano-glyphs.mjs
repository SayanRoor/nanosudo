// Capture the localized home pages and verify glyph hover without layout changes.
import assert from "node:assert/strict";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { chromium, devices } from "@playwright/test";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const output = path.join(root, "artifacts/nano-glyphs");
const baseURL = process.argv[2] ?? "http://127.0.0.1:3000";
await mkdir(output, { recursive: true });
const browser = await chromium.launch();
const report = [];

/** @returns {Promise<void>} */
async function revealPage(page) {
  const height = await page.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y < height; y += 500) {
    await page.evaluate((offset) => window.scrollTo(0, offset), y);
    await page.waitForTimeout(220);
  }
  await page.waitForTimeout(900);
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(300);
}

/** @returns {Promise<void>} */
async function checkHover(page, theme) {
  const icons = page.locator(".nano-glyph");
  assert.equal(await icons.count(), 12);
  for (let index = 0; index < 12; index++) {
    const icon = icons.nth(index);
    const card = icon.locator("xpath=ancestor::*[contains(concat(' ', normalize-space(@class), ' '), ' glass-card ')][1]");
    await card.scrollIntoViewIfNeeded();
    const before = await card.evaluate((element) => [element.offsetTop, element.offsetLeft, element.offsetWidth, element.offsetHeight]);
    await card.hover();
    await page.waitForTimeout(120);
    const animations = await icon.evaluate((element) => element.getAnimations({ subtree: true }).filter((animation) => animation instanceof CSSAnimation).map((animation) => animation.animationName));
    assert.ok(animations.length > 0, `Glyph ${index + 1} must animate on card hover`);
    const after = await card.evaluate((element) => [element.offsetTop, element.offsetLeft, element.offsetWidth, element.offsetHeight]);
    assert.deepEqual(after, before, `Glyph ${index + 1} changes card layout`);
    if ([0, 4, 8].includes(index)) await card.screenshot({ path: path.join(output, `hover-${theme}-${index + 1}.png`) });
    report.push({ theme, icon: index + 1, animations, stableLayout: true });
    await page.mouse.move(0, 0);
  }
}

/** @returns {Promise<void>} */
async function checkReducedMotion(page) {
  await page.emulateMedia({ reducedMotion: "reduce" });
  for (const icon of await page.locator(".nano-glyph").all()) {
    await icon.hover();
    const names = await icon.evaluate((element) => Array.from(element.querySelectorAll("[data-anim], [data-anim] *"), (layer) => getComputedStyle(layer).animationName));
    assert.ok(names.every((name) => name === "none"));
  }
}

/** @returns {Promise<void>} */
async function captureHome(theme, mobile) {
  const context = await browser.newContext(mobile ? { ...devices["iPhone 13"] } : { viewport: { width: 1440, height: 900 } });
  await context.addInitScript((selectedTheme) => localStorage.setItem("nanosudo-theme", selectedTheme), theme);
  const page = await context.newPage();
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto(`${baseURL}/en`, { waitUntil: "networkidle" });
  await page.evaluate((selectedTheme) => { document.documentElement.dataset.theme = selectedTheme; }, theme);
  await revealPage(page);
  const ids = await page.locator(".nano-glyph linearGradient").evaluateAll((elements) => elements.map((element) => element.id));
  assert.equal(new Set(ids).size, 12);
  assert.equal(await page.locator(".nano-glyph[width='40'][height='40']").count(), 12);
  assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), "Horizontal overflow");
  await page.screenshot({ path: path.join(output, `home-en-${theme}-${mobile ? "iphone13" : "1440"}.png`), fullPage: true });
  if (!mobile) { await checkHover(page, theme); await checkReducedMotion(page); }
  assert.deepEqual(errors, [], "Browser runtime errors");
  await context.close();
}

/** @returns {Promise<void>} */
async function checkLocales() {
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  for (const locale of ["ru", "kk"]) {
    await page.goto(`${baseURL}/${locale}`, { waitUntil: "networkidle" });
    await revealPage(page);
    assert.equal(await page.locator(".nano-glyph").count(), 12);
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
    await page.screenshot({ path: path.join(output, `home-${locale}-1440.png`), fullPage: true });
  }
  await page.close();
}

try {
  for (const theme of ["dark", "light"]) {
    await captureHome(theme, false);
    await captureHome(theme, true);
  }
  await checkLocales();
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  await page.goto(pathToFileURL(path.join(output, "preview.html")).href);
  await page.screenshot({ path: path.join(output, "preview-browser.png"), fullPage: true });
  await writeFile(path.join(output, "browser-checks.json"), `${JSON.stringify(report, null, 2)}\n`);
} finally {
  await browser.close();
}
