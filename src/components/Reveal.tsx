import type { ReactNode } from 'react';
import { motion } from 'framer-motion';

/** Fades content in once as it enters the viewport. Used sparingly. */
export default function Reveal({ children, className, delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -10% 0px' }}
      transition={{ duration: 0.7, ease: [0.2, 0.7, 0.1, 1], delay }}
    >
      {children}
    </motion.div>
  );
}
