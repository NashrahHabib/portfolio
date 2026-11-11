import { useEffect, useRef, useState } from 'react';
import { animate, useInView } from 'framer-motion';
import { ease, prefersReducedMotion } from '../../lib/motion';

/**
 * Counts the number inside a value such as "200+" or "4+" up from zero when it scrolls into
 * view. Values without a number ("USA, UK, Europe") are shown as they are. The final text is
 * always what screen readers and search engines get.
 */
export default function CountUp({ value, delay = 0, className }: { value: string; delay?: number; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '0px 0px -10% 0px' });
  const match = value.match(/^(\D*)(\d+)(.*)$/);
  const [shown, setShown] = useState(match && !prefersReducedMotion() ? `${match[1]}0${match[3]}` : value);

  useEffect(() => {
    if (!match || !inView || prefersReducedMotion()) return;
    const [, before, digits, after] = match;
    const controls = animate(0, Number(digits), {
      duration: 1.6,
      delay,
      ease: ease.out,
      onUpdate: (v) => setShown(`${before}${Math.round(v)}${after}`),
    });
    return () => controls.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView]);

  return (
    <span ref={ref} className={className}>
      <span aria-hidden="true">{shown}</span>
      <span className="sr-only">{value}</span>
    </span>
  );
}
