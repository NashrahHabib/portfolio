import { Wrench } from 'lucide-react';
import { siPython, siShopify, siWoocommerce, siWordpress } from 'simple-icons';
import { services } from '../data/services';
import type { StackItem } from '../data/stack';
import PinnedSteps, { type PinnedItem } from './PinnedSteps';

/** The official logo for each service (a line icon where there is no brand, such as maintenance). */
const logos: Record<string, StackItem> = {
  wordpress: { name: 'WordPress', note: '', logo: siWordpress },
  woocommerce: { name: 'WooCommerce', note: '', logo: siWoocommerce, scale: 1.85 },
  shopify: { name: 'Shopify', note: '', logo: siShopify },
  maintenance: { name: 'Maintenance', note: '', icon: Wrench },
  emerging: { name: 'Python', note: '', logo: siPython },
};

/** Short names shown beside the big logo while each service is in view. */
const short: Record<string, string> = {
  wordpress: 'WordPress',
  woocommerce: 'WooCommerce',
  shopify: 'Shopify',
  maintenance: 'Maintenance',
  emerging: 'Emerging',
};

/** Official editor screenshots, from each platform's own documentation. */
const shots: Record<string, string> = {
  wordpress: '/images/editors/wordpress-site-editor.jpg',
  woocommerce: '/images/editors/woocommerce-block-editor.jpg',
  shopify: '/images/editors/shopify-theme-editor.jpg',
};

const items: PinnedItem[] = services.map((s) => ({
  title: short[s.id] ?? s.title,
  heading: s.title,
  text: s.summary,
  logo: logos[s.id] ?? logos.wordpress,
  points: s.items,
  badge: s.emerging ? 'Emerging focus' : undefined,
  image: shots[s.id],
}));

/**
 * Services in the pinned storytelling layout (the same design "How I work" used) on the dark band: the heading
 * and the service's editor screenshot (or logo) stay in place on the left while each service scrolls past on the right.
 */
export default function ServicesSection() {
  return <PinnedSteps id="services" eyebrow="Services" title={['What I Can', '*Build* For You']} items={items} palette="green" visual="icon" />;
}
