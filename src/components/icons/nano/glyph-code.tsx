// Terminal window with a blinking diamond cursor.
"use client";

import type { ReactElement } from "react";
import { GlyphBase, GlyphPixel, type GlyphProps } from "./glyph-base";

export function GlyphCode(props: GlyphProps): ReactElement {
  return (
    <GlyphBase {...props}>
      {(gradientId): ReactElement => (
        <>
          <rect x="6" y="9" width="36" height="30" rx="6" />
          <path d="M6 18h36m-28 7 5 5-5 5" />
          <g data-anim="blink" fill={`url(#${gradientId})`} stroke="none">
            <GlyphPixel x={29} y={30} />
          </g>
        </>
      )}
    </GlyphBase>
  );
}
