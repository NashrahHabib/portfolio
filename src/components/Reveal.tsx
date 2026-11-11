import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { ease } from '../lib/motion';

type Variant = 'up' | 'left' | 'right' | 'scale';

const from: Record<Variant, Record<string, number | string>> = {
  up: { y: 36 },
  left: { x: -40 },
  right: { x: 40 },
  scale: { scale: 0.94 },
};

/** Content that rises (or slides) into place and comes into focus as it enters the viewport. Plays once. */
export default function Reveal({
  children,
  className,
  delay = 0,
  variant = 'up',
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  variant?: Variant;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, filter: 'blur(8px)', ...from[variant] }}
      whileInView={{ opacity: 1, filter: 'blur(0px)', x: 0, y: 0, scale: 1 }}
      viewport={{ once: true, margin: '0px 0px -10% 0px' }}
      transition={{ duration: 0.9, ease: ease.out, delay }}
    >
      {children}
    </motion.div>
  );
}
