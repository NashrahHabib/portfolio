import { copyFileSync, existsSync, readdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import { viteSingleFile } from 'vite-plugin-singlefile';
import { projects } from './src/data/projects';

// Set these when building for production (the GitHub Actions workflow does it for you).
const base = process.env.VITE_BASE || '/';
const siteUrl = (process.env.SITE_URL || 'https://example.com').replace(/\/$/, '');

/** Maps project slug -> screenshot path for every image in public/images/projects. */
function projectImages(): Record<string, string> {
  const dir = resolve('public/images/projects');
  if (!existsSync(dir)) return {};
  return Object.fromEntries(
    readdirSync(dir)
      .filter((f) => /\.(jpe?g|png|webp|avif)$/i.test(f))
      .map((f) => [f.replace(/\.[^.]+$/, ''), `images/projects/${f}`]),
  );
}

/** Writes sitemap.xml, robots.txt and a 404.html copy (so deep links work on GitHub Pages). */
function staticFiles(): Plugin {
  return {
    name: 'portfolio-static-files',
    apply: 'build',
    generateBundle() {
      const routes = ['/', '/about', '/portfolio', '/services', '/contact', ...projects.map((p) => `/portfolio/${p.slug}`)];
      const urls = routes.map((r) => `  <url><loc>${siteUrl}${r === '/' ? '/' : r}</loc></url>`).join('\n');
      this.emitFile({
        type: 'asset',
        fileName: 'sitemap.xml',
        source: `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`,
      });
      this.emitFile({ type: 'asset', fileName: 'robots.txt', source: `User-agent: *\nAllow: /\n\nSitemap: ${siteUrl}/sitemap.xml\n` });
    },
    closeBundle() {
      const index = resolve('dist/index.html');
      if (existsSync(index)) copyFileSync(index, resolve('dist/404.html'));
    },
  };
}

export default defineConfig(({ mode }) => {
  // "preview" mode builds one self-contained HTML file with hash routing, for sharing a quick preview.
  const preview = mode === 'preview';
  return {
    base: preview ? './' : base,
    plugins: [react(), ...(preview ? [viteSingleFile()] : [staticFiles()])],
    define: {
      __SITE_URL__: JSON.stringify(siteUrl),
      __HASH_ROUTER__: JSON.stringify(preview),
      __PROJECT_IMAGES__: JSON.stringify(projectImages()),
    },
    build: { outDir: preview ? 'dist-preview' : 'dist' },
  };
});
