// AI network with three pulsing nodes and a diamond core.
"use client";

import type { ReactElement } from "react";
import { GlyphBase, GlyphPixel, type GlyphProps } from "./glyph-base";

export function GlyphAi(props: GlyphProps): ReactElement {
  return (
    <GlyphBase {...props}>
      {(gradientId): ReactElement => (
        <>
          <rect
            x="10"
            y="10"
            width="28"
            height="28"
            rx="6"
            transform="rotate(45 24 24)"
          />
          <path d="m20 21 4 4 4-4M24 25v5.5" />
          <g data-anim="pulse">
            <circle cx="18" cy="19" r="2.5" />
            <circle cx="30" cy="19" r="2.5" />
            <circle cx="24" cy="33" r="2.5" />
          </g>
          <g fill={`url(#${gradientId})`} stroke="none">
            <GlyphPixel x={24} y={25} />
          </g>
        </>
      )}
    </GlyphBase>
  );
}
