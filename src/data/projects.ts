/**
 * PROJECT DATA — the single place to add, edit or remove projects.
 *
 * Only `name` and `url` are required. Everything else is optional and should be filled in
 * only with information you have verified:
 *
 *   category      one of the CATEGORIES below (defaults to "Other / To be classified")
 *   description   one or two factual sentences about the site
 *   contribution  the work you did on it (defaults to DEFAULT_CONTRIBUTION below)
 *   technologies  technologies used
 *   image         main screenshot, relative to /public. You rarely need to set this: any file in
 *                 public/images/projects/ named after the project's slug (yuki-shrimp.jpg) is
 *                 picked up automatically. `npm run screenshots` creates those files.
 *   gallery       extra screenshots for the project page
 *   featured      true SHOWS the project on the site (homepage carousel and Portfolio page).
 *                 Entries without it are kept here for later but appear nowhere. To add a
 *                 project to the site, give it `featured: true`.
 *   slug          URL of the project page; generated from the name when omitted
 *
 * `id`, `slug`, `imageStatus` and `kind` are filled in automatically at the bottom of this file.
 */

export const CATEGORIES = [
  'E-commerce',
  'Healthcare',
  'Engineering & Construction',
  'Travel & Hospitality',
  'Nonprofit',
  'Directory & Marketplace',
  'Business Consulting',
  'Automotive',
  'Local services',
  'Software',
  'Other / To be classified',
] as const;

export type Category = (typeof CATEGORIES)[number];
export const UNCLASSIFIED: Category = 'Other / To be classified';

export type ImageStatus = 'screenshot' | 'placeholder';

/** Who the project was delivered for or through. */
export const COMPANIES = ['SMCSE Solutions', 'Vision Craft Technologies', 'Freelance'] as const;
export type Company = (typeof COMPANIES)[number];

/** Kinds of work that can be credited on a project, in the order they are displayed. */
export const WORK_TYPES = [
  'Complete website build',
  'Designed pages',
  'Figma to WordPress',
  'Custom coding',
  'Theme customisation',
  'Store setup',
  'Product upload and management',
  'Payment and shipping setup',
  'Custom tools and integrations',
  'Performance optimisation',
  'SEO',
  'Migration',
  'Maintenance and fixes',
] as const;
export type WorkType = (typeof WORK_TYPES)[number];

export interface ProjectInput {
  name: string;
  url: string;
  slug?: string;
  category?: Category;
  description?: string;
  /** Company the work was done for or through. */
  company?: Company;
  /** The work performed, picked from WORK_TYPES. */
  work?: WorkType[];
  contribution?: string;
  technologies?: string[];
  image?: string;
  gallery?: string[];
  featured?: boolean;
}

export interface Project extends Omit<ProjectInput, 'slug' | 'category' | 'featured'> {
  id: number;
  slug: string;
  category: Category;
  featured: boolean;
  imageStatus: ImageStatus;
  /** "social" marks entries that are a social profile, not a website. */
  kind: 'website' | 'social';
}

/** Work performed on every website in the portfolio, unless a project sets its own `contribution`. */
export const DEFAULT_CONTRIBUTION = 'Design and custom coding.';

/** Technologies detected in the markup of the live site. */
const WP_ELEMENTOR = ['WordPress', 'Elementor'];
const WP_WOO = ['WordPress', 'WooCommerce', 'Elementor'];

