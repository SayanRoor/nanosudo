// Full-stack: three stacked slabs (database, backend, frontend); the top one
// is green, the lower two carry a brand-pixel status light. Slabs separate on hover.
"use client";

import type { ReactElement } from "react";
import { GlyphBase, GlyphPixel, type GlyphProps } from "./glyph-base";

function Slab({ y }: { readonly y: number }): ReactElement {
  return (
    <g>
      <rect x="7" y={y} width="34" height="9" rx="3" />
      <g fill="currentColor" stroke="none">
        <GlyphPixel x={34.5} y={y + 4.5} />
      </g>
    </g>
  );
}

export function GlyphLayers(props: GlyphProps): ReactElement {
  return (
    <GlyphBase {...props}>
      {(gradientId): ReactElement => (
        <g data-anim="lift">
          <Slab y={33} />
          <Slab y={21.5} />
          <g>
            <rect x="7" y="10" width="34" height="9" rx="3" fill={`url(#${gradientId})`} stroke="none" />
          </g>
        </g>
      )}
    </GlyphBase>
  );
}
