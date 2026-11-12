import { Check, Wrench } from 'lucide-react';
import { siPython, siShopify, siWoocommerce, siWordpress } from 'simple-icons';
import { services } from '../data/services';
import type { StackItem } from '../data/stack';
import { asset } from '../lib/projects';
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

/** Official screenshots from each platform's own documentation (WordPress, WooCommerce, Shopify, Python). */
const shots: Record<string, string> = {
  wordpress: '/images/editors/wordpress-site-editor.jpg',
  woocommerce: '/images/editors/woocommerce-block-editor.jpg',
  shopify: '/images/editors/shopify-theme-editor.jpg',
  maintenance: '/images/editors/wordpress-updates.jpg',
  emerging: '/images/editors/python-installer.jpg',
};

/** Tile sizes in the bento grid (large screens): WordPress leads, the stores sit beside it, the rest share the bottom row. */
const tiles: Record<string, string> = {
  wordpress: 'lg:col-span-4 lg:row-span-2',
  woocommerce: 'lg:col-span-2',
  shopify: 'lg:col-span-2',
  maintenance: 'lg:col-span-3',
  emerging: 'lg:col-span-3',
};

/**
 * Services as a bento grid on the dark band. Each tile has the service's logo, name and summary,
 * and its official screenshot. Pointing at (or tabbing into) a tile zooms the screenshot and
 * slides up what's included; on touch screens the included list is shown under the summary.
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

        <ul className="mt-12 grid gap-4 md:grid-cols-2 lg:mt-16 lg:grid-cols-6">
          {services.map((s, i) => {
            const big = s.id === 'wordpress';
            const logo = logos[s.id] ?? logos.wordpress;
            return (
              <li key={s.id} id={s.id} className={`${tiles[s.id] ?? 'lg:col-span-2'} ${big ? 'md:col-span-2' : ''}`}>
                <Reveal delay={0.06 * i} variant="scale" className="h-full">
                  <article
                    tabIndex={0}
                    aria-labelledby={`${s.id}-title`}
                    className={`group flex h-full flex-col overflow-hidden rounded-panel border bg-white/[0.04] p-6 outline-offset-4 transition-colors duration-500 hover:border-white/30 hover:bg-white/[0.07] md:p-7 ${
                      s.emerging ? 'border-dashed border-[color:var(--skin)]/50' : 'border-white/10'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <TechLogo item={logo} size={big ? 56 : 48} />
                      {s.emerging && <span className="rounded-full bg-[color:var(--skin)] px-3 py-1 text-xs font-semibold text-[#141532]">Emerging focus</span>}
                    </div>
                    <h3 id={`${s.id}-title`} className={`display mt-5 leading-tight text-white ${big ? 'text-[clamp(1.75rem,2.6vw,2.5rem)]' : 'text-2xl'}`}>{s.title}</h3>
                    <p className={`mt-2 text-white/70 ${big ? 'max-w-lg' : ''}`}>{s.summary}</p>

                    {/* Touch screens: what's included, as a list */}
                    {/* The large tile always lists it; the others list it on touch screens only */}
                    <ul className={`grid gap-1.5 text-sm text-white/80 ${big ? 'mt-6 gap-x-6 gap-y-2 sm:grid-cols-2 lg:text-base' : 'mt-4 [@media(hover:hover)]:hidden'}`}>
                      {s.items.map((it) => (
                        <li key={it} className="flex items-start gap-2"><Check size={15} aria-hidden="true" className="mt-0.5 shrink-0 text-[color:var(--skin)]" />{it}</li>
                      ))}
                    </ul>

                    {/* Screenshot, with what's included sliding up over it on hover or focus */}
                    <div className="mt-auto pt-6" />
                    <div className="relative aspect-[16/9] overflow-hidden rounded-xl border border-white/10 bg-white">
                      <img
                        src={asset(shots[s.id])}
                        alt={`${s.title}: screenshot from the official documentation`}
                        loading="lazy"
                        className="absolute inset-0 h-full w-full object-cover object-left-top transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.06] group-focus-visible:scale-[1.06] motion-reduce:transition-none"
                      />
                      {!big && <div
                        aria-hidden="true"
                        className="absolute inset-x-0 bottom-0 hidden translate-y-full bg-gradient-to-t from-[#0D0E24] via-[#0D0E24]/95 to-[#0D0E24]/70 p-5 pt-8 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-y-0 group-focus-visible:translate-y-0 motion-reduce:transition-none [@media(hover:hover)]:block"
                      >
                        <ul className="grid gap-1.5 text-sm text-white/90">
                          {s.items.map((it) => (
                            <li key={it} className="flex items-start gap-2"><Check size={15} className="mt-0.5 shrink-0 text-[color:var(--skin)]" />{it}</li>
                          ))}
                        </ul>
                      </div>}
                    </div>
                    {/* Screen readers on mouse devices: the included list, once */}
                    {!big && (
                      <ul className="sr-only hidden [@media(hover:hover)]:block">
                        {s.items.map((it) => <li key={it}>{it}</li>)}
                      </ul>
                    )}
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
