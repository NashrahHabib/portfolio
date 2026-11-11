/** Profile, navigation and career content. Edit text here; no component changes needed. */
import portrait from '../assets/portrait.jpg';

export const site = {
  name: 'Nashrah Habib',
  title: 'WordPress Developer',
  tagline: 'WordPress Developer | Custom Themes | WooCommerce | Shopify | Web Engineering',
  location: 'Lahore, Pakistan',
  availability: 'Available for remote projects worldwide',
  email: 'nashrahhabib@gmail.com',
  linkedin: 'https://linkedin.com/in/nashrahhabib',
  /** Portrait photo. To change it, replace src/assets/portrait.jpg (4:5 portrait orientation). */
  portrait,
  /**
   * Contact form endpoint (for example a Formspree or Web3Forms URL). Set it with the
   * VITE_FORM_ENDPOINT environment variable. While it is empty the form opens an email draft.
   */
  formEndpoint: (import.meta.env.VITE_FORM_ENDPOINT as string | undefined) || '',
};

export const nav = [
  { label: 'Home', to: '/' },
  { label: 'About', to: '/about' },
  { label: 'Portfolio', to: '/portfolio' },
  { label: 'Services', to: '/services' },
  { label: 'Contact', to: '/contact' },
];

export const stats = [
  { value: '4+', label: 'Years Experience' },
  { value: '200+', label: 'Websites Built & Managed' },
  { value: 'USA, UK, Europe', label: 'International Client Experience' },
];

export const experience = [
  { period: 'May 2026 – Present', company: 'Vision Craft Technologies', role: 'WordPress Developer', note: 'Contracted to HjemmesideHelten, Norway.' },
  { period: 'January 2025 – June 2026', company: 'SMCSE Solutions', role: 'WordPress Developer', note: '' },
  { period: 'October 2021 – May 2023', company: 'SMCSE Solutions', role: 'WordPress Developer', note: '' },
];

export const education = [
  { period: '2015 – 2019', title: 'BS Computer Science', place: 'Lahore College for Women University' },
];
