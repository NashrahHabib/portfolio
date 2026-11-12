import { useRef, useState } from 'react';
import { AnimatePresence, LayoutGroup, motion } from 'framer-motion';
import { stackGroups, type StackItem } from '../data/stack';
import { ease, hasFinePointer } from '../lib/motion';
import TechLogo from './TechLogo';
import SplitText from './motion/SplitText';

const ALL = 'All';

/**
 * Tools and technologies as a glowing grid: every tool is a tile on a dark band, a soft light
 * follows the pointer and lights up the edges of nearby tiles, and the category chips filter
 * the grid (tiles glide into place). Touch screens get the same grid without the light.
 */
export default function StackGrid() {
  const [group, setGroup] = useState(ALL);
  const grid = useRef<HTMLUListElement>(null);
  const [fine] = useState(() => hasFinePointer());

  const items: (StackItem & { group: string })[] = stackGroups.flatMap((g) => g.items.map((i) => ({ ...i, group: g.title })));
  const shown = group === ALL ? items : items.filter((i) => i.group === group);

  // Pass the pointer position to every tile so each can light the part of its edge nearest to it.
  const onMove = (e: React.PointerEvent) => {
    if (!fine || !grid.current) return;
    for (const tile of Array.from(grid.current.children) as HTMLElement[]) {
      const r = tile.getBoundingClientRect();
      tile.style.setProperty('--x', `${e.clientX - r.left}px`);
      tile.style.setProperty('--y', `${e.clientY - r.top}px`);
    }
  };

  const chip = (on: boolean) =>
    `rounded-btn border px-3.5 py-1.5 text-sm font-semibold transition-colors ${
      on ? 'border-transparent bg-white text-[#141532]' : 'border-white/20 text-white/80 hover:border-white/50 hover:text-white'
    }`;

  return (
    <section id="tools" aria-labelledby="tools-title" className="tone-accent grain section-pad relative scroll-mt-16 overflow-hidden !bg-[color:var(--band-deep)]">
      <div aria-hidden="true" className="orb !absolute left-[calc(50%-18rem)] top-24 h-[36rem] w-[36rem] bg-[#4338CA] opacity-25" />

      <div className="container-site relative">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[color:var(--skin)]">My Stack</p>
          <SplitText id="tools-title" text={['The Tools Behind', 'Every *Build*']} className="display h-section mt-3" />
          <p className="lede mt-5 text-white/75">The platforms, plugins, languages, hosts and services I use to design, build, launch and look after websites.</p>
        </div>

        <div className="mt-10 flex flex-wrap justify-center gap-2" role="group" aria-label="Filter by category">
          {[ALL, ...stackGroups.map((g) => g.title)].map((t) => (
            <button key={t} type="button" className={chip(group === t)} aria-pressed={group === t} onClick={() => setGroup(t)}>
              {t}
              <span className="ml-1.5 opacity-60">{t === ALL ? items.length : items.filter((i) => i.group === t).length}</span>
            </button>
          ))}
        </div>

        <LayoutGroup>
          <ul
            ref={grid}
            onPointerMove={onMove}
            className="glow-grid mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6"
            aria-label={group === ALL ? 'All tools' : group}
          >
            <AnimatePresence mode="popLayout" initial={false}>
              {shown.map((item, i) => (
                <motion.li
                  key={item.name}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.45, ease: ease.out, delay: Math.min(i, 12) * 0.015 }}
                  className="glow-tile group flex min-h-[9.5rem] flex-col items-start rounded-box p-4"
                >
                  <TechLogo item={item} size={48} className="transition-transform duration-300 group-hover:-translate-y-0.5" />
                  <p className="mt-auto pt-4 font-bold leading-tight text-white">
                    {item.name}
                    {item.learning && <span className="ml-2 rounded-full bg-[color:var(--skin)] px-2 py-0.5 align-middle text-[0.65rem] font-bold text-[#141532]">Learning</span>}
                  </p>
                  <p className="mt-1 text-xs leading-snug text-white/60">{item.note}</p>
                </motion.li>
              ))}
            </AnimatePresence>
          </ul>
        </LayoutGroup>
      </div>
    </section>
  );
}