const entries: ProjectInput[] = [
  {
    name: 'Yuki Shrimp', url: 'https://yukishrimp.com/', category: 'E-commerce', featured: true,
    company: 'SMCSE Solutions', work: ['Designed pages', 'Figma to WordPress', 'Custom coding', 'Theme customisation', 'Performance optimisation', 'SEO', 'Maintenance and fixes'],
    description: 'Online shop for a breeder of aquarium shrimp in the Netherlands, selling shrimp, plants, food and hardware in English and Dutch.',
    technologies: WP_WOO,
  },
  {
    name: 'DampAmok', url: 'https://dampamok.com/', category: 'E-commerce', featured: true,
    company: 'SMCSE Solutions', work: ['Designed pages', 'Figma to WordPress', 'Custom coding', 'Theme customisation', 'Store setup', 'Product upload and management', 'Performance optimisation', 'SEO', 'Maintenance and fixes'],
    description: 'Danish-language online shop for disposable vapes.',
    technologies: WP_WOO,
  },
  { name: 'Jam-Packed', url: 'https://jam-packed.com/' },
  { name: 'JB Saeed Home', url: 'https://jbsaeedhome.com/' },
  { name: 'Evolution Bikes', url: 'https://evolutionbikes.it/' },
  { name: 'cbevisa.com', url: 'https://cbevisa.com/' },
  { name: 'Imagine Your Best', url: 'https://imagineyourbest.com/' },
  { name: 'Thrive Therapy of KS', url: 'https://thrivetherapyofks.com/' },
  {
    name: 'Clever Nurse', url: 'https://clevernurse.ch/', category: 'Healthcare', featured: true,
    company: 'SMCSE Solutions', work: ['Designed pages', 'Figma to WordPress', 'Theme customisation', 'Performance optimisation', 'SEO'],
    description: 'Website for a Zurich-based private healthcare coordination service, with service pages, insights and consultation request forms.',
    technologies: WP_ELEMENTOR,
  },
  { name: 'My Noble Care', url: 'https://mynoblecare.com/' },
  { name: 'Mint Pharma', url: 'https://www.mintpharma.co/' },
  { name: 'clearpathos.net', url: 'https://www.clearpathos.net/' },
  { name: 'Northeastern MN', url: 'https://northeasternmn.com/' },
  { name: 'Enhancing Massage', url: 'https://enhancingmassage.com/' },
  { name: 'My Therapeutic Edge', url: 'https://mytherapeuticedge.com/' },
  { name: 'PFM Fleet Service', url: 'https://www.pfmfleetservice.com/', category: 'Automotive', featured: true,
    company: 'SMCSE Solutions', work: ['Designed pages', 'Custom coding', 'Theme customisation', 'Store setup', 'Performance optimisation', 'SEO'] },
  { name: 'SMCSE Consulting', url: 'https://smcseconsulting.com/' },
  { name: 'CG Squad', url: 'https://cgsquad.co.uk/' },
  { name: 'Premium Pirate', url: 'https://premiumpirate.com/' },
  { name: 'John Yoder Agency', url: 'https://johnyoderagency.com/' },
  { name: 'Quality Landscaping LLC', url: 'https://qualitylandscapingllc.com/' },
  { name: 'Fedorich Solutions', url: 'http://fedorichsolutions.net/' },
  { name: 'Gametria', url: 'https://gametria.io/' },
  {
    name: 'Hayes Garage', url: 'https://hayes-garage.co.uk/', category: 'Automotive',
    description: 'Website for an independent MOT, servicing and repair garage in Hayes, West London, with online appointment booking.',
    technologies: WP_ELEMENTOR,
  },
  { name: 'CreaHome', url: 'https://www.instagram.com/creahome.eu/', description: 'Instagram profile.' },
  { name: 'Belief Global', url: 'https://beliefglobal.org/' },
  { name: 'Ayten’s Makeup', url: 'http://aytensmakeup.com/' },
  { name: 'Career Alignment Coach', url: 'https://careeralignmentcoach.com/' },
  { name: 'morgosiane.com', url: 'https://morgosiane.com/' },
  { name: 'California Aesthetics', url: 'https://californiaaesthetics.co/' },
  {
    name: 'Mass Timber Advisors', url: 'https://masstimberadvisors.com/', category: 'Engineering & Construction', featured: true,
    company: 'SMCSE Solutions', work: ['Designed pages', 'Figma to WordPress', 'Theme customisation', 'Performance optimisation', 'SEO'],
    description: 'Website for a structural engineering practice serving homeowners, architects and builders across Vermont and New Hampshire.',
    technologies: WP_ELEMENTOR,
  },
  { name: 'cnamac.com', url: 'https://cnamac.com/' },
  { name: 'River City Stump Removal', url: 'https://rivercitystumpremoval.com/', category: 'Local services', featured: true,
    company: 'SMCSE Solutions', work: ['Designed pages', 'Figma to WordPress', 'Custom coding', 'Theme customisation', 'Custom tools and integrations', 'Performance optimisation', 'SEO', 'Maintenance and fixes'] },
  {
    name: 'Hornsby Business Advisory', url: 'https://hornsbyadvisory.com/', category: 'Business Consulting',
    description: 'Website for a leadership advisory firm that works with executive teams on alignment, leadership development and execution.',
    technologies: WP_ELEMENTOR,
  },
  { name: 'Accentrix', url: 'https://accentrix.co.uk/' },
  { name: 'Castalia Massage', url: 'https://castaliamassage.com/' },
  { name: 'Coolax USA', url: 'https://coolaxusa.com/' },
  { name: 'shiftsixos.com', url: 'https://shiftsixos.com/' },
  { name: '360 Vision Builds', url: 'https://360visionbuilds.com/' },
  { name: 'U-sens', url: 'https://u-sens.com/', category: 'Engineering & Construction', featured: true,
    company: 'SMCSE Solutions', work: ['Designed pages', 'Custom coding', 'Theme customisation', 'Performance optimisation', 'SEO', 'Maintenance and fixes'] },
  {
    name: 'Shulin Lake Resort', url: 'https://www.shulinlakeresort.com/', category: 'Travel & Hospitality', featured: true,
    company: 'SMCSE Solutions', work: ['Designed pages', 'Figma to WordPress', 'Theme customisation', 'Performance optimisation', 'SEO', 'Maintenance and fixes'],
    description: 'Website for an all-inclusive wilderness lodge near Denali, Alaska, covering accommodation, fishing and adventure trips, and weddings.',
    technologies: WP_ELEMENTOR,
  },
  { name: 'Vybra Online', url: 'https://vybraonline.com/' },
  { name: 'skylands.aero', url: 'https://skylands.aero/' },
  { name: 'C Two Management', url: 'https://ctwomanagement.com/' },
  { name: 'Trading Game', url: 'https://tradinggame.com/' },
  { name: 'ZHM Technology', url: 'https://zhmtechnology.com/' },
  { name: 'Start Your New Journey', url: 'https://startyournewjourney.com/' },
  { name: 'Genxys', url: 'https://www.genxys.com/' },
  { name: 'Water411', url: 'https://water411.org/' },
  { name: 'cttib.com', url: 'https://cttib.com/' },
  { name: 'pcs.care', url: 'https://www.pcs.care/' },
  {
    name: 'The Broadway Legacy Foundation', url: 'https://thebroadwaylegacyfoundation.org/', category: 'Nonprofit',
    description: 'Website for a New York nonprofit that works with the Museum of Broadway on theatre education, special exhibits and arts advocacy.',
    technologies: WP_ELEMENTOR,
  },
  {
    name: 'Chord Board', url: 'https://chordboardmusic.com/', category: 'Software',
    description: 'Product website for Chord Board, a music-creation tool. The site now points visitors to the product’s new name, Motiflux.',
    technologies: WP_ELEMENTOR,
  },
  { name: 'Lagree Vibes', url: 'http://lagreevibes.com/' },
  { name: 'reihey.com', url: 'https://reihey.com/' },
  { name: 'emorocho.com', url: 'https://emorocho.com/' },
  { name: 'catbas.nl', url: 'https://catbas.nl/' },
  { name: 'Elite Imaging', url: 'http://eliteimaging.com/' },
  { name: 'Provantage Capital', url: 'https://www.provantagecapital.com/' },
  { name: 'rhrenoman.com', url: 'https://rhrenoman.com/' },
  { name: 'AGPUS', url: 'https://agpus.org/', category: 'Nonprofit', featured: true,
    company: 'Freelance', work: ['Complete website build', 'Designed pages', 'Theme customisation', 'Payment and shipping setup', 'Performance optimisation', 'SEO'] },
  { name: 'CWNB', url: 'https://cwnbny.com/', category: 'E-commerce', featured: true,
    company: 'Freelance', work: ['Complete website build', 'Designed pages', 'Theme customisation', 'Store setup', 'Payment and shipping setup', 'Performance optimisation', 'SEO', 'Maintenance and fixes'] },
  { name: 'Shop Nicotech', url: 'https://shopnicotech.com/', category: 'E-commerce', featured: true, technologies: ['Shopify'],
    company: 'Freelance', work: ['Complete website build', 'Designed pages', 'Theme customisation', 'Store setup', 'Product upload and management', 'Payment and shipping setup', 'Performance optimisation', 'SEO'] },
  {
    name: 'Browse Botswana', url: 'https://browsebotswana.com/', category: 'Directory & Marketplace', featured: true,
    company: 'SMCSE Solutions', work: ['Designed pages', 'Custom coding', 'Theme customisation', 'Performance optimisation', 'SEO', 'Maintenance and fixes'],
    description: 'Listings platform for Botswana with classifieds, events, services and stays, plus a multi-vendor marketplace.',
    technologies: WP_ELEMENTOR,
  },
];

