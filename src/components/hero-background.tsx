'use client';

import { motion } from "framer-motion";
import Image from "next/image";
import { useEffect, useState } from "react";

const techIcons = [
    'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nextjs/nextjs-original.svg',
    'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/react/react-original.svg',
    'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/typescript/typescript-original.svg',
    'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nodejs/nodejs-original.svg',
    'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/supabase/supabase-original.svg',
    'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/postgresql/postgresql-original.svg',
    'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/docker/docker-original.svg',
    'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/tailwindcss/tailwindcss-original.svg',
    'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/graphql/graphql-plain.svg',
    'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/prisma/prisma-original.svg',
];

export function HeroBackground(): React.ReactElement | null {
    const [mounted, setMounted] = useState(false);
    const [icons, setIcons] = useState<Array<{
        x: number;
        y: number;
        duration: number;
        delay: number;
        scale: number;
        icon: string;
    }>>([]);

    useEffect(() => {
        // Generate static random positions on mount to avoid hydration mismatch
        const generatedIcons = techIcons.map((icon) => ({
            icon,
            x: Math.floor(Math.random() * 90) + 5,
            y: Math.floor(Math.random() * 80) + 10,
            duration: Math.floor(Math.random() * 20) + 25,
            delay: Math.floor(Math.random() * 10),
            scale: 0.4 + Math.random() * 0.4,
        }));
        setIcons(generatedIcons);
        setMounted(true);
    }, []);

    if (!mounted) return null;

    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10 select-none">
            {/* Floating Icons */}
            {icons.map((config, index) => (
                <motion.div
                    key={index}
                    className="absolute rounded-2xl bg-surface/5 backdrop-blur-[1px] border border-border/10 p-2 md:p-3 shadow-2xl"
                    style={{
                        left: `${config.x}%`,
                        top: `${config.y}%`,
                    }}
                    initial={{
                        opacity: 0,
                        scale: config.scale,
                        rotate: 0
                    }}
                    animate={{
                        y: [0, -40, 0],
                        rotate: [0, 15, -15, 0],
                        opacity: [0, 0.15, 0],
                        scale: [config.scale, config.scale * 1.1, config.scale]
                    }}
                    transition={{
                        duration: config.duration,
                        repeat: Infinity,
                        delay: config.delay,
                        ease: "easeInOut"
                    }}
                >
                    <div className="relative w-6 h-6 md:w-8 md:h-8 grayscale opacity-20 transition-all duration-500">
                        <Image
                            src={config.icon}
                            alt="tech icon"
                            width={32}
                            height={32}
                            className="object-contain"
                        />
                    </div>
                </motion.div>
            ))}

            {/* Decorative Orbs */}
            <div className="absolute top-1/4 -left-1/4 w-[600px] h-[600px] bg-accent/5 blur-[120px] rounded-full" />
            <div className="absolute bottom-1/4 -right-1/4 w-[700px] h-[700px] bg-secondary/5 blur-[150px] rounded-full" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,transparent_0%,var(--background)_70%)] opacity-50" />
        </div>
    );
}
