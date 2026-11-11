import type { LucideIcon } from 'lucide-react';

/**
 * Icon on a soft duotone tile: a straight rounded square in pale indigo with an indigo icon.
 * `onColor` is for icons placed on the gradient or a dark band (frosted white tile, white icon).
 */
export default function FeatureIcon({
  icon: Icon,
  size = 52,
  onColor = false,
  className = '',
}: {
  icon: LucideIcon;
  size?: number;
  onColor?: boolean;
  className?: string;
}) {
  return (
    <span
      aria-hidden="true"
      className={`grid shrink-0 place-items-center rounded-[28%] ${
        onColor ? 'bg-white/15 text-white ring-1 ring-inset ring-white/25' : 'bg-[color:var(--skin-soft)] text-[color:var(--accent)]'
      } ${className}`}
      style={{ width: size, height: size }}
    >
      <Icon size={Math.round(size * 0.46)} strokeWidth={2} />
    </span>
  );
}
