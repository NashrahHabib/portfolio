import { useEffect } from 'react';
import { site } from '../data/site';

interface Seo {
  title: string;
  description: string;
  /** Route path, e.g. "/work". Used for the canonical and Open Graph URL. */
  path: string;
}

function setMeta(selector: string, attr: string, value: string) {
  const el = document.head.querySelector(selector);
  if (el) el.setAttribute(attr, value);
}

/** Sets the page title, description, canonical URL and Open Graph tags for a route. */
export function useSeo({ title, description, path }: Seo) {
  useEffect(() => {
    const fullTitle = path === '/' ? title : `${title} | ${site.name}`;
    const url = __SITE_URL__ + (path === '/' ? '/' : path);
    document.title = fullTitle;
    setMeta('meta[name="description"]', 'content', description);
    setMeta('link[rel="canonical"]', 'href', url);
    setMeta('meta[property="og:title"]', 'content', fullTitle);
    setMeta('meta[property="og:description"]', 'content', description);
    setMeta('meta[property="og:url"]', 'content', url);
  }, [title, description, path]);
}
