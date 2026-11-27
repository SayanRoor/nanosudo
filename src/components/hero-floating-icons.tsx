'use client';

// HeroFloatingIcons — tech-stack icons placed only in the empty space around the
// hero text (side columns on desktop, top/bottom bands on mobile). Each tile
// floats in place; hovering colours it in, scales it up with an accent glow
// and reveals its name. Decorative only (aria-hidden).
import type { CSSProperties, ReactElement } from "react";
import Image from "next/image";

const DEVICON = "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons";
const SIMPLE = "https://cdn.simpleicons.org";

/** Where a tile is shown: desktop side columns, wide-screen inner columns, or mobile bands */
type Zone = "side" | "wide" | "mobile";

type FloatingIcon = {
  readonly name: string;
  readonly icon: string;
  /** Position of the tile centre, in % of the hero section */
  readonly x: number;
  readonly y: number;
  readonly zone: Zone;
  /** Monochrome dark icon that needs inverting on the dark theme */
  readonly invertOnDark?: boolean;
};

const ICONS: ReadonlyArray<FloatingIcon> = [
  // Left column
  { name: "Next.js", icon: `${DEVICON}/nextjs/nextjs-original.svg`, x: 7, y: 24, zone: "side", invertOnDark: true },
  { name: "Claude", icon: `${SIMPLE}/claude`, x: 13, y: 42, zone: "side" },
  { name: "TypeScript", icon: `${DEVICON}/typescript/typescript-original.svg`, x: 5, y: 58, zone: "side" },
  { name: "n8n", icon: `${SIMPLE}/n8n`, x: 12, y: 75, zone: "side" },
  { name: "PostgreSQL", icon: `${DEVICON}/postgresql/postgresql-original.svg`, x: 6, y: 86, zone: "side" },
  // Right column
  { name: "React", icon: `${DEVICON}/react/react-original.svg`, x: 93, y: 24, zone: "side" },
  { name: "Make", icon: `${SIMPLE}/make`, x: 87, y: 42, zone: "side", invertOnDark: true },
  { name: "Node.js", icon: `${DEVICON}/nodejs/nodejs-original.svg`, x: 95, y: 58, zone: "side" },
  { name: "Supabase", icon: `${DEVICON}/supabase/supabase-original.svg`, x: 88, y: 75, zone: "side" },
  { name: "Docker", icon: `${DEVICON}/docker/docker-original.svg`, x: 94, y: 86, zone: "side" },
  // Extra inner tiles where wide screens leave room
  { name: "Cursor", icon: `${SIMPLE}/cursor`, x: 19, y: 30, zone: "wide", invertOnDark: true },
  { name: "Tailwind CSS", icon: `${DEVICON}/tailwindcss/tailwindcss-original.svg`, x: 20, y: 80, zone: "wide" },
  { name: "Python", icon: `${DEVICON}/python/python-original.svg`, x: 81, y: 30, zone: "wide" },
  { name: "Telegram Bot API", icon: `${SIMPLE}/telegram`, x: 80, y: 80, zone: "wide" },
  // Mobile: bands above the headline and below the socials
  { name: "Next.js", icon: `${DEVICON}/nextjs/nextjs-original.svg`, x: 14, y: 15, zone: "mobile", invertOnDark: true },
  { name: "Claude", icon: `${SIMPLE}/claude`, x: 50, y: 13, zone: "mobile" },
  { name: "React", icon: `${DEVICON}/react/react-original.svg`, x: 86, y: 15, zone: "mobile" },
  { name: "n8n", icon: `${SIMPLE}/n8n`, x: 14, y: 95, zone: "mobile" },
  { name: "TypeScript", icon: `${DEVICON}/typescript/typescript-original.svg`, x: 50, y: 96, zone: "mobile" },
  { name: "Supabase", icon: `${DEVICON}/supabase/supabase-original.svg`, x: 86, y: 95, zone: "mobile" },
];

const ZONE_CLASS: Record<Zone, string> = {
  side: "hidden lg:block",
  wide: "hidden 2xl:block",
  mobile: "lg:hidden",
};

function FloatingTile({ item, index }: { readonly item: FloatingIcon; readonly index: number }): ReactElement {
  // Deterministic variety so tiles don't bob in sync
  const style = {
    left: `${item.x}%`,
    top: `${item.y}%`,
    "--float-duration": `${5 + (index % 4) * 0.8}s`,
    "--float-delay": `${-(index * 0.7) % 5}s`,
    "--float-rotate": `${index % 2 === 0 ? 4 : -4}deg`,
  } as CSSProperties;

  return (
    <div className={`hero-float absolute ${ZONE_CLASS[item.zone]}`} style={style}>
      <div className="hero-float-tile group relative flex h-11 w-11 items-center justify-center rounded-2xl border border-border/60 bg-surface/50 backdrop-blur-sm md:h-16 md:w-16">
        <span className={`relative h-6 w-6 md:h-8 md:w-8 ${item.invertOnDark ? "hero-tech-invert" : ""}`}>
          <Image src={item.icon} alt="" fill sizes="32px" className="object-contain" unoptimized />
        </span>
        <span className="pointer-events-none absolute top-full left-1/2 mt-2 -translate-x-1/2 whitespace-nowrap rounded-md bg-foreground px-2 py-1 text-[11px] font-semibold text-background opacity-0 transition-all duration-300 group-hover:translate-y-0.5 group-hover:opacity-100">
          {item.name}
        </span>
      </div>
    </div>
  );
}

export function HeroFloatingIcons(): ReactElement {
  return (
    <div aria-hidden="true" className="absolute inset-0">
      {ICONS.map((item, i) => (
        <FloatingTile key={`${item.zone}-${item.name}`} item={item} index={i} />
      ))}
    </div>
  );
}
