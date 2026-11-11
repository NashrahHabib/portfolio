import { useRef } from 'react';
import { motion, useScroll, useTransform, type MotionValue } from 'framer-motion';
import { prefersReducedMotion } from '../../lib/motion';

function Word({ word, highlight, progress, from, to }: { word: string; highlight: boolean; progress: MotionValue<number>; from: number; to: number }) {
  const opacity = useTransform(progress, [from, to], [0.16, 1]);
  return (
    <motion.span style={{ opacity }} className={highlight ? 'hl' : undefined}>
      {word}
    </motion.span>
  );
}

/**
 * A large paragraph whose words light up one after another (grey to full colour) as it scrolls
 * through the screen. Wrap words in asterisks (*200 websites*) to give them the gradient.
 * The text stays ordinary, readable text for screen readers, and is fully lit for reduced motion.
 */
export default function LightUpText({ text, className = '' }: { text: string; className?: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.85', 'end 0.5'] });

  // Split into words, remembering which ones sit inside *highlight* markers.
  const words: { w: string; hl: boolean }[] = [];
  let inside = false;
  for (const raw of text.split(/\s+/)) {
    const opens = raw.startsWith('*');
    const closes = raw.replace(/[.,;:!?]+$/, '').endsWith('*');
    if (opens) inside = true;
    words.push({ w: raw.replace(/\*/g, ''), hl: inside });
    if (closes) inside = false;
  }

  if (prefersReducedMotion()) {
    return (
      <p className={className}>
        {words.map((x, i) => <span key={i}>{x.hl ? <span className="hl">{x.w}</span> : x.w}{i < words.length - 1 ? ' ' : ''}</span>)}
      </p>
    );
  }

  const n = words.length;
  return (
    <p ref={ref} className={className}>
      {words.map((x, i) => (
        <span key={i}>
          <Word word={x.w} highlight={x.hl} progress={scrollYProgress} from={i / n} to={(i + 1) / n} />
          {i < n - 1 ? ' ' : ''}
        </span>
      ))}
    </p>
  );
}
