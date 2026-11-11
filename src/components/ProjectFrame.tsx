import { useState } from 'react';
import type { Project } from '../data/projects';
import { asset, displayUrl } from '../lib/projects';

interface Props {
  project: Project;
  /** Image path override (used for gallery images). */
  src?: string;
  eager?: boolean;
  className?: string;
}

/**
 * Browser-style frame around a project screenshot. When a project has no image (or it fails
 * to load) a neutral placeholder with the project name is shown. Nothing here imitates a
 * real screenshot.
 */
export default function ProjectFrame({ project, src, eager, className = '' }: Props) {
  const [failed, setFailed] = useState(false);
  const image = src ?? project.image;
  const showImage = Boolean(image) && !failed;

  return (
    <div className={`overflow-hidden rounded-box border border-line bg-frame text-on-frame ${className}`}>
      <div className="flex items-center gap-1.5 border-b border-white/15 px-3 py-2" aria-hidden="true">
        <span className="h-2 w-2 rounded-full bg-white/30" />
        <span className="h-2 w-2 rounded-full bg-white/30" />
        <span className="h-2 w-2 rounded-full bg-white/30" />
        <span className="ml-2 truncate text-xs text-white/60">{displayUrl(project.url)}</span>
      </div>
      <div className="relative aspect-[16/10] [container-type:inline-size]">
        {showImage ? (
          <img
            src={asset(image!)}
            alt={`Screenshot of the ${project.name} website`}
            loading={eager ? 'eager' : 'lazy'}
            decoding="async"
            onError={() => setFailed(true)}
            className="absolute inset-0 h-full w-full object-cover object-top transition-transform duration-700 group-hover:scale-[1.03]"
          />
        ) : (
          /* Placeholder cover: an abstract page outline with the project name. Sizes use
             container units so it scales from small cards to the large featured frame. */
          <div className="absolute inset-0 overflow-hidden bg-[color:var(--band)] text-white">
            <span aria-hidden="true" className="display absolute -bottom-[16cqw] right-[2cqw] text-[58cqw] leading-none text-white/10">
              {project.name.replace(/^the\s+/i, '').charAt(0).toUpperCase()}
            </span>
            <div aria-hidden="true" className="absolute inset-x-[6cqw] top-[5cqw] flex items-center justify-between">
              <span className="h-[2.4cqw] w-[2.4cqw] bg-[color:var(--skin)]" />
              <span className="flex gap-[2cqw]">
                <span className="h-[0.9cqw] w-[7cqw] bg-white/30" />
                <span className="h-[0.9cqw] w-[7cqw] bg-white/30" />
                <span className="h-[0.9cqw] w-[7cqw] bg-white/30" />
              </span>
            </div>
            <div className="absolute inset-x-[6cqw] top-[15cqw]">
              <span className="display block max-w-[78%] text-[6.5cqw] leading-[1] [overflow-wrap:anywhere]">{project.name}</span>
              <span aria-hidden="true" className="mt-[3.5cqw] block h-[1cqw] w-[38cqw] bg-white/30" />
              <span aria-hidden="true" className="mt-[1.6cqw] block h-[1cqw] w-[28cqw] bg-white/30" />
              <span aria-hidden="true" className="mt-[3.5cqw] block h-[4.4cqw] w-[16cqw] bg-[color:var(--skin)]" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
