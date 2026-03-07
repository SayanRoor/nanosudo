// Static decorative background — pure CSS, zero JS animations.
// Replaces previous Framer Motion version (26 infinite loops) for performance.

import type { ReactElement } from "react";

export function BackgroundInfrastructure(): ReactElement {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden" aria-hidden="true">
      {/* Top-right primary glow */}
      <div
        className="absolute -top-64 -right-64 w-[700px] h-[700px] rounded-full"
        style={{ background: 'radial-gradient(circle at center, rgba(140,200,75,0.07) 0%, transparent 65%)' }}
      />

      {/* Bottom-left secondary glow */}
      <div
        className="absolute -bottom-80 -left-48 w-[800px] h-[800px] rounded-full"
        style={{ background: 'radial-gradient(circle at center, rgba(104,160,99,0.05) 0%, transparent 65%)' }}
      />

      {/* Center ambient depth */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] rounded-full"
        style={{ background: 'radial-gradient(circle at center, rgba(140,200,75,0.025) 0%, transparent 55%)' }}
      />

      {/* Subtle dot-grid texture */}
      <div
        className="absolute inset-0 opacity-[0.018] dark:opacity-[0.025]"
        style={{
          backgroundImage: 'radial-gradient(circle, var(--color-accent, #8cc84b) 1px, transparent 1px)',
          backgroundSize: '52px 52px',
        }}
      />

      {/* Vignette edge fade */}
      <div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 40%, rgba(9,9,11,0.6) 100%)',
        }}
      />
    </div>
  );
}
