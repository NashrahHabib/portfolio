import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Code2, Globe, ShoppingBag, Sparkles } from 'lucide-react';
import { site } from '../data/site';
import { featuredProjects } from '../lib/projects';
import { useSeo } from '../lib/seo';
import ContactBand from '../components/ContactBand';
import ProjectStack from '../components/ProjectStack';
import Reveal from '../components/Reveal';
import SkillGroups from '../components/SkillGroups';
import ProcessSteps from '../components/ProcessSteps';
import WhyPanels from '../components/WhyPanels';
import StackHub from '../components/StackHub';
import StackMarquee from '../components/StackMarquee';
import ServicesSection from '../components/ServicesSection';
import Portrait from '../components/Portrait';
import LightUpText from '../components/motion/LightUpText';
import HeroOrbit from '../components/HeroOrbit';
import ScrollMarquee from '../components/motion/ScrollMarquee';
import SplitText from '../components/motion/SplitText';
import FeatureIcon from '../components/FeatureIcon';
import { ease as motionEase, enterDelay, prefersReducedMotion } from '../lib/motion';

const ease = motionEase.out;

/** The headline is set as two lines on desktop. */
const headline = ['Building Digital *Experiences*', 'That Go Beyond the Design.'];
const focusAreas = ['WordPress', 'Custom Themes', 'WooCommerce', 'Shopify'];
/** Words in the scrolling band under the hero. */
const marqueeWords = ['WordPress', 'Custom Themes', 'WooCommerce', 'Shopify'];
const marqueeWordsAlt = ['Figma to WordPress', 'Maintenance', 'Speed', 'E-commerce'];

const highlights = [
  { icon: Code2, title: 'Custom WordPress themes', text: 'Finished designs turned into themes with editable sections and fields.' },
  { icon: ShoppingBag, title: 'E-commerce', text: 'WooCommerce and Shopify stores, from product pages to payments.' },
  { icon: Globe, title: 'International clients', text: 'Projects for clients in the USA, the UK and Europe, delivered remotely.' },
  { icon: Sparkles, title: 'Learning next', text: 'Python, backend development and AI integration.' },
];

/** The About story. Words in *asterisks* get the gradient; it lights up word by word as it scrolls past. */
const aboutStory =
  'I’m a WordPress developer in Lahore with *4+ years* of professional experience and more than *200 websites* built and managed for clients in the USA, the UK and Europe. I turn finished designs into custom themes with editable sections, so the people who own a site can run it themselves. I build *WooCommerce* and *Shopify* stores from product pages to payments, and I’m learning Python and AI integration to build the logic behind websites too.';


