import { useEffect, useRef } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import Header from './Header';
import Footer from './Footer';

export default function Layout() {
  const { pathname } = useLocation();

  const mainRef = useRef<HTMLElement>(null);
  const firstRender = useRef(true);

  // Start each page at the top and move keyboard and screen-reader focus to the new content.
  useEffect(() => {
    window.scrollTo(0, 0);
    if (firstRender.current) firstRender.current = false;
    else mainRef.current?.focus({ preventScroll: true });
  }, [pathname]);

  return (
    <>
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-50 focus:bg-accent focus:px-4 focus:py-2 focus:text-on-accent">
        Skip to content
      </a>
      <Header />
      <motion.main id="main" ref={mainRef} tabIndex={-1} key={pathname} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.35 }}>
        <Outlet />
      </motion.main>
      <Footer />
    </>
  );
}
