import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useInView, useMotionValue, useScroll, useSpring, useTransform } from 'framer-motion';
import { Lock, Pause, Play, RotateCw, Wrench } from 'lucide-react';
import { siPython, siShopify, siWoocommerce, siWordpress } from 'simple-icons';
import type { StackItem } from '../data/stack';
import { asset } from '../lib/projects';
import { ease, hasFinePointer, prefersReducedMotion } from '../lib/motion';
import TechLogo from './TechLogo';
import SplitText from './motion/SplitText';

interface Tab {
  id: string;
  /** The tool's name as shown on the tab. */
  name: string;
  label: string;
  logo: StackItem;
  url: string;
  shot: string;
  doing: string;
}

/** Full-screen captures from each tool's own official documentation. */
const tabs: Tab[] = [
  {
    id: 'wordpress',
    name: 'WordPress',
    label: 'Block editor',
    logo: { name: 'WordPress', note: '', logo: siWordpress },
    url: 'yoursite.com/wp-admin/post-new.php',
    shot: '/images/editors/wordpress-block-editor.jpg',
    doing: 'Building pages with blocks in the WordPress editor.',
  },
  {
    id: 'woocommerce',
    name: 'WooCommerce',
    label: 'Cart page',
    logo: { name: 'WooCommerce', note: '', logo: siWoocommerce, scale: 1.85 },
    url: 'yourstore.com/wp-admin/site-editor.php?p=cart',
    shot: '/images/editors/woocommerce-block-editor.jpg',
    doing: 'Laying out a WooCommerce cart page with blocks.',
  },
  {
    id: 'shopify',
    name: 'Shopify',
    label: 'Theme editor',
    logo: { name: 'Shopify', note: '', logo: siShopify },
    url: 'admin.shopify.com/store/your-store/themes',
    shot: '/images/editors/shopify-theme-editor.jpg',
    doing: 'Customising a Shopify theme in the theme editor.',
  },
  {
    id: 'updates',
    name: 'WordPress',
    label: 'Updates',
    logo: { name: 'Maintenance', note: '', icon: Wrench },
    url: 'yoursite.com/wp-admin/update-core.php',
    shot: '/images/editors/wordpress-updates.jpg',
    doing: 'Keeping WordPress, plugins and themes up to date.',
  },
  {
    id: 'python',
    name: 'Python',
    label: 'Installer',
    logo: { name: 'Python', note: '', logo: siPython },
    url: 'python.org/downloads',
    shot: '/images/editors/python-installer.jpg',
    doing: 'Learning Python on the side, for automation and AI.',
  },
];

const STEP = 5200; // ms each tab stays open while the tour plays

/** Where each tool's floating bubble sits around the monitor (large screens). */
const bubbleSpots = [
  '-left-7 top-[18%]',
  '-right-6 -top-6',
  '-left-10 bottom-[34%]',
  '-right-9 top-[46%]',
  'left-[16%] -bottom-2',
];

/**
 * "At my desk": the text on the left, and on the right a monitor with a browser full of
 * tabs, one per tool I use, each showing that tool's full-screen capture from its official docs.
 * While the section is on screen a cursor tours the tabs on its own, gliding to the next tab and
 * clicking it; clicking a tab (or the list on the left) stops the tour, Play resumes it.
 * The tabs are a real tab list for keyboards and screen readers. Reduced motion: no tour.
 */
