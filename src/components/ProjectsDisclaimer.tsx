import { Info } from 'lucide-react';
import { site } from '../data/site';

/** Ownership note for the client projects, shown on the Portfolio page and each project page. */
export default function ProjectsDisclaimer({ className = '' }: { className?: string }) {
  return (
    <aside aria-label="About these projects" className={`tone-base ${className}`}>
      <div className="container-site">
        <div className="border-t border-line pt-6"><p className="flex max-w-4xl items-start gap-3 text-sm leading-relaxed text-[color:var(--label)]">
          <Info size={16} aria-hidden="true" className="mt-0.5 shrink-0" />
          <span>
            Some projects shown here were built while I worked at SMCSE Solutions and are marked “Delivered with SMCSE Solutions”. All
            trademarks, logos and website content belong to their respective owners. Screenshots show the public websites and are
            included only to illustrate my role in the work. If you’d like a project removed,{' '}
            <a href={`mailto:${site.email}`} className="link">email me</a> and I’ll take it down.
          </span>
        </p></div>
      </div>
    </aside>
  );
}
