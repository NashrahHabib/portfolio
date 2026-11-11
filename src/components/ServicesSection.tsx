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

/**
 * Services on the homepage (this replaces the old Services page). Each card has the summary and
 * the full list of what's included. The first service is the filled lead card; the emerging one
 * is dashed and labelled so it is never mistaken for an established service.
 */
export default function ServicesSection() {
  return (
    <section id="services" aria-labelledby="services-title" className="tone-alt section-pad scroll-mt-16">
      <div className="container-site">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-muted">Services</p>
          <SplitText id="services-title" text={['What I Can *Build*', 'For You']} className="display h-section mt-3" />
          <p className="lede mt-4 text-muted">What I build and look after for clients, and one area I’m growing into.</p>
        </div>

        <ul className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {services.map((s, i) => {
            const logo = logos[s.id] ?? logos.wordpress;
            const lead = i === 0;
            const box = lead
              ? 'rounded-box bg-accent text-on-accent'
              : s.emerging
                ? 'rounded-box border border-dashed border-accent bg-paper'
                : 'card';
            return (
              <li key={s.id} id={s.id} className={lead ? 'md:col-span-2' : ''}>
                <Reveal delay={0.05 * i} className={`lift spotlight shadow-soft flex h-full flex-col p-6 md:p-8 ${box}`}>
                  <div className="flex items-center justify-between gap-3">
                    <TechLogo item={logo} size={lead ? 64 : 56} />
                    {s.emerging && <span className="tag-learning">Emerging focus</span>}
                  </div>
                  <h3 className={`display mt-5 ${lead ? 'text-2xl md:text-3xl' : 'h-item'}`}>{s.title}</h3>
                  <p className={`mt-2 ${lead ? 'max-w-lg opacity-90' : 'text-muted'}`}>{s.summary}</p>
                  <ul className={`mt-5 grid gap-2 text-sm font-semibold ${lead ? 'sm:grid-cols-2' : ''}`}>
                    {s.items.map((item) => (
                      <li key={item} className="flex items-start gap-2">
                        <Check size={16} aria-hidden="true" className={`mt-0.5 shrink-0 ${lead ? 'text-[#BAE6FD]' : 'text-[color:var(--pop)]'}`} />
                        {item}
                      </li>
                    ))}
                  </ul>
                </Reveal>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
