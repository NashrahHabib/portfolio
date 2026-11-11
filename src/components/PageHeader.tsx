import type { ReactNode } from 'react';
import { motion } from 'framer-motion';

/** Dark title band at the top of every inner page. */
export default function PageHeader({ title, children }: { title: string; children?: ReactNode }) {
  return (
    <section className="tone-base pt-16">
      <div className="container-site pb-14 pt-16 md:pb-20 md:pt-24">
        <motion.h1 className="display h-page max-w-[26ch]" initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: [0.2, 0.7, 0.1, 1] }}>
          {title}
        </motion.h1>
        {children && <div className="lede mt-8 max-w-2xl text-muted">{children}</div>}
      </div>
    </section>
  );
}
