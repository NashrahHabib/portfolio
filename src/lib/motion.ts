import type Lenis from 'lenis';

/** Shared easing curves. `out` is a long, soft settle; `inOut` is used for curtains and wipes. */
export const ease = {
  out: [0.22, 1, 0.36, 1] as const,
  soft: [0.2, 0.7, 0.1, 1] as const,
  inOut: [0.77, 0, 0.18, 1] as const,
};

/** True when the visitor has asked their device for less motion. */
export const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/** True for a mouse or trackpad. Cursor effects (magnetic, tilt, spotlight) are only used there. */
export const hasFinePointer = () =>
  typeof window !== 'undefined' && window.matchMedia('(hover: hover) and (pointer: fine)').matches;

/**
 * How long a new page waits before its own entrance animations start, so they play as the
 * page curtain lifts rather than underneath it. The very first load waits a little longer
 * because the curtain shows the monogram first.
 */
let firstPage = true;
export function enterDelay() {
  if (prefersReducedMotion()) return 0;
  return firstPage ? 0.85 : 0.35;
}
export const markPageShown = () => { firstPage = false; };
export const isFirstPage = () => firstPage;

/** The smooth-scroll instance, when it is running. Set by <SmoothScroll />. */
let lenis: Lenis | null = null;
export const setLenis = (instance: Lenis | null) => { lenis = instance; };

/**
 * Scrolls to a position or element, through smooth scroll when it is active. For elements it
 * checks where it landed afterwards and corrects itself, in case anything above changed size
 * during the glide (lazy images, fonts, animations).
 */
export function scrollToTarget(target: number | HTMLElement, immediate = false) {
  if (lenis) {
    const l = lenis;
    const offset = typeof target === 'number' ? 0 : -80;
    l.scrollTo(target, {
      immediate,
      offset,
      onComplete: () => {
        if (typeof target === 'number') return;
        const off = target.getBoundingClientRect().top - 80;
        if (Math.abs(off) > 4) l.scrollTo(target, { immediate: true, offset });
      },
    });
    return;
  }
  const top = typeof target === 'number' ? target : target.getBoundingClientRect().top + window.scrollY - 80;
  window.scrollTo({ top, behavior: immediate || prefersReducedMotion() ? 'auto' : 'smooth' });
}
