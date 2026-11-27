'use client';

// HeroTechBackdrop — decorative tech-stack marquee rendered behind the hero text.
// Several rows drift in alternating directions; hovering a chip colours it in,
// lifts it with an accent glow and pauses its row. Purely visual (aria-hidden).
import type { ReactElement } from "react";
import Image from "next/image";

type Tech = {
  readonly name: string;
  readonly icon: string;
  /** Monochrome dark icon that needs inverting on the dark theme */
  readonly invertOnDark?: boolean;
};

const DEVICON = "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons";
const SIMPLE = "https://cdn.simpleicons.org";

const ROWS: ReadonlyArray<ReadonlyArray<Tech>> = [
  [
    { name: "Next.js", icon: `${DEVICON}/nextjs/nextjs-original.svg`, invertOnDark: true },
    { name: "React", icon: `${DEVICON}/react/react-original.svg` },
    { name: "TypeScript", icon: `${DEVICON}/typescript/typescript-original.svg` },
    { name: "Node.js", icon: `${DEVICON}/nodejs/nodejs-original.svg` },
    { name: "NestJS", icon: `${DEVICON}/nestjs/nestjs-original.svg` },
    { name: "Tailwind CSS", icon: `${DEVICON}/tailwindcss/tailwindcss-original.svg` },
    { name: "GraphQL", icon: `${DEVICON}/graphql/graphql-plain.svg` },
  ],
  [
    { name: "Claude", icon: `${SIMPLE}/claude` },
    { name: "n8n", icon: `${SIMPLE}/n8n` },
    { name: "Make", icon: `${SIMPLE}/make`, invertOnDark: true },
    { name: "Cursor", icon: `${SIMPLE}/cursor`, invertOnDark: true },
    { name: "Python", icon: `${DEVICON}/python/python-original.svg` },
    { name: "Telegram Bot API", icon: `${SIMPLE}/telegram` },
    { name: "Figma", icon: `${DEVICON}/figma/figma-original.svg` },
  ],
  [
    { name: "Supabase", icon: `${DEVICON}/supabase/supabase-original.svg` },
    { name: "PostgreSQL", icon: `${DEVICON}/postgresql/postgresql-original.svg` },
    { name: "Prisma", icon: `${DEVICON}/prisma/prisma-original.svg`, invertOnDark: true },
    { name: "Redis", icon: `${DEVICON}/redis/redis-original.svg` },
    { name: "MongoDB", icon: `${DEVICON}/mongodb/mongodb-original.svg` },
    { name: "JavaScript", icon: `${DEVICON}/javascript/javascript-original.svg` },
    { name: "Jest", icon: `${DEVICON}/jest/jest-plain.svg` },
  ],
  [
    { name: "Docker", icon: `${DEVICON}/docker/docker-original.svg` },
    { name: "Kubernetes", icon: `${DEVICON}/kubernetes/kubernetes-original.svg` },
    { name: "Nginx", icon: `${DEVICON}/nginx/nginx-original.svg` },
    { name: "Linux", icon: `${DEVICON}/linux/linux-original.svg` },
    { name: "Git", icon: `${DEVICON}/git/git-original.svg` },
    { name: "Vercel", icon: `${SIMPLE}/vercel`, invertOnDark: true },
    { name: "HTML5", icon: `${DEVICON}/html5/html5-original.svg` },
  ],
];

const ROW_DURATIONS = ["48s", "62s", "54s", "70s"] as const;

function TechChip({ tech }: { readonly tech: Tech }): ReactElement {
  return (
    <div className="hero-tech-chip group flex shrink-0 items-center gap-3 rounded-2xl border border-border/50 bg-surface/40 px-5 py-3 md:px-6 md:py-4 backdrop-blur-sm">
      <span className={`relative flex h-6 w-6 shrink-0 items-center justify-center md:h-7 md:w-7 ${tech.invertOnDark ? "hero-tech-invert" : ""}`}>
        <Image src={tech.icon} alt="" width={28} height={28} className="object-contain" loading="lazy" unoptimized />
      </span>
      <span className="whitespace-nowrap text-sm font-semibold text-muted-foreground transition-colors duration-300 group-hover:text-foreground md:text-base">
        {tech.name}
      </span>
    </div>
  );
}

function TechRow({ items, index }: { readonly items: ReadonlyArray<Tech>; readonly index: number }): ReactElement {
  const reverse = index % 2 === 1;
  // Four copies: both halves are identical, so a -50% translate loops seamlessly
  const loop = [...items, ...items, ...items, ...items];
  return (
    <div
      className={`hero-tech-row flex w-max gap-4 md:gap-6 ${reverse ? "hero-tech-row--reverse" : ""}`}
      style={{ animationDuration: ROW_DURATIONS[index % ROW_DURATIONS.length] }}
    >
      {loop.map((tech, i) => (
        <TechChip key={`${tech.name}-${i}`} tech={tech} />
      ))}
    </div>
  );
}

export function HeroTechBackdrop(): ReactElement {
  return (
    <div aria-hidden="true" className="hero-tech-backdrop absolute inset-0 overflow-hidden">
      <div className="hero-tech-tilt absolute inset-0 flex flex-col justify-evenly">
        {ROWS.map((items, i) => (
          <TechRow key={i} items={items} index={i} />
        ))}
      </div>
    </div>
  );
}
