import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowUpRight, Clock } from 'lucide-react';
import { nav, site } from '../data/site';
import { ease, prefersReducedMotion } from '../lib/motion';

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

const link = 'nav-link inline-block no-underline [--accent:var(--skin)]';

/**
 * "Giant wordmark" footer: one slim row of links and contact details, the copyright line, and
 * the name in huge gradient letters across the full width, cut off by the bottom edge.
 */
export default function Footer() {
  const time = useLahoreTime();
  const year = new Date().getFullYear();
  const letters = Array.from(site.name);
  const still = prefersReducedMotion();

  return (
    <footer className="grain relative overflow-hidden bg-[color:var(--band-deep)] text-[#F5F6FF] [--heading:#FFFFFF]">
      <div className="container-site grid gap-10 pt-16 md:grid-cols-12 md:items-start md:pt-20">
        {/* Name and availability */}
        <div className="md:col-span-4">
          <Link to="/" className="inline-flex items-center gap-3 no-underline" aria-label={`${site.name}, home`}>
            <span aria-hidden="true" className="display grid h-10 w-10 place-items-center rounded-input bg-accent text-base text-white">NH</span>
            <span className="display text-xl">{site.name}</span>
          </Link>
          <p className="mt-4 flex items-center gap-2.5 text-sm text-[rgba(245,246,255,0.8)]">
            <span aria-hidden="true" className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#22C55E] opacity-70 motion-reduce:hidden" />
              <span className="relative h-2.5 w-2.5 rounded-full bg-[#4ADE80]" />
            </span>
            {site.availability}
          </p>
        </div>

        {/* Pages on one line */}
        <nav aria-label="Footer" className="md:col-span-4">
          <ul className="flex flex-wrap gap-x-6 gap-y-2 font-semibold">
            {nav.map((item) => (
              <li key={item.to}><Link to={item.to} className={link}>{item.label}</Link></li>
            ))}
          </ul>
        </nav>

        {/* Contact */}
        <div className="space-y-2 md:col-span-4 md:text-right">
          <a href={`mailto:${site.email}`} className={`${link} font-semibold [overflow-wrap:anywhere]`}>{site.email}</a>
          <p>
            <a className={`${link} inline-flex items-center gap-1`} href={site.linkedin} target="_blank" rel="noopener noreferrer">
              LinkedIn <ArrowUpRight size={15} aria-hidden="true" /><span className="sr-only"> (opens in a new tab)</span>
            </a>
          </p>
          <p className="inline-flex items-center gap-1.5 text-sm text-[rgba(245,246,255,0.75)]">
            <Clock size={14} aria-hidden="true" /> {time} in {site.location.split(',')[0]}
          </p>
        </div>
      </div>

      <div className="container-site mt-12 flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-6 text-sm text-[rgba(245,246,255,0.7)]">
        <p>© {year} {site.name}. Designed and built by hand.</p>
        <p>WordPress · WooCommerce · Shopify</p>
      </div>

      {/* Giant wordmark: letters rise in one by one and lift on hover; the bottom is cut off by the edge. */}
      <div aria-hidden="true" className="mt-6 h-[0.8em] select-none overflow-hidden px-[1.5vw] text-[12.6vw] leading-none opacity-[0.14] transition-opacity duration-500 hover:opacity-[0.3]">
        {/* The line itself is watched (the letters start hidden below it, so they can't be). */}
        <motion.p
          className="display flex justify-between whitespace-nowrap leading-[1] tracking-[-0.03em]"
          initial={still ? 'show' : 'hidden'}
          whileInView="show"
          viewport={{ once: true }}
        >
          {letters.map((ch, i) => (
            <motion.span
              key={i}
              className="inline-block bg-gradient-to-b from-[#A5B4FC] via-[#7DD3FC] to-[#7DD3FC]/10 bg-clip-text text-transparent"
              variants={{
                hidden: { y: '100%' },
                show: { y: '0%', transition: { duration: 0.9, ease: ease.out, delay: i * 0.035 } },
              }}
              whileHover={still ? undefined : { y: '-8%', transition: { duration: 0.3 } }}
            >
              {ch === ' ' ? ' ' : ch}
            </motion.span>
          ))}
        </motion.p>
      </div>
    </footer>
  );
}
