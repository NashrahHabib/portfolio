import { Check, Wrench } from 'lucide-react';
import { siPython, siShopify, siWoocommerce, siWordpress } from 'simple-icons';
import { services } from '../data/services';
import type { StackItem } from '../data/stack';
import Reveal from './Reveal';
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

/** Tile sizes in the bento grid (large screens): WordPress and WooCommerce on top, the other three below. */
const tiles: Record<string, string> = {
  wordpress: 'lg:col-span-4',
  woocommerce: 'lg:col-span-2',
  shopify: 'lg:col-span-2',
  maintenance: 'lg:col-span-2',
  emerging: 'lg:col-span-2',
};

/**
 * Services as a bento grid on the dark band. Each tile has the service's logo, name, summary and
 * what's included. (The tools' screenshots are in the "At my desk" section.)
 */
export default function ServicesSection() {
  return (
    <section id="services" aria-labelledby="services-title" className="tone-accent grain section-pad relative scroll-mt-16 overflow-hidden !bg-[color:var(--band-deep)]">
      <div aria-hidden="true" className="orb !absolute -left-40 top-20 h-[32rem] w-[32rem] bg-[#4338CA] opacity-25" />

      <div className="container-site relative">
        <div className="grid gap-6 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <p className="eyebrow">Services</p>
            <SplitText id="services-title" text="What I Can *Build* For You" className="display h-section mt-3" />
          </div>
          <p className="lede text-white/75 lg:col-span-5">What I build and look after for clients, and one area I’m growing into.</p>
        </div>

        <ul className="mt-12 grid gap-4 md:mt-16 md:grid-cols-2 lg:grid-cols-6">
          {services.map((s, i) => {
            const big = s.id === 'wordpress';
            const logo = logos[s.id] ?? logos.wordpress;
            return (
              <li key={s.id} id={s.id} className={`${tiles[s.id] ?? 'lg:col-span-2'} ${big ? 'md:col-span-2' : ''}`}>
                <Reveal delay={0.06 * i} variant="scale" className="h-full">
                  <article
                    aria-labelledby={`${s.id}-title`}
                    className={`group relative isolate flex h-full flex-col overflow-hidden rounded-panel border bg-white/[0.04] p-6 outline-offset-4 transition-colors duration-500 hover:border-white/30 hover:bg-white/[0.07] md:p-8 ${
                      s.emerging ? 'border-dashed border-[color:var(--skin)]/50' : 'border-white/10'
                    }`}
                  >
                    {/* The large tile: a faint WordPress mark in the corner */}
                    {big && (
                      <svg
                        aria-hidden="true"
                        viewBox="0 0 24 24"
                        className="pointer-events-none absolute -bottom-16 -right-10 -z-10 hidden h-64 w-64 fill-white/[0.05] transition-transform duration-700 group-hover:rotate-12 motion-reduce:transition-none lg:block"
                      >
                        <path d={siWordpress.path} />
                      </svg>
                    )}
                    <div className="flex items-start justify-between gap-4">
                      <TechLogo item={logo} size={big ? 56 : 48} />
                      {s.emerging && <span className="rounded-full bg-[color:var(--skin)] px-3 py-1 text-xs font-semibold text-[#141532]">Emerging focus</span>}
                    </div>
                    <h3 id={`${s.id}-title`} className={`display mt-5 leading-tight text-white ${big ? 'text-[clamp(1.75rem,2.6vw,2.5rem)]' : 'text-2xl'}`}>{s.title}</h3>
                    <p className={`mt-2 text-white/70 ${big ? 'max-w-lg' : ''}`}>{s.summary}</p>

                    {/* What's included, pinned to the bottom of the tile */}
                    <div aria-hidden="true" className="mt-auto pt-6" />
                    <ul className={`grid gap-x-6 gap-y-2 border-t border-white/10 pt-5 text-sm text-white/80 ${big ? 'sm:grid-cols-2 lg:text-base' : ''}`}>
                      {s.items.map((it) => (
                        <li key={it} className="flex items-start gap-2"><Check size={15} aria-hidden="true" className="mt-0.5 shrink-0 text-[color:var(--skin)]" />{it}</li>
                      ))}
                    </ul>
                  </article>
                </Reveal>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
