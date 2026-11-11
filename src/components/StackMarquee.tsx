import { allStackItems, stackGroups, type StackItem } from '../data/stack';
import Reveal from './Reveal';
import TechLogo from './TechLogo';
import SplitText from './motion/SplitText';

function ItemCard({ item }: { item: StackItem }) {
  return (
    <div className="flex w-[19rem] shrink-0 items-center gap-4 rounded-[1.25rem] border border-line bg-paper p-4 shadow-soft">
      <TechLogo item={item} size={52} />
      <div className="min-w-0">
        <p className="flex items-center gap-2 font-extrabold leading-tight">
          {item.name}
          {item.learning && <span className="rounded-full bg-[color:var(--skin-soft)] px-2 py-0.5 text-[0.7rem] font-bold">Learning</span>}
        </p>
        <p className="mt-0.5 text-sm text-muted">{item.note}</p>
      </div>
    </div>
  );
}

/** One endless row. The list is drawn twice so the loop is seamless; the copy is hidden from screen readers. */
function Row({ items, reverse }: { items: StackItem[]; reverse?: boolean }) {
  return (
    <div className="marquee group flex overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_8%,#000_92%,transparent)]">
      {[0, 1].map((copy) => (
        <ul
          key={copy}
          aria-hidden={copy === 1 ? 'true' : undefined}
          className={`marquee-track flex shrink-0 gap-4 pr-4 ${reverse ? 'marquee-reverse' : ''}`}
        >
          {items.map((it) => <li key={it.name}><ItemCard item={it} /></li>)}
        </ul>
      ))}
    </div>
  );
}

/**
 * "Tools and technologies": two rows of logo cards drifting in opposite directions (paused on
 * hover), followed by every tool grouped by category.
 */
export default function StackMarquee({ rowsOnly = false }: { rowsOnly?: boolean }) {
  const half = Math.ceil(allStackItems.length / 2);
  const first = allStackItems.slice(0, half);
  const second = allStackItems.slice(half);

  // Just the two moving rows (used under the homepage stack hub).
  if (rowsOnly) {
    return (
      <div className="tone-base space-y-4 overflow-hidden pb-24">
        <Row items={first} />
        <Row items={second} reverse />
      </div>
    );
  }

  return (
    <section aria-labelledby="tools-title" className="tone-alt section-pad overflow-hidden">
      <div className="container-site text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-muted">Tools and Technologies</p>
        <SplitText id="tools-title" text={['What I Build', 'Websites *With*']} className="display h-page mx-auto mt-3 max-w-3xl" />
        <p className="lede mx-auto mt-5 max-w-xl text-muted">Platforms, languages, payment gateways and services I use every day, from the first line of code to launch and upkeep.</p>
      </div>

      <div className="mt-14 space-y-4">
        <Row items={first} />
        <Row items={second} reverse />
      </div>

      <div className="container-site mt-20 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
        {stackGroups.map((g, i) => (
          <Reveal key={g.title} delay={0.05 * i}>
            <h3 className="display text-xl">{g.title}</h3>
            <ul className="mt-4 flex flex-wrap gap-2">
              {g.items.map((it) => (
                <li key={it.name} className="flex items-center gap-2 rounded-full border border-line bg-paper py-1 pl-1 pr-3 text-sm font-semibold">
                  <TechLogo item={it} size={28} />
                  {it.name}
                  {it.learning && <span className="font-normal text-muted">(learning)</span>}
                </li>
              ))}
            </ul>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
