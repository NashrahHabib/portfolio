import { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, ArrowUpRight, Shuffle } from 'lucide-react';
import type { Project } from '../data/projects';
import { asset, visitLabel } from '../lib/projects';
import { ease } from '../lib/motion';
import ProjectFrame from './ProjectFrame';
import { projectLine } from './ProjectHoverList';

const pad = (n: number) => String(n).padStart(2, '0');

function shuffled<T>(list: T[]): T[] {
  const a = [...list];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** A small tilted screenshot, used in the two stacks. */
function StackCard({ project, depth, corner }: { project: Project; depth: number; corner: 'top' | 'bottom' }) {
  const dir = corner === 'top' ? -1 : 1;
  return (
    <motion.div
      layout
      layoutId={`stack-${project.id}`}
      className="absolute left-0 top-0 w-full overflow-hidden rounded-[0.6rem] border border-white/40 bg-frame shadow-card"
      style={{ zIndex: 10 - depth }}
      initial={{ opacity: 0, x: dir * 40, y: dir * 40 }}
      animate={{ opacity: 1 - depth * 0.12, x: depth * 18 * -dir, y: depth * 18 * dir }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.7, ease: ease.out }}
    >
      {project.image ? (
        <img src={asset(project.image)} alt="" loading="lazy" className="aspect-[16/10] w-full object-cover object-top" />
      ) : (
        <span className="display grid aspect-[16/10] place-items-center bg-[color:var(--band)] text-sm text-white">{project.name}</span>
      )}
    </motion.div>
  );
}

/**
 * Full-screen project viewer: one project at a time with its screenshot in the middle, its
 * details on the left and its description on the right. Projects already seen collect in a
 * tilted stack at the top left; the ones coming up wait at the bottom right. Move with the
 * scroll wheel or trackpad (large screens), swipe (touch), the arrow keys, or the buttons, and
 * "Mix" shuffles the order. At the last project, scrolling carries on down the page as normal.
 */
