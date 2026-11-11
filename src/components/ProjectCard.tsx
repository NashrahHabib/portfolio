import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import type { Project } from '../data/projects';
import { displayUrl, visitLabel } from '../lib/projects';
import ProjectFrame from './ProjectFrame';

/** Archive entry. `view` switches between the image grid and the compact list. */
export default function ProjectCard({ project, view }: { project: Project; view: 'grid' | 'list' }) {
  const external = (
    <a href={project.url} target="_blank" rel="noopener noreferrer" className="link inline-flex items-center gap-1 font-medium">
      {visitLabel(project)} <ArrowUpRight size={16} aria-hidden="true" />
      <span className="sr-only">: {project.name} (opens in a new tab)</span>
    </a>
  );

  if (view === 'list') {
    return (
      <li className="grid items-baseline gap-x-6 gap-y-1 border-b border-line py-5 md:grid-cols-12">
        <h2 className="display text-2xl md:col-span-5">
          <Link to={`/portfolio/${project.slug}`} className="no-underline hover:text-accent">{project.name}</Link>
        </h2>
        <p className="text-muted md:col-span-3">{project.category}</p>
        <p className="truncate text-muted md:col-span-2">{displayUrl(project.url)}</p>
        <p className="md:col-span-2 md:text-right">{external}</p>
      </li>
    );
  }

  return (
    <li>
      <Link to={`/portfolio/${project.slug}`} className="lift shadow-card group block rounded-box" aria-label={`View project: ${project.name}`}>
        <ProjectFrame project={project} />
      </Link>
      <div className="mt-6 flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h2 className="display text-2xl">
            <Link to={`/portfolio/${project.slug}`} className="no-underline hover:text-accent">{project.name}</Link>
          </h2>
          <p className="mt-1 text-muted">{project.category}</p>
        </div>
      </div>
      <p className="mt-3">{external}</p>
    </li>
  );
}
