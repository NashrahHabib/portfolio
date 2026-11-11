import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { site } from '../../data/site';
import { ease, isFirstPage, markPageShown, prefersReducedMotion } from '../../lib/motion';

/**
 * A green panel that wipes upwards off the screen whenever a page opens. On the first visit it
 * holds for a moment with the monogram, like a short intro. It never blocks clicks and is
 * skipped for visitors who prefer reduced motion. Render it with `key={pathname}`.
 */
export default function PageCurtain() {
  const [first] = useState(isFirstPage);
  const [done, setDone] = useState(prefersReducedMotion);

  useEffect(() => {
    // Mark after the first page has rendered, so the next page uses the short wipe.
    const t = window.setTimeout(markPageShown, 50);
    return () => window.clearTimeout(t);
  }, []);

  if (done) return null;

  return (
    <motion.div
      aria-hidden="true"
      className="band-deep pointer-events-none fixed inset-0 z-[70] grid origin-top place-items-center"
      initial={{ scaleY: 1 }}
      animate={{ scaleY: 0 }}
      transition={{ duration: first ? 0.9 : 0.7, ease: ease.inOut, delay: first ? 0.55 : 0.05 }}
      onAnimationComplete={() => setDone(true)}
    >
      {first && (
        <motion.span
          className="display flex items-center gap-4 text-4xl text-[color:var(--skin)] md:text-5xl"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: [0, 1, 1, 0], y: [24, 0, 0, -24] }}
          transition={{ duration: 1.1, times: [0, 0.35, 0.7, 1], ease: ease.out }}
        >
          <span className="grid h-14 w-14 place-items-center rounded-input bg-[color:var(--skin)] text-2xl text-[#141532]">NH</span>
          {site.name}
        </motion.span>
      )}
    </motion.div>
  );
}
