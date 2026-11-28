// Site-wide background — slow-drifting aurora in the logo greens, a fine film
// grain and an edge vignette. Pure CSS (globals.css: .site-bg*), zero JS;
// adapts to dark/light theme and stops moving under prefers-reduced-motion.

import type { ReactElement } from "react";

export function BackgroundInfrastructure(): ReactElement {
  return (
    <div className="site-bg fixed inset-0 z-0 pointer-events-none overflow-hidden" aria-hidden="true">
      <div className="site-bg-aurora site-bg-aurora--a" />
      <div className="site-bg-aurora site-bg-aurora--b" />
      <div className="site-bg-aurora site-bg-aurora--c" />
      <div className="site-bg-grain" />
      <div className="site-bg-vignette" />
    </div>
  );
}
