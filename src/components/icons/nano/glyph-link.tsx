// Interlocking diamond links with a green intersection and a diamond node.
"use client";

import type { ReactElement } from "react";
import { GlyphBase, GlyphPixel, type GlyphProps } from "./glyph-base";

type LinkDiamondProps = {
  readonly x: number;
  readonly y: number;
  readonly clipId?: string;
};

function LinkDiamond({ x, y, clipId }: LinkDiamondProps): ReactElement {
  return (
    <rect
      x={x - 10}
      y={y - 10}
      width="20"
      height="20"
      rx="6"
      transform={`rotate(45 ${x} ${y})`}
      clipPath={clipId ? `url(#${clipId})` : undefined}
    />
  );
}

export function GlyphLink(props: GlyphProps): ReactElement {
  return (
    <GlyphBase {...props}>
      {(gradientId): ReactElement => (
        <>
          <defs>
            <clipPath id={`${gradientId}-intersection`}>
              <LinkDiamond x={29} y={29} />
            </clipPath>
          </defs>
          <g fill={`url(#${gradientId})`} stroke="none">
            <LinkDiamond x={19} y={19} clipId={`${gradientId}-intersection`} />
            <GlyphPixel x={24} y={24} />
          </g>
          <g data-anim="join">
            <g>
              <LinkDiamond x={19} y={19} />
            </g>
            <g>
              <LinkDiamond x={29} y={29} />
            </g>
          </g>
        </>
      )}
    </GlyphBase>
  );
}
