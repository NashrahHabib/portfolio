import { Link } from 'react-router-dom';
import { education, experience, site } from '../data/site';
import { useSeo } from '../lib/seo';
import PageHeader from '../components/PageHeader';
import Portrait from '../components/Portrait';
import Reveal from '../components/Reveal';
import SkillGroups from '../components/SkillGroups';

export default function About() {
  useSeo({
    title: 'About',
    description:
      'About Nashrah Habib: a WordPress developer with 4+ years of experience in custom themes, WooCommerce and Shopify, a BS in Computer Science, and clients in the USA, UK and Europe.',
    path: '/about',
  });

  return (
    <>
      <PageHeader title="Building for the Web, Growing with Technology.">
        <p>{site.tagline}</p>
      </PageHeader>

      <section className="tone-alt section-pad">
        <div className="container-site grid gap-12 md:grid-cols-12 md:gap-8">
          <Reveal className="w-56 md:col-span-3 md:w-auto md:self-start"><Portrait /></Reveal>
          <div className="lede space-y-5 md:col-span-7 md:col-start-6">
            <p>
              I’m a WordPress developer based in {site.location}, with more than four years of professional web development
              experience. Over that time I’ve built and managed more than 200 websites.
            </p>
            <p>
              Most of my work is custom WordPress development: turning a finished design into a theme with editable sections and
              sensible fields, so the people who own the site can update it themselves. I’ve done this for clients in the USA, the
              UK and Europe, and I currently build for a Norwegian web agency.
            </p>
            <p>
              E-commerce is a regular part of that work. I set up and customise stores on WooCommerce and Shopify, from product
              pages to shipping and payments.
            </p>
            <p>
              I’m also learning Python and exploring AI integration, because I want to build the logic behind a website as well as
              the site itself.
            </p>
          </div>
        </div>
      </section>

      <section className="tone-alt border-t border-line section-pad">
        <div className="container-site">
          <h2 className="display h-section">Experience</h2>
          <ol className="mt-12">
            {experience.map((job, i) => (
              <li key={job.period} className="border-t border-line last:border-b">
                <Reveal delay={0.08 * i} className="grid gap-2 py-7 md:grid-cols-12 md:gap-8">
                  <p className="text-muted md:col-span-4">{job.period}</p>
                  <div className="md:col-span-8">
                    <h3 className="display h-item">{job.company}</h3>
                    <p className="mt-2">{job.role}</p>
                    {job.note && <p className="text-muted">{job.note}</p>}
                  </div>
                </Reveal>
              </li>
            ))}
          </ol>

          <h2 className="display h-section mt-20">Education</h2>
          <ol className="mt-12">
            {education.map((item) => (
              <li key={item.title} className="grid gap-2 border-y border-line py-7 md:grid-cols-12 md:gap-8">
                <p className="text-muted md:col-span-4">{item.period}</p>
                <div className="md:col-span-8">
                  <h3 className="display h-item">{item.title}</h3>
                  <p className="mt-2">{item.place}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="tone-base section-pad">
        <div className="container-site">
          <h2 className="display h-section">Skills &amp; Tools</h2>
          <p className="mt-3 max-w-md text-muted">What I use every day to build, launch and look after websites.</p>
          <div className="mt-10"><SkillGroups /></div>
          <div className="mt-16 flex flex-wrap gap-3">
            <Link to="/portfolio" className="btn btn-solid">Explore My Work</Link>
            <Link to="/contact" className="btn btn-line">Contact Me</Link>
          </div>
        </div>
      </section>
    </>
  );
}