export default function DeskTabs() {
  const [active, setActive] = useState(0);
  const [playing, setPlaying] = useState(() => !prefersReducedMotion());
  const [cursor, setCursor] = useState<{ x: number; y: number; click: number } | null>(null);
  const scene = useRef<HTMLDivElement>(null);
  const screen = useRef<HTMLDivElement>(null);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const inView = useInView(scene, { amount: 0.45 });
  const tab = tabs[active];
  const [still] = useState(prefersReducedMotion);
  const [fine] = useState(hasFinePointer);

  // Where a tab sits inside the screen, for the touring cursor.
  const pointAt = useCallback((i: number) => {
    const el = tabRefs.current[i];
    const box = screen.current;
    if (!el || !box) return null;
    const r = el.getBoundingClientRect();
    const b = box.getBoundingClientRect();
    return { x: r.left - b.left + Math.min(r.width * 0.45, 50), y: r.top - b.top + r.height * 0.6 };
  }, []);

  // The tour: glide to the next tab, click, open it.
  useEffect(() => {
    if (!playing || !inView) return;
    let click: number | undefined;
    const t = window.setTimeout(() => {
      const next = (active + 1) % tabs.length;
      const p = pointAt(next);
      if (p) setCursor((c) => ({ ...p, click: c?.click ?? 0 }));
      click = window.setTimeout(() => {
        setCursor((c) => (c ? { ...c, click: c.click + 1 } : c));
        setActive(next);
      }, 900);
    }, STEP - 900);
    return () => { window.clearTimeout(t); if (click) window.clearTimeout(click); };
  }, [active, playing, inView, pointAt]);

  // Park the cursor on the page when the tour starts.
  useEffect(() => {
    if (playing && inView && !cursor && screen.current) {
      const b = screen.current.getBoundingClientRect();
      setCursor({ x: b.width * 0.6, y: b.height * 0.6, click: 0 });
    }
  }, [playing, inView, cursor]);

  // Scroll: the monitor rises and straightens up as it comes into view.
  const { scrollYProgress } = useScroll({ target: scene, offset: ['start end', 'center center'] });
  const enterX = useTransform(scrollYProgress, [0, 1], still ? [0, 0] : [24, 0]);
  const lift = useTransform(scrollYProgress, [0, 1], still ? [0, 0] : [60, 0]);
  const grow = useTransform(scrollYProgress, [0, 1], still ? [1, 1] : [0.9, 1]);

  // Pointer: the monitor tilts towards it, the glass catches a glare, the bubbles drift away from it.
  const tx = useMotionValue(0);
  const ty = useMotionValue(0);
  const sx = useSpring(tx, { stiffness: 120, damping: 16 });
  const sy = useSpring(ty, { stiffness: 120, damping: 16 });
  const rotateX = useTransform([enterX, sy] as const, ([e, s]: number[]) => e - s * 7);
  const rotateY = useTransform(sx, (v) => v * 9);
  const bx = [useTransform(sx, (v) => v * -18), useTransform(sx, (v) => v * 14), useTransform(sx, (v) => v * -10), useTransform(sx, (v) => v * 16), useTransform(sx, (v) => v * -14)];
  const by = [useTransform(sy, (v) => v * -12), useTransform(sy, (v) => v * 10), useTransform(sy, (v) => v * -16), useTransform(sy, (v) => v * 12), useTransform(sy, (v) => v * -8)];
  const [glare, setGlare] = useState<{ x: number; y: number } | null>(null);
  const onTilt = (e: React.PointerEvent) => {
    if (!fine || still || !scene.current) return;
    const r = scene.current.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    tx.set(px - 0.5);
    ty.set(py - 0.5);
    setGlare({ x: px * 100, y: py * 100 });
  };

  // The address bar types out each new address.
  const [typed, setTyped] = useState(tabs[0].url.length);
  const first = useRef(true);
  useEffect(() => {
    if (first.current) { first.current = false; return; }
    if (still) { setTyped(tab.url.length); return; }
    setTyped(0);
    const id = window.setInterval(() => setTyped((n) => (n >= tab.url.length ? (window.clearInterval(id), n) : n + 2)), 18);
    return () => window.clearInterval(id);
  }, [active, still, tab.url.length]);

  // The bubbles pop in once, the first time the section is seen.
  const seen = useRef(false);
  useEffect(() => { if (inView) { const t = window.setTimeout(() => { seen.current = true; }, 1200); return () => window.clearTimeout(t); } }, [inView]);

  const choose = (i: number) => {
    setPlaying(false);
    setCursor(null);
    setActive(i);
  };

  // Arrow keys move between tabs (the usual tab-list pattern).
  const onKey = (e: React.KeyboardEvent) => {
    const d = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
    if (!d) return;
    e.preventDefault();
    const next = (active + d + tabs.length) % tabs.length;
    choose(next);
    tabRefs.current[next]?.focus();
  };

  return (
    <section id="desk" aria-labelledby="desk-title" className="tone-base section-pad relative scroll-mt-16 overflow-hidden">
      <div aria-hidden="true" className="orb -right-32 top-24 h-80 w-80 bg-[color:var(--skin)] opacity-30" />

      <div className="container-site relative grid items-center gap-12 lg:grid-cols-12 lg:gap-14">
        {/* Left: the words */}
        <div className="lg:col-span-5">
          <p className="eyebrow">At my desk</p>
          <SplitText id="desk-title" text="A Day in *My Tabs*" className="display h-section mt-3" />
          <p className="lede mt-5 text-muted">
            Most days I have these open side by side. Watch the tour, or pick a tab to look around.
          </p>

          {/* What's open right now */}
          <div className="mt-8 rounded-panel border border-line bg-[color:var(--bg-alt)] p-5" aria-live="polite">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={tab.id}
                className="flex items-start gap-4"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.35, ease: ease.out }}
              >
                <TechLogo item={tab.logo} size={44} />
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[1.75px] text-[color:var(--label)]">Now open</p>
                  <p className="mt-1 font-semibold text-ink">{tab.name} · {tab.label}</p>
                  <p className="mt-1 text-muted">{tab.doing}</p>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="mt-5 flex items-center gap-3 text-sm text-muted">
            <button
              type="button"
              onClick={() => { setPlaying((p) => !p); setCursor(null); }}
              className="hover-grad inline-flex items-center gap-2 rounded-full border px-4 py-2 font-semibold"
            >
              {playing ? <Pause size={15} aria-hidden="true" /> : <Play size={15} aria-hidden="true" />}
              {playing ? 'Pause the tour' : 'Play the tour'}
            </button>
            <span className="tabular-nums">{active + 1} / {tabs.length}</span>
          </div>
          <p className="mt-6 text-xs text-[color:var(--label)]">Screenshots from the official WordPress, WooCommerce, Shopify and Python documentation.</p>
        </div>

        {/* Right: the monitor, with the tools floating around it */}
        <div
          ref={scene}
          className="relative mx-auto w-full min-w-0 max-w-[34rem] [perspective:1400px] lg:col-span-7"
          onPointerMove={onTilt}
          onPointerLeave={() => { tx.set(0); ty.set(0); setGlare(null); }}
        >
          {/* Floating tool bubbles: click one to open its tab */}
          {tabs.map((t, i) => {
            const on = i === active;
            return (
              <motion.button
                key={t.id}
                type="button"
                tabIndex={-1}
                aria-hidden="true"
                onClick={() => choose(i)}
                className={`absolute z-20 hidden rounded-2xl transition-[box-shadow] duration-300 md:block ${bubbleSpots[i]} ${
                  on ? 'shadow-[0_0_0_3px_var(--accent),0_12px_30px_-8px_rgba(67,56,202,0.55)]' : 'shadow-card hover:shadow-[0_0_0_2px_var(--line),0_10px_24px_-8px_rgba(20,21,50,0.3)]'
                }`}
                style={{ x: bx[i], y: by[i] }}
                initial={still ? false : { opacity: 0, scale: 0.4 }}
                animate={inView ? { opacity: 1, scale: on ? 1.12 : 1 } : undefined}
                whileHover={still ? undefined : { scale: 1.18, rotate: i % 2 ? 6 : -6 }}
                whileTap={{ scale: 0.92 }}
                transition={{ type: 'spring', stiffness: 260, damping: 18, delay: inView && !seen.current ? 0.35 + i * 0.08 : 0 }}
              >
                <motion.span
                  className="block"
                  animate={still ? undefined : { y: [0, i % 2 ? 7 : -7, 0] }}
                  transition={{ duration: 3.6 + i * 0.4, repeat: Infinity, ease: 'easeInOut' }}
                >
                  <TechLogo item={t.logo} size={46} />
                </motion.span>
              </motion.button>
            );
          })}

          {/* Monitor: rises and straightens as it scrolls in, then tilts towards the pointer */}
          <motion.div style={{ rotateX, rotateY, y: lift, scale: grow, transformStyle: 'preserve-3d' }} className="relative z-10">
          <div className="relative rounded-[1.25rem] bg-[#141532] p-2.5 shadow-lg sm:p-3">
            {/* Glare that follows the pointer across the glass */}
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 z-40 rounded-[1.25rem] transition-opacity duration-300"
              style={{
                opacity: glare ? 1 : 0,
                background: glare ? `radial-gradient(420px circle at ${glare.x}% ${glare.y}%, rgba(255,255,255,0.22), transparent 55%)` : undefined,
              }}
            />
            <div ref={screen} className="relative overflow-hidden rounded-lg bg-[#ECEDF4]">
              {/* Browser: tab strip */}
              <div className="flex items-end gap-1 bg-[#DCDEE9] px-1.5 pt-1.5">
                <span aria-hidden="true" className="mb-2.5 mr-1 hidden gap-1 lg:flex">
                  <span className="h-2.5 w-2.5 rounded-full bg-[#FF5F57]" />
                  <span className="h-2.5 w-2.5 rounded-full bg-[#FEBC2E]" />
                  <span className="h-2.5 w-2.5 rounded-full bg-[#28C840]" />
                </span>
                <div role="tablist" aria-label="Tools I work in" className="flex min-w-0 flex-1 gap-0.5" onKeyDown={onKey}>
                  {tabs.map((t, i) => {
                    const on = i === active;
                    return (
                      <button
                        key={t.id}
                        ref={(el) => { tabRefs.current[i] = el; }}
                        type="button"
                        role="tab"
                        id={`desk-tab-${t.id}`}
                        aria-selected={on}
                        aria-controls="desk-panel"
                        tabIndex={on ? 0 : -1}
                        onClick={() => choose(i)}
                        className={`relative flex min-w-0 flex-auto items-center justify-center gap-1 rounded-t-md px-1.5 py-1.5 sm:justify-start text-left text-[11px] font-semibold transition-colors ${
                          on ? 'bg-white text-[#141532]' : 'text-[#4A4E6A] hover:bg-white/60'
                        }`}
                      >
                        <TechLogo item={t.logo} size={14} className="!rounded-[3px] !shadow-none" />
                        <span className="hidden truncate sm:inline">{t.id === 'updates' ? 'Updates' : t.name}</span>
                        <span className="sr-only sm:hidden">{t.name}</span>
                        {on && playing && inView && (
                          <motion.span
                            key={`bar-${active}`}
                            aria-hidden="true"
                            className="absolute inset-x-2 bottom-0 h-0.5 origin-left rounded-full bg-[color:var(--accent)]"
                            initial={{ scaleX: 0 }}
                            animate={{ scaleX: 1 }}
                            transition={{ duration: STEP / 1000, ease: 'linear' }}
                          />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Browser: address bar */}
              <div className="flex items-center gap-2 border-b border-[#DCDEE9] bg-white px-3 py-1.5 text-[#4A4E6A]">
                <RotateCw size={13} aria-hidden="true" className="hidden shrink-0 sm:block" />
                <p className="flex min-w-0 flex-1 items-center gap-1.5 rounded-full bg-[#F1F2F7] px-3 py-1 text-xs">
                  <Lock size={11} aria-hidden="true" className="shrink-0" />
                  <span className="truncate">
                    {tab.url.slice(0, typed)}
                    {typed < tab.url.length && <span aria-hidden="true" className="ml-px inline-block h-3 w-px translate-y-0.5 animate-pulse bg-[#141532]" />}
                  </span>
                </p>
              </div>
              {/* Page loading bar */}
              <motion.span
                key={`load-${active}`}
                aria-hidden="true"
                className="-mb-0.5 relative z-20 block h-0.5 origin-left bg-gradient-to-r from-[var(--grad-a)] to-[var(--grad-b)]"
                initial={{ scaleX: 0, opacity: 1 }}
                animate={{ scaleX: 1, opacity: [1, 1, 0] }}
                transition={{ duration: still ? 0 : 0.9, ease: ease.out, opacity: { times: [0, 0.8, 1], duration: still ? 0 : 0.9 } }}
              />

              {/* The page: the whole capture, never cropped */}
              <div id="desk-panel" role="tabpanel" aria-labelledby={`desk-tab-${tab.id}`} className="relative aspect-[16/10] overflow-hidden bg-[#F1F2F7]">
                <AnimatePresence initial={false} mode="wait">
                  <motion.img
                    key={tab.id}
                    src={asset(tab.shot)}
                    alt={`${tab.name}: ${tab.doing} Screenshot from the official documentation.`}
                    className="absolute inset-0 h-full w-full object-contain"
                    initial={{ opacity: 0, scale: 0.985 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3, ease: ease.out }}
                  />
                </AnimatePresence>
              </div>

              {/* The touring cursor */}
              {cursor && playing && inView && (
                <motion.div
                  aria-hidden="true"
                  className="pointer-events-none absolute left-0 top-0 z-30"
                  initial={false}
                  animate={{ x: cursor.x, y: cursor.y }}
                  transition={{ duration: 0.8, ease: ease.inOut }}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" className="drop-shadow-md">
                    <path d="M4 2l15 8.5-6.6 1.6L9.6 19z" fill="#141532" stroke="#fff" strokeWidth="1.6" strokeLinejoin="round" />
                  </svg>
                  <motion.span
                    key={cursor.click}
                    className="absolute -left-2 -top-2 h-6 w-6 rounded-full border-2 border-[color:var(--accent)]"
                    initial={{ scale: 0.3, opacity: cursor.click ? 0.9 : 0 }}
                    animate={{ scale: 1.8, opacity: 0 }}
                    transition={{ duration: 0.6 }}
                  />
                </motion.div>
              )}
            </div>
          </div>
          </motion.div>
          {/* Monitor stand */}
          <div aria-hidden="true" className="mx-auto h-8 w-24 bg-gradient-to-b from-[#B9BCCE] to-[#D8DAE6] [clip-path:polygon(20%_0,80%_0,100%_100%,0_100%)] sm:h-10 sm:w-32" />
          <div aria-hidden="true" className="mx-auto h-2 w-44 rounded-full bg-[#C9CCDA] sm:w-56" />
        </div>
      </div>
    </section>
  );
}
