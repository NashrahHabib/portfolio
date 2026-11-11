import { processSteps } from '../data/process';
import PinnedSteps from './PinnedSteps';

/** "How I work": dark band with large outlined step numbers that stays pinned while the steps scroll. */
export default function ProcessSteps() {
  return <PinnedSteps id="process" eyebrow="How I Work" title={['From Design', 'to *Launch.*']} items={processSteps} palette="green" visual="number" />;
}
