// Three-quarter speedometer with a sweeping diamond-tipped needle.
"use client";

import type { ReactElement } from "react";
import { GlyphBase, GlyphPixel, type GlyphProps } from "./glyph-base";

export function GlyphSpeed(props: GlyphProps): ReactElement {
  return (
    <GlyphBase {...props}>
      {(gradientId): ReactElement => (
        <>
          <path d="M11 37a18.4 18.4 0 1 1 26 0M6 24h4m3-13 3 3m8-8v4m11 3-3 3m10 8h-4" />
          <g data-anim="sweep">
            <circle cx="24" cy="24" r="17" stroke="none" />
            <g fill={`url(#${gradientId})`} stroke="none">
              <path d="m22.75 22.75 7-7 2.5 2.5-7 7Z" />
              <GlyphPixel x={31} y={17} />
            </g>
          </g>
        </>
      )}
    </GlyphBase>
  );
}
