import { reasons } from '../data/process';
import PinnedSteps from './PinnedSteps';

/** "Why choose me": on the dark band with a big icon per reason. */
export default function WhyChooseMe() {
  return <PinnedSteps id="why" eyebrow="Why Choose Me" title={['Why Clients', 'Work With *Me.*']} items={reasons} palette="green" visual="icon" />;
}
