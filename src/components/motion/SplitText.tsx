import type { ElementType } from 'react';
import { motion } from 'framer-motion';
import { ease } from '../../lib/motion';

interface Props {
  /** One string, or several to force line breaks between them. */
  text: string | string[];
  as?: ElementType;
  className?: string;
  id?: string;
  /** Seconds before the first word moves. */
  delay?: number;
  /** Play when scrolled into view (default) or straight away (for page titles). */
  trigger?: 'view' | 'load';
}

/** Splits "Growing with *Technology*." into plain and highlighted pieces. */
function pieces(word: string) {
  return word.split('*').map((part, i) => ({ part, hl: i % 2 === 1 })).filter((p) => p.part);
}

/** Removes the *highlight* markers. */
export const plainText = (s: string) => s.replace(/\*/g, '');

/**
 * Heading whose words rise one after another from behind a mask. Wrap the key word in asterisks
 * ("Featured *Work*") to show it in the highlight colour. Screen readers get the plain text once
 * through aria-label; the animated word pieces are hidden from them.
 */
export default function SplitText({ text, as: Tag = 'h2', className = '', id, delay = 0, trigger = 'view' }: Props) {
  const lines = Array.isArray(text) ? text : [text];
  let index = 0;

  const play = { y: '0%', rotate: 0 };
  const motionProps =
    trigger === 'load'
      ? { animate: play }
      : { whileInView: play, viewport: { once: true, margin: '0px 0px -12% 0px' } };

  return (
    <Tag id={id} className={className} aria-label={plainText(lines.join(' '))}>
      {lines.map((line, li) => (
        <span key={li} aria-hidden="true" className="block">
          {line.split(' ').map((word, wi, words) => {
            const i = index++;
            return (
              <span key={wi}>
                <span className="-mb-[0.14em] inline-block overflow-hidden pb-[0.14em] align-top">
                  <motion.span
                    className="inline-block origin-bottom-left will-change-transform"
                    initial={{ y: '110%', rotate: 4 }}
                    {...motionProps}
                    transition={{ duration: 0.85, ease: ease.out, delay: delay + i * 0.06 }}
                  >
                    {pieces(word).map((p, pi) => (p.hl ? <span key={pi} className="hl">{p.part}</span> : p.part))}
                  </motion.span>
                </span>
                {wi < words.length - 1 && ' '}
              </span>
            );
          })}
        </span>
      ))}
    </Tag>
  );
}
