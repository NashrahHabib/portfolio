import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight, ArrowUpRight, Check } from 'lucide-react';
import { displayUrl, findProject, neighbours, visitLabel } from '../lib/projects';
import { useSeo } from '../lib/seo';
import ProjectFrame from '../components/ProjectFrame';
import NotFound from './NotFound';

export default function ProjectDetail() {
  const { slug } = useParams();
  const project = findProject(slug);
  return project ? <Detail project={project} /> : <NotFound />;
}

function Detail({ project }: { project: NonNullable<ReturnType<typeof findProject>> }) {
  useSeo({
    title: project.name,
    description: project.description ?? `${project.name}: a project from Nashrah Habib’s portfolio archive.`,
    path: `/portfolio/${project.slug}`,
  });

  const { previous, next } = neighbours(project);
  const gallery = project.gallery ?? [];
  const hasNotes = project.description || project.contribution || project.work?.length || project.technologies?.length;

  return (
    <article>
      <section className="tone-base pt-16">
        <div className="container-site pb-14 pt-12 md:pt-16">
          <Link to="/portfolio" className="inline-flex items-center gap-2 text-muted no-underline hover:text-ink">
            <ArrowLeft size={18} aria-hidden="true" /> All projects
          </Link>
          <p className="mt-10 text-muted">{project.category}</p>
          <h1 className="display h-page mt-3 [overflow-wrap:anywhere]">{project.name}</h1>
          <a href={project.url} target="_blank" rel="noopener noreferrer" className="btn btn-solid mt-8">
            {visitLabel(project)} <ArrowUpRight size={20} aria-hidden="true" />
            <span className="sr-only">(opens in a new tab)</span>
          </a>
        </div>
      </section>

      <section className="tone-alt section-pad">
        <div className="container-site grid gap-12 md:grid-cols-12 md:gap-8">
          <div className="space-y-8 md:col-span-8">
            <ProjectFrame project={project} eager />
            {gallery.map((src) => <ProjectFrame key={src} project={project} src={src} />)}
          </div>

          <dl className="space-y-8 md:col-span-4 md:col-start-9">
            <div>
              <dt className="label">Project URL</dt>
              <dd className="mt-1 [overflow-wrap:anywhere]">
                <a className="link" href={project.url} target="_blank" rel="noopener noreferrer">{displayUrl(project.url)}</a>
              </dd>
            </div>
            <div>
              <dt className="label">Industry</dt>
              <dd className="mt-1">{project.category}</dd>
            </div>
            {project.company && (
              <div>
                <dt className="label">Delivered with</dt>
                <dd className="mt-1 inline-flex items-center gap-2 font-bold">
                  <span aria-hidden="true" className="h-2.5 w-2.5 rounded-full bg-[color:var(--pop)]" />
                  {project.company === 'Freelance' ? 'Freelance project' : project.company}
                </dd>
              </div>
            )}
            {project.work && project.work.length > 0 && (
              <div>
                <dt className="label">Work I did</dt>
                <dd className="mt-2">
                  <ul className="flex flex-wrap gap-2">
                    {project.work.map((w) => (
                      <li key={w} className="inline-flex items-center gap-1.5 rounded-btn border border-line bg-paper px-3 py-1 text-sm font-semibold">
                        <Check size={14} aria-hidden="true" className="text-[color:var(--heading-hl)]" /> {w}
                      </li>
                    ))}
                  </ul>
                </dd>
              </div>
            )}
            {project.description && (
              <div>
                <dt className="label">Overview</dt>
                <dd className="mt-1">{project.description}</dd>
              </div>
            )}
            {project.contribution && (
              <div>
                <dt className="label">Work performed</dt>
                <dd className="mt-1">{project.contribution}</dd>
              </div>
            )}
            {project.technologies && project.technologies.length > 0 && (
              <div>
                <dt className="label">Technologies on the live site</dt>
                <dd className="mt-2 flex flex-wrap gap-2">
                  {project.technologies.map((t) => <span key={t} className="rounded-btn border border-line bg-skin-soft px-3 py-1 text-sm">{t}</span>)}
                </dd>
              </div>
            )}
            {!hasNotes && <p className="text-muted">Project notes haven’t been added yet. Visit the live site to see it.</p>}
          </dl>
        </div>
      </section>

      <nav aria-label="More projects" className="tone-base">
        <div className="container-site grid md:grid-cols-2">
          <Link to={`/portfolio/${previous.slug}`} className="group border-b border-line py-10 no-underline md:border-b-0 md:border-r md:pr-8">
            <span className="inline-flex items-center gap-2 text-muted"><ArrowLeft size={18} aria-hidden="true" /> Previous project</span>
            <span className="display h-item mt-2 block group-hover:text-accent">{previous.name}</span>
          </Link>
          <Link to={`/portfolio/${next.slug}`} className="group py-10 no-underline md:pl-8 md:text-right">
            <span className="inline-flex items-center gap-2 text-muted">Next project <ArrowRight size={18} aria-hidden="true" /></span>
            <span className="display h-item mt-2 block group-hover:text-accent">{next.name}</span>
          </Link>
        </div>
      </nav>
    </article>
  );
}
