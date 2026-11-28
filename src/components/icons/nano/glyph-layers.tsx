// Three diamond planes that separate vertically on hover.
"use client";

import type { ReactElement } from "react";
import { GlyphBase, GlyphPixel, type GlyphProps } from "./glyph-base";

export function GlyphLayers(props: GlyphProps): ReactElement {
  return (
    <GlyphBase {...props}>
      {(gradientId): ReactElement => (
        <>
          <g data-anim="lift">
            <path d="m10 27 14 14 14-14" />
            <path d="m10 19 14 14 14-14" />
            <g>
              <rect
                x="15"
                y="8"
                width="18"
                height="18"
                rx="6"
                transform="rotate(45 24 17)"
                fill={`url(#${gradientId})`}
                stroke="none"
              />
              <g fill="currentColor" stroke="none">
                <GlyphPixel x={24} y={17} />
              </g>
            </g>
          </g>
        </>
      )}
    </GlyphBase>
  );
}
