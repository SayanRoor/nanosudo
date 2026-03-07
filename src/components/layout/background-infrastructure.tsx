// Geometric grid background — pure CSS, zero JS, zero animations.
// .grid-pattern (globals.css) adapts automatically to dark/light theme
// via CSS custom properties (--base-color-border, --base-color-accent).

import type { ReactElement } from "react";

export function BackgroundInfrastructure(): ReactElement {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden" aria-hidden="true">
      <div className="grid-pattern absolute inset-0" />
    </div>
  );
}
