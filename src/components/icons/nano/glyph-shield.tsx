// Warranty shield with a drawn check and a diamond seal.
"use client";

import type { ReactElement } from "react";
import { GlyphBase, GlyphPixel, type GlyphProps } from "./glyph-base";

export function GlyphShield(props: GlyphProps): ReactElement {
  return (
    <GlyphBase {...props}>
      {(gradientId): ReactElement => (
        <>
          <path d="M10 7h28v19l-14 14-14-14Z" />
          <g fill="currentColor" stroke="none">
            <GlyphPixel x={24} y={14} />
          </g>
          <g data-anim="draw">
            <defs>
              <mask
                id={`${gradientId}-check`}
                maskUnits="userSpaceOnUse"
                x="14"
                y="18"
                width="21"
                height="16"
              >
                <path
                  data-part="check"
                  d="m17 25 5 5 10-10"
                  pathLength="1"
                  stroke="white"
                  strokeWidth="4"
                  strokeDasharray="1"
                />
              </mask>
            </defs>
            <path
              d="m15.5 25 2.5-2.5 4 4L30.5 18l2.5 2.5L22 31.5Z"
              fill={`url(#${gradientId})`}
              stroke="none"
              mask={`url(#${gradientId}-check)`}
            />
          </g>
        </>
      )}
    </GlyphBase>
  );
}
