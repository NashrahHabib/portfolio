import { useEffect, useRef } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import Header from './Header';
import Footer from './Footer';
import BackToTop from './BackToTop';
import PageCurtain from './motion/PageCurtain';
import PointerEffects from './motion/PointerEffects';
import SmoothScroll from './motion/SmoothScroll';
import { scrollToTarget } from '../lib/motion';

export default function Layout() {
  const { pathname, hash } = useLocation();

  const mainRef = useRef<HTMLElement>(null);
  const firstRender = useRef(true);

  // Start each page at the top and move keyboard and screen-reader focus to the new content.
  useEffect(() => {
    if (!hash) scrollToTarget(0, true);
    if (firstRender.current) firstRender.current = false;
    else if (!hash) mainRef.current?.focus({ preventScroll: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, hash]);

  // Links such as /#about scroll to that section (after the page has rendered) and move focus there.
  useEffect(() => {
    if (!hash) return;
    // On a fresh page load the layout is still settling (fonts, curtain), so wait a little longer and jump.
    const fresh = performance.now() < 4000;
    const t = window.setTimeout(() => {
      const el = document.getElementById(decodeURIComponent(hash.slice(1)));
      if (!el) return;
      scrollToTarget(el, fresh);
      el.setAttribute('tabindex', '-1');
      el.focus({ preventScroll: true });
    }, fresh ? 900 : 120);
    return () => window.clearTimeout(t);
  }, [pathname, hash]);

  // Clicking a link to the section you are already on (same #hash) does not change the address,
  // so the browser would do nothing. Scroll to it anyway.
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const a = (e.target as Element | null)?.closest?.('a[href]') as HTMLAnchorElement | null;
      // The router's Link has usually handled (and prevented) this click already; it changes nothing, so scroll here.
      if (!a || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const url = new URL(a.href, window.location.href);
      if (!url.hash || url.origin !== window.location.origin) return;
      if (url.pathname !== window.location.pathname || url.hash !== window.location.hash) return;
      const el = document.getElementById(decodeURIComponent(url.hash.slice(1)));
      if (!el) return;
      e.preventDefault();
      scrollToTarget(el);
    };
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, []);

  return (
    <>
      <SmoothScroll />
      <PointerEffects />
      <PageCurtain key={`curtain-${pathname}`} />
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-50 focus:bg-[color:var(--grad-a)] focus:px-4 focus:py-2 focus:text-white">
        Skip to content
      </a>
      <Header />
      <motion.main id="main" ref={mainRef} tabIndex={-1} key={pathname} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.35 }}>
        <Outlet />
      </motion.main>
      <Footer />
      <BackToTop />
    </>
  );
}
