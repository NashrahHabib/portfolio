import type { StackItem } from '../data/stack';

/**
 * A tool's logo on a small white tile: the official brand mark in its brand colour when there is
 * one, otherwise a navy line icon. The tile stays white in dark mode so every brand colour
 * (including black marks like GitHub) keeps its contrast.
 */
export default function TechLogo({ item, size = 44, className = '' }: { item: StackItem; size?: number; className?: string }) {
  const Icon = item.icon;
  const glyph = Math.round(size * 0.52 * (item.scale ?? 1));
  return (
    <span
      aria-hidden="true"
      className={`grid shrink-0 place-items-center rounded-[30%] border border-[#141532]/10 bg-white shadow-[0_1px_2px_rgba(20,21,50,0.08),0_6px_14px_-6px_rgba(20,21,50,0.22)] ${className}`}
      style={{ width: size, height: size }}
    >
      {item.logo ? (
        <svg viewBox="0 0 24 24" width={glyph} height={glyph} fill={`#${item.logo.hex}`}>
          <path d={item.logo.path} />
        </svg>
      ) : Icon ? (
        <Icon size={glyph} strokeWidth={2} color="#141532" />
      ) : null}
    </span>
  );
}
