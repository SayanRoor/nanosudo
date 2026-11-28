// Two chain links on the 45° diagonal, joined by a green brand pixel.
"use client";

import type { ReactElement } from "react";
import { GlyphBase, GlyphPixel, type GlyphProps } from "./glyph-base";

/** A stadium-shaped chain link centred at (x, y), laid along the 45° diagonal. */
function ChainLink({ x, y }: { readonly x: number; readonly y: number }): ReactElement {
  return (
    <rect
      x={x - 12}
      y={y - 5.5}
      width="24"
      height="11"
      rx="5.5"
      transform={`rotate(-45 ${x} ${y})`}
    />
  );
}

export function GlyphLink(props: GlyphProps): ReactElement {
  return (
    <GlyphBase {...props}>
      {(gradientId): ReactElement => (
        <>
          <g data-anim="join">
            <g>
              <ChainLink x={17} y={31} />
            </g>
            <g>
              <ChainLink x={31} y={17} />
            </g>
          </g>
          <g fill={`url(#${gradientId})`} stroke="none">
            <GlyphPixel x={24} y={24} />
          </g>
        </>
      )}
    </GlyphBase>
  );
}
