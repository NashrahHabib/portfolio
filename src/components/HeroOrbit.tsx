import type { CSSProperties } from 'react';
import { motion } from 'framer-motion';
import { site, stats } from '../data/site';
import { allStackItems } from '../data/stack';
import { ease } from '../lib/motion';
import TechLogo from './TechLogo';
import CountUp from './motion/CountUp';

const pick = (names: string[]) => names.map((n) => allStackItems.find((i) => i.name === n)!).filter(Boolean);

/** Logos on the inner and outer rings. Edit the names to change them (they come from src/data/stack.ts). */
const inner = pick(['WordPress', 'WooCommerce', 'Shopify', 'Elementor']);
const outer = pick(['PHP', 'JavaScript', 'Figma', 'Stripe', 'PayPal', 'Claude', 'GitHub', 'Gutenberg']);

/** Positions for the three floating stat cards. */
const statPlaces = [
  'left-0 top-[8%] -translate-x-[8%]',
  'right-0 top-[58%] translate-x-[10%]',
  'left-[4%] bottom-[2%]',
];

function Ring({ items, radius, duration, reverse, size }: { items: typeof inner; radius: number; duration: number; reverse?: boolean; size: number }) {
  return (
    <div
      aria-hidden="true"
      className={`orbit-ring absolute inset-0 ${reverse ? 'orbit-reverse' : ''}`}
      style={{ '--orbit-duration': `${duration}s` } as CSSProperties}
    >
      <span className="absolute inset-[var(--inset)] rounded-full border border-dashed border-[color:var(--control)]/40" style={{ '--inset': `${50 - radius}%` } as CSSProperties} />
      {items.map((item, i) => {
        const angle = (360 / items.length) * i;
        return (
          <span
            key={item.name}
            className="absolute left-1/2 top-1/2"
            style={{ transform: `rotate(${angle}deg) translateX(${radius}cqw) rotate(${-angle}deg)` }}
          >
            {/* Counter-rotates so the logo stays upright while the ring turns. */}
            <span className="orbit-upright block -translate-x-1/2 -translate-y-1/2">
              <TechLogo item={item} size={size} />
            </span>
          </span>
        );
      })}
    </div>
  );
}

/**
 * Hero visual: the portrait in the centre, two rings of tool logos turning in opposite
 * directions around it, and the key figures on floating cards. Rings stop for reduced motion.
 */
export default function HeroOrbit({ delay = 0 }: { delay?: number }) {
  return (
    <motion.div
      className="relative mx-auto aspect-square w-full max-w-[34rem] [container-type:inline-size]"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1.1, ease: ease.out, delay }}
    >
      <div aria-hidden="true" className="absolute inset-[18%] rounded-full bg-[radial-gradient(circle,rgba(99,102,241,0.18),transparent_70%)]" />
      <Ring items={outer} radius={46} duration={60} size={46} />
      <Ring items={inner} radius={31} duration={42} reverse size={52} />

      {/* Portrait */}
      {/* Ring and photo share one square box, so both are perfect, concentric circles. */}
      <div className="absolute left-1/2 top-1/2 aspect-square w-[40%] -translate-x-1/2 -translate-y-1/2">
        <span
          aria-hidden="true"
          className="absolute inset-0 rounded-full bg-[conic-gradient(from_0deg,var(--grad-a),var(--grad-b),#38BDF8,var(--grad-b),var(--grad-a))] shadow-card [animation:orbit-spin_8s_linear_infinite] motion-reduce:animate-none"
        />
        <img
          src={site.portrait}
          alt={`Portrait of ${site.name}`}
          className="absolute inset-[5px] aspect-square h-[calc(100%-10px)] w-[calc(100%-10px)] rounded-full border-4 border-[color:var(--bg)] object-cover object-top"
        />
      </div>

      {/* Stat cards */}
      <ul className="contents">
        {stats.map((s, i) => (
          <motion.li
            key={s.label}
            className={`absolute ${statPlaces[i]} z-10 hidden max-w-[13rem] rounded-2xl border border-line bg-paper px-4 py-3 shadow-card sm:block`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: [0, -8, 0] }}
            transition={{
              opacity: { duration: 0.7, delay: delay + 0.5 + i * 0.15 },
              y: { duration: 5 + i, repeat: Infinity, ease: 'easeInOut', delay: delay + i * 0.4 },
            }}
          >
            <CountUp value={s.value} delay={delay + 0.6 + i * 0.15} className="display block text-2xl leading-tight" />
            <span className="block text-xs font-semibold text-muted">{s.label}</span>
          </motion.li>
        ))}
      </ul>

      {/* Phones: the same figures as a tidy row under the orbit, so nothing covers the portrait. */}
      <ul className="absolute inset-x-0 top-full mt-4 grid grid-cols-3 gap-2 sm:hidden">
        {stats.map((s) => (
          <li key={s.label} className="rounded-xl border border-line bg-paper px-2 py-2 text-center shadow-soft">
            <span className="display block text-base leading-tight">{s.value}</span>
            <span className="block text-[0.7rem] leading-snug text-muted">{s.label}</span>
          </li>
        ))}
      </ul>
    </motion.div>
  );
}
