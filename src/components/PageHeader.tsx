import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { ease, enterDelay } from '../lib/motion';
import SplitText from './motion/SplitText';

/** Title band at the top of every inner page: the title rises in word by word as the page curtain lifts. */
export default function PageHeader({ title, children }: { title: string; children?: ReactNode }) {
  const start = enterDelay();
  return (
    <section className="tone-base relative overflow-hidden pt-16">
      <div aria-hidden="true" className="orb -right-32 -top-10 h-96 w-96 bg-[color:var(--skin)] opacity-30" />
      <div className="container-site relative pb-14 pt-16 md:pb-20 md:pt-24">
        <SplitText as="h1" trigger="load" text={title} delay={start} className="display h-page max-w-[26ch]" />
        <motion.span
          aria-hidden="true"
          className="mt-8 block h-[3px] w-24 origin-left rounded-full bg-accent"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.9, ease: ease.out, delay: start + 0.35 }}
        />
        {children && (
          <motion.div
            className="lede mt-8 max-w-2xl text-muted"
            initial={{ opacity: 0, y: 20, filter: 'blur(6px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 0.9, ease: ease.out, delay: start + 0.3 }}
          >
            {children}
          </motion.div>
        )}
      </div>
    </section>
  );
}
