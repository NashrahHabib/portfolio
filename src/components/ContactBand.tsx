import { useEffect, useRef, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { ArrowUpRight, Check, Copy, X } from 'lucide-react';
import { site } from '../data/site';
import { hasFinePointer, prefersReducedMotion } from '../lib/motion';
import ContactForm from './ContactForm';
import ScrollMarquee from './motion/ScrollMarquee';

/**
 * Contact: "Let’s work together" runs across the page in huge type (it drifts and speeds up with
 * scrolling), and a round "Start a project" button sits on top of it. On a mouse or trackpad the
 * button is magnetic: it leans towards the pointer anywhere in the section. It opens the contact
 * form in a dialog. Email (with a copy button), LinkedIn and Instagram sit underneath.
 */
export default function ContactBand() {
  const [copied, setCopied] = useState(false);
  const area = useRef<HTMLDivElement>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const [fine] = useState(() => hasFinePointer() && !prefersReducedMotion());

  // Magnetic pull towards the pointer
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const x = useSpring(mx, { stiffness: 150, damping: 15, mass: 0.4 });
  const y = useSpring(my, { stiffness: 150, damping: 15, mass: 0.4 });

  const onMove = (e: React.PointerEvent) => {
    if (!fine || !area.current) return;
    const r = area.current.getBoundingClientRect();
    const dx = e.clientX - (r.left + r.width / 2);
    const dy = e.clientY - (r.top + r.height / 2);
    const clamp = (v: number, m: number) => Math.max(-m, Math.min(m, v));
    mx.set(clamp(dx * 0.35, 220));
    my.set(clamp(dy * 0.35, 90));
  };
  const onLeave = () => { mx.set(0); my.set(0); };

  useEffect(() => {
    if (!copied) return;
    const t = window.setTimeout(() => setCopied(false), 2500);
    return () => window.clearTimeout(t);
  }, [copied]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(site.email);
      setCopied(true);
    } catch {
      window.location.href = `mailto:${site.email}`;
    }
  };

  const open = () => dialog.current?.showModal();
  const close = () => dialog.current?.close();

  return (
    <section id="contact" aria-labelledby="contact-title" className="tone-base relative scroll-mt-16 overflow-hidden pb-24 pt-20 md:pb-32 md:pt-28">
      <div className="container-site flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow">Contact</p>
          <h2 id="contact-title" className="display h-section mt-3">Have a project in mind?</h2>
        </div>
        <p className="flex items-center gap-2.5 text-sm text-muted">
          <span aria-hidden="true" className="relative flex h-2.5 w-2.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#22C55E] opacity-70 motion-reduce:hidden" />
            <span className="relative h-2.5 w-2.5 rounded-full bg-[#16A34A]" />
          </span>
          {site.availability}
        </p>
      </div>

      {/* Marquee with the magnetic button on top */}
      <div ref={area} className="relative mt-6 md:mt-10" onPointerMove={onMove} onPointerLeave={onLeave}>
        <ScrollMarquee words={['Let’s work together']} reverseWords={['Start a project']} />
        <div className="pointer-events-none absolute inset-0 grid place-items-center">
          <motion.button
            type="button"
            onClick={open}
            style={{ x, y }}
            data-cursor="Hello"
            className="pointer-events-auto grid h-36 w-36 place-items-center rounded-full bg-gradient-to-br from-[var(--grad-a)] to-[var(--grad-b)] text-center font-semibold text-white shadow-lg transition-[box-shadow,transform] duration-300 hover:scale-105 hover:shadow-[0_20px_60px_-10px_rgba(67,56,202,0.6)] focus-visible:outline-offset-4 md:h-48 md:w-48 md:text-lg"
          >
            <span className="flex flex-col items-center gap-1 leading-tight">
              Start a<br />project
              <ArrowUpRight size={22} aria-hidden="true" />
            </span>
          </motion.button>
        </div>
      </div>

      {/* Ways to reach me */}
      <div className="container-site mt-6 grid gap-6 md:mt-10 md:grid-cols-3 md:items-end">
        <div className="md:col-span-2">
          <p className="text-sm text-muted">Email me</p>
          <div className="mt-1 flex flex-wrap items-center gap-3">
            <a href={`mailto:${site.email}`} className="display link text-[clamp(1.4rem,3.2vw,2.5rem)] [overflow-wrap:anywhere]">{site.email}</a>
            <button type="button" onClick={copy} className="hover-grad inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-sm font-semibold">
              {copied ? <Check size={16} aria-hidden="true" /> : <Copy size={16} aria-hidden="true" />}
              {copied ? 'Copied' : 'Copy'}
            </button>
          </div>
          <p className="sr-only" aria-live="polite">{copied ? `${site.email} copied to the clipboard` : ''}</p>
        </div>
        <ul className="flex flex-wrap gap-x-6 gap-y-2 font-semibold md:justify-end">
          <li>
            <a className="link inline-flex items-center gap-1" href={site.linkedin} target="_blank" rel="noopener noreferrer">
              LinkedIn <ArrowUpRight size={16} aria-hidden="true" /><span className="sr-only"> (opens in a new tab)</span>
            </a>
          </li>
          <li>
            <a className="link inline-flex items-center gap-1" href={site.instagram} target="_blank" rel="noopener noreferrer">
              Instagram <ArrowUpRight size={16} aria-hidden="true" /><span className="sr-only"> (opens in a new tab)</span>
            </a>
          </li>
        </ul>
      </div>

      {/* The form, in a dialog */}
      <dialog
        ref={dialog}
        aria-labelledby="contact-form-title"
        data-lenis-prevent
        onClick={(e) => { if (e.target === dialog.current) close(); }}
        className="w-[min(40rem,calc(100vw-2rem))] max-h-[calc(100svh-2rem)] overflow-y-auto rounded-panel border border-line bg-paper p-0 text-ink shadow-lg backdrop:bg-[#0D0E24]/60 backdrop:backdrop-blur-sm"
      >
        <div className="p-6 sm:p-8">
          <div className="mb-6 flex items-start justify-between gap-4">
            <div>
              <p className="eyebrow">Start a project</p>
              <h3 id="contact-form-title" className="display h-item mt-2">Tell me about your site</h3>
            </div>
            <button type="button" onClick={close} aria-label="Close" className="hover-grad grid h-10 w-10 shrink-0 place-items-center rounded-full border">
              <X size={18} aria-hidden="true" />
            </button>
          </div>
          <ContactForm />
        </div>
      </dialog>
    </section>
  );
}
