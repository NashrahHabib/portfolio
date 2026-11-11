import { skillGroups } from '../data/skills';
import Reveal from './Reveal';
import FeatureIcon from './FeatureIcon';

/**
 * Skills as a grid of rounded cards. The first group is the filled lead card; the
 * "currently learning" group spans the full width with a dashed outline so it is never
 * mistaken for professional experience.
 */
export default function SkillGroups() {
  const professional = skillGroups.filter((g) => !g.learning);
  const learning = skillGroups.filter((g) => g.learning);

  // Two wide cards on the first row, three on the second.
  const span = (i: number) => (i < 2 ? 'lg:col-span-3' : 'lg:col-span-2');

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-6">
      {professional.map(({ title, summary, icon: Icon, skills }, i) => {
        const lead = i === 0;
        return (
          <Reveal
            key={title}
            delay={0.06 * i}
            className={`${span(i)} ${i === 4 ? 'sm:col-span-2 lg:col-span-2' : ''} lift spotlight shadow-soft flex flex-col rounded-box p-6 md:p-7 ${
              lead ? 'bg-accent text-on-accent' : 'card'
            }`}
          >
            <div className="flex items-start justify-between gap-4">
              <FeatureIcon icon={Icon} size={52} onColor={lead} />
              <span className={`text-sm ${lead ? 'opacity-90' : 'text-muted'}`}>
                {skills.length} {skills.length === 1 ? 'skill' : 'skills'}
              </span>
            </div>
            <h3 className="display h-item mt-5">{title}</h3>
            <p className={`mt-1 text-sm ${lead ? 'opacity-90' : 'text-muted'}`}>{summary}</p>
            <ul className="mt-5 flex flex-wrap gap-2" aria-label={title}>
              {skills.map((skill) => (
                <li
                  key={skill}
                  className={`rounded-btn border px-3 py-1 text-sm font-medium ${
                    lead ? 'border-white/25 bg-white/10' : 'border-line bg-skin-soft'
                  }`}
                >
                  {skill}
                </li>
              ))}
            </ul>
          </Reveal>
        );
      })}

      {learning.map(({ title, summary, icon: Icon, skills }) => (
        <Reveal
          key={title}
          delay={0.3}
          className="flex flex-col gap-5 rounded-box border border-dashed border-accent bg-[color:var(--bg-alt)] p-6 sm:col-span-2 md:flex-row md:items-center md:p-7 lg:col-span-6"
        >
          <FeatureIcon icon={Icon} size={52} />
          <div className="md:w-72 md:shrink-0">
            <span className="tag-learning">{title}</span>
            <p className="mt-2 text-sm text-muted">{summary}</p>
          </div>
          <ul className="flex flex-wrap gap-2 md:ml-auto" aria-label={title}>
            {skills.map((skill) => (
              <li key={skill} className="rounded-btn border border-dashed border-accent bg-paper px-4 py-1.5 font-medium">
                {skill}
              </li>
            ))}
          </ul>
        </Reveal>
      ))}
    </div>
  );
}
