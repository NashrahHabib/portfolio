import { useRef, useState, type ReactNode } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { prefersReducedMotion } from '../../lib/motion';

/**
 * Section-to-section transition for the dark bands. As a band scrolls up into view it starts as
 * a rounded "window" inset from the page edges and opens out to full width; as it scrolls away
 * it closes back into a rounded window, so the light section after it slides in around it.
 * Uses clip-path only (no transforms), so sticky and pinned content inside keeps working.
 */
export default function BandReveal({ children, exit = true }: { children: ReactNode; exit?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const [still] = useState(prefersReducedMotion);

  const { scrollYProgress: inP } = useScroll({ target: ref, offset: ['start end', 'start 15%'] });
  const { scrollYProgress: outP } = useScroll({ target: ref, offset: ['end 85%', 'end start'] });

  const clipPath = useTransform([inP, outP], ([a, b]: number[]) => {
    if (still) return 'none';
    // 0 = fully open, 1 = fully closed into a window
    const top = 1 - a;
    const bottom = exit ? b : 0;
    const side = Math.max(top, bottom) * 4; // % from each side
    const r = Math.max(top, bottom) * 56;   // corner radius in px
    return `inset(${top * 90}px ${side}% ${bottom * 90}px ${side}% round ${r}px)`;
  });

  return (
    <motion.div ref={ref} style={{ clipPath }}>
      {children}
    </motion.div>
  );
}
