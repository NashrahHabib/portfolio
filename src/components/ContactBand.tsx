import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Copy, MapPin } from 'lucide-react';
import { site } from '../data/site';
import { ease } from '../lib/motion';
import ContactForm from './ContactForm';
import SplitText from './motion/SplitText';

/**
 * Contact (this replaces the old Contact page): an "availability card" with the portrait, a live
 * availability badge, the headline and a copy-email button on the left, and the contact form on
 * the right.
 */
export default function ContactBand() {
  const [copied, setCopied] = useState(false);

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

  return (
    <section id="contact" className="tone-base section-pad relative scroll-mt-16 overflow-hidden" aria-labelledby="contact-band-title">
      <div aria-hidden="true" className="orb left-[calc(50%-13rem)] top-[calc(50%-13rem)] h-[26rem] w-[26rem] bg-[color:var(--skin)] opacity-30" />

      <div className="container-site relative">
        <motion.div
          className="mx-auto max-w-6xl rounded-[2rem] border border-line bg-[color:var(--bg)] p-6 shadow-soft sm:p-10 md:p-12"
          initial={{ opacity: 0, y: 40, scale: 0.97 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: '0px 0px -10% 0px' }}
          transition={{ duration: 0.9, ease: ease.out }}
        >
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-14">
            {/* Left: who you're writing to */}
            <div className="text-center lg:col-span-5 lg:text-left">
              <div className="relative mx-auto w-40 lg:mx-0">
                <span aria-hidden="true" className="absolute -inset-2 rounded-full bg-[conic-gradient(from_0deg,var(--grad-a),var(--grad-b),var(--skin),var(--grad-a))] opacity-80 [animation:orbit-spin_10s_linear_infinite] motion-reduce:animate-none" />
                <img
                  src={site.portrait}
                  alt={`Portrait of ${site.name}`}
                  className="relative aspect-square w-full rounded-full border-4 border-[color:var(--bg)] object-cover object-top"
                />
                <span className="absolute -bottom-3 left-1/2 inline-flex -translate-x-1/2 items-center gap-2 whitespace-nowrap rounded-full border border-line bg-paper px-3.5 py-1.5 text-xs font-semibold shadow-card">
                  <span aria-hidden="true" className="relative flex h-2.5 w-2.5">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#22C55E] opacity-70 motion-reduce:hidden" />
                    <span className="relative h-2.5 w-2.5 rounded-full bg-[#16A34A]" />
                  </span>
                  Available for new projects
                </span>
              </div>

              <SplitText id="contact-band-title" text="Let’s Build Something Worth *Visiting.*" className="display h-section mx-auto mt-10 max-w-[16ch] lg:mx-0" />
              <p className="mx-auto mt-4 max-w-md text-muted lg:mx-0">
                Have a design that’s ready to build, or a site that needs fixing? Tell me about it and I’ll reply by email.
              </p>

              <div className="mt-6 flex flex-wrap justify-center gap-3 lg:justify-start">
                <button type="button" className="btn btn-line" onClick={copy}>
                  {copied ? <Check size={18} aria-hidden="true" /> : <Copy size={18} aria-hidden="true" />}
                  {copied ? 'Email copied' : 'Copy email'}
                </button>
                <a className="btn btn-line" href={site.linkedin} target="_blank" rel="noopener noreferrer">
                  LinkedIn<span className="sr-only"> (opens in a new tab)</span>
                </a>
              </div>
              <p className="sr-only" aria-live="polite">{copied ? `${site.email} copied to the clipboard` : ''}</p>

              <div className="mt-6 space-y-1 text-sm text-muted">
                <p><a className="link font-semibold text-ink" href={`mailto:${site.email}`}>{site.email}</a></p>
                <p className="inline-flex items-center gap-1.5"><MapPin size={15} aria-hidden="true" /> {site.location}. {site.availability}.</p>
              </div>
            </div>

            {/* Right: the form */}
            <div className="rounded-panel border border-line bg-[color:var(--bg-alt)] p-5 sm:p-8 lg:col-span-7">
              <h3 className="display h-item mb-6">Send a message</h3>
              <ContactForm />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
