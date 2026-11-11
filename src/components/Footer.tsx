import { Link } from 'react-router-dom';
import { nav, site } from '../data/site';

export default function Footer() {
  return (
    <footer className="tone-base border-t border-line">
      <div className="container-site grid gap-10 py-14 md:grid-cols-12">
        <div className="md:col-span-5">
          <p className="display text-3xl">{site.name}</p>
          <p className="mt-3 max-w-sm text-muted">{site.tagline}</p>
        </div>
        <nav aria-label="Footer" className="md:col-span-3">
          <ul className="space-y-2">
            {nav.map((item) => (
              <li key={item.to}>
                <Link to={item.to} className="no-underline hover:underline">{item.label}</Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="space-y-2 md:col-span-4">
          <p><a className="link" href={`mailto:${site.email}`}>{site.email}</a></p>
          <p><a className="link" href={site.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn</a></p>
          <p className="text-muted">{site.location}. {site.availability}.</p>
        </div>
      </div>
      <div className="container-site border-t border-line py-6 text-sm text-muted">© {new Date().getFullYear()} {site.name}</div>
    </footer>
  );
}
