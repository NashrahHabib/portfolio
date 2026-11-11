/**
 * Captures a homepage screenshot for every website in src/data/projects.ts and saves it as
 * public/images/projects/<slug>.jpg, where the site picks it up automatically.
 *
 *   npm run screenshots            capture projects that have no screenshot yet
 *   npm run screenshots -- --force re-capture everything (images you added yourself in another
 *                                  format, such as .webp or .png, are still left alone)
 *   npm run screenshots -- yuki-shrimp clever-nurse   (re)capture specific projects by slug
 *
 * First run only: npx playwright install chromium
 */
import { existsSync, mkdirSync, readdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { chromium, type Page } from 'playwright';
import { projects } from '../src/data/projects';

const outDir = resolve('public/images/projects');
const args = process.argv.slice(2);
const force = args.includes('--force');
const only = args.filter((a) => !a.startsWith('--'));
const timeout = Number(process.env.SHOT_TIMEOUT ?? 90000);

mkdirSync(outDir, { recursive: true });

/** Every image already in the folder, by slug and extension. */
const existing = readdirSync(outDir).filter((f) => /\.(jpe?g|png|webp|avif)$/i.test(f));
const imageFor = (slug: string) => existing.filter((f) => f.replace(/\.[^.]+$/, '') === slug);

/** Cookie banners, consent dialogs, chat bubbles and "install app" prompts to hide before the shot. */
// Wrapped in :not(html):not(body) because some sites put "cookie"/"consent" classes on <body> itself.
const HIDE_OVERLAYS = `
  :is([id*="cookie" i], [class*="cookie" i], [id*="consent" i], [class*="consent" i],
  [id*="gdpr" i], [class*="gdpr" i], [class*="cmplz" i], #CybotCookiebotDialog, .cky-consent-container,
  #onetrust-consent-sdk, .fc-consent-root, [class*="pwa" i][class*="install" i], [id*="pwa" i],
  [class*="add-to-home" i], [class*="whatsapp" i][class*="float" i], #tidio-chat, .tawk-min-container,
  iframe[title*="chat" i], [class*="newsletter-popup" i], .pum-overlay):not(html):not(body)
  { display: none !important; visibility: hidden !important; }
  html, body { overflow: auto !important; }
`;

/** Waits until the page's hero content has actually loaded, not just the HTML. */
async function settle(page: Page) {
  // Many WordPress speed plugins only load scripts after the first mouse move or scroll.
  await page.mouse.move(400, 300);
  await page.mouse.wheel(0, 400);
  await page.waitForTimeout(400);
  await page.mouse.wheel(0, -400);

  // Slow sites keep fetching scripts after "load"; give them time to go quiet.
  await page.waitForLoadState('networkidle', { timeout: 30000 }).catch(() => {});

  // Lazy images in the first screen: wait until they have finished downloading.
  await page
    .waitForFunction(
      () =>
        [...document.images]
          .filter((img) => img.getBoundingClientRect().top < window.innerHeight)
          .every((img) => img.complete),
      null,
      { timeout: 15000 },
    )
    .catch(() => {});

  // Background videos: make sure they play and have a frame to show.
  await page.evaluate(() => document.querySelectorAll('video').forEach((v) => { v.muted = true; v.play().catch(() => {}); }));
  await page
    .waitForFunction(() => [...document.querySelectorAll('video')].every((v) => v.readyState >= 2), null, { timeout: 20000 })
    .catch(() => {});

  // Elementor YouTube/Vimeo backgrounds are inserted as an iframe once the page's scripts run.
  const hasEmbedBackground = await page.$('.elementor-background-video-embed');
  if (hasEmbedBackground) {
    await page.waitForSelector('.elementor-background-video-embed iframe, iframe.elementor-background-video-embed', { timeout: 30000 }).catch(() => {});
    await page.waitForTimeout(6000); // let the embedded player buffer and start
  }

  await page.addStyleTag({ content: HIDE_OVERLAYS }).catch(() => {});
  await page.waitForTimeout(3000); // fonts, sliders and fade-in animations
}

const targets = projects.filter((p) => p.kind === 'website' && (only.length === 0 || only.includes(p.slug)));
const browser = await chromium.launch({ args: ['--autoplay-policy=no-user-gesture-required'] });
const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1, locale: 'en-US' });
const failed: string[] = [];
let captured = 0;

for (const project of targets) {
  const file = resolve(outDir, `${project.slug}.jpg`);
  const current = imageFor(project.slug);
  const named = only.includes(project.slug);
  // Never overwrite an image someone added by hand in another format.
  const manual = current.some((f) => !f.endsWith('.jpg'));
  if (manual && !named) {
    console.log(`skipped   ${project.slug} (has its own ${current.join(', ')})`);
    continue;
  }
  if (current.length && !force && !named) continue;

  const page = await context.newPage();
  try {
    await page.goto(project.url, { waitUntil: 'load', timeout });
    await settle(page);
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(500);
    await page.screenshot({ path: file, type: 'jpeg', quality: 82 });
    captured += 1;
    console.log(`captured  ${project.slug}`);
  } catch (error) {
    failed.push(project.slug);
    console.warn(`failed    ${project.slug}: ${(error as Error).message.split('\n')[0]}`);
  } finally {
    await page.close();
  }
}

await browser.close();
console.log(`\n${captured} captured, ${failed.length} failed${failed.length ? `: ${failed.join(', ')}` : ''}.`);
console.log('Review the images before publishing: cookie banners, redirects or error pages may need a manual retake.');
