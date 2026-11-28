// Bank card above a 30/40/30 staged-payment bar; the 40% stage is green.
"use client";

import type { ReactElement } from "react";
import { GlyphBase, GlyphPixel, type GlyphProps } from "./glyph-base";

export function GlyphPayment(props: GlyphProps): ReactElement {
  return (
    <GlyphBase {...props}>
      {(gradientId): ReactElement => (
        <>
          <rect x="5" y="6" width="38" height="23" rx="5" />
          <path d="M5 13.5h38" />
          <g fill="currentColor" stroke="none">
            <GlyphPixel x={12} y={22} />
          </g>
          <g data-anim="fill">
            <rect x="5" y="35" width="9.9" height="7" rx="3" />
            <rect x="17.4" y="35" width="13.2" height="7" rx="3" fill={`url(#${gradientId})`} stroke="none" />
            <rect x="33.1" y="35" width="9.9" height="7" rx="3" />
          </g>
        </>
      )}
    </GlyphBase>
  );
}
