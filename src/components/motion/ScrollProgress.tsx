import { motion, useScroll, useSpring } from 'framer-motion';

/** Thin bar along the bottom edge of the header that fills as the page is read. */
export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 140, damping: 26, mass: 0.3 });
  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none absolute inset-x-0 bottom-[-1px] h-[3px] origin-left bg-accent"
      style={{ scaleX }}
    />
  );
}
