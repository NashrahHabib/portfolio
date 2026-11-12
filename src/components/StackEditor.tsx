import { useState } from 'react';
import { motion } from 'framer-motion';
import { FileCode2, FolderOpen } from 'lucide-react';
import { stackGroups, type StackItem } from '../data/stack';
import { ease, prefersReducedMotion } from '../lib/motion';
import TechLogo from './TechLogo';
import SplitText from './motion/SplitText';

const ALL = 'stack.ts';

/** A code-style key for each category, e.g. "E-commerce and payments" → "ecommerce". */
const keyOf = (title: string) => {
  const words = title.toLowerCase().replace(/[^a-z ]/g, '').split(' ').filter((w) => w && w !== 'and');
  return words[0] + words.slice(1).map((w) => w[0].toUpperCase() + w.slice(1)).join('');
};

/* Syntax colours (on the dark band) */
const kw = 'text-[#C4B5FD]';      // keywords
const str = 'text-[#7DD3FC]';     // strings
const cmt = 'text-white/45 italic'; // comments
const punc = 'text-white/60';     // brackets, commas
const prop = 'text-[#F9A8D4]';    // object keys

/**
 * Tools and technologies as a code editor: the stack is "written" as a TypeScript file, one line
 * at a time as it scrolls into view, with each tool's logo beside its name. The explorer on the
 * left opens one category (the rest dim); pointing at or tabbing to a tool shows what it's used
 * for in the status bar. Every tool is a real list item, so screen readers get a plain list.
 */
