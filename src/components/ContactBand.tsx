import { useEffect, useRef, useState } from 'react';
import { ArrowUpRight, Check, Clock, Copy, Mail, X } from 'lucide-react';
import { site } from '../data/site';
import SplitText from './motion/SplitText';
import ContactForm from './ContactForm';

/** Local time in Lahore, refreshed every 20 seconds. */
function useLahoreTime() {
  const format = () =>
    new Intl.DateTimeFormat('en-GB', { timeZone: 'Asia/Karachi', hour: '2-digit', minute: '2-digit', hour12: true }).format(new Date());
  const [time, setTime] = useState(format);
  useEffect(() => {
    const t = window.setInterval(() => setTime(format()), 20000);
    return () => window.clearInterval(t);
  }, []);
  return time;
}

/**
 * Contact: the email address is the headline, set huge across the page. Pointing at it fills it
 * with the gradient from left to right; clicking it copies the address. Below it, "Start a project"
 * opens the contact form in a dialog, next to an email link, LinkedIn, Instagram and the time in Lahore.
 */
export default function ContactBand() {
  const [copied, setCopied] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  const time = useLahoreTime();

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
  const [user, domain] = site.email.split('@');

  return (
    <section id="contact" aria-labelledby="contact-title" className="tone-base relative scroll-mt-16 overflow-hidden pb-24 pt-20 md:pb-32 md:pt-28">
      <div aria-hidden="true" className="orb left-[calc(50%-12rem)] top-[18%] h-[24rem] w-[24rem] bg-[color:var(--skin)] opacity-25" />

      <div className="container-site relative">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="eyebrow">Contact</p>
            <SplitText id="contact-title" text="Something worth *building?*" className="display h-section mt-3" />
          </div>
          <p className="flex items-center gap-2.5 text-sm text-muted">
            <span aria-hidden="true" className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#22C55E] opacity-70 motion-reduce:hidden" />
              <span className="relative h-2.5 w-2.5 rounded-full bg-[#16A34A]" />
            </span>
            {site.availability}
          </p>
        </div>

        {/* The email as the headline: click to copy */}
        <button
          type="button"
          onClick={copy}
          data-cursor={copied ? 'Copied' : 'Copy'}
          aria-label={`Copy email address ${site.email}`}
          className="group mt-10 block w-full border-y border-line py-8 text-left md:mt-14 md:py-12"
        >
          <span className="relative block">
            <span className="display block text-[clamp(1.6rem,6vw,5.5rem)] leading-none tracking-[-0.03em] md:whitespace-nowrap [overflow-wrap:anywhere]">
              {user}<span className="text-[color:var(--label)]">@</span>{domain}
            </span>
            <span
              aria-hidden="true"
              className="display hl absolute inset-0 block text-[clamp(1.6rem,6vw,5.5rem)] leading-none tracking-[-0.03em] md:whitespace-nowrap transition-[clip-path] duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] [clip-path:inset(0_100%_0_0)] [overflow-wrap:anywhere] group-hover:[clip-path:inset(0_0_0_0)] group-focus-visible:[clip-path:inset(0_0_0_0)] motion-reduce:transition-none"
            >
              {site.email}
            </span>
          </span>
          <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-muted">
            {copied ? <Check size={16} aria-hidden="true" className="text-[#16A34A]" /> : <Copy size={16} aria-hidden="true" />}
            {copied ? 'Email copied' : 'Click to copy'}
          </span>
        </button>
        <p className="sr-only" aria-live="polite">{copied ? `${site.email} copied to the clipboard` : ''}</p>

        {/* Actions and links */}
        <div className="mt-8 flex flex-wrap items-center justify-between gap-x-8 gap-y-6">
          <div className="flex flex-wrap gap-3">
            <button type="button" onClick={open} className="btn btn-solid">
              Start a project <ArrowUpRight size={18} aria-hidden="true" />
            </button>
            <a href={`mailto:${site.email}`} className="btn btn-line">
              <Mail size={18} aria-hidden="true" /> Write an email
            </a>
          </div>
          <ul className="flex flex-wrap items-center gap-x-6 gap-y-2 font-semibold">
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
            <li className="inline-flex items-center gap-1.5 text-sm font-normal text-muted">
              <Clock size={15} aria-hidden="true" /> {time} in Lahore
            </li>
          </ul>
        </div>
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
