import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Menu, Moon, Sun, X } from 'lucide-react';
import { nav, site } from '../data/site';
import { useTheme } from '../lib/theme';

export default function Header() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  const { theme, toggle } = useTheme();

  const [scrolled, setScrolled] = useState(false);

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

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
    <header className={`tone-base fixed inset-x-0 top-0 z-40 border-b border-line transition-shadow duration-300 ${scrolled ? 'shadow-card' : ''}`}>
      <div className="container-site flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-3 no-underline" aria-label={`${site.name}, home`}>
          <span aria-hidden="true" className="display grid h-9 w-9 place-items-center rounded-input bg-accent text-base text-on-accent">NH</span>
          <span className="display text-xl">{site.name}</span>
        </Link>

        <nav aria-label="Main" className="ml-auto mr-6 hidden md:block">
          <ul className="flex gap-8">
            {nav.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  end={item.to === '/'}
                  className={({ isActive }) =>
                    `py-1 font-medium underline-offset-8 decoration-accent decoration-2 hover:underline ${isActive ? 'underline' : 'no-underline'}`
                  }
                >
                  {item.label}
                </NavLink>
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
                  <NavLink
                    to={item.to}
                    end={item.to === '/'}
                    className={({ isActive }) => `display block py-2 text-5xl no-underline ${isActive ? 'text-accent' : ''}`}
                  >
                    {item.label}
                  </NavLink>
                </motion.li>
              ))}
            </ul>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
