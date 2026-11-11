import type { StackItem } from '../data/stack';
import { asset } from '../lib/projects';

/**
 * A tool's logo on a small white tile, in order of preference:
 *   - an official logo file (`image`); square app icons (`fill`) cover the whole tile,
 *   - a Simple Icons brand mark in its brand colour (`logo`),
 *   - a navy line icon (`icon`) for things that are not a brand.
 * The tile stays white in dark mode so every brand colour (including black marks) keeps its contrast.
 */
export default function TechLogo({ item, size = 44, className = '' }: { item: StackItem; size?: number; className?: string }) {
  const Icon = item.icon;
  const glyph = Math.round(size * 0.52 * (item.scale ?? 1));
  return (
    <span
      aria-hidden="true"
      className={`grid shrink-0 place-items-center overflow-hidden rounded-[30%] border border-[#141532]/10 bg-white shadow-[0_1px_2px_rgba(20,21,50,0.08),0_6px_14px_-6px_rgba(20,21,50,0.22)] ${className}`}
      style={{ width: size, height: size }}
    >
      {item.image ? (
        <img
          src={asset(item.image)}
          alt=""
          loading="lazy"
          decoding="async"
          className={item.fill ? 'h-full w-full object-cover' : 'object-contain'}
          style={item.fill ? undefined : { width: glyph, height: glyph }}
        />
      ) : item.logo ? (
        <svg viewBox="0 0 24 24" width={glyph} height={glyph} fill={`#${item.logo.hex}`}>
          <path d={item.logo.path} />
        </svg>
      ) : Icon ? (
        <Icon size={glyph} strokeWidth={2} color="#141532" />
      ) : null}
    </span>
  );
}