export default function StackEditor() {
  const [file, setFile] = useState(ALL);
  const [hover, setHover] = useState<StackItem | null>(null);
  const still = prefersReducedMotion();
  const total = stackGroups.reduce((n, g) => n + g.items.length, 0);

  // Build the lines: a comment and an opening line, the tools, then a closing line per category.
  type Line = { key: string; group?: string; node: React.ReactNode };
  const lines: Line[] = [
    { key: 'c1', node: <span className={cmt}>{'// The tools behind every build'}</span> },
    { key: 'open', node: <><span className={kw}>export const</span> stack <span className={punc}>=</span> <span className={punc}>{'{'}</span></> },
  ];
  for (const g of stackGroups) {
    const k = keyOf(g.title);
    lines.push({ key: `${k}-c`, group: g.title, node: <span className={`pl-6 ${cmt}`}>{`// ${g.summary}`}</span> });
    lines.push({
      key: k,
      group: g.title,
      node: (
        <span className="block pl-6">
          <span className={prop}>{k}</span>
          <span className={punc}>: [</span>
          <ul aria-label={g.title} className="inline">
            {g.items.map((item, i) => (
              <li
                key={item.name}
                tabIndex={0}
                className="ml-1.5 inline-flex items-center gap-1.5 rounded-md px-1 align-middle outline-offset-2 transition-colors hover:bg-white/10 focus-visible:bg-white/10"
                onMouseEnter={() => setHover(item)}
                onMouseLeave={() => setHover(null)}
                onFocus={() => setHover(item)}
                onBlur={() => setHover(null)}
              >
                <TechLogo item={item} size={20} className="!rounded-[0.35rem] !shadow-none" />
                <span className={str}>'{item.name}'{i < g.items.length - 1 && !item.learning && <span aria-hidden="true" className={punc}>,</span>}</span>
                {item.learning && <span className={cmt}>{'/* learning */'}{i < g.items.length - 1 && <span aria-hidden="true" className={punc}>,</span>}</span>}
              </li>
            ))}
          </ul>
          <span className={punc}>],</span>
        </span>
      ),
    });
  }
  lines.push({ key: 'close', node: <span className={punc}>{'};'}</span> });

  const files = [ALL, ...stackGroups.map((g) => `${keyOf(g.title)}.ts`)];
  const activeGroup = file === ALL ? null : stackGroups.find((g) => `${keyOf(g.title)}.ts` === file)?.title;

  return (
    <section id="tools" aria-labelledby="tools-title" className="tone-accent grain section-pad relative scroll-mt-16 overflow-hidden !bg-[color:var(--band-deep)]">
      <div aria-hidden="true" className="orb !absolute left-[calc(50%-18rem)] top-24 h-[36rem] w-[36rem] bg-[#4338CA] opacity-25" />

      <div className="container-site relative">
        <div className="mx-auto max-w-4xl text-center">
          <p className="eyebrow">My Stack</p>
          <SplitText id="tools-title" text="The Tools Behind Every *Build*" className="display h-section mt-3" />
          <p className="lede mt-5 text-white/75">The platforms, plugins, languages, hosts and services I use to design, build, launch and look after websites.</p>
        </div>

        {/* The editor window */}
        <div className="mt-12 overflow-hidden rounded-panel border border-white/15 bg-[#0A0B1C]/90 shadow-lg backdrop-blur">
          {/* Title bar with tabs */}
          <div className="flex items-center gap-4 border-b border-white/10 bg-white/[0.03] px-4">
            <span aria-hidden="true" className="flex gap-1.5 py-3.5">
              <span className="h-3 w-3 rounded-full bg-[#FF5F57]" />
              <span className="h-3 w-3 rounded-full bg-[#FEBC2E]" />
              <span className="h-3 w-3 rounded-full bg-[#28C840]" />
            </span>
            <span className="flex items-center gap-2 self-stretch border-x border-white/10 border-b-2 border-b-[color:var(--skin)] bg-[#0A0B1C] px-4 font-mono text-sm text-white/90">
              <FileCode2 size={15} aria-hidden="true" className="text-[#7DD3FC]" /> {file}
            </span>
          </div>

          <div className="grid lg:grid-cols-[14rem_1fr]">
            {/* Explorer: one file per category */}
            <nav aria-label="Stack categories" className="hidden border-r border-white/10 py-4 font-mono text-sm lg:block">
              <p className="flex items-center gap-2 px-4 pb-2 text-xs uppercase tracking-[1.75px] text-white/50">
                <FolderOpen size={14} aria-hidden="true" /> Explorer
              </p>
              <ul>
                {files.map((f) => (
                  <li key={f}>
                    <button
                      type="button"
                      aria-pressed={file === f}
                      onClick={() => setFile(f)}
                      className={`flex w-full items-center gap-2 px-4 py-1.5 text-left transition-colors ${
                        file === f ? 'bg-white/10 text-white' : 'text-white/65 hover:bg-white/5 hover:text-white'
                      }`}
                    >
                      <FileCode2 size={14} aria-hidden="true" className="shrink-0 text-[#7DD3FC]" /> {f}
                    </button>
                  </li>
                ))}
              </ul>
            </nav>

            {/* Code */}
            <motion.ol
              className="min-w-0 py-5 font-mono text-[13px] leading-[2] text-white/90 sm:text-sm"
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: '0px 0px -15% 0px' }}
            >
              {lines.map((l, n) => {
                const dim = activeGroup && l.group !== activeGroup;
                return (
                  <motion.li
                    key={l.key}
                    className="grid grid-cols-[2.5rem_1fr] pr-4 sm:grid-cols-[3.25rem_1fr]"
                    variants={{
                      hidden: still ? { opacity: 1 } : { opacity: 0, x: -10 },
                      show: { opacity: 1, x: 0, transition: { duration: 0.4, ease: ease.out, delay: n * 0.06 } },
                    }}
                  >
                    <span aria-hidden="true" className="select-none pr-4 text-right text-white/30">{n + 1}</span>
                    <span className={`min-w-0 transition-opacity duration-500 ${dim ? "opacity-25" : "opacity-100"}`}>{l.node}</span>
                  </motion.li>
                );
              })}
              <li aria-hidden="true" className="grid grid-cols-[2.5rem_1fr] sm:grid-cols-[3.25rem_1fr]">
                <span />
                <span className="h-5 w-2 animate-pulse bg-[color:var(--skin)] motion-reduce:animate-none" />
              </li>
            </motion.ol>
          </div>

          {/* Status bar: what the pointed-at tool is used for */}
          <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-1 border-t border-white/10 bg-[#4338CA] px-4 py-1.5 font-mono text-xs text-white" aria-live="polite">
            <span className="min-w-0 truncate">{hover ? `${hover.name} — ${hover.note}` : 'Point at a tool to see what I use it for'}</span>
            <span className="text-white/80">TypeScript · {total} tools</span>
          </div>
        </div>
      </div>
    </section>
  );
}
