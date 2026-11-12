import { useRef } from 'react';
import { motion, useAnimationFrame, useMotionValue, useScroll, useSpring, useTransform, useVelocity, wrap } from 'framer-motion';
import { allStackItems, stackGroups, type StackItem } from '../data/stack';
import { prefersReducedMotion } from '../lib/motion';
import TechLogo from './TechLogo';
import SplitText from './motion/SplitText';

function Card({ item }: { item: StackItem }) {
  return (
    <div className="flex w-[18rem] shrink-0 items-center gap-4 rounded-[1.25rem] border border-white/10 bg-white/[0.04] p-4 transition-colors duration-300 hover:border-white/30 hover:bg-white/[0.08]">
      <TechLogo item={item} size={52} />
      <div className="min-w-0">
        <p className="flex items-center gap-2 font-semibold leading-tight text-white">
          {item.name}
          {item.learning && <span className="rounded-full bg-[color:var(--skin)] px-2 py-0.5 text-[0.65rem] font-semibold text-[#141532]">Learning</span>}
        </p>
        <p className="mt-0.5 text-sm leading-snug text-white/60">{item.note}</p>
      </div>
    </div>
  );
}

/**
 * One endless row of tool cards. It drifts on its own, speeds up with scrolling (scrolling up
 * flips its direction) and slows to a stop while the pointer is over it.
 */
function Row({ items, speed }: { items: StackItem[]; speed: number }) {
  const base = useMotionValue(0);
  const { scrollY } = useScroll();
  const velocity = useSpring(useVelocity(scrollY), { damping: 50, stiffness: 400 });
  const boost = useTransform(velocity, [-2000, 0, 2000], [-1.5, 0, 1.5], { clamp: false });
  const direction = useRef(1);
  const pace = useRef(1); // eases to 0 on hover
  const hovering = useRef(false);
  const still = useRef(prefersReducedMotion());

  // Three copies of the cards; wrapping at one third makes the loop seamless.
  const x = useTransform(base, (v) => `${wrap(-100 / 3, 0, v)}%`);

  useAnimationFrame((_, delta) => {
    if (still.current) return;
    pace.current += ((hovering.current ? 0 : 1) - pace.current) * Math.min(1, delta / 250);
    const b = boost.get();
    if (b < 0) direction.current = -1;
    else if (b > 0) direction.current = 1;
    base.set(base.get() + direction.current * speed * pace.current * (1 + Math.abs(b)) * (delta / 1000));
  });

  return (
    <div
      className="flex overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_8%,#000_92%,transparent)]"
      onMouseEnter={() => { hovering.current = true; }}
      onMouseLeave={() => { hovering.current = false; }}
    >
      <motion.div className="flex shrink-0 gap-4" style={{ x }}>
        {[0, 1, 2].map((copy) => (
          <div key={copy} className="flex shrink-0 gap-4">
            {items.map((it) => <Card key={it.name} item={it} />)}
          </div>
        ))}
      </motion.div>
    </div>
  );
}

/**
 * Tools and technologies: three rows of logo cards drifting in alternating directions on the
 * dark band. The moving rows are decorative; screen readers get the same tools as a plain list
 * grouped by category.
 */
export default function StackRows() {
  const third = Math.ceil(allStackItems.length / 3);
  const rows = [allStackItems.slice(0, third), allStackItems.slice(third, third * 2), allStackItems.slice(third * 2)];

  return (
    <section id="tools" aria-labelledby="tools-title" className="tone-accent grain section-pad relative scroll-mt-16 overflow-hidden !bg-[color:var(--band-deep)]">
      <div aria-hidden="true" className="orb !absolute left-[calc(50%-18rem)] top-24 h-[36rem] w-[36rem] bg-[#4338CA] opacity-25" />

      <div className="container-site relative text-center">
        <p className="eyebrow">My Stack</p>
        <SplitText id="tools-title" text="The Tools Behind Every *Build*" className="display h-section mx-auto mt-3 max-w-4xl" />
        <p className="lede mx-auto mt-5 max-w-2xl text-white/75">
          The platforms, plugins, languages, hosts and services I use to design, build, launch and look after websites.
        </p>
      </div>

      <div aria-hidden="true" className="relative mt-14 space-y-4">
        <Row items={rows[0]} speed={-0.55} />
        <Row items={rows[1]} speed={0.45} />
        <Row items={rows[2]} speed={-0.6} />
      </div>

      <div className="sr-only">
        {stackGroups.map((g) => (
          <ul key={g.title} aria-label={g.title}>
            {g.items.map((it) => <li key={it.name}>{it.name}: {it.note}{it.learning ? ' (learning)' : ''}</li>)}
          </ul>
        ))}
      </div>
    </section>
  );
}
