import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'framer-motion';
import { Menu, Moon, Sun, X } from 'lucide-react';
import { nav, site } from '../data/site';
import { useTheme } from '../lib/theme';
import { ease } from '../lib/motion';
import ScrollProgress from './motion/ScrollProgress';

export default function Header() {
  const [open, setOpen] = useState(false);
  const { pathname, hash } = useLocation();

  // Which menu item is current: About is a section of the homepage, so it is matched by its #hash.
  const isCurrent = (to: string) => {
    const [path, anchor] = to.split('#');
    if (anchor) return pathname === (path || '/') && hash === '#' + anchor;
    if (to === '/') return pathname === '/' && !nav.some((n) => n.to.includes('#') && hash === '#' + n.to.split('#')[1]);
    return pathname === to || pathname.startsWith(to + '/');
  };
  const { theme, toggle } = useTheme();

  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);

  useEffect(() => setOpen(false), [pathname]);

  // Slide the header away while scrolling down and bring it back as soon as the visitor scrolls up.
  const { scrollY } = useScroll();
  useMotionValueEvent(scrollY, 'change', (y) => {
    const previous = scrollY.getPrevious() ?? 0;
    setScrolled(y > 8);
    if (Math.abs(y - previous) < 4) return;
    setHidden(y > previous && y > 240);
  });

  // Keep it visible while it has keyboard focus or the menu is open.
  const pinned = open;

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <motion.header
      className={`tone-base fixed inset-x-0 top-0 z-40 border-b border-line transition-shadow duration-300 ${scrolled ? 'shadow-card' : ''}`}
      animate={{ y: hidden && !pinned ? '-100%' : '0%' }}
      transition={{ duration: 0.45, ease: ease.out }}
      onFocusCapture={() => setHidden(false)}
    >
      <ScrollProgress />
      <div className="container-site flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-3 no-underline" aria-label={`${site.name}, home`}>
          <span aria-hidden="true" className="display grid h-9 w-9 place-items-center rounded-input bg-accent text-base text-on-accent">NH</span>
          <span className="display text-xl">{site.name}</span>
        </Link>

        <nav aria-label="Main" className="ml-auto mr-6 hidden md:block">
          <ul className="flex gap-8">
            {nav.map((item) => (
              <li key={item.to}>
                <Link
                  to={item.to}
                  aria-current={isCurrent(item.to) ? 'page' : undefined}
                  className="nav-link py-1 font-medium no-underline"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-1">
          <button
            type="button"
            className="grid h-11 w-11 place-items-center rounded-full"
            aria-pressed={theme === 'dark'}
            aria-label="Dark theme"
            title={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
            onClick={toggle}
          >
            {theme === 'dark' ? <Sun aria-hidden="true" /> : <Moon aria-hidden="true" />}
          </button>
          <button
            type="button"
            className="grid h-11 w-11 place-items-center rounded-full md:hidden"
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? 'Close menu' : 'Open menu'}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.nav
            id="mobile-nav"
            aria-label="Mobile"
            className="tone-base fixed inset-x-0 top-16 h-[calc(100dvh-4rem)] overflow-y-auto md:hidden"
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25 }}
          >
            <ul className="container-site flex flex-col gap-2 py-10">
              {nav.map((item, i) => (
                <motion.li key={item.to} initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.05 * i }}>
                  <Link
                    to={item.to}
                    aria-current={isCurrent(item.to) ? 'page' : undefined}
                    onClick={() => setOpen(false)}
                    className={`display block py-2 text-5xl no-underline ${isCurrent(item.to) ? 'text-accent' : ''}`}
                  >
                    {item.label}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </motion.nav>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
