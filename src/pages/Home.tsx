import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Bot, Code2, Gauge, Globe, LayoutTemplate, ShoppingBag, ShoppingCart, Sparkles, Store, Wrench } from 'lucide-react';
import { site, stats } from '../data/site';
import { servicesPreview } from '../data/services';
import { featuredProjects } from '../lib/projects';
import { useSeo } from '../lib/seo';
import ContactBand from '../components/ContactBand';
import FeaturedCarousel from '../components/FeaturedCarousel';
import Portrait from '../components/Portrait';
import Reveal from '../components/Reveal';
import SkillGroups from '../components/SkillGroups';

const ease = [0.2, 0.7, 0.1, 1] as const;

/** The headline is set as two lines on desktop. */
const headline = ['Building Digital Experiences', 'That Go Beyond the Design.'];
const focusAreas = ['WordPress', 'Custom Themes', 'WooCommerce', 'Shopify'];

const highlights = [
  { icon: Code2, title: 'Custom WordPress themes', text: 'Finished designs turned into themes with editable sections and fields.' },
  { icon: ShoppingBag, title: 'E-commerce', text: 'WooCommerce and Shopify stores, from product pages to payments.' },
  { icon: Globe, title: 'International clients', text: 'Projects for clients in the USA, the UK and Europe, delivered remotely.' },
  { icon: Sparkles, title: 'Learning next', text: 'Python, backend development and AI integration.' },
];

const serviceIcons = [Code2, LayoutTemplate, ShoppingCart, Store, Wrench, Gauge, Bot];

