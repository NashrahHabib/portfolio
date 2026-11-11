import type { LucideIcon } from 'lucide-react';
import { Bot, Code2, GraduationCap, LineChart, ShoppingBag, Wrench } from 'lucide-react';

export interface SkillGroup {
  title: string;
  /** One line shown under the group title. */
  summary: string;
  icon: LucideIcon;
  skills: string[];
  /** Learning groups are styled differently and labelled "Currently learning". */
  learning?: boolean;
}

export const skillGroups: SkillGroup[] = [
  {
    title: 'Professional skills',
    summary: 'The languages behind every site I build.',
    icon: Code2,
    skills: ['WordPress', 'PHP', 'JavaScript', 'HTML5', 'CSS3', 'MySQL'],
  },
  {
    title: 'CMS and e-commerce',
    summary: 'Platforms I build and customise.',
    icon: ShoppingBag,
    skills: ['WordPress', 'WooCommerce', 'Shopify', 'Elementor', 'Gutenberg'],
  },
  {
    title: 'Development tools',
    summary: 'Fields, version control and deployment.',
    icon: Wrench,
    skills: ['ACF', 'Secure Custom Fields', 'WP-CLI', 'Git', 'GitHub', 'SSH', 'rsync'],
  },
  {
    title: 'SEO and optimisation',
    summary: 'Getting sites found and keeping them fast.',
    icon: LineChart,
    skills: ['Rank Math', 'Google Analytics', 'Google Search Console', 'WebP optimisation', '301 redirects'],
  },
  {
    title: 'AI-assisted development',
    summary: 'How I speed up building and testing.',
    icon: Bot,
    skills: ['Claude', 'Code generation', 'Debugging and QA'],
  },
  {
    title: 'Currently learning',
    summary: 'Study areas, not yet part of my professional experience.',
    icon: GraduationCap,
    skills: ['Python', 'FastAPI', 'AI integration'],
    learning: true,
  },
];
