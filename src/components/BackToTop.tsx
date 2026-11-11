import { useState } from 'react';
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'framer-motion';
import { ArrowUp } from 'lucide-react';
import { scrollToTarget } from '../lib/motion';

/** Round "back to top" button with a ring that fills as the page is read. Appears after the first screen. */
export default function BackToTop() {
  const { scrollY, scrollYProgress } = useScroll();
  const [show, setShow] = useState(false);
  useMotionValueEvent(scrollY, 'change', (v) => setShow(v > window.innerHeight * 0.9));

  return (
    <AnimatePresence>
      {show && (
        <motion.button
          type="button"
          aria-label="Back to top"
          className="tone-base shadow-card fixed bottom-5 right-5 z-30 grid h-14 w-14 place-items-center rounded-full border border-line md:bottom-8 md:right-8"
          initial={{ opacity: 0, scale: 0.6, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.6, y: 20 }}
          transition={{ type: 'spring', stiffness: 380, damping: 26 }}
          onClick={() => {
            scrollToTarget(0);
            document.getElementById('main')?.focus({ preventScroll: true });
          }}
        >
          <svg aria-hidden="true" viewBox="0 0 56 56" className="absolute inset-0 -rotate-90">
            <motion.circle cx="28" cy="28" r="26" fill="none" stroke="var(--accent)" strokeWidth="2.5" style={{ pathLength: scrollYProgress }} />
          </svg>
          <ArrowUp size={20} aria-hidden="true" />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
