import { chromium } from "playwright";
import { mkdirSync } from "node:fs";

const OUT_DIR = new URL("./screenshots/", import.meta.url).pathname;
mkdirSync(OUT_DIR, { recursive: true });

const browser = await chromium.launch({
    executablePath: "/opt/pw-browsers/chromium-1194/chrome-linux/chrome",
});
const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await context.newPage();

page.on("pageerror", (e) => console.error("[pageerror]", e.message));
page.on("console", (m) => {
    if (m.type() === "error") console.error("[console.error]", m.text());
});

console.log("admin: navigating to http://localhost:8000/");
await page.goto("http://localhost:8000/", { waitUntil: "domcontentloaded", timeout: 60_000 });

console.log("admin: at", page.url());
await page.waitForSelector('select[name="login"]', { timeout: 30_000 });
await page.selectOption('select[name="login"]', "1");
await Promise.all([
    page.waitForNavigation({ waitUntil: "domcontentloaded", timeout: 60_000 }),
    page.click('button[type="submit"]'),
]);

// Sometimes there's a consent screen after login
for (let i = 0; i < 3; i++) {
    if (!/\/interaction\//.test(page.url())) break;
    const btn = await page.$('button[type="submit"]');
    if (!btn) break;
    console.log("admin: interaction step at", page.url());
    await Promise.all([
        page.waitForNavigation({ waitUntil: "domcontentloaded", timeout: 60_000 }),
        btn.click(),
    ]);
}

console.log("admin: post-login at", page.url());
await page.waitForLoadState("networkidle", { timeout: 60_000 }).catch(() => {});
await page.waitForTimeout(3000);
await page.screenshot({ path: OUT_DIR + "admin.png", fullPage: false });
console.log("admin: screenshot saved to", OUT_DIR + "admin.png");

await browser.close();
console.log("done");
