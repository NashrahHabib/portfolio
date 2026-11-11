import { useEffect } from 'react';
import Lenis from 'lenis';
import { prefersReducedMotion, setLenis } from '../../lib/motion';

/**
 * Inertia ("smooth") scrolling for mouse wheels and trackpads. Touch devices keep their own
 * native scrolling, and it is switched off entirely for visitors who prefer reduced motion.
 * Scroll position stays native, so sticky sections and scroll-linked animations work as normal.
 */
export default function SmoothScroll() {
  useEffect(() => {
    if (prefersReducedMotion()) return;
    const lenis = new Lenis({ lerp: 0.11, wheelMultiplier: 0.95, smoothWheel: true });
    setLenis(lenis);
    document.documentElement.classList.add('has-smooth-scroll');

    let frame = requestAnimationFrame(function raf(time) {
      lenis.raf(time);
      frame = requestAnimationFrame(raf);
    });

    return () => {
      cancelAnimationFrame(frame);
      lenis.destroy();
      setLenis(null);
      document.documentElement.classList.remove('has-smooth-scroll');
    };
  }, []);

  return null;
}
