import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import type { Project } from '../data/projects';
import { visitLabel } from '../lib/projects';
import ProjectFrame from './ProjectFrame';

/** One slide of the featured carousel: preview on top, details in two columns underneath. */
export default function FeaturedProject({ project, eager }: { project: Project; eager?: boolean }) {
  return (
    <div className="lift shadow-card flex h-full flex-col overflow-hidden rounded-box border border-line bg-paper">
      <Link to={`/portfolio/${project.slug}`} className="group block" aria-label={`View project: ${project.name}`}>
        <ProjectFrame project={project} eager={eager} className="!rounded-none !border-0" />
      </Link>

      <div className="grid flex-1 gap-6 border-t-4 border-accent p-6 md:grid-cols-2 md:gap-10 md:p-8">
        <div>
          <p className="label">{project.category}</p>
          <h3 className="display h-item mt-2">{project.name}</h3>
          {project.technologies && project.technologies.length > 0 && (
            <ul className="mt-4 flex flex-wrap gap-1.5 text-sm" aria-label="Built with">
              {project.technologies.map((t) => <li key={t} className="rounded-btn border border-line bg-skin-soft px-3 py-0.5">{t}</li>)}
            </ul>
          )}
        </div>

        <div className="flex flex-col">
          {project.description && <p className="text-muted">{project.description}</p>}
          {project.contribution && (
            <p className="mt-3 text-sm">
              <span className="text-muted">My role: </span>
              <span className="font-medium">{project.contribution}</span>
            </p>
          )}
          <div className="mt-auto flex flex-wrap gap-3 pt-6">
            <Link to={`/portfolio/${project.slug}`} className="btn btn-solid !px-5 !py-2 !text-base">
              View Project<span className="sr-only">: {project.name}</span>
            </Link>
            <a href={project.url} target="_blank" rel="noopener noreferrer" className="btn btn-line !px-5 !py-2 !text-base">
              {visitLabel(project)} <ArrowUpRight size={18} aria-hidden="true" />
              <span className="sr-only">: {project.name} (opens in a new tab)</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
