import { Link } from 'react-router-dom';
import { site } from '../data/site';

/** Closing call to action: headline on the purple band, details on a deeper panel that runs to the screen edge. */
export default function ContactBand() {
  return (
    <section className="tone-accent grid md:grid-cols-[7fr_5fr]" aria-labelledby="contact-band-title">
      <div className="bleed-l section-pad pr-6 md:pr-12">
        <h2 id="contact-band-title" className="display h-page max-w-[18ch]">Let’s Build Something Worth Visiting.</h2>
      </div>
      <div className="band-deep bleed-r shadow-[inset_12px_0_24px_-12px_rgba(0,0,0,0.45)] flex flex-col justify-end py-12 pl-[clamp(1.25rem,5vw,4.5rem)] md:py-20 md:pl-12">
        <p className="lede max-w-sm">Have a design that’s ready to build, or a site that needs fixing? Tell me about it and I’ll reply by email.</p>
        <div className="mt-8">
          <Link to="/contact" className="btn btn-solid">Start a Conversation</Link>
        </div>
        <p className="mt-8 border-t border-line pt-6">
          <a className="underline decoration-2 underline-offset-4" href={`mailto:${site.email}`}>{site.email}</a>
          <span className="mt-1 block text-muted">{site.location}. {site.availability}.</span>
        </p>
      </div>
    </section>
  );
}
