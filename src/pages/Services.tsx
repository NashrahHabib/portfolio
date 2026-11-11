import { services } from '../data/services';
import { useSeo } from '../lib/seo';
import ContactBand from '../components/ContactBand';
import PageHeader from '../components/PageHeader';

export default function Services() {
  useSeo({
    title: 'Services',
    description:
      'Services from Nashrah Habib: custom WordPress development, Figma to WordPress conversion, WooCommerce and Shopify stores, and website maintenance.',
    path: '/services',
  });

  const established = services.filter((s) => !s.emerging);
  const emerging = services.filter((s) => s.emerging);

  return (
    <>
      <PageHeader title="Services">
        <p>What I build and look after for clients, and what I’m working towards next.</p>
      </PageHeader>

      <section className="tone-alt">
        <div className="container-site">
          {established.map((service, i) => {
            const flip = i % 2 === 1;
            return (
            <section key={service.id} id={service.id} aria-labelledby={`${service.id}-title`} className="grid gap-8 border-b border-line py-14 md:grid-cols-12 md:gap-8 md:py-20">
              <div className={flip ? 'md:col-span-6 md:col-start-7 md:row-start-1' : 'md:col-span-6'}>
                <h2 id={`${service.id}-title`} className="display h-section">{service.title}</h2>
                <p className="lede mt-6 max-w-md text-muted">{service.summary}</p>
              </div>
              <ul className={flip ? 'md:col-span-5 md:col-start-1 md:row-start-1' : 'md:col-span-5 md:col-start-8'}>
                {service.items.map((item) => (
                  <li key={item} className="border-t border-line py-4 text-lg font-medium last:border-b">{item}</li>
                ))}
              </ul>
            </section>
            );
          })}
        </div>
      </section>

      {emerging.map((service) => (
        <section key={service.id} id={service.id} aria-labelledby={`${service.id}-title`} className="tone-base section-pad">
          <div className="container-site">
            <div className="grid gap-8 rounded-panel border border-dashed border-accent p-6 md:grid-cols-12 md:gap-8 md:p-12">
              <div className="md:col-span-6">
                <span className="tag-learning">Emerging focus, not yet a commercial service</span>
                <h2 id={`${service.id}-title`} className="display h-section mt-5">{service.title}</h2>
                <p className="lede mt-6 max-w-md text-muted">{service.summary}</p>
              </div>
              <ul className="md:col-span-5 md:col-start-8">
                {service.items.map((item) => (
                  <li key={item} className="border-t border-line py-4 text-lg font-medium last:border-b">{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      ))}

      <ContactBand />
    </>
  );
}
