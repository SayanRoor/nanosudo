// Shared Nano Glyph canvas, theme gradient, pixel signature, and accessible label.
"use client";
import { useId, type ReactElement, type ReactNode } from "react";

export type GlyphProps = {
  readonly size?: number;
  readonly className?: string;
  readonly title?: string;
};

export type NanoGlyph = (props: GlyphProps) => ReactElement;

type GlyphBaseProps = GlyphProps & {
  readonly children: (gradientId: string) => ReactNode;
};

export function GlyphBase({
  size = 48,
  className,
  title,
  children,
}: GlyphBaseProps): ReactElement {
  const gradientId = `nano-${useId().replace(/:/g, "")}`;
  const titleId = `${gradientId}-title`;
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 48 48"
      width={size}
      height={size}
      className={`nano-glyph shrink-0${className ? ` ${className}` : ""}`}
      fill="none"
      stroke="currentColor"
      strokeWidth={2.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden={title ? undefined : true}
      role={title ? "img" : undefined}
      aria-labelledby={title ? titleId : undefined}
      focusable="false"
    >
      {title ? <title id={titleId}>{title}</title> : null}
      <defs>
        <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: "var(--glyph-a, #4ADE80)" }} />
          <stop
            offset="100%"
            style={{ stopColor: "var(--glyph-b, #2BB25A)" }}
          />
        </linearGradient>
      </defs>
      {children(gradientId)}
    </svg>
  );
}

// A 3.5-unit square rotated 45 degrees makes the five-unit brand pixel.
export function GlyphPixel({
  x,
  y,
}: {
  readonly x: number;
  readonly y: number;
}): ReactElement {
  return (
    <rect
      x={x - 1.75}
      y={y - 1.75}
      width="3.5"
      height="3.5"
      rx="1"
      transform={`rotate(45 ${x} ${y})`}
    />
  );
}