export default function Home() {
  useSeo({
    title: 'Nashrah Habib | WordPress Developer for Custom Themes, WooCommerce and Shopify',
    description:
      'Nashrah Habib is a WordPress developer in Lahore who turns designs into responsive, maintainable websites: custom themes, WooCommerce and Shopify for clients in the USA, UK and Europe.',
    path: '/',
  });

  return (
    <>
      {/* Hero: headline across the top, intro on the left, portrait and figures in a soft panel on the right */}
      <section className="tone-base pt-16">
        <div className="container-site pb-16 pt-10 md:pb-24 md:pt-16">
          <p className="pill">
            <span aria-hidden="true" className="h-2 w-2 rounded-full bg-accent" />
            {site.title}, {site.location}
          </p>

          <h1 className="display h-hero mt-6" aria-label={headline.join(' ')}>
            {headline.map((line, i) => (
              <span key={line} aria-hidden="true" className="-mb-[0.12em] block overflow-hidden pb-[0.12em]">
                <motion.span
                  className="block"
                  initial={{ y: '105%' }}
                  animate={{ y: 0 }}
                  transition={{ duration: 0.9, ease, delay: 0.12 * i }}
                >
                  {line}
                </motion.span>
              </span>
            ))}
          </h1>

          <div className="mt-10 grid gap-10 lg:mt-14 lg:grid-cols-12 lg:items-center lg:gap-12">
            <motion.div
              className="lg:col-span-5"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease, delay: 0.3 }}
            >
              <p className="lede text-muted">
                I’m Nashrah Habib, a WordPress Developer specialising in custom themes, WooCommerce and functional web solutions. I
                transform design concepts into responsive, maintainable and easy-to-manage websites.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link to="/portfolio" className="btn btn-solid">Explore My Work</Link>
                <Link to="/contact" className="btn btn-line">Contact Me</Link>
              </div>
              <ul className="mt-8 flex flex-wrap gap-2" aria-label="Focus areas">
                {focusAreas.map((area) => <li key={area} className="pill bg-skin-soft">{area}</li>)}
              </ul>
            </motion.div>

            <motion.div
              className="rounded-panel border border-line bg-[color:var(--bg-alt)] p-5 md:p-8 lg:col-span-7"
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease, delay: 0.35 }}
            >
              <div className="grid items-center gap-5 sm:grid-cols-[minmax(0,16rem)_1fr] md:gap-8">
                <Portrait className="mx-auto w-full max-w-[16rem]" />
                <ul className="grid gap-4">
                  {stats.map((s, i) => (
                    <motion.li
                      key={s.label}
                      className="card lift shadow-soft p-5"
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.6 + 0.12 * i }}
                    >
                      <span className="display block text-3xl">{s.value}</span>
                      <span className="mt-1 block text-sm text-muted">{s.label}</span>
                    </motion.li>
                  ))}
                </ul>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* About: statement and text on the left, four highlight boxes on the right */}
      <section className="tone-alt section-pad">
        <div className="container-site grid gap-10 lg:grid-cols-12 lg:gap-12">
          <Reveal className="lg:col-span-5">
            <h2 className="display h-section">
              <span className="block">Thoughtful Development.</span>
              <span className="block">Practical Solutions.</span>
            </h2>
            <div className="mt-6 space-y-4 text-muted">
              <p>
                For more than four years I’ve built WordPress sites for clients in the USA, the UK and Europe: custom themes,
                WooCommerce and Shopify stores, and the maintenance that keeps them running.
              </p>
              <p>I build so that the people who own a site can run it without a developer.</p>
            </div>
            <Link to="/about" className="btn btn-solid mt-8">More About Me</Link>
          </Reveal>

          <ul className="grid gap-4 sm:grid-cols-2 lg:col-span-7">
            {highlights.map(({ icon: Icon, title, text }, i) => (
              <li key={title}>
                <Reveal delay={0.07 * i} className="card lift shadow-soft h-full p-6">
                  <span className="grid h-11 w-11 place-items-center rounded-input bg-skin-soft text-accent">
                    <Icon size={22} aria-hidden="true" />
                  </span>
                  <h3 className="display h-item mt-5">{title}</h3>
                  <p className="mt-2 text-muted">{text}</p>
                </Reveal>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Featured work */}
      <section className="tone-base section-pad">
        <div className="container-site">
          <div className="grid gap-6 md:grid-cols-12 md:items-end md:gap-8">
            <h2 className="display h-section md:col-span-7">Featured Work</h2>
            <p className="text-muted md:col-span-4 md:col-start-9">
              A selection of the websites I’ve designed and custom coded.{' '}
              <Link to="/portfolio" className="link font-semibold text-current">View the full portfolio</Link>
            </p>
          </div>
        </div>

        <FeaturedCarousel projects={featuredProjects} />

        <div className="container-site mt-12 text-center">
          <Link to="/portfolio" className="btn btn-solid">View the Portfolio</Link>
        </div>
      </section>

      {/* Services: rounded cards with icons; the first is filled, the emerging one is dashed */}
      <section className="tone-alt section-pad">
        <div className="container-site">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <h2 className="display h-section">Services</h2>
              <p className="mt-3 max-w-md text-muted">What I do for clients, and one area I’m growing into.</p>
            </div>
            <Link to="/services" className="btn btn-line">All Services</Link>
          </div>

          <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {servicesPreview.map((s, i) => {
              const Icon = serviceIcons[i % serviceIcons.length];
              const lead = i === 0;
              const box = lead
                ? 'rounded-box bg-accent text-on-accent'
                : s.emerging
                  ? 'rounded-box border border-dashed border-accent bg-paper'
                  : 'card';
              return (
                <li key={s.title} className={lead ? 'sm:col-span-2' : ''}>
                  <Reveal delay={0.05 * i} className={`lift shadow-soft flex h-full flex-col p-6 md:p-7 ${box}`}>
                    <div className="flex items-center justify-between gap-3">
                      <span className={`grid h-11 w-11 place-items-center rounded-input ${lead ? 'bg-white/15' : 'bg-skin-soft text-accent'}`}>
                        <Icon size={22} aria-hidden="true" />
                      </span>
                      {s.emerging && <span className="tag-learning">Emerging focus</span>}
                    </div>
                    <h3 className={`display mt-5 ${lead ? 'text-2xl md:text-3xl' : 'h-item'}`}>{s.title}</h3>
                    <p className={`mt-2 ${lead ? 'max-w-md opacity-90' : 'text-muted'}`}>{s.summary}</p>
                  </Reveal>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      {/* Skills */}
      <section className="tone-base section-pad">
        <div className="container-site">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <h2 className="display h-section">Skills &amp; Tools</h2>
              <p className="mt-3 max-w-md text-muted">What I use every day to build, launch and look after websites.</p>
            </div>
            <Link to="/about" className="btn btn-line">More About Me</Link>
          </div>
          <div className="mt-10"><SkillGroups /></div>
        </div>
      </section>

      <ContactBand />
    </>
  );
}
