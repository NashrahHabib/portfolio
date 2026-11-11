import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useInView } from 'framer-motion';
import { site } from '../data/site';
import { stackGroups } from '../data/stack';
import { ease, prefersReducedMotion } from '../lib/motion';
import TechLogo from './TechLogo';
import SplitText from './motion/SplitText';

type Line = { x1: number; y1: number; x2: number; y2: number };

/**
 * "My stack" hub: the portrait in the middle, tool groups around it, joined by lines. The groups
 * take turns being "In use": that line animates, a dot travels along it, and the speech bubble
 * says what the tools are being used for. Hovering or focusing a card selects it. On phones the
 * cards stack under the portrait without lines.
 */
export default function StackHub() {
  const groups = stackGroups.slice(0, 6);
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [lines, setLines] = useState<Line[]>([]);
  const wrap = useRef<HTMLDivElement>(null);
  const hub = useRef<HTMLDivElement>(null);
  const cards = useRef<(HTMLElement | null)[]>([]);
  const inView = useInView(wrap, { margin: '-20% 0px -20% 0px' });

  // Cycle through the groups while the section is on screen.
  useEffect(() => {
    if (!inView || paused) return;
    const t = window.setInterval(() => setActive((a) => (a + 1) % groups.length), prefersReducedMotion() ? 6000 : 3200);
    return () => window.clearInterval(t);
  }, [inView, paused, groups.length]);

  // Measure where the lines start (hub centre) and end (inner edge of each card).
  const measure = useCallback(() => {
      const box = wrap.current?.getBoundingClientRect();
      const h = hub.current?.getBoundingClientRect();
      if (!box || !h || window.innerWidth < 1024) { setLines([]); return; }
      const cx = h.left + h.width / 2 - box.left;
      const cy = h.top + h.height / 2 - box.top;
      setLines(cards.current.map((el, i) => {
        const r = el!.getBoundingClientRect();
        const left = i % 2 === 0;
        return { x1: cx, y1: cy, x2: (left ? r.right : r.left) - box.left, y2: r.top + r.height / 2 - box.top };
      }));
  }, []);

  useLayoutEffect(() => {
    measure();
    const ro = new ResizeObserver(measure);
    if (wrap.current) ro.observe(wrap.current);
    window.addEventListener('resize', measure);
    return () => { ro.disconnect(); window.removeEventListener('resize', measure); };
  }, [measure]);

  // Measure again once the cards have finished sliding into place.
  useEffect(() => {
    if (!inView) return;
    const t = window.setTimeout(measure, 1000);
    return () => window.clearTimeout(t);
  }, [inView, measure]);

  const card = (i: number) => {
    const g = groups[i];
    const on = i === active;
    return (
      <motion.article
        key={g.title}
        ref={(el: HTMLElement | null) => { cards.current[i] = el; }}
        tabIndex={0}
        aria-current={on ? 'true' : undefined}
        onMouseEnter={() => { setActive(i); setPaused(true); }}
        onMouseLeave={() => setPaused(false)}
        onFocus={() => { setActive(i); setPaused(true); }}
        onBlur={() => setPaused(false)}
        className={`relative rounded-[1.25rem] border p-4 transition-[border-color,box-shadow,opacity] duration-500 md:p-5 ${
          on
            ? 'border-[color:var(--pop)] bg-paper opacity-100 shadow-[0_18px_40px_-18px_rgba(79,70,229,0.45)]'
            : 'border-line bg-paper opacity-100 shadow-soft lg:opacity-60'
        }`}
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, ease: ease.out, delay: 0.08 * i }}
      >
        <div className="flex items-start gap-3">
          <div className="flex shrink-0 -space-x-3">
            {g.items.slice(0, 3).map((it, k) => (
              <TechLogo key={it.name} item={it} size={40} className={k > 0 ? 'ring-2 ring-[color:var(--bg)]' : ''} />
            ))}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-2">
              <h3 className="display text-lg leading-tight">{g.title}</h3>
              <span
                className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                  on ? 'bg-[color:var(--pop-soft)] text-ink' : 'bg-[color:var(--bg-alt)] text-muted'
                }`}
              >
                {on && <span aria-hidden="true" className="h-2.5 w-2.5 animate-spin rounded-full border-2 border-current border-t-transparent motion-reduce:animate-none" />}
                {on ? 'In use' : 'Ready'}
              </span>
            </div>
            <p className="mt-1 text-sm text-muted">{g.summary}</p>
          </div>
        </div>
        <div aria-hidden="true" className="mt-4 h-1 overflow-hidden rounded-full bg-[color:var(--bg-alt)]">
          {on && (
            <motion.div
              key={`bar-${active}`}
              className="h-full rounded-full bg-accent"
              initial={{ width: '0%' }}
              animate={{ width: '100%' }}
              transition={{ duration: 3.1, ease: 'linear' }}
            />
          )}
        </div>
      </motion.article>
    );
  };

  const left = [0, 2, 4];
  const right = [1, 3, 5];
  const current = groups[active];

  return (
    <section id="tools" aria-labelledby="stack-title" className="tone-base section-pad scroll-mt-16 overflow-hidden !pb-12">
      <div className="container-site">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-muted">My Stack</p>
          <SplitText id="stack-title" text={['The Tools Behind', 'Every *Build*']} className="display h-section mt-3" />
          <p className="lede mt-5 text-muted">The platforms, languages and services I use to design, build, launch and look after websites.</p>
        </div>

        <div ref={wrap} className="relative mt-14 grid gap-4 lg:mt-20 lg:grid-cols-[1fr_minmax(18rem,22rem)_1fr] lg:gap-x-10 lg:gap-y-6">
          {/* Lines (large screens) */}
          {lines.length > 0 && (
            <svg aria-hidden="true" className="pointer-events-none absolute inset-0 h-full w-full overflow-visible">
              {lines.map((l, i) => (
                <line key={`base-${i}`} x1={l.x1} y1={l.y1} x2={l.x2} y2={l.y2} stroke="var(--control)" strokeOpacity="0.45" strokeWidth="1.5" strokeDasharray="2 6" strokeLinecap="round" />
              ))}
              {lines[active] && (
                <g key={`active-${active}`}>
                  <motion.line
                    x1={lines[active].x1} y1={lines[active].y1} x2={lines[active].x2} y2={lines[active].y2}
                    stroke="var(--pop)" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="10 8"
                    initial={{ pathLength: 0, strokeDashoffset: 0 }}
                    animate={{ pathLength: 1, strokeDashoffset: -72 }}
                    transition={{ pathLength: { duration: 0.6, ease: ease.out }, strokeDashoffset: { duration: 2.4, repeat: Infinity, ease: 'linear' } }}
                  />
                  <motion.circle
                    r="6" fill="var(--pop)" stroke="var(--bg)" strokeWidth="2"
                    initial={{ cx: lines[active].x1, cy: lines[active].y1 }}
                    animate={{ cx: [lines[active].x1, lines[active].x2], cy: [lines[active].y1, lines[active].y2] }}
                    transition={{ duration: 1.6, repeat: Infinity, repeatDelay: 0.4, ease: 'easeInOut' }}
                  />
                </g>
              )}
            </svg>
          )}

          {/* Left column */}
          <div className="order-2 grid gap-4 sm:grid-cols-2 lg:order-1 lg:grid-cols-1 lg:gap-6">{left.map(card)}</div>

          {/* Centre */}
          <div className="order-1 flex flex-col items-center justify-center py-6 lg:order-2">
            <div ref={hub} className="relative grid place-items-center">
              <span aria-hidden="true" className="absolute h-[19rem] w-[19rem] rounded-full border border-line" />
              <span aria-hidden="true" className="absolute h-[15rem] w-[15rem] rounded-full bg-[radial-gradient(circle,rgba(99,102,241,0.22),transparent_70%)]" />
              <motion.div
                className="relative h-40 w-40 overflow-hidden rounded-full border-4 border-[color:var(--bg)] shadow-card"
                animate={prefersReducedMotion() ? undefined : { y: [0, -8, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
              >
                <img src={site.portrait} alt="" className="h-full w-full object-cover object-top" />
              </motion.div>
            </div>
            <p className="display mt-8 text-2xl">{site.name}</p>
            <p className="text-muted">{site.title}</p>
            <div className="relative mt-5 w-full max-w-sm rounded-[1.25rem] border border-line bg-paper px-5 py-4 text-center shadow-soft">
              <span aria-hidden="true" className="absolute -top-[7px] left-1/2 h-3 w-3 -translate-x-1/2 rotate-45 border-l border-t border-line bg-paper" />
              <AnimatePresence mode="wait">
                <motion.p
                  key={active}
                  className="font-semibold"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.35 }}
                >
                  {current.activity}
                </motion.p>
              </AnimatePresence>
            </div>
          </div>

          {/* Right column */}
          <div className="order-3 grid gap-4 sm:grid-cols-2 lg:grid-cols-1 lg:gap-6">{right.map(card)}</div>
        </div>
      </div>
    </section>
  );
}
