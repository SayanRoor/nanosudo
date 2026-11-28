// Dialogue bubbles with three bouncing diamond dots.
"use client";

import type { ReactElement } from "react";
import { GlyphBase, GlyphPixel, type GlyphProps } from "./glyph-base";

export function GlyphTalk(props: GlyphProps): ReactElement {
  return (
    <GlyphBase {...props}>
      {(gradientId): ReactElement => (
        <>
          <path d="M17 10V9a4 4 0 0 1 4-4h17a4 4 0 0 1 4 4v12l-6 6h-1" />
          <path d="M6 17a6 6 0 0 1 6-6h17a6 6 0 0 1 6 6v12a6 6 0 0 1-6 6H14l-8 8Z" />
          <g data-anim="dots" fill={`url(#${gradientId})`} stroke="none">
            <g>
              <GlyphPixel x={13} y={23} />
            </g>
            <g>
              <GlyphPixel x={21} y={23} />
            </g>
            <g>
              <GlyphPixel x={29} y={23} />
            </g>
          </g>
        </>
      )}
    </GlyphBase>
  );
}