/** Additional references that are not projects of their own. */
export const socialReferences = [{ label: 'Mint Pharma on Facebook', url: 'https://www.facebook.com/mintpharma.co/' }];

const slugify = (s: string) =>
  s
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f’']/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

/** Screenshots found in public/images/projects at build time (see vite.config.ts). */
const detectedImages: Record<string, string> = typeof __PROJECT_IMAGES__ !== 'undefined' ? __PROJECT_IMAGES__ : {};

const seen = new Set<string>();

/** Every entry in this file, shown or not. */
export const allProjects: Project[] = entries.map((entry, index) => {
  const { slug: customSlug, category, featured, ...rest } = entry;
  let slug = customSlug || slugify(entry.name);
  while (seen.has(slug)) slug += `-${index + 1}`;
  seen.add(slug);
  const kind = /(instagram|facebook)\.com/.test(entry.url) ? 'social' : 'website';
  const image = entry.image ?? detectedImages[slug];
  return {
    ...rest,
    id: index + 1,
    slug,
    category: category ?? UNCLASSIFIED,
    featured: featured ?? false,
    // A list of work types replaces the generic contribution line.
    contribution: entry.contribution ?? (kind === 'website' && !entry.work?.length ? DEFAULT_CONTRIBUTION : undefined),
    image,
    imageStatus: image ? 'screenshot' : 'placeholder',
    kind,
  };
});

/** The projects that appear on the site. */
export const projects: Project[] = allProjects.filter((p) => p.featured);
