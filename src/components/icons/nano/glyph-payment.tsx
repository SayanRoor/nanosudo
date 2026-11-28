// Payment card with a 30/40/30 bar and a diamond marker.
"use client";

import type { ReactElement } from "react";
import { GlyphBase, GlyphPixel, type GlyphProps } from "./glyph-base";

export function GlyphPayment(props: GlyphProps): ReactElement {
  return (
    <GlyphBase {...props}>
      {(gradientId): ReactElement => (
        <>
          <rect x="5.25" y="9" width="37.5" height="30" rx="6" />
          <g fill="currentColor" stroke="none">
            <GlyphPixel x={13} y={17} />
          </g>
          <g data-anim="fill">
            <rect x="9" y="25" width="6.3" height="8" rx="2" />
            <rect
              x="19.8"
              y="25"
              width="8.4"
              height="8"
              rx="2"
              fill={`url(#${gradientId})`}
              stroke="none"
            />
            <rect x="32.7" y="25" width="6.3" height="8" rx="2" />
          </g>
        </>
      )}
    </GlyphBase>
  );
}