export default function Home() {
  useSeo({
    title: 'Nashrah Habib | WordPress Developer for Custom Themes, WooCommerce and Shopify',
    description:
      'Nashrah Habib is a WordPress developer in Lahore who turns designs into responsive, maintainable websites: custom themes, WooCommerce and Shopify for clients in the USA, UK and Europe.',
    path: '/',
  });

  // Entrance timing follows the page curtain; the portrait panel drifts up slightly as the hero scrolls away.
  const start = enterDelay();
  const hero = useRef<HTMLElement>(null);
  const { scrollYProgress: heroProgress } = useScroll({ target: hero, offset: ['start start', 'end start'] });
  const still = prefersReducedMotion();
  const panelY = useTransform(heroProgress, [0, 1], still ? [0, 0] : [0, -50]);
  const headlineY = useTransform(heroProgress, [0, 1], still ? [0, 0] : [0, 40]);

  return (
    <>
      {/* Hero: headline, intro and actions on the left; the portrait with orbiting tool logos on the right */}
      <section ref={hero} className="tone-base relative overflow-hidden pt-16">
        <div aria-hidden="true" className="orb -right-24 top-24 h-80 w-80 bg-[color:var(--skin)] opacity-40" />
        <div aria-hidden="true" className="orb -left-40 bottom-10 h-72 w-72 bg-[color:var(--skin)] opacity-20 [animation-delay:-6s]" />

        <div className="container-site relative grid items-center gap-12 pb-16 pt-10 md:pb-24 md:pt-14 lg:grid-cols-12 lg:gap-8">
          <motion.div className="lg:col-span-6" style={{ y: headlineY }}>
            <motion.p
              className="pill"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease, delay: start }}
            >
              <span aria-hidden="true" className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-60 motion-reduce:hidden" />
                <span className="relative h-2 w-2 rounded-full bg-accent" />
              </span>
              {site.title}, {site.location}
            </motion.p>

            <SplitText as="h1" trigger="load" text={headline} delay={start + 0.1} className="display h-hero mt-6" />

            <motion.div
              initial={{ opacity: 0, y: 24, filter: 'blur(6px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={{ duration: 0.9, ease, delay: start + 0.45 }}
            >
              <p className="lede mt-6 max-w-xl text-muted">
                I’m Nashrah Habib, a WordPress Developer specialising in custom themes, WooCommerce and functional web solutions. I
                transform design concepts into responsive, maintainable and easy-to-manage websites.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link to="/portfolio" className="btn btn-solid">Explore My Work</Link>
                <Link to="/#contact" className="btn btn-line">Contact Me</Link>
              </div>
              <ul className="mt-8 flex flex-wrap gap-2" aria-label="Focus areas">
                {focusAreas.map((area, i) => (
                  <motion.li
                    key={area}
                    className="pill bg-skin-soft"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20, delay: start + 0.7 + 0.07 * i }}
                  >
                    {area}
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          </motion.div>

          <motion.div className="pb-28 sm:pb-0 lg:col-span-6" style={{ y: panelY }}>
            <HeroOrbit delay={start + 0.25} />
          </motion.div>
        </div>
      </section>

      {/* Scrolling band: drifts on its own and speeds up with scrolling */}
      <div className="tone-base border-y border-line">
        <ScrollMarquee words={marqueeWords} reverseWords={marqueeWordsAlt} />
      </div>

      {/* About me: portrait pinned on the left, the story lighting up word by word on the right, highlights below */}
      <section id="about" aria-labelledby="about-title" className="tone-alt section-pad scroll-mt-16">
        <div className="container-site">
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-4">
              <div className="lg:sticky lg:top-28">
                <Reveal variant="scale" className="mx-auto w-full max-w-[20rem]">
                  <div data-tilt><Portrait /></div>
                </Reveal>
                <ul className="mx-auto mt-6 flex max-w-[20rem] flex-wrap justify-center gap-2 text-sm font-semibold" aria-label="At a glance">
                  <li className="pill bg-paper">{site.location}</li>
                  <li className="pill bg-paper">4+ years</li>
                  <li className="pill bg-paper">200+ websites</li>
                </ul>
              </div>
            </div>

            <div className="lg:col-span-8">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-muted">About Me</p>
              <SplitText id="about-title" text={['Thoughtful *Development.*', 'Practical Solutions.']} className="display h-section mt-3" />
              <LightUpText
                className="display mt-10 text-[clamp(1.5rem,2.6vw,2.4rem)] !font-bold leading-[1.35] !tracking-[-0.01em]"
                text={aboutStory}
              />
              <div className="mt-10 flex flex-wrap gap-3">
                <Link to="/portfolio" className="btn btn-solid">Explore My Work</Link>
                <Link to="/#contact" className="btn btn-line">Contact Me</Link>
              </div>
            </div>
          </div>

          <ul className="mt-20 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {highlights.map(({ icon: Icon, title, text }, i) => (
              <li key={title}>
                <Reveal delay={0.08 * i} variant="scale" className="card lift spotlight shadow-soft h-full p-6">
                  <FeatureIcon icon={Icon} size={52} />
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
            <SplitText text="Featured *Work*" className="display h-section md:col-span-7" />
            <p className="text-muted md:col-span-4 md:col-start-9">
              A selection of the websites I’ve designed and custom coded.{' '}
              <Link to="/portfolio" className="link font-semibold text-current">View the full portfolio</Link>
            </p>
          </div>
        </div>

        <ProjectStack projects={featuredProjects.slice(0, 6)} />

        <div className="container-site mt-12 text-center">
          <Link to="/portfolio" className="btn btn-solid">See All {featuredProjects.length} Projects</Link>
        </div>
      </section>

      {/* Why choose me: expanding panels */}
      <WhyPanels />

      {/* Services (this replaces the old Services page) */}
      <ServicesSection />

      {/* My stack: tool groups around the portrait */}
      <StackHub />
      <StackMarquee rowsOnly />

      {/* How I work: pinned steps */}
      <ProcessSteps />

      {/* Skills */}
      <section className="tone-base section-pad">
        <div className="container-site">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <SplitText text="Skills & *Tools*" className="display h-section" />
              <p className="mt-3 max-w-md text-muted">What I use every day to build, launch and look after websites.</p>
            </div>
            <Link to="/#contact" className="btn btn-line">Work With Me</Link>
          </div>
          <div className="mt-10"><SkillGroups /></div>
        </div>
      </section>

      <ContactBand />
    </>
  );
}
