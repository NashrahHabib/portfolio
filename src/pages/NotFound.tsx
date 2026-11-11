import { Link } from 'react-router-dom';
import { useSeo } from '../lib/seo';

export default function NotFound() {
  useSeo({ title: 'Page not found', description: 'This page does not exist.', path: '/404' });
  return (
    <section className="tone-base pt-16">
      <div className="container-site section-pad">
        <h1 className="display h-page">Page not found.</h1>
        <p className="lede mt-6 text-muted">The address may be mistyped, or the page has moved.</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link to="/" className="btn btn-solid">Go to Homepage</Link>
          <Link to="/portfolio" className="btn btn-line">Browse the Portfolio</Link>
        </div>
      </div>
    </section>
  );
}
