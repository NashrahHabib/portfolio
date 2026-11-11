import { useRef } from 'react';
import { motion, useAnimationFrame, useMotionValue, useScroll, useSpring, useTransform, useVelocity, wrap } from 'framer-motion';
import { prefersReducedMotion } from '../../lib/motion';

/**
 * A row of large words that drifts sideways on its own and speeds up (or reverses) with the
 * visitor's scrolling, like a ticker tied to the page. Purely decorative: the same words are
 * hidden from screen readers. Stands still for visitors who prefer reduced motion.
 */
function Row({ words, speed, outline }: { words: string[]; speed: number; outline?: boolean }) {
  const base = useMotionValue(0);
  const { scrollY } = useScroll();
  const velocity = useSpring(useVelocity(scrollY), { damping: 50, stiffness: 400 });
  const boost = useTransform(velocity, [-2000, 0, 2000], [-4, 0, 4], { clamp: false });
  const direction = useRef(1);
  const still = useRef(prefersReducedMotion());

  // Four copies of the words; wrapping at -25% makes the loop seamless.
  const x = useTransform(base, (v) => `${wrap(-25, 0, v)}%`);

  useAnimationFrame((_, delta) => {
    if (still.current) return;
    // Scrolling down keeps each row's own direction; scrolling up flips it. Faster scrolling, faster drift.
    const b = boost.get();
    if (b < 0) direction.current = -1;
    else if (b > 0) direction.current = 1;
    base.set(base.get() + direction.current * speed * (1 + Math.abs(b)) * (delta / 1000));
  });

  const item = outline
    ? 'text-transparent [-webkit-text-stroke:1.5px_var(--accent)]'
    : 'text-[color:var(--heading)]';

  return (
    <div className="flex overflow-hidden whitespace-nowrap">
      <motion.div className="flex shrink-0" style={{ x }}>
        {Array.from({ length: 4 }).map((_, copy) => (
          <span key={copy} className="flex shrink-0 items-center">
            {words.map((w) => (
              <span key={w} className={`display flex items-center text-[clamp(2.75rem,8vw,7.5rem)] leading-none ${item}`}>
                <span className="px-[0.35em]">{w}</span>
                <span className="h-[0.18em] w-[0.18em] rounded-full bg-[color:var(--skin)]" />
              </span>
            ))}
          </span>
        ))}
      </motion.div>
    </div>
  );
}

export default function ScrollMarquee({ words, reverseWords }: { words: string[]; reverseWords?: string[] }) {
  return (
    <div aria-hidden="true" className="select-none space-y-3 overflow-hidden py-10 md:space-y-5 md:py-16">
      <Row words={words} speed={-2.2} />
      <Row words={reverseWords ?? words} speed={2.2} outline />
    </div>
  );
}
