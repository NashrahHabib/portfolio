/**
 * Captures a homepage screenshot for every website in src/data/projects.ts and saves it as
 * public/images/projects/<slug>.jpg, where the site picks it up automatically.
 *
 *   npm run screenshots            capture projects that have no screenshot yet
 *   npm run screenshots -- --force re-capture everything
 *   npm run screenshots -- yuki-shrimp clever-nurse   capture specific projects by slug
 *
 * First run only: npx playwright install chromium
 */
import { existsSync, mkdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { chromium } from 'playwright';
import { projects } from '../src/data/projects';

const outDir = resolve('public/images/projects');
const args = process.argv.slice(2);
const force = args.includes('--force');
const only = args.filter((a) => !a.startsWith('--'));
const timeout = Number(process.env.SHOT_TIMEOUT ?? 45000);

mkdirSync(outDir, { recursive: true });

const targets = projects.filter((p) => p.kind === 'website' && (only.length === 0 || only.includes(p.slug)));
const browser = await chromium.launch();
const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1, locale: 'en-US' });
const failed: string[] = [];
let captured = 0;

for (const project of targets) {
  const file = resolve(outDir, `${project.slug}.jpg`);
  if (existsSync(file) && !force) continue;
  const page = await context.newPage();
  try {
    await page.goto(project.url, { waitUntil: 'load', timeout });
    await page.waitForTimeout(2500); // let fonts, sliders and lazy images settle
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
