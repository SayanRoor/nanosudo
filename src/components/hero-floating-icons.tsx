'use client';

// HeroFloatingIcons — desktop: full-colour tech-stack icons placed only in the
// empty space around the hero text; each floats in place and on hover scales up
// with an accent glow and reveals its name.
// HeroTechStrip — mobile: the same stack as a moving strip at the bottom of hero.
// Both are decorative only (aria-hidden).
import type { CSSProperties, ReactElement } from "react";
import Image from "next/image";

const DEVICON = "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons";
const SIMPLE = "https://cdn.simpleicons.org";

/** Where a tile is shown: desktop side columns or wide-screen inner columns */
type Zone = "side" | "wide";

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
];

const ZONE_CLASS: Record<Zone, string> = {
  side: "hidden lg:block",
  wide: "hidden 2xl:block",
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
    <div aria-hidden="true" className="absolute inset-0 hidden lg:block">
      {ICONS.map((item, i) => (
        <FloatingTile key={`${item.zone}-${item.name}`} item={item} index={i} />
      ))}
    </div>
  );
}

function StripChip({ item }: { readonly item: FloatingIcon }): ReactElement {
  return (
    <div className="flex shrink-0 items-center gap-2 rounded-xl border border-border/60 bg-surface/60 px-3 py-2 backdrop-blur-sm">
      <span className={`relative h-5 w-5 ${item.invertOnDark ? "hero-tech-invert" : ""}`}>
        <Image src={item.icon} alt="" fill sizes="20px" className="object-contain" unoptimized />
      </span>
      <span className="whitespace-nowrap text-xs font-semibold text-foreground">{item.name}</span>
    </div>
  );
}

export function HeroTechStrip(): ReactElement {
  // Two identical halves so the -50% translate loops seamlessly
  const loop = [...ICONS, ...ICONS];
  return (
    <div aria-hidden="true" className="hero-strip-mask overflow-hidden lg:hidden">
      <div className="hero-strip-track flex w-max gap-3">
        {loop.map((item, i) => (
          <StripChip key={`${item.name}-${i}`} item={item} />
        ))}
      </div>
    </div>
  );
}
