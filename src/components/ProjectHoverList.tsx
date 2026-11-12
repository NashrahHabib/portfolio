import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion, useMotionValue, useSpring, useTransform, useVelocity } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import type { Project } from '../data/projects';
import { ease, hasFinePointer, prefersReducedMotion } from '../lib/motion';
import ProjectFrame from './ProjectFrame';

const pad = (n: number) => String(n).padStart(2, '0');

/** One line about the project: its description, or else the main kinds of work done. */
export const projectLine = (p: Project) =>
  p.description ?? (p.work?.length ? `${p.work.slice(0, 3).join(', ')}.` : 'Design and custom coding.');

/**
 * Featured projects as a list of large names. Pointing at (or tabbing to) a name fills it in
 * from left to right, brings its details forward, and shows the project's screenshot floating
 * beside the cursor. On touch screens each row shows its screenshot instead.
 */
export default function ProjectHoverList({ projects }: { projects: Project[] }) {
  const [active, setActive] = useState<number | null>(null);
  const [fine] = useState(() => hasFinePointer());
  const still = prefersReducedMotion();

  // Floating preview position: follows the pointer with a soft lag and leans with its speed.
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const x = useSpring(mx, { stiffness: 170, damping: 24, mass: 0.6 });
  const y = useSpring(my, { stiffness: 170, damping: 24, mass: 0.6 });
  const lean = useTransform(useVelocity(x), [-1500, 0, 1500], still ? [0, 0, 0] : [-8, 0, 8], { clamp: true });

  useEffect(() => {
    if (!fine) return;
    const onMove = (e: PointerEvent) => { mx.set(e.clientX); my.set(e.clientY); };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => window.removeEventListener('pointermove', onMove);
  }, [fine, mx, my]);

  const current = active === null ? null : projects[active];

  return (
    <div className="container-site relative" onMouseLeave={() => setActive(null)}>
      <ol className="border-t border-line" aria-label="Featured projects">
        {projects.map((p, i) => {
          const on = active === i;
          const dim = active !== null && !on;
          const company = p.company === 'Freelance' ? 'Freelance project' : p.company;
          return (
            <motion.li
              key={p.id}
              className="group relative grid items-center gap-x-6 gap-y-3 border-b border-line py-7 md:grid-cols-12 md:py-9"
              onMouseEnter={() => setActive(i)}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '0px 0px -8% 0px' }}
              transition={{ duration: 0.8, ease: ease.out, delay: Math.min(i, 4) * 0.05 }}
            >
              <span className="display text-sm text-muted md:col-span-1">{pad(i + 1)}</span>

              {/* The name: a faint copy underneath, and a gradient copy that wipes in from the left */}
              <h3 className="md:col-span-7">
                <Link
                  to={`/portfolio/${p.slug}`}
                  className="relative inline-block no-underline focus-visible:outline-offset-8"
                  onFocus={() => setActive(i)}
                  onBlur={() => setActive(null)}
                >
                  <span className={`display block text-[clamp(2rem,4.8vw,4.5rem)] !font-semibold leading-[1.05] transition-opacity duration-500 ${dim ? 'opacity-[0.08]' : 'opacity-[0.16]'}`}>
                    {p.name}
                  </span>
                  <span
                    aria-hidden="true"
                    className="display hl absolute inset-0 block text-[clamp(2rem,4.8vw,4.5rem)] !font-semibold leading-[1.05] transition-[clip-path] duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none"
                    style={{ clipPath: on ? 'inset(0 0 0 0)' : 'inset(0 100% 0 0)' }}
                  >
                    {p.name}
                  </span>
                </Link>
              </h3>

              {/* Details */}
              <div className={`text-sm transition-opacity duration-500 md:col-span-4 md:text-right ${dim ? 'opacity-40' : 'opacity-100'}`}>
                <p className="font-semibold">{p.category}{company && <span className="font-normal text-muted"> · {company}</span>}</p>
                <p className="mt-2 text-base text-muted md:ml-auto md:max-w-xs">{projectLine(p)}</p>
                <Link to={`/portfolio/${p.slug}`} className="mt-3 inline-flex items-center gap-1 font-semibold no-underline" tabIndex={-1} aria-hidden="true">
                  View project <ArrowUpRight size={16} className={`transition-transform duration-300 ${on ? 'translate-x-0.5 -translate-y-0.5' : ''}`} />
                </Link>
              </div>

              {/* Touch screens: show the screenshot in the row */}
              {!fine && (
                <Link to={`/portfolio/${p.slug}`} className="block md:col-span-12" tabIndex={-1} aria-hidden="true">
                  <ProjectFrame project={p} />
                </Link>
              )}
            </motion.li>
          );
        })}
      </ol>

      {/* Floating preview that follows the pointer */}
      {fine && (
        <motion.div
          aria-hidden="true"
          className="pointer-events-none fixed left-0 top-0 z-40 hidden w-[min(34vw,30rem)] md:block"
          style={{ x, y, rotate: lean }}
        >
          {/* Sits just right of the pointer, vertically centred on it */}
          <div className="translate-x-10 -translate-y-1/2">
          <AnimatePresence mode="popLayout">
            {current && (
              <motion.div
                key={current.id}
                className="overflow-hidden rounded-box shadow-lg"
                initial={{ opacity: 0, scale: 0.85, clipPath: 'inset(12% 12% 12% 12% round 1rem)' }}
                animate={{ opacity: 1, scale: 1, clipPath: 'inset(0% 0% 0% 0% round 1rem)' }}
                exit={{ opacity: 0, scale: 0.92 }}
                transition={{ duration: 0.45, ease: ease.out }}
              >
                <ProjectFrame project={current} eager className="!border-0" />
              </motion.div>
            )}
          </AnimatePresence>
          </div>
        </motion.div>
      )}
    </div>
  );
}
