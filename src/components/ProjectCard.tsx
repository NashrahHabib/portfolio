import { forwardRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { ease } from '../lib/motion';
import type { Project } from '../data/projects';
import { displayUrl, visitLabel } from '../lib/projects';
import ProjectFrame from './ProjectFrame';

/**
 * Archive entry. `view` switches between the image grid and the compact list. It forwards its
 * ref so the portfolio grid can animate cards in and out while filtering.
 */
const ProjectCard = forwardRef<HTMLLIElement, { project: Project; view: 'grid' | 'list' }>(function ProjectCard({ project, view }, ref) {
  const external = (
    <a href={project.url} target="_blank" rel="noopener noreferrer" className="link inline-flex items-center gap-1 font-medium">
      {visitLabel(project)} <ArrowUpRight size={16} aria-hidden="true" />
      <span className="sr-only">: {project.name} (opens in a new tab)</span>
    </a>
  );

  if (view === 'list') {
    return (
      <li ref={ref} className="grid items-baseline gap-x-6 gap-y-1 border-b border-line py-5 md:grid-cols-12">
        <h2 className="display text-2xl md:col-span-5">
          <Link to={`/portfolio/${project.slug}`} className="no-underline hover:text-accent">{project.name}</Link>
        </h2>
        <p className="text-muted md:col-span-3">{project.category}{project.company && <span className="block text-sm">{project.company}</span>}</p>
        <p className="truncate text-muted md:col-span-2">{displayUrl(project.url)}</p>
        <p className="md:col-span-2 md:text-right">{external}</p>
      </li>
    );
  }

  return (
    <motion.li
      ref={ref}
      layout
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      viewport={{ once: true, margin: '0px 0px -8% 0px' }}
      transition={{ duration: 0.8, ease: ease.out }}
    >
      <Link to={`/portfolio/${project.slug}`} className="lift shadow-card group block rounded-box" data-cursor="View" aria-label={`View project: ${project.name}`}>
        <div data-tilt className="rounded-box">
          <ProjectFrame project={project} />
        </div>
      </Link>
      <div className="mt-6 flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h2 className="display text-2xl">
            <Link to={`/portfolio/${project.slug}`} className="no-underline hover:text-accent">{project.name}</Link>
          </h2>
          <p className="mt-1 text-muted">
            {project.category}
            {project.company && <><span aria-hidden="true"> · </span>{project.company}</>}
          </p>
        </div>
      </div>
      <p className="mt-3">{external}</p>
    </motion.li>
  );
});

export default ProjectCard;
