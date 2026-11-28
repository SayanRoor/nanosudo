// Angular rocket with a diamond flame that extends on launch.
"use client";

import type { ReactElement } from "react";
import { GlyphBase, GlyphPixel, type GlyphProps } from "./glyph-base";

export function GlyphLaunch(props: GlyphProps): ReactElement {
  return (
    <GlyphBase {...props}>
      {(gradientId): ReactElement => (
        <>
          <g data-anim="rise">
            <g data-part="rocket">
              <path d="m24 6 9 9v11l-9 9-9-9V15ZM15 22l-8 8v6l8-8m18-6 8 8v6l-8-8" />
              <circle cx="24" cy="19" r="3" />
            </g>
            <g data-part="flame" fill={`url(#${gradientId})`} stroke="none">
              <GlyphPixel x={24} y={42} />
            </g>
          </g>
        </>
      )}
    </GlyphBase>
  );
}
