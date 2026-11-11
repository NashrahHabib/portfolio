import { useEffect, useState } from 'react';
import { AnimatePresence, motion, useMotionValue, useSpring } from 'framer-motion';
import { hasFinePointer, prefersReducedMotion } from '../../lib/motion';

type Mode = 'hidden' | 'default' | 'link' | 'button' | 'text' | 'label';

const CLICKABLE = 'a[href], button:not(:disabled), [role="button"], label[for], select, summary';
const TYPING = 'input:not([type="checkbox"]):not([type="radio"]):not([type="submit"]):not([type="button"]), textarea, [contenteditable="true"]';

/**
 * Cursor-driven effects, wired up once for the whole site with event delegation:
 *
 *   custom cursor   a small dot with a ring that trails behind it; the ring grows over links and
 *                   fills softly over buttons. Text fields keep the normal text cursor.
 *   .spotlight      a soft light follows the cursor across the card (CSS reads --sx / --sy)
 *   [data-tilt]     the element tilts in 3D towards the cursor (CSS reads --rx / --ry)
 *   [data-cursor]   a round label (the attribute's text, e.g. "View") replaces the cursor
 *
 * Only runs for mouse and trackpad users who have not asked for reduced motion; everyone else
 * keeps their normal cursor.
 */
export default function PointerEffects() {
  const [enabled] = useState(() => hasFinePointer() && !prefersReducedMotion());
  const [label, setLabel] = useState<string | null>(null);
  const [mode, setMode] = useState<Mode>('hidden');
  const [pressed, setPressed] = useState(false);

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  // The ring and the label trail slightly behind the dot.
  const rx = useSpring(x, { stiffness: 380, damping: 32, mass: 0.5 });
  const ry = useSpring(y, { stiffness: 380, damping: 32, mass: 0.5 });

  useEffect(() => {
    if (!enabled) return;
    document.documentElement.classList.add('has-custom-cursor');
    let tilt: HTMLElement | null = null;

    const release = (el: HTMLElement | null) => {
      if (!el) return;
      el.style.removeProperty('--rx');
      el.style.removeProperty('--ry');
    };

    const onMove = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      const target = e.target instanceof Element ? e.target : null;

      const spot = target?.closest<HTMLElement>('.spotlight');
      if (spot) {
        const r = spot.getBoundingClientRect();
        spot.style.setProperty('--sx', `${e.clientX - r.left}px`);
        spot.style.setProperty('--sy', `${e.clientY - r.top}px`);
      }

      const tilted = target?.closest<HTMLElement>('[data-tilt]') ?? null;
      if (tilted !== tilt) { release(tilt); tilt = tilted; }
      if (tilted) {
        const r = tilted.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5;
        const py = (e.clientY - r.top) / r.height - 0.5;
        tilted.style.setProperty('--rx', `${(-py * 5).toFixed(2)}deg`);
        tilted.style.setProperty('--ry', `${(px * 7).toFixed(2)}deg`);
      }

      const labelled = target?.closest<HTMLElement>('[data-cursor]');
      setLabel(labelled?.dataset.cursor ?? null);

      // What is under the cursor decides the cursor's look.
      if (labelled) setMode('label');
      else if (target?.closest(TYPING)) setMode('text');
      else if (target?.closest('.btn, .hover-grad')) setMode('button');
      else if (target?.closest(CLICKABLE)) setMode('link');
      else setMode('default');
    };

    const onLeave = () => {
      release(tilt); tilt = null;
      setLabel(null);
      setMode('hidden');
    };
    const onDown = () => setPressed(true);
    const onUp = () => setPressed(false);

    document.addEventListener('pointermove', onMove, { passive: true });
    document.addEventListener('pointerdown', onDown);
    document.addEventListener('pointerup', onUp);
    document.documentElement.addEventListener('pointerleave', onLeave);
    window.addEventListener('blur', onLeave);
    return () => {
      document.documentElement.classList.remove('has-custom-cursor');
      document.removeEventListener('pointermove', onMove);
      document.removeEventListener('pointerdown', onDown);
      document.removeEventListener('pointerup', onUp);
      document.documentElement.removeEventListener('pointerleave', onLeave);
      window.removeEventListener('blur', onLeave);
      onLeave();
    };
  }, [enabled, x, y]);

  if (!enabled) return null;

  const showCursor = mode !== 'hidden' && mode !== 'text' && mode !== 'label';
  const ringSize = mode === 'button' ? 64 : mode === 'link' ? 54 : 36;

  return (
    <>
      {/* Ring: trails behind, grows over links, fills over buttons */}
      <motion.div aria-hidden="true" className="pointer-events-none fixed left-0 top-0 z-[80]" style={{ x: rx, y: ry }}>
        <motion.span
          className="block rounded-full border-[1.5px] border-[color:var(--accent)]"
          animate={{
            width: ringSize,
            height: ringSize,
            marginLeft: -ringSize / 2,
            marginTop: -ringSize / 2,
            opacity: showCursor ? 1 : 0,
            scale: pressed ? 0.85 : 1,
            backgroundColor: mode === 'button' ? 'rgba(99, 102, 241, 0.14)' : 'rgba(99, 102, 241, 0)',
          }}
          transition={{ type: 'spring', stiffness: 320, damping: 26 }}
        />
      </motion.div>

      {/* Dot: sits exactly on the pointer */}
      <motion.div aria-hidden="true" className="pointer-events-none fixed left-0 top-0 z-[81]" style={{ x, y }}>
        <motion.span
          className="-ml-1 -mt-1 block h-2 w-2 rounded-full bg-[color:var(--accent)]"
          animate={{ opacity: showCursor ? 1 : 0, scale: mode === 'button' || mode === 'link' ? 0.6 : pressed ? 1.4 : 1 }}
          transition={{ duration: 0.15 }}
        />
      </motion.div>

      {/* "View" label over project previews */}
      <AnimatePresence>
        {label && (
          <motion.div
            aria-hidden="true"
            className="pointer-events-none fixed left-0 top-0 z-[80]"
            style={{ x: rx, y: ry }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 400, damping: 28 }}
          >
            <span className="display -ml-11 -mt-11 grid h-[5.5rem] w-[5.5rem] place-items-center rounded-full bg-accent text-sm font-semibold uppercase tracking-wider text-on-accent shadow-card">
              {label}
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
