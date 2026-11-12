import { projects } from '../data/projects';
import { useSeo } from '../lib/seo';
import WorkViewer from '../components/WorkViewer';
import ProjectsDisclaimer from '../components/ProjectsDisclaimer';

export default function Portfolio() {
  useSeo({
    title: 'Portfolio',
    description: 'Selected websites designed and custom coded by Nashrah Habib.',
    path: '/portfolio',
  });

  return (
    <>
      <WorkViewer projects={projects} />
      <ProjectsDisclaimer className="pb-16 pt-10" />
    </>
  );
}
