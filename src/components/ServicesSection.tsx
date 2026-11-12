import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Check, Plus, Wrench } from 'lucide-react';
import { siPython, siShopify, siWoocommerce, siWordpress } from 'simple-icons';
import { services } from '../data/services';
import type { StackItem } from '../data/stack';
import { ease } from '../lib/motion';
import TechLogo from './TechLogo';
import SplitText from './motion/SplitText';

/** The official logo for each service (a line icon where there is no brand, such as maintenance). */
const logos: Record<string, StackItem> = {
  wordpress: { name: 'WordPress', note: '', logo: siWordpress },
  woocommerce: { name: 'WooCommerce', note: '', logo: siWoocommerce, scale: 1.85 },
  shopify: { name: 'Shopify', note: '', logo: siShopify },
  maintenance: { name: 'Maintenance', note: '', icon: Wrench },
  emerging: { name: 'Python', note: '', logo: siPython },
};

const pad = (n: number) => String(n).padStart(2, '0');

/**
 * Services as big accordion rows: each service name is a large line in a list. Pointing at a row
 * fills its name with the gradient and slides its logo in; clicking (or Enter) opens the row to
 * show the summary and everything included. One row is open at a time; the first starts open.
 */
export default function ServicesSection() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="services" aria-labelledby="services-title" className="tone-base section-pad scroll-mt-16">
      <div className="container-site">
        <div className="grid gap-6 md:grid-cols-12 md:items-end md:gap-8">
          <div className="md:col-span-7">
            <p className="eyebrow">Services</p>
            <SplitText id="services-title" text="What I Can *Build* For You" className="display h-section mt-3" />
          </div>
          <p className="lede text-muted md:col-span-5">What I build and look after for clients, and one area I’m growing into.</p>
        </div>

        <ul className="mt-12 border-t border-line md:mt-16">
          {services.map((s, i) => {
            const on = open === i;
            const logo = logos[s.id] ?? logos.wordpress;
            return (
              <li key={s.id} id={s.id} className="group border-b border-line">
                <h3>
                  <button
                    type="button"
                    aria-expanded={on}
                    aria-controls={`${s.id}-panel`}
                    onClick={() => setOpen(on ? null : i)}
                    className="grid w-full grid-cols-[auto_1fr_auto] items-center gap-x-4 py-6 text-left md:gap-x-8 md:py-8"
                  >
                    <span className="display text-sm text-[color:var(--label)]">{pad(i + 1)}</span>

                    {/* The name: a plain copy, with a gradient copy wiping in on hover or when open */}
                    <span className="relative block">
                      <span className="display block text-[clamp(1.6rem,3.6vw,3.25rem)] leading-tight">
                        {s.title}
                        {s.emerging && <span className="tag-learning ml-3 align-middle font-sans !text-xs !tracking-normal">Emerging focus</span>}
                      </span>
                      <span
                        aria-hidden="true"
                        className={`display hl absolute inset-0 block text-[clamp(1.6rem,3.6vw,3.25rem)] leading-tight transition-[clip-path] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none ${
                          on ? '[clip-path:inset(0_0_0_0)]' : '[clip-path:inset(0_100%_0_0)] group-hover:[clip-path:inset(0_0_0_0)]'
                        }`}
                      >
                        {s.title}
                      </span>
                    </span>

                    <span className="flex items-center gap-4">
                      <span
                        className={`hidden transition-[opacity,transform] duration-500 sm:block ${
                          on ? 'translate-x-0 opacity-100' : 'translate-x-4 opacity-0 group-hover:translate-x-0 group-hover:opacity-100'
                        }`}
                      >
                        <TechLogo item={logo} size={52} />
                      </span>
                      <span
                        aria-hidden="true"
                        className={`grid h-11 w-11 place-items-center rounded-full border transition-[transform,background-color,color] duration-500 ${
                          on ? 'rotate-45 border-transparent bg-accent text-on-accent' : 'border-line'
                        }`}
                      >
                        <Plus size={20} />
                      </span>
                    </span>
                  </button>
                </h3>

                <AnimatePresence initial={false}>
                  {on && (
                    <motion.div
                      id={`${s.id}-panel`}
                      key="panel"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.55, ease: ease.out }}
                      className="overflow-hidden"
                    >
                      <div className="grid gap-6 pb-8 md:grid-cols-[auto_1fr_1fr] md:gap-x-8 md:pb-10">
                        {/* Keeps the details lined up with the name, not the number */}
                        <span aria-hidden="true" className="hidden w-[1.6rem] md:block" />
                        <p className="max-w-md text-muted">{s.summary}</p>
                        <ul className="grid gap-2 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2">
                          {s.items.map((item) => (
                            <li key={item} className="flex items-start gap-2 text-base">
                              <Check size={18} aria-hidden="true" className="mt-1.5 shrink-0 text-[color:var(--pop)]" />
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
