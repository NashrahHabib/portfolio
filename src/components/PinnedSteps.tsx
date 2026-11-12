import { useRef, useState } from 'react';
import type { LucideIcon } from 'lucide-react';
import { AnimatePresence, motion, useMotionValueEvent, useScroll, useTransform } from 'framer-motion';
import { ease } from '../lib/motion';
import { useCurrentTheme } from '../lib/theme';
import FeatureIcon from './FeatureIcon';
import SplitText from './motion/SplitText';

export interface PinnedItem {
  /** Short name shown beside the big number or icon, e.g. "Review". */
  title: string;
  heading: string;
  text: string;
  icon?: LucideIcon;
}

const pad = (n: number) => String(n).padStart(2, '0');

/** Background shades the band moves through as the items advance. */
const palettes = {
  green: { light: ['#0D0E24', '#111330', '#141532', '#1B1D45', '#111330', '#0D0E24'], dark: ['#08091A', '#0D0E24', '#111330', '#141532', '#0D0E24', '#08091A'] },
  cream: { light: ['#FFFFFF', '#F9FAFB', '#F4F5F8', '#F7F8F9', '#FAFBFC', '#FFFFFF'], dark: ['#0B0C1E', '#0E1026', '#11132D', '#141633', '#0E1026', '#0B0C1E'] },
};

/**
 * A pinned storytelling section. On large screens the left half stays in place while the items
 * scroll past on the right: a huge outlined number (or a big 3D icon) swaps per item, a progress
 * line fills with a travelling dot, and the background shifts shade. On phones it becomes a
 * simple list with each item's number and icon.
 */
export default function PinnedSteps({
  id,
  eyebrow,
  title,
  items,
  palette = 'green',
  visual = 'number',
}: {
  id: string;
  eyebrow: string;
  title: string[];
  items: PinnedItem[];
  palette?: keyof typeof palettes;
  visual?: 'number' | 'icon';
}) {
  const ref = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);
  const theme = useCurrentTheme();
  const count = items.length;
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] });

  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    setActive(Math.min(count - 1, Math.max(0, Math.floor(v * count))));
  });

  const shades = palettes[palette][theme].slice(0, count + 1);
  while (shades.length < count + 1) shades.push(shades[shades.length - 1]);
  const background = useTransform(scrollYProgress, shades.map((_, i) => i / count), shades);
  const dotTop = useTransform(scrollYProgress, (v) => `calc(${v * 100}% - 7px)`);

  const onDark = palette === 'green' || theme === 'dark';
  const ink = onDark ? 'text-[#F5F6FF]' : 'text-[#141532]';
  const soft = onDark ? 'text-[rgba(245,246,255,0.85)]' : 'text-[#4A4E6A]';
  const highlight = onDark ? 'text-[color:var(--skin)]' : 'text-[color:var(--accent)]';
  const rule = onDark ? 'bg-[color:var(--skin)]' : 'bg-[color:var(--pop)]';
  const track = onDark ? 'bg-white/15' : 'bg-[#141532]/15';
  const stroke = onDark ? '[-webkit-text-stroke:1.5px_rgba(125,211,252,0.6)]' : '[-webkit-text-stroke:1.5px_rgba(67,56,202,0.35)]';
  const divider = onDark ? 'border-white/15' : 'border-[#141532]/15';
  const item = items[active];

  return (
    <motion.section
      ref={ref}
      id={id}
      aria-labelledby={`${id}-title`}
      className={`relative ${ink} ${onDark ? '[--heading:#FFFFFF] [--hl-a:var(--band-hl-a)] [--hl-b:var(--band-hl-b)] [--heading-hl:var(--band-hl-b)]' : '[--heading:#0B0B0B] [--hl-a:#4338CA] [--hl-b:#0369A1] [--heading-hl:#4338CA]'}`}
      style={{ background }}
    >
      <div className="container-site lg:grid lg:grid-cols-12 lg:gap-8">
        {/* Pinned side (large screens) */}
        <div className="pt-20 lg:sticky lg:top-0 lg:col-span-6 lg:flex lg:h-screen lg:flex-col lg:justify-between lg:py-24">
          <div>
            <p className={`eyebrow flex items-center gap-3 ${onDark ? "[--label:rgba(245,246,255,0.7)]" : ""}`}>
              <span aria-hidden="true" className="h-px w-8 bg-current" /> {eyebrow}
            </p>
            <SplitText id={`${id}-title`} text={title} className="display h-page mt-5" />
          </div>

          <div aria-hidden="true" className="relative hidden lg:block">
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.div
                key={active}
                className="flex items-end gap-8"
                initial={{ y: 60, opacity: 0, rotateX: -30 }}
                animate={{ y: 0, opacity: 1, rotateX: 0 }}
                exit={{ y: -60, opacity: 0, rotateX: 30 }}
                transition={{ duration: 0.65, ease: ease.out }}
              >
                {visual === 'icon' && item.icon ? (
                  <FeatureIcon icon={item.icon} size={140} onColor={onDark} />
                ) : (
                  <span className={`display block text-[clamp(9rem,16vw,15rem)] leading-[0.8] text-transparent ${stroke}`}>{pad(active + 1)}</span>
                )}
                <span className="pb-2">
                  {visual === 'icon' && <span className={`display block text-6xl leading-none text-transparent ${stroke}`}>{pad(active + 1)}</span>}
                  <span className={`display mt-3 block text-3xl ${highlight}`}>{item.title}</span>
                </span>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Progress line with a travelling dot */}
          <div aria-hidden="true" className={`absolute bottom-24 right-0 top-24 hidden w-px lg:block ${track}`}>
            <motion.div className={`absolute inset-x-0 top-0 h-full origin-top ${rule}`} style={{ scaleY: scrollYProgress }} />
            <motion.span
              className={`absolute -left-[7px] h-[15px] w-[15px] rounded-full ${rule} shadow-[0_0_0_6px_rgba(125,211,252,0.3)]`}
              style={{ top: dotTop }}
            />
          </div>
        </div>

        {/* Items */}
        <ol className="pb-20 lg:col-span-5 lg:col-start-8 lg:py-[30vh]">
          {items.map((s, i) => (
            <li
              key={s.title}
              className={`flex flex-col justify-center border-t py-10 transition-opacity duration-500 first:border-t-0 lg:min-h-[70vh] lg:border-t-0 lg:py-0 ${divider} ${
                i === active ? 'lg:opacity-100' : 'lg:opacity-30'
              }`}
            >
              <span className="flex items-center gap-5 lg:hidden">
                {s.icon && <FeatureIcon icon={s.icon} size={52} onColor={onDark} />}
                <span className={`display text-5xl text-transparent ${stroke}`}>{pad(i + 1)}</span>
              </span>
              <span aria-hidden="true" className={`mt-5 block h-px w-24 lg:mt-0 ${rule}`} />
              <h3 className="display mt-5 text-[clamp(1.75rem,2.6vw,2.5rem)] leading-tight">
                <span className="sr-only">{i + 1}, {s.title}: </span>
                {s.heading}
              </h3>
              <p className={`lede mt-4 max-w-md ${soft}`}>{s.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </motion.section>
  );
}
