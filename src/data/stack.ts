/**
 * TOOLS AND TECHNOLOGIES — shown on the homepage (hub) and the Services page (scrolling rows).
 *
 * Brand logos come from Simple Icons (simpleicons.org): import the `si…` name, for example
 * `siCloudflare`, and set it as `logo`. For things that are not a brand (migration, shipping)
 * or brands Simple Icons does not carry, put the official logo file in public/images/logos and set
 * `image` (add `fill: true` for square app icons that bring their own background), or use a
 * lucide icon as `icon`.
 * Only list tools you actually use; `learning: true` labels a tool as "Learning".
 */
import type { LucideIcon } from 'lucide-react';
import {
  ArrowRightLeft, Bug, Code2, DatabaseBackup, FolderSync, Droplets, Gauge, Image, Link2, Server, ShoppingCart, SquareTerminal, Truck, UploadCloud,
} from 'lucide-react';
import {
  siClaude, siCss, siElementor, siFastapi, siFigma, siGit, siGithub, siGoogleanalytics, siGooglesearchconsole, siGoogletagmanager, siGutenberg,
  siHostinger, siHtml5, siJavascript, siKinsta, siMariadb, siMysql, siPaypal, siPhp, siPython, siShopify, siStripe, siWoocommerce, siWordpress,
} from 'simple-icons';

export interface BrandLogo { title: string; hex: string; path: string }

export interface StackItem {
  name: string;
  /** A few words on how it is used. */
  note: string;
  logo?: BrandLogo;
  icon?: LucideIcon;
  /** An official logo file in /public, e.g. '/images/logos/acf.svg'. */
  image?: string;
  /** The image is a square app icon with its own background: let it fill the whole tile. */
  fill?: boolean;
  /** Enlarges wide logos (wordmarks) so they fill the tile like square ones. */
  scale?: number;
  learning?: boolean;
}

export interface StackGroup {
  title: string;
  /** Short line used on the homepage hub cards. */
  summary: string;
  /** What the hub "speech bubble" says while this group is highlighted. */
  activity: string;
  items: StackItem[];
}

export const stackGroups: StackGroup[] = [
  {
    title: 'WordPress',
    summary: 'Themes, blocks and builders',
    activity: 'Turning a finished design into a custom WordPress theme with editable blocks.',
    items: [
      { name: 'WordPress', note: 'Custom themes and plugins', logo: siWordpress },
      { name: 'Gutenberg', note: 'Custom blocks and patterns', logo: siGutenberg },
      { name: 'Elementor', note: 'Page builds and templates', logo: siElementor },
      { name: 'ACF', note: 'Advanced Custom Fields', image: '/images/logos/acf.svg', fill: true },
      { name: 'Secure Custom Fields', note: 'SCF fields and option pages', image: '/images/logos/scf.svg', fill: true },
    ],
  },
  {
    title: 'E-commerce and payments',
    summary: 'Stores, checkout and gateways',
    activity: 'Setting up a store: products, checkout, shipping, and Stripe and PayPal payments.',
    items: [
      { name: 'WooCommerce', note: 'Stores, products and checkout', logo: siWoocommerce, scale: 1.85 },
      { name: 'Shopify', note: 'Store setup and configuration', logo: siShopify },
      { name: 'Liquid', note: 'Shopify theme templates', icon: Droplets },
      { name: 'Stripe', note: 'Card payments', logo: siStripe },
      { name: 'PayPal', note: 'PayPal checkout', logo: siPaypal },
      { name: 'Cart and checkout', note: 'Smooth paths to purchase', icon: ShoppingCart },
      { name: 'Shipping', note: 'Zones, rates and rules', icon: Truck },
    ],
  },
  {
    title: 'Code',
    summary: 'Languages and databases',
    activity: 'Writing the PHP behind a custom feature and the MySQL queries it needs.',
    items: [
      { name: 'PHP', note: 'Themes and plugin logic', logo: siPhp, scale: 1.45 },
      { name: 'MySQL', note: 'Databases and queries', logo: siMysql, scale: 1.3 },
      { name: 'MariaDB', note: 'Databases on modern hosts', logo: siMariadb, scale: 1.2 },
      { name: 'JavaScript', note: 'Interactions and front-end logic', logo: siJavascript },
      { name: 'HTML5', note: 'Semantic, accessible markup', logo: siHtml5 },
      { name: 'CSS', note: 'Responsive layouts', logo: siCss },
      { name: 'Custom code', note: 'Features written for the project', icon: Code2 },
      { name: 'VS Code', note: 'Where the code gets written', image: '/images/logos/vscode.svg' },
    ],
  },
  {
    title: 'Hosting and servers',
    summary: 'Hosts, deploys, migrations and backups',
    activity: 'Moving a site to a new host safely, with redirects and no downtime.',
    items: [
      { name: 'Git', note: 'Version control', logo: siGit },
      { name: 'GitHub', note: 'Repositories and deploys', logo: siGithub },
      { name: 'WP-CLI and SSH', note: 'Server work from the command line', icon: SquareTerminal },
      { name: 'rsync', note: 'Fast, safe file syncing between servers', icon: FolderSync },
      { name: 'Server management', note: 'Hosting setup and upkeep', icon: Server },
      { name: 'Hosting', note: 'Choosing and configuring hosts', icon: UploadCloud },
      { name: 'Migration', note: 'Moving sites without losing data', icon: ArrowRightLeft },
      { name: 'Hostinger', note: 'Hosting setup and management', logo: siHostinger },
      { name: 'Kinsta', note: 'Managed WordPress hosting', logo: siKinsta },
      { name: 'Website backups', note: 'Scheduled backups and restores', icon: DatabaseBackup },
    ],
  },
  {
    title: 'SEO and speed',
    summary: 'Found in search, fast to load',
    activity: 'Getting pages indexed in Search Console and speeding them up with caching and WebP images.',
    items: [
      { name: 'Google Search Console', note: 'Page indexing and search health', logo: siGooglesearchconsole },
      { name: 'Google Analytics', note: 'Traffic and goals', logo: siGoogleanalytics },
      { name: 'Google Tag Manager', note: 'Tracking tags without code changes', logo: siGoogletagmanager },
      { name: 'LiteSpeed Cache', note: 'Page caching and speed tuning', image: '/images/logos/litespeed-cache.png', fill: true },
      { name: 'Rank Math', note: 'On-page SEO', image: '/images/logos/rank-math.svg', fill: true },
      { name: 'Performance', note: 'Caching and Core Web Vitals', icon: Gauge },
      { name: 'WebP images', note: 'Lighter, faster images', icon: Image },
      { name: '301 redirects', note: 'Keeping rankings after changes', icon: Link2 },
    ],
  },
  {
    title: 'Design and AI',
    summary: 'From Figma to AI-assisted builds',
    activity: 'Reading a Figma file and using AI tools to build and test faster.',
    items: [
      { name: 'Figma', note: 'Designs ready to build', logo: siFigma },
      { name: 'Claude', note: 'AI-assisted code generation', logo: siClaude },
      { name: 'ChatGPT', note: 'Drafting and problem solving', image: '/images/logos/openai.svg' },
      { name: 'Debugging and QA', note: 'Finding and fixing issues before launch', icon: Bug },
      { name: 'Python', note: 'Automation and scripts', logo: siPython, learning: true },
      { name: 'FastAPI', note: 'APIs in Python', logo: siFastapi, learning: true },
    ],
  },
];

/** Every item once, in a flat list (for the scrolling rows). */
export const allStackItems: StackItem[] = stackGroups.flatMap((g) => g.items);
