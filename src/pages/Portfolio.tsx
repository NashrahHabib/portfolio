import { useMemo, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { LayoutGrid, List, Search, X } from 'lucide-react';
import { CATEGORIES, COMPANIES, projects } from '../data/projects';
import { useSeo } from '../lib/seo';
import WorkViewer from '../components/WorkViewer';
import SplitText from '../components/motion/SplitText';
import ProjectCard from '../components/ProjectCard';

export default function Portfolio() {
  useSeo({
    title: 'Portfolio',
    description: 'Selected websites designed and custom coded by Nashrah Habib, searchable by name and filterable by category.',
    path: '/portfolio',
  });

  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');
  const [view, setView] = useState<'grid' | 'list'>('grid');

  const categories = useMemo(
    () => CATEGORIES.map((c) => ({ name: c, count: projects.filter((p) => p.category === c).length })).filter((c) => c.count > 0),
    [],
  );

  const [company, setCompany] = useState('All');
  const companies = useMemo(
    () => COMPANIES.map((c) => ({ name: c, count: projects.filter((p) => p.company === c).length })).filter((c) => c.count > 0),
    [],
  );

  const results = useMemo(() => {
    const term = query.trim().toLowerCase();
    return projects.filter(
      (p) =>
        (category === 'All' || p.category === category) &&
        (company === 'All' || p.company === company) &&
        (!term || p.name.toLowerCase().includes(term) || p.url.toLowerCase().includes(term)),
    );
  }, [query, category, company]);

  const filtered = query !== '' || category !== 'All' || company !== 'All';
  const clear = () => {
    setQuery('');
    setCategory('All');
    setCompany('All');
  };

  const chip = (active: boolean) =>
    `rounded-btn border px-3.5 py-1.5 text-sm font-medium transition-colors ${active ? 'border-current bg-ink text-paper' : 'border-control hover:border-current'}`;

  return (
    <>
      <WorkViewer projects={projects} />

      <section id="all-projects" aria-labelledby="all-projects-title" className="tone-alt section-pad">
        <div className="container-site">
          <div className="mb-10 grid gap-4 md:grid-cols-12 md:items-end">
            <SplitText id="all-projects-title" text="All *Projects*" className="display h-section md:col-span-6" />
            <p className="text-muted md:col-span-5 md:col-start-8">Search by name, or filter by category or company.</p>
          </div>
          <div className="grid gap-8 md:grid-cols-12">
            <div className="md:col-span-4">
              <label htmlFor="project-search" className="label">Search by project name</label>
              <div className="relative mt-1">
                <Search size={20} aria-hidden="true" className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
                <input
                  id="project-search"
                  type="search"
                  className="field !pl-11"
                  placeholder="Start typing a name"
                  autoComplete="off"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
              </div>
            </div>

            <div className="md:col-span-8">
              <p className="label" id="category-label">Category</p>
              <div className="mt-2 flex flex-wrap gap-2" role="group" aria-labelledby="category-label">
                <button type="button" className={chip(category === 'All')} aria-pressed={category === 'All'} onClick={() => setCategory('All')}>
                  All <span className="opacity-70">{projects.length}</span>
                </button>
                {categories.map((c) => (
                  <button key={c.name} type="button" className={chip(category === c.name)} aria-pressed={category === c.name} onClick={() => setCategory(c.name)}>
                    {c.name} <span className="opacity-70">{c.count}</span>
                  </button>
                ))}
              </div>

              <p className="label mt-5" id="company-label">Company</p>
              <div className="mt-2 flex flex-wrap gap-2" role="group" aria-labelledby="company-label">
                <button type="button" className={chip(company === 'All')} aria-pressed={company === 'All'} onClick={() => setCompany('All')}>
                  All <span className="opacity-70">{projects.length}</span>
                </button>
                {companies.map((c) => (
                  <button key={c.name} type="button" className={chip(company === c.name)} aria-pressed={company === c.name} onClick={() => setCompany(c.name)}>
                    {c.name} <span className="opacity-70">{c.count}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-y border-line py-4">
            <p aria-live="polite" className="text-muted">
              Showing {results.length} of {projects.length} projects
            </p>
            <div className="flex flex-wrap items-center gap-3">
              {filtered && (
                <button type="button" className="link inline-flex items-center gap-1 font-medium" onClick={clear}>
                  <X size={16} aria-hidden="true" /> Clear filters
                </button>
              )}
              <div className="flex" role="group" aria-label="Layout">
                <button type="button" className={`${chip(view === 'grid')} !px-2.5`} aria-pressed={view === 'grid'} aria-label="Grid view" onClick={() => setView('grid')}>
                  <LayoutGrid size={18} aria-hidden="true" />
                </button>
                <button type="button" className={`${chip(view === 'list')} ml-1 !px-2.5`} aria-pressed={view === 'list'} aria-label="List view" onClick={() => setView('list')}>
                  <List size={18} aria-hidden="true" />
                </button>
              </div>
            </div>
          </div>

          {results.length === 0 ? (
            <div className="py-20 text-center">
              <h2 className="display h-item">No projects match those filters.</h2>
              <p className="mt-3 text-muted">Try a shorter search term or a different category.</p>
              <button type="button" className="btn btn-solid mt-8" onClick={clear}>Clear filters</button>
            </div>
          ) : view === 'grid' ? (
            <ul className="mt-10 grid gap-x-10 gap-y-16 sm:grid-cols-2">
              <AnimatePresence mode="popLayout">
                {results.map((p) => <ProjectCard key={p.id} project={p} view="grid" />)}
              </AnimatePresence>
            </ul>
          ) : (
            <ul className="mt-2">
              {results.map((p) => <ProjectCard key={p.id} project={p} view="list" />)}
            </ul>
          )}
        </div>
      </section>
    </>
  );
}
