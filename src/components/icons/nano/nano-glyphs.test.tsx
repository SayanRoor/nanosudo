// Verify the Nano Glyph family's SVG contract, accessibility, and instance IDs.
import { cleanup, render } from "@testing-library/react";
import { afterEach, expect, it } from "vitest";
import {
  GlyphAi,
  GlyphCode,
  GlyphLink,
  GlyphSpeed,
  GlyphShield,
  GlyphContract,
  GlyphPayment,
  GlyphEye,
  GlyphTalk,
  GlyphBlueprint,
  GlyphLayers,
  GlyphLaunch,
} from "./index";

const glyphs = [
  GlyphAi,
  GlyphCode,
  GlyphLink,
  GlyphSpeed,
  GlyphShield,
  GlyphContract,
  GlyphPayment,
  GlyphEye,
  GlyphTalk,
  GlyphBlueprint,
  GlyphLayers,
  GlyphLaunch,
];

afterEach(cleanup);

for (const Glyph of glyphs) {
  it(`${Glyph.name} uses the shared canvas and line weight`, (): void => {
    const { container } = render(<Glyph />);
    const svg = container.querySelector("svg");
    expect(svg).toHaveAttribute("viewBox", "0 0 48 48");
    expect(svg).toHaveAttribute("width", "48");
    expect(svg).toHaveAttribute("height", "48");
    expect(svg).toHaveAttribute("stroke", "currentColor");
    expect(svg).toHaveAttribute("stroke-width", "2.5");
    expect(svg).toHaveAttribute("fill", "none");
  });

  it(`${Glyph.name} has exactly one accent element referencing its own theme gradient`, (): void => {
    const { container } = render(<Glyph />);
    const accents = Array.from(container.querySelectorAll("[fill]")).filter(
      (element): boolean =>
        element.getAttribute("fill")?.startsWith("url(#") === true,
    );
    const gradient = container.querySelector("linearGradient");
    expect(accents).toHaveLength(1);
    expect(accents[0]).toHaveAttribute("fill", `url(#${gradient?.id})`);
    expect(gradient?.querySelectorAll("stop")).toHaveLength(2);
    expect(gradient?.firstElementChild?.getAttribute("style")).toContain(
      "var(--glyph-a, #4ADE80)",
    );
    expect(gradient?.lastElementChild?.getAttribute("style")).toContain(
      "var(--glyph-b, #2BB25A)",
    );
  });

  it(`${Glyph.name} is decorative without a title`, (): void => {
    const { container } = render(<Glyph />);
    expect(container.querySelector("svg")).toHaveAttribute(
      "aria-hidden",
      "true",
    );
    expect(container.querySelector("svg")).not.toHaveAttribute("role");
  });

  it(`${Glyph.name} exposes the title as its accessible name`, (): void => {
    const { getByRole } = render(<Glyph title="Nano example" />);
    const svg = getByRole("img", { name: "Nano example" });
    expect(svg).not.toHaveAttribute("aria-hidden");
    expect(svg.querySelector("title")).toHaveAttribute(
      "id",
      svg.getAttribute("aria-labelledby"),
    );
  });

  it(`${Glyph.name} keeps gradients and labels distinct between instances`, (): void => {
    const { container } = render(
      <>
        <Glyph title="First" />
        <Glyph title="Second" />
      </>,
    );
    const ids = Array.from(
      container.querySelectorAll("[id]"),
      (element): string => element.id,
    );
    expect(new Set(ids).size).toBe(ids.length);
    const gradients = container.querySelectorAll("linearGradient");
    const accents = Array.from(container.querySelectorAll("[fill]")).filter(
      (element): boolean =>
        element.getAttribute("fill")?.startsWith("url(#") === true,
    );
    expect(accents[0]).toHaveAttribute("fill", `url(#${gradients[0].id})`);
    expect(accents[1]).toHaveAttribute("fill", `url(#${gradients[1].id})`);
  });

  it(`${Glyph.name} accepts a size and class while retaining one animation layer and brand pixel`, (): void => {
    const { container } = render(
      <Glyph size={24} className="text-foreground" />,
    );
    const svg = container.querySelector("svg");
    expect(svg).toHaveAttribute("width", "24");
    expect(svg).toHaveAttribute("height", "24");
    expect(svg).toHaveClass("nano-glyph", "text-foreground");
    expect(container.querySelectorAll("[data-anim]")).toHaveLength(1);
    expect(
      container.querySelector('rect[width="3.5"][height="3.5"][rx="1"]'),
    ).not.toBeNull();
  });
}
