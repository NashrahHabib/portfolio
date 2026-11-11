import { useCallback, useEffect, useState } from 'react';

export type Theme = 'light' | 'dark';
const KEY = 'theme';

const current = (): Theme => (document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light');

/**
 * Light is the default theme. The visitor's choice is remembered in localStorage and applied
 * before first paint by the small script in index.html.
 */
export function useTheme() {
  const [theme, setTheme] = useState<Theme>(current);

  useEffect(() => {
    if (theme === 'dark') document.documentElement.dataset.theme = 'dark';
    else delete document.documentElement.dataset.theme;
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', theme === 'dark' ? '#0B0C1E' : '#FFFFFF');
    try {
      localStorage.setItem(KEY, theme);
    } catch {
      /* storage unavailable: the choice simply lasts for this visit */
    }
  }, [theme]);

  const toggle = useCallback(() => setTheme((t) => (t === 'dark' ? 'light' : 'dark')), []);
  return { theme, toggle };
}

/** Read-only: the current theme, updated whenever the header toggle changes it. */
export function useCurrentTheme(): Theme {
  const [theme, setTheme] = useState<Theme>(current);
  useEffect(() => {
    const observer = new MutationObserver(() => setTheme(current()));
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    return () => observer.disconnect();
  }, []);
  return theme;
}