export default function WorkViewer({ projects }: { projects: Project[] }) {
  const [order, setOrder] = useState(projects);
  const [pos, setPos] = useState(0);
  const [dir, setDir] = useState(1);
  const section = useRef<HTMLElement>(null);
  const lock = useRef(0);
  const dragged = useRef(false); // a swipe must not also open the project
  const count = order.length;
  const p = order[pos];

  const go = useCallback((step: number) => {
    setPos((cur) => {
      const next = cur + step;
      if (next < 0 || next >= count) return cur;
      setDir(step);
      return next;
    });
  }, [count]);

  const mix = () => {
    setDir(1);
    setOrder((o) => shuffled(o));
    setPos(0);
  };

  // Scroll wheel / trackpad turns the page while the viewer fills the screen (large screens only).
  useEffect(() => {
    const el = section.current;
    if (!el) return;
    let acc = 0;
    const onWheel = (e: WheelEvent) => {
      if (window.innerWidth < 1024) return;
      const top = el.getBoundingClientRect().top;
      if (Math.abs(top) > 12) return; // only when the viewer is snapped to the top
      const down = e.deltaY > 0;
      const atEdge = (down && pos >= count - 1) || (!down && pos <= 0);
      if (atEdge) return; // let the page scroll on
      e.preventDefault();
      const now = performance.now();
      if (now < lock.current) return;
      acc += e.deltaY;
      if (Math.abs(acc) < 24) return;
      acc = 0;
      lock.current = now + 750;
      go(down ? 1 : -1);
    };
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, [pos, count, go]);

  // Left and right arrow keys, unless the visitor is typing.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement;
      if (t.closest('input, textarea, select, [contenteditable="true"]')) return;
      const r = section.current?.getBoundingClientRect();
      if (!r || r.bottom < 100 || r.top > window.innerHeight - 100) return;
      if (e.key === 'ArrowRight') go(1);
      if (e.key === 'ArrowLeft') go(-1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [go]);

  const seen = order.slice(Math.max(0, pos - 4), pos).reverse(); // nearest first
  const coming = order.slice(pos + 1, pos + 5);
  const company = p.company === 'Freelance' ? 'Freelance project' : p.company;

  const meta: [string, string][] = [
    ['Delivered with', company ?? '—'],
    ['Industry', p.category],
    ['Work', p.work?.length ? p.work.slice(0, 3).join(', ') + (p.work.length > 3 ? ` +${p.work.length - 3}` : '') : 'Design and custom coding'],
    ...(p.technologies?.length ? ([['Built with', p.technologies.join(', ')]] as [string, string][]) : []),
  ];

  const enter = { opacity: 0, x: dir * 260, y: dir * 160, scale: 0.55, rotate: dir * -6 };
  const leave = { opacity: 0, x: dir * -260, y: dir * -160, scale: 0.5, rotate: dir * 6 };

  return (
    <section
      ref={section}
      data-lenis-prevent-wheel
      aria-labelledby="work-title"
      className="tone-base relative overflow-hidden pt-16 lg:h-[100svh] lg:min-h-[46rem]"
    >
      <h1 id="work-title" className="sr-only">Selected work</h1>
      <p className="sr-only" aria-live="polite">Project {pos + 1} of {count}: {p.name}</p>

      {/* Big words: WORK (top right) and SELECTED (bottom left) */}
      <p aria-hidden="true" className="display pointer-events-none absolute right-[3vw] top-24 hidden select-none text-[clamp(5rem,10vw,9.5rem)] leading-[0.8] lg:block">
        Work<span className="hl">.</span>
      </p>
      <p aria-hidden="true" className="display pointer-events-none absolute bottom-6 left-[3vw] hidden select-none text-[clamp(4rem,7.4vw,7rem)] leading-[0.8] lg:block">
        Selected
      </p>

      {/* Stacks (large screens) */}
      <div aria-hidden="true" className="absolute left-[15vw] top-20 hidden h-40 w-56 -skew-y-[10deg] lg:block">
        <AnimatePresence>{seen.map((s, i) => <StackCard key={s.id} project={s} depth={i} corner="top" />)}</AnimatePresence>
      </div>
      <div aria-hidden="true" className="absolute bottom-16 right-[6vw] hidden h-40 w-60 -skew-y-[10deg] lg:block">
        <AnimatePresence>{coming.map((s, i) => <StackCard key={s.id} project={s} depth={i} corner="bottom" />)}</AnimatePresence>
      </div>

      <div className="container-site relative grid h-full items-center gap-10 pb-16 pt-8 lg:grid-cols-12 lg:gap-8 lg:pb-28 lg:pt-0">
        {/* Phone and tablet heading */}
        <div className="lg:hidden">
          <p className="eyebrow">Portfolio</p>
          <p className="display h-page mt-2">Selected <span className="hl">Work</span></p>
        </div>

        {/* Left: details */}
        <dl className="order-4 grid grid-cols-2 gap-x-6 gap-y-5 lg:order-1 lg:col-span-3 lg:grid-cols-1">
          {meta.map(([k, v], i) => (
            <div key={k} className="overflow-hidden">
              <dt className="text-sm text-muted">{k}</dt>
              <AnimatePresence mode="wait" initial={false}>
                <motion.dd
                  key={`${p.id}-${k}`}
                  className="mt-0.5 font-semibold"
                  initial={{ y: '110%', opacity: 0 }}
                  animate={{ y: '0%', opacity: 1 }}
                  exit={{ y: '-110%', opacity: 0 }}
                  transition={{ duration: 0.45, ease: ease.out, delay: 0.05 * i }}
                >
                  {v}
                </motion.dd>
              </AnimatePresence>
            </div>
          ))}
        </dl>

        {/* Centre: screenshot, name and links */}
        <div className="order-2 lg:col-span-6">
          <div className="relative">
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.div
                key={p.id}
                initial={enter}
                animate={{ opacity: 1, x: 0, y: 0, scale: 1, rotate: 0 }}
                exit={leave}
                transition={{ duration: 0.8, ease: ease.out }}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.25}
                onDragStart={() => { dragged.current = true; }}
                onDragEnd={(_, info) => {
                  if (info.offset.x < -60) go(1); else if (info.offset.x > 60) go(-1);
                  window.setTimeout(() => { dragged.current = false; }, 50);
                }}
                className="touch-pan-y"
              >
                <Link
                  to={`/portfolio/${p.slug}`}
                  data-cursor="View"
                  aria-label={`View project: ${p.name}`}
                  className="group block"
                  draggable={false}
                  onClick={(e) => { if (dragged.current) e.preventDefault(); }}
                  onDragStart={(e) => e.preventDefault()}
                >
                  <ProjectFrame project={p} eager className="shadow-lg" />
                </Link>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="mt-5 flex flex-wrap items-end justify-between gap-x-6 gap-y-3">
            <div className="overflow-hidden">
              <AnimatePresence mode="wait" initial={false}>
                <motion.h2
                  key={p.id}
                  className="display text-[clamp(1.75rem,3vw,2.75rem)] leading-tight"
                  initial={{ y: '100%' }}
                  animate={{ y: '0%' }}
                  exit={{ y: '-100%' }}
                  transition={{ duration: 0.5, ease: ease.out }}
                >
                  {p.name}
                </motion.h2>
              </AnimatePresence>
            </div>
            <div className="flex flex-wrap gap-x-5 gap-y-2 font-semibold">
              <Link to={`/portfolio/${p.slug}`} className="link">View project<span className="sr-only">: {p.name}</span></Link>
              <a href={p.url} target="_blank" rel="noopener noreferrer" className="link inline-flex items-center gap-1">
                {visitLabel(p)} <ArrowUpRight size={16} aria-hidden="true" /><span className="sr-only">: {p.name} (opens in a new tab)</span>
              </a>
            </div>
          </div>
        </div>

        {/* Right: description */}
        <div className="order-5 lg:order-4 lg:col-span-3 lg:pt-40">
          <AnimatePresence mode="wait" initial={false}>
            <motion.p
              key={p.id}
              className="lede lg:text-right"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.45, ease: ease.out }}
            >
              {projectLine(p)}
            </motion.p>
          </AnimatePresence>
        </div>

        {/* Controls */}
        <div className="order-3 flex flex-wrap items-center justify-center gap-3 lg:absolute lg:bottom-8 lg:left-1/2 lg:-translate-x-1/2">
          <button type="button" className="hover-grad grid h-11 w-11 place-items-center rounded-full border" aria-label="Previous project" disabled={pos === 0} onClick={() => go(-1)}>
            <ArrowLeft size={18} aria-hidden="true" />
          </button>
          <span className="display min-w-[5.5rem] text-center tabular-nums">{pad(pos + 1)} / {pad(count)}</span>
          <button type="button" className="hover-grad grid h-11 w-11 place-items-center rounded-full border" aria-label="Next project" disabled={pos === count - 1} onClick={() => go(1)}>
            <ArrowRight size={18} aria-hidden="true" />
          </button>
          <button type="button" className="btn btn-line ml-2 !px-5 !py-2" onClick={mix}>
            <Shuffle size={16} aria-hidden="true" /> Mix
          </button>
        </div>
      </div>
    </section>
  );
}
