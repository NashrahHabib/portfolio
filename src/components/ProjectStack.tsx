import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform, type MotionValue } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import type { Project } from '../data/projects';
import { prefersReducedMotion } from '../lib/motion';
import { visitLabel } from '../lib/projects';
import ProjectFrame from './ProjectFrame';

const pad = (n: number) => String(n).padStart(2, '0');

function StackCard({ project, index, count, progress }: { project: Project; index: number; count: number; progress: MotionValue<number> }) {
  // Once a later card starts covering this one, it shrinks back a little, like a deck.
  const still = prefersReducedMotion();
  const end = 1 - (count - index - 1) * 0.04;
  const scale = useTransform(progress, [index / count, 1], [1, still ? 1 : end]);
  const dim = useTransform(progress, [index / count, 1], [0, still ? 0 : (count - index - 1) * 0.06]);
  const company = project.company === 'Freelance' ? 'Freelance project' : project.company;

  return (
    <li className="sticky top-0 flex h-screen items-center" style={{ paddingTop: `${index * 16}px` }}>
      <motion.article
        style={{ scale, transformOrigin: 'top center' }}
        className="relative w-full overflow-hidden rounded-panel border border-line bg-paper shadow-lg"
        aria-labelledby={`stack-${project.slug}`}
      >
        <motion.span aria-hidden="true" className="pointer-events-none absolute inset-0 z-10 bg-[#0B0C1E]" style={{ opacity: dim }} />
        <div className="grid lg:grid-cols-12">
          <Link
            to={`/portfolio/${project.slug}`}
            data-cursor="View"
            aria-label={`View project: ${project.name}`}
            className="group block lg:col-span-7"
          >
            <ProjectFrame project={project} eager={index === 0} className="!rounded-none !border-0" />
          </Link>

          <div className="flex flex-col p-6 md:p-8 lg:col-span-5 lg:p-10">
            <div className="flex items-center justify-between gap-4 text-sm text-muted">
              <span>{project.category}</span>
              <span className="display text-base">{pad(index + 1)} / {pad(count)}</span>
            </div>
            <h3 id={`stack-${project.slug}`} className="display mt-3 text-[clamp(1.75rem,3vw,2.75rem)] leading-tight">{project.name}</h3>
            {project.description && <p className="mt-4 hidden text-muted md:block">{project.description}</p>}

            {company && (
              <p className="mt-5 inline-flex items-center gap-2 text-sm font-bold">
                <span aria-hidden="true" className="h-2 w-2 rounded-full bg-[color:var(--pop)]" />
                {company}
              </p>
            )}
            {project.work && project.work.length > 0 && (
              <ul className="mt-3 hidden flex-wrap gap-1.5 text-sm sm:flex" aria-label="Work I did">
                {project.work.slice(0, 5).map((w) => <li key={w} className="rounded-btn border border-line px-2.5 py-0.5">{w}</li>)}
                {project.work.length > 5 && <li className="px-1 py-0.5 text-muted">+{project.work.length - 5} more</li>}
              </ul>
            )}

            <div className="mt-auto flex flex-wrap gap-3 pt-8">
              <Link to={`/portfolio/${project.slug}`} className="btn btn-solid !px-5 !py-2.5">
                View Project<span className="sr-only">: {project.name}</span>
              </Link>
              <a href={project.url} target="_blank" rel="noopener noreferrer" className="btn btn-line !px-5 !py-2.5">
                {visitLabel(project)} <ArrowUpRight size={18} aria-hidden="true" />
                <span className="sr-only">: {project.name} (opens in a new tab)</span>
              </a>
            </div>
          </div>
        </div>
      </motion.article>
    </li>
  );
}

/**
 * Featured projects as a stack of cards: each one pins near the top of the screen and the next
 * slides up over it, while the cards underneath shrink back slightly.
 */
export default function ProjectStack({ projects }: { projects: Project[] }) {
  const ref = useRef<HTMLOListElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] });
  return (
    <ol ref={ref} className="container-site relative" aria-label="Featured projects">
      {projects.map((p, i) => (
        <StackCard key={p.id} project={p} index={i} count={projects.length} progress={scrollYProgress} />
      ))}
    </ol>
  );
}
