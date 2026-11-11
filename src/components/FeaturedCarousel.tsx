import { useCallback, useEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import type { Project } from '../data/projects';
import FeaturedProject from './FeaturedProject';

/**
 * Featured projects carousel.
 *
 * Built on native horizontal scrolling with scroll snapping, so touch swipe, trackpads and
 * keyboards all work. It never moves on its own (no autoplay), the buttons and dots are real
 * buttons, and each slide announces its position, following the WAI-ARIA carousel pattern.
 */
export default function FeaturedCarousel({ projects }: { projects: Project[] }) {
  const track = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const last = projects.length - 1;

  const slides = () => Array.from(track.current?.children ?? []) as HTMLElement[];

  const goTo = useCallback((index: number) => {
    const el = track.current;
    const slide = slides()[Math.max(0, Math.min(index, last))];
    if (!el || !slide) return;
    const edge = parseFloat(getComputedStyle(el).scrollPaddingLeft) || 0;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    el.scrollTo({ left: slide.offsetLeft - edge, behavior: reduce ? 'auto' : 'smooth' });
  }, [last]);

  // Keep the counter, dots and button states in step with the scroll position.
  useEffect(() => {
    const el = track.current;
    if (!el) return;
    let frame = 0;
    const update = () => {
      const edge = parseFloat(getComputedStyle(el).scrollPaddingLeft) || 0;
      const atEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 4;
      let nearest = 0;
      let best = Infinity;
      slides().forEach((s, i) => {
        const d = Math.abs(s.offsetLeft - edge - el.scrollLeft);
        if (d < best) { best = d; nearest = i; }
      });
      setActive(atEnd ? last : nearest);
    };
    const onScroll = () => { cancelAnimationFrame(frame); frame = requestAnimationFrame(update); };
    el.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => { el.removeEventListener('scroll', onScroll); window.removeEventListener('resize', onScroll); cancelAnimationFrame(frame); };
  }, [last]);

  const arrow = 'shadow-soft grid h-12 w-12 place-items-center rounded-full border border-accent transition-colors hover:bg-accent hover:text-on-accent disabled:cursor-not-allowed disabled:border-control disabled:text-muted disabled:hover:bg-transparent';

  return (
    <section aria-roledescription="carousel" aria-label="Featured projects" className="mt-12 md:mt-16">
      <div className="container-site flex items-center justify-between gap-4">
        <p aria-live="polite" className="text-muted">
          Project <span className="font-semibold text-ink">{active + 1}</span> of {projects.length}
        </p>
        <div className="flex gap-2">
          <button type="button" className={arrow} aria-label="Previous project" disabled={active === 0} onClick={() => goTo(active - 1)}>
            <ArrowLeft aria-hidden="true" />
          </button>
          <button type="button" className={arrow} aria-label="Next project" disabled={active === last} onClick={() => goTo(active + 1)}>
            <ArrowRight aria-hidden="true" />
          </button>
        </div>
      </div>

      <div
        ref={track}
        className="carousel-track relative mt-6 flex snap-x snap-mandatory gap-5 overflow-x-auto pb-12 pt-4 md:gap-8"
        onKeyDown={(e) => {
          if (e.key === 'ArrowRight') { e.preventDefault(); goTo(active + 1); }
          if (e.key === 'ArrowLeft') { e.preventDefault(); goTo(active - 1); }
        }}
      >
        {projects.map((project, i) => (
          <div
            key={project.id}
            role="group"
            aria-roledescription="slide"
            aria-label={`${i + 1} of ${projects.length}: ${project.name}`}
            className="w-[86vw] shrink-0 snap-start sm:w-[72vw] lg:w-[min(52rem,54vw)]"
          >
            <article className="h-full">
              <FeaturedProject project={project} eager={i === 0} />
            </article>
          </div>
        ))}
      </div>

      <div className="container-site -mt-2 flex justify-center gap-1">
        {projects.map((project, i) => (
          <button
            key={project.id}
            type="button"
            className="grid h-8 w-8 place-items-center"
            aria-label={`Go to project ${i + 1}: ${project.name}`}
            aria-current={i === active ? 'true' : undefined}
            onClick={() => goTo(i)}
          >
            <span className={`block h-2.5 rounded-full transition-all ${i === active ? 'w-6 bg-accent' : 'w-2.5 border border-control'}`} />
          </button>
        ))}
      </div>
    </section>
  );
}
