// Folded contract with three text lines and a diamond stamp.
"use client";

import type { ReactElement } from "react";
import { GlyphBase, GlyphPixel, type GlyphProps } from "./glyph-base";

export function GlyphContract(props: GlyphProps): ReactElement {
  return (
    <GlyphBase {...props}>
      {(gradientId): ReactElement => (
        <>
          <path d="M29 6H14a6 6 0 0 0-6 6v24a6 6 0 0 0 6 6h20a6 6 0 0 0 6-6V17ZM29 6v11h11M15 17h6m-6 8h10m-10 8h6" />
          <g data-anim="stamp">
            <rect
              x="28"
              y="28"
              width="10"
              height="10"
              rx="2"
              transform="rotate(45 33 33)"
            />
            <g fill={`url(#${gradientId})`} stroke="none">
              <GlyphPixel x={33} y={33} />
            </g>
          </g>
        </>
      )}
    </GlyphBase>
  );
}
