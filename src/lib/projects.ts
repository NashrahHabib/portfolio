import { projects, type Project } from '../data/projects';

/** "https://www.example.com/" -> "example.com" (social profiles keep their path). */
export function displayUrl(url: string): string {
  try {
    const u = new URL(url);
    const host = u.hostname.replace(/^www\./, '');
    return /(instagram|facebook)\.com$/.test(host) ? host + u.pathname.replace(/\/$/, '') : host;
  } catch {
    return url;
  }
}

/** Resolves a path inside /public against the site's base URL. */
export const asset = (path: string) => `${import.meta.env.BASE_URL}${path.replace(/^\//, '')}`;

export const featuredProjects = projects.filter((p) => p.featured);
export const findProject = (slug?: string): Project | undefined => projects.find((p) => p.slug === slug);

export function neighbours(project: Project) {
  const i = projects.indexOf(project);
  return {
    previous: projects[(i - 1 + projects.length) % projects.length],
    next: projects[(i + 1) % projects.length],
  };
}

export const visitLabel = (p: Project) => (p.kind === 'social' ? 'View Profile' : 'Visit Website');
