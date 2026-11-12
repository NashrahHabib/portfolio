import { Award, Globe2, ShieldCheck, ShoppingCart, SlidersHorizontal } from 'lucide-react';
import type { PinnedItem } from '../components/PinnedSteps';

/**
 * "Why choose me" reasons. Edit the wording here; the section adjusts to any number of
 * items (three to five read best). Icons come from lucide.dev.
 * Every point is based on the experience described in the About section.
 */
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
