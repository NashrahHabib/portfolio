import { useState } from 'react';
import { site } from '../data/site';

/** Portrait with a placeholder. Change the image in src/data/site.ts (`portrait`). */
export default function Portrait({ className = '' }: { className?: string }) {
  const [missing, setMissing] = useState(false);
  return (
    <div className={`relative ${className}`}>
      <div className="shadow-card relative aspect-[4/5] overflow-hidden rounded-panel border border-line bg-frame">
        {missing ? (
          <div className="flex h-full flex-col items-center justify-center text-center">
            <span className="display text-7xl text-[color:var(--skin)]">NH</span>
            <span className="mt-2 text-sm text-white/60">Portrait to be added</span>
          </div>
        ) : (
          <img src={site.portrait} width={768} height={960} alt={`Portrait of ${site.name}`} className="h-full w-full object-cover" onError={() => setMissing(true)} />
        )}
      </div>
    </div>
  );
}
