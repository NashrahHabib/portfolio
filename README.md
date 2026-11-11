# Nashrah Habib — portfolio

React + TypeScript + Tailwind CSS site built with Vite. Routing is React Router, motion is Framer Motion, icons are Lucide. There is no backend.

## Run it

```bash
npm install
npm run dev        # local development at http://localhost:5173
npm run build      # type-check and build to dist/
npm run preview    # serve the built site locally
```

Requires Node 18 or newer.

## Where things live

```
src/
  data/
    projects.ts    all projects; only those with `featured: true` appear on the site
    site.ts        name, email, LinkedIn, portrait path, stats, experience, education
    services.ts    services page and homepage services preview
    skills.ts      skill groups, including the "currently learning" group
  pages/           Home, About, Portfolio, ProjectDetail, Services, Contact, NotFound
  components/      header, footer, project frame and cards, contact form, and so on
  lib/             SEO hook, theme hook and project helpers
  assets/portrait.jpg   your portrait photo
  index.css        colour themes (light and dark) and shared styles
scripts/
  capture-screenshots.ts   screenshots every project homepage
public/
  images/projects/             put project screenshots here
```

## Changing content

**Text.** Profile details, stats and the career timeline are in `src/data/site.ts`. Page copy (biography, headlines) is in the matching file in `src/pages/`.

**Projects.** Each entry in `src/data/projects.ts` needs only `name` and `url`:

```ts
{
  name: 'Yuki Shrimp',
  url: 'https://yukishrimp.com/',
  category: 'E-commerce',                       // one of CATEGORIES at the top of the file
  description: 'One or two factual sentences.',
  contribution: 'What you did on the project.',
  technologies: ['WordPress', 'WooCommerce'],
  image: 'images/projects/yuki-shrimp.jpg',
  gallery: ['images/projects/yuki-shrimp-2.jpg'],
  featured: true,                               // shows it on the site; without it the entry stays hidden
},
```

Every website shows "Design and custom coding." as the work performed (`DEFAULT_CONTRIBUTION` in the same file); set `contribution` on a project to say something more specific. Optional fields that are left out are simply not displayed. A project without a category is listed under "Other / To be classified". `id`, `slug` and `imageStatus` are generated automatically; add `slug` yourself only if you want a specific project URL.

**Screenshots.** Any image in `public/images/projects/` named after a project's slug (for example `yuki-shrimp.jpg`) is used automatically. A project's slug is the last part of its page address. Until an image exists the project shows a neutral placeholder with its name.

To capture all of them in one go:

```bash
npx playwright install chromium   # first time only
npm run screenshots               # captures every website that has no screenshot yet
npm run screenshots -- --force    # re-captures everything
npm run screenshots -- yuki-shrimp clever-nurse   # only these projects
SHOT_CHANNEL=chrome npm run screenshots          # use your installed Google Chrome
```

Or run it on GitHub with nothing installed locally: open the repository's Actions tab, choose "Capture project screenshots" and press "Run workflow". It commits the images and the site redeploys. Look through the results afterwards, because cookie banners, redirects and error pages get captured too. Replace any bad one with your own 1440 × 900 image of the same file name.

**Portrait.** Replace `src/assets/portrait.jpg` with another photo of the same name (portrait orientation, 4:5, about 800 × 1000 px). It appears in the homepage hero and on the About page.

## Contact form

The form validates in the browser and has spam protection (a hidden honeypot field and a minimum fill time).

Out of the box no email service is connected, so submitting opens a pre-filled draft in the visitor's email app. To have messages delivered directly:

1. Create a form endpoint with a form service (for example Formspree or Web3Forms) or your own server. The endpoint must accept a JSON `POST` with `name`, `email`, `projectType`, `budget` and `message`.
2. Set it as `VITE_FORM_ENDPOINT`: in a `.env.local` file for local work, and as a repository variable named `FORM_ENDPOINT` on GitHub (Settings → Secrets and variables → Actions → Variables).

Never put API keys or email passwords in this project. Everything in a frontend build is public. If a service needs a secret, it belongs on a server.

## Deploying to GitHub Pages

The workflow in `.github/workflows/deploy.yml` builds and publishes the site on every push to `main`.

1. Create a repository on GitHub. Naming it `<username>.github.io` serves the site at that address; any other name serves it at `<username>.github.io/<repo>`. The workflow detects which and sets the base path, sitemap and canonical URLs to match.
2. Push the project:
   ```bash
   git init
   git add .
   git commit -m "Portfolio site"
   git branch -M main
   git remote add origin https://github.com/<username>/<repo>.git
   git push -u origin main
   ```
3. In the repository, open Settings → Pages and set Source to "GitHub Actions".
4. Watch the Actions tab. When the run finishes, the site is live.

Deep links such as `/portfolio/yuki-shrimp` work through a `404.html` copy of the app, which is the standard approach for single-page apps on GitHub Pages.

For another host or a custom domain, build with `VITE_BASE=/ SITE_URL=https://your-domain.com npm run build` and upload `dist/`.

## Global design tokens, colours and dark mode

Fonts, heading sizes, corner radii, colours and shadows are all defined once, in the "DESIGN TOKENS" block at the top of `src/index.css`. Components only reference those tokens, so changing a value there changes the whole site.

- Fonts: Funnel Display for headings and Geist for text. Both are Google Fonts, bundled with the site so nothing loads from a third party.
- Colours: white page, light skin sections and dark green in the light theme; deep green with a skin accent in the dark theme.
- The site opens in the light theme. The moon/sun button in the header switches to dark and the choice is remembered on that device.

## Accessibility and SEO

Built to WCAG 2.1 Level AA, the standard used for ADA and Section 508 conformance in the United States:

- Text and controls meet AA contrast in both themes.
- Everything works by keyboard, with a visible focus outline and a "Skip to content" link.
- Page changes move focus to the new content so screen readers announce it.
- Images have descriptive alt text; decorative elements are hidden from assistive technology.
- Form fields have labels, required fields are marked, and errors are announced and linked to their field.
- Animation is switched off for visitors who ask their system to reduce motion.

Automated axe checks pass on every page type in both themes, at desktop and mobile widths. Automated tools catch only part of what WCAG covers, so a manual pass with a screen reader is still worth doing before you state conformance publicly.

For search engines: each page sets its own title, description, canonical URL and Open Graph tags (`useSeo` in each page), the build writes `sitemap.xml` and `robots.txt`, and `index.html` carries Person structured data.

## Notes

- The old `/work` addresses redirect to `/portfolio`.
- `npm run build:preview` produces `dist-preview/index.html`, a single self-contained file with in-memory routing for sending someone a quick preview.
