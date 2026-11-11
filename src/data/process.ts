import { Award, Code2, Globe2, LifeBuoy, Rocket, ScanSearch, ShieldCheck, ShoppingCart, SlidersHorizontal } from 'lucide-react';
import type { PinnedItem } from '../components/PinnedSteps';

/**
 * Homepage storytelling sections. Edit the wording here; each section adjusts to any number of
 * items (three to five read best). Icons come from lucide.dev.
 */

/** "How I work" */
export const processSteps: PinnedItem[] = [
  {
    title: 'Review',
    icon: ScanSearch,
    heading: 'Understand the design',
    text: 'I go through the design and what the site needs to do, and we agree on the pages, features and timeline before any code is written.',
  },
  {
    title: 'Build',
    icon: Code2,
    heading: 'A custom theme, not a page builder maze',
    text: 'The design becomes a WordPress theme with editable sections and sensible fields, or a WooCommerce or Shopify store set up around your products.',
  },
  {
    title: 'Launch',
    icon: Rocket,
    heading: 'Tested, then live',
    text: 'I check the site on phones, tablets and the main browsers, look at speed and the basics of SEO, and then put it live.',
  },
  {
    title: 'Support',
    icon: LifeBuoy,
    heading: 'Looked after afterwards',
    text: 'Updates, fixes and improvements that keep the site running, so you can run it day to day without a developer.',
  },
];

/** "Why choose me". Every point is based on the experience described in the About section. */
export const reasons: PinnedItem[] = [
  {
    title: 'Experience',
    icon: Award,
    heading: '4+ years, 200+ websites',
    text: 'More than four years of professional WordPress work, with over 200 websites built and managed along the way.',
  },
  {
    title: 'Easy to edit',
    icon: SlidersHorizontal,
    heading: 'Sites you can run yourself',
    text: 'Editable sections and sensible fields mean you can change text, images and pages without calling a developer.',
  },
  {
    title: 'E-commerce',
    icon: ShoppingCart,
    heading: 'Stores that are ready to sell',
    text: 'WooCommerce and Shopify stores set up end to end, from product pages to shipping and payments.',
  },
  {
    title: 'Remote',
    icon: Globe2,
    heading: 'Used to working across time zones',
    text: 'Clients in the USA, the UK and Europe, with clear updates and handovers that fit around their working hours, all delivered remotely.',
  },
  {
    title: 'Reliable',
    icon: ShieldCheck,
    heading: 'Built to keep running',
    text: 'Troubleshooting, migrations, performance and security hardening are part of my everyday work, not an afterthought.',
  },
];
