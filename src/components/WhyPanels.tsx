import { useState } from 'react';
import { reasons } from '../data/process';
import FeatureIcon from './FeatureIcon';
import Reveal from './Reveal';
import SplitText from './motion/SplitText';

const pad = (n: number) => String(n).padStart(2, '0');

/**
 * "Why choose me" as expanding panels: on large screens five tall panels sit side by side and
 * the active one (hovered, focused or clicked) widens to reveal its heading and text. On smaller
 * screens the reasons are simple stacked cards. Every panel's text stays in the page for screen
 * readers; the panels are real buttons, so keyboard users can open each one.
 */
export default function WhyPanels() {
  const [active, setActive] = useState(0);

  return (
    <section id="why" aria-labelledby="why-title" className="tone-base section-pad scroll-mt-16">
      <div className="container-site">
        <div className="grid gap-6 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-muted">Why Choose Me</p>
            <SplitText id="why-title" text={['Why Clients', 'Work With *Me.*']} className="display h-section mt-3" />
          </div>
          <p className="lede text-muted lg:col-span-5">
            Five reasons clients bring their websites to me, and keep coming back for the next one.
          </p>
        </div>

        {/* Large screens: expanding panels */}
        <ul className="mt-12 hidden h-[30rem] gap-3 lg:flex">
          {reasons.map((r, i) => {
            const on = i === active;
            return (
              <li
                key={r.title}
                className="min-w-0 transition-[flex-grow] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none"
                style={{ flexGrow: on ? 5 : 1, flexBasis: 0 }}
                onMouseEnter={() => setActive(i)}
              >
                <button
                  type="button"
                  aria-expanded={on}
                  onClick={() => setActive(i)}
                  onFocus={() => setActive(i)}
                  className={`relative flex h-full w-full flex-col overflow-hidden rounded-panel border p-6 text-left transition-colors duration-500 ${
                    on ? 'border-transparent bg-accent text-white shadow-lg' : 'border-line bg-[color:var(--bg-alt)] hover:border-[color:var(--control)]'
                  }`}
                >
                  <span className="flex items-start justify-between gap-3">
                    <FeatureIcon icon={r.icon!} size={52} onColor={on} />
                    <span className={`display text-lg ${on ? 'text-white/80' : 'text-muted'}`}>{pad(i + 1)}</span>
                  </span>

                  {/* Open: the title as a large, faint watermark in the empty top-right area */}
                  <span
                    aria-hidden="true"
                    className={`display pointer-events-none absolute right-6 top-20 select-none whitespace-nowrap text-right text-[clamp(4rem,7.5vw,7.5rem)] leading-none text-white/[0.12] transition-[opacity,transform] duration-700 ${
                      on ? 'translate-x-0 opacity-100 delay-300' : 'translate-x-8 opacity-0'
                    }`}
                  >
                    {r.title}
                  </span>

                  {/* Collapsed: the title runs up the panel */}
                  <span
                    aria-hidden="true"
                    className={`display absolute bottom-6 left-6 origin-bottom-left -rotate-90 translate-x-[1.6rem] whitespace-nowrap text-xl transition-opacity duration-300 ${
                      on ? 'opacity-0' : 'opacity-100 delay-200'
                    }`}
                  >
                    {r.title}
                  </span>

                  {/* Expanded: heading and text */}
                  <span
                    className={`mt-auto block max-w-md transition-[opacity,transform] duration-500 [--heading:#FFFFFF] ${
                      on ? 'translate-y-0 opacity-100 delay-200' : 'pointer-events-none translate-y-4 opacity-0'
                    }`}
                  >
                    <span className="text-sm font-bold uppercase tracking-[0.16em] text-white/75">{r.title}</span>
                    <span className="display mt-2 block text-3xl leading-tight">{r.heading}</span>
                    <span className="mt-3 block text-white/85">{r.text}</span>
                  </span>
                </button>
              </li>
            );
          })}
        </ul>

        {/* Smaller screens: stacked cards */}
        <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:hidden">
          {reasons.map((r, i) => (
            <li key={r.title}>
              <Reveal delay={0.05 * i} className={`h-full rounded-panel border p-6 ${i === 0 ? 'border-transparent bg-accent text-white' : 'card'}`}>
                <span className="flex items-start justify-between gap-3">
                  <FeatureIcon icon={r.icon!} size={48} onColor={i === 0} />
                  <span className={`display text-lg ${i === 0 ? 'text-white/80' : 'text-muted'}`}>{pad(i + 1)}</span>
                </span>
                <p className={`mt-5 text-sm font-bold uppercase tracking-[0.16em] ${i === 0 ? 'text-white/75' : 'text-muted'}`}>{r.title}</p>
                <h3 className="display mt-1 text-2xl leading-tight">{r.heading}</h3>
                <p className={`mt-2 ${i === 0 ? 'text-white/85' : 'text-muted'}`}>{r.text}</p>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
