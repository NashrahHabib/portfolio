export interface Service {
  id: string;
  title: string;
  summary: string;
  items: string[];
  /** Emerging services are shown separately and labelled, never as established offers. */
  emerging?: boolean;
}

export const services: Service[] = [
  {
    id: 'wordpress',
    title: 'Custom WordPress Development',
    summary: 'Themes and features written for the project, so the site does what the design promised and stays easy to edit.',
    items: ['Custom theme development', 'Figma to WordPress conversion', 'Gutenberg integration', 'Custom fields and reusable sections'],
  },
  {
    id: 'woocommerce',
    title: 'WooCommerce',
    summary: 'Online stores on WooCommerce, from first setup to shop and product pages that match the brand.',
    items: ['Store development', 'Product and shop customisation', 'Shipping and payment setup'],
  },
  {
    id: 'shopify',
    title: 'Shopify',
    summary: 'Shopify stores set up and configured so they are ready to sell.',
    items: ['Store setup', 'Product pages', 'Store configuration'],
  },
  {
    id: 'maintenance',
    title: 'Website Maintenance',
    summary: 'Keeping existing sites healthy: fixing what breaks, moving sites safely and making them faster.',
    items: ['Troubleshooting', 'Website migration', 'Performance optimisation', 'Security hardening', 'Technical SEO', 'Page indexing in Google Search Console'],
  },
  {
    id: 'emerging',
    title: 'Emerging Technologies',
    summary: 'Areas I am studying and experimenting with alongside client work. They are not yet established commercial services.',
    items: ['Python automation', 'AI API integration', 'AI chatbot development concepts'],
    emerging: true,
  },
];
