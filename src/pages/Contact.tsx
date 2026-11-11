import { site } from '../data/site';
import { useSeo } from '../lib/seo';
import PageHeader from '../components/PageHeader';
import ContactForm from '../components/ContactForm';

export default function Contact() {
  useSeo({
    title: 'Contact',
    description: 'Contact Nashrah Habib about a WordPress, WooCommerce or Shopify project. Based in Lahore and available for remote projects worldwide.',
    path: '/contact',
  });

  return (
    <>
      <PageHeader title="Contact">
        <p>Tell me what you need built or fixed, and I’ll reply by email.</p>
      </PageHeader>

      <section className="tone-alt section-pad">
        <div className="container-site grid gap-14 md:grid-cols-12 md:gap-8">
          <dl className="space-y-8 md:col-span-5">
            <div>
              <dt className="label">Name</dt>
              <dd className="display h-item mt-1">{site.name}</dd>
            </div>
            <div>
              <dt className="label">Email</dt>
              <dd className="display h-item mt-1 [overflow-wrap:anywhere]">
                <a className="link" href={`mailto:${site.email}`}>{site.email}</a>
              </dd>
            </div>
            <div>
              <dt className="label">LinkedIn</dt>
              <dd className="mt-1 text-lg">
                <a className="link" href={site.linkedin} target="_blank" rel="noopener noreferrer">linkedin.com/in/nashrahhabib</a>
              </dd>
            </div>
            <div>
              <dt className="label">Location</dt>
              <dd className="mt-1 text-lg">{site.location}. {site.availability}.</dd>
            </div>
          </dl>
          <div className="md:col-span-6 md:col-start-7">
            <h2 className="display h-item mb-8">Send a message</h2>
            <ContactForm />
          </div>
        </div>
      </section>
    </>
  );
}
