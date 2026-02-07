'use client';

import { motion } from "framer-motion";
import Image from "next/image";
import { useEffect, useState, useMemo } from "react";

const technologies = [
    { name: 'Next.js', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nextjs/nextjs-original.svg' },
    { name: 'React', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/react/react-original.svg' },
    { name: 'TypeScript', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/typescript/typescript-original.svg' },
    { name: 'Node.js', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nodejs/nodejs-original.svg' },
    { name: 'Supabase', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/supabase/supabase-original.svg' },
    { name: 'PostgreSQL', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/postgresql/postgresql-original.svg' },
    { name: 'Docker', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/docker/docker-original.svg' },
    { name: 'Tailwind', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/tailwindcss/tailwindcss-original.svg' },
    { name: 'Prisma', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/prisma/prisma-original.svg' },
    { name: 'Framer', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/framermotion/framermotion-original.svg' },
    { name: 'Vite', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/vite/vite-original.svg' },
    { name: 'Redux', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/redux/redux-original.svg' },
    { name: 'GraphQL', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/graphql/graphql-plain.svg' },
    { name: 'Astro', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/astro/astro-original.svg' },
    { name: 'Bun', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/bun/bun-original.svg' },
];

export function GlobalTechBackground() {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const icons = useMemo(() => {
        return Array.from({ length: 24 }).map((_, i) => ({
            id: i,
            tech: technologies[i % technologies.length],
            left: `${(Math.random() * 100).toFixed(2)}%`,
            top: `${(Math.random() * 100).toFixed(2)}%`,
            duration: 20 + Math.random() * 40,
            delay: Math.random() * -20,
            scale: 0.5 + Math.random() * 0.5,
            rotate: Math.random() * 360,
        }));
    }, []);

    if (!mounted) return null;

    return (
        <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none select-none opacity-[0.04] dark:opacity-[0.08] transition-opacity duration-1000">
            {icons.map((icon) => (
                <motion.div
                    key={icon.id}
                    className="absolute"
                    style={{
                        left: icon.left,
                        top: icon.top,
                    }}
                    initial={{ opacity: 0 }}
                    animate={{
                        opacity: 1,
                        y: [0, -40, 0, 40, 0],
                        x: [0, 40, 0, -40, 0],
                        rotate: [icon.rotate, icon.rotate + 360],
                        scale: icon.scale,
                    }}
                    transition={{
                        duration: icon.duration,
                        repeat: Infinity,
                        delay: icon.delay,
                        ease: "linear",
                    }}
                >
                    <div className="relative group grayscale hover:grayscale-0 transition-all duration-700 blur-[2px] dark:blur-[1px]">
                        <Image
                            src={icon.tech.icon}
                            alt={icon.tech.name}
                            width={64}
                            height={64}
                            className="object-contain"
                        />
                    </div>
                </motion.div>
            ))}

            {/* Subtle overlays for better transition between sections */}
            <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-background dark:from-background/20 dark:to-background/20" />
        </div>
    );
}
