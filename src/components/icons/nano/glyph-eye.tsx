// Almond eye with a diamond pupil and closing eyelids.
"use client";

import type { ReactElement } from "react";
import { GlyphBase, GlyphPixel, type GlyphProps } from "./glyph-base";

export function GlyphEye(props: GlyphProps): ReactElement {
  return (
    <GlyphBase {...props}>
      {(gradientId): ReactElement => (
        <>
          <g data-anim="blink" data-part="eyelids">
            <path d="M5 24Q24-1 43 24Q24 49 5 24Z" />
            <circle cx="24" cy="24" r="7" />
            <g fill={`url(#${gradientId})`} stroke="none">
              <GlyphPixel x={24} y={24} />
            </g>
          </g>
        </>
      )}
    </GlyphBase>
  );
}
