// Page wireframe with assembling content blocks and a diamond tile.
"use client";

import type { ReactElement } from "react";
import { GlyphBase, GlyphPixel, type GlyphProps } from "./glyph-base";

export function GlyphBlueprint(props: GlyphProps): ReactElement {
  return (
    <GlyphBase {...props}>
      {(gradientId): ReactElement => (
        <>
          <rect x="6" y="7" width="36" height="34" rx="6" />
          <path d="M6 16h36" />
          <g data-anim="assemble">
            <g>
              <rect
                x="12"
                y="23"
                width="11"
                height="12"
                rx="2"
                fill={`url(#${gradientId})`}
                stroke="none"
              />
              <g fill="currentColor" stroke="none">
                <GlyphPixel x={17.5} y={29} />
              </g>
            </g>
            <rect x="29" y="23" width="7" height="12" rx="2" />
          </g>
        </>
      )}
    </GlyphBase>
  );
}
