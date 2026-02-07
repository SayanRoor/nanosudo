'use client';

import { motion } from "framer-motion";
import Image from "next/image";
import { useEffect, useState, useRef, useMemo } from "react";
import { useTranslations } from "next-intl";

const technologies = [
    { name: 'Next.js', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nextjs/nextjs-original.svg', category: 'frontend' },
    { name: 'React', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/react/react-original.svg', category: 'frontend' },
    { name: 'TypeScript', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/typescript/typescript-original.svg', category: 'language' },
    { name: 'Node.js', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nodejs/nodejs-original.svg', category: 'backend' },
    { name: 'Supabase', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/supabase/supabase-original.svg', category: 'database' },
    { name: 'PostgreSQL', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/postgresql/postgresql-original.svg', category: 'database' },
    { name: 'Docker', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/docker/docker-original.svg', category: 'ops' },
    { name: 'Tailwind', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/tailwindcss/tailwindcss-original.svg', category: 'frontend' },
    { name: 'Prisma', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/prisma/prisma-original.svg', category: 'backend' },
    { name: 'Framer', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/framermotion/framermotion-original.svg', category: 'frontend' },
];

export function TechEcosystem() {
    const t = useTranslations();
    const [mounted, setMounted] = useState(false);
    const [radius, setRadius] = useState(320); // Default to desktop radius

    // State to store the assignment of tech to orbital slots
    const [slots, setSlots] = useState<number[]>(technologies.map((_, i) => i));

    useEffect(() => {
        setMounted(true);

        const updateRadius = () => {
            if (window.innerWidth < 640) setRadius(160); // Mobile
            else if (window.innerWidth < 1024) setRadius(220); // Tablet
            else setRadius(320); // Desktop
        };

        updateRadius();
        window.addEventListener('resize', updateRadius);

        // Periodic reshuffle for "dynamic ecosystem"
        const interval = setInterval(() => {
            setSlots((prev) => {
                const newSlots = [...prev];
                // Perform random swaps to keep it feeling alive
                for (let i = 0; i < 2; i++) {
                    const idx1 = Math.floor(Math.random() * newSlots.length);
                    const idx2 = Math.floor(Math.random() * newSlots.length);
                    [newSlots[idx1], newSlots[idx2]] = [newSlots[idx2], newSlots[idx1]];
                }
                return newSlots;
            });
        }, 5000);

        return () => {
            window.removeEventListener('resize', updateRadius);
            clearInterval(interval);
        };
    }, []);

    // Calculate slot coordinates based on current radius
    const slotPositions = useMemo(() => {
        const count = technologies.length;
        return Array.from({ length: count }).map((_, i) => {
            const angle = (i / count) * Math.PI * 2;
            return {
                x: Math.cos(angle) * radius,
                y: Math.sin(angle) * radius,
                angle
            };
        });
    }, [radius]);

    if (!mounted) return null;

    return (
        <div className="relative w-full py-24 overflow-hidden bg-background/50">
            <div className="container mx-auto px-4 text-center mb-16">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="space-y-4"
                >
                    <h2 className="text-3xl md:text-5xl font-heading font-black tracking-tighter uppercase">
                        Unified <span className="text-accent">Ecosystem</span>
                    </h2>
                    <p className="text-muted-foreground max-w-2xl mx-auto">
                        A battle-tested technology stack designed for high-performance applications, seamless integration, and infinite scalability.
                    </p>
                </motion.div>
            </div>

            <div className="relative h-[650px] sm:h-[700px] md:h-[800px] max-w-7xl mx-auto flex items-center justify-center">
                {/* Central Core */}
                <motion.div
                    className="relative z-20 w-32 h-32 md:w-48 md:h-48 rounded-full bg-accent/10 border border-accent/30 flex items-center justify-center shadow-[0_0_50px_rgba(59,130,246,0.2)]"
                    animate={{
                        scale: [1, 1.05, 1],
                        boxShadow: [
                            "0_0_30px_rgba(59,130,246,0.1)",
                            "0_0_60px_rgba(59,130,246,0.3)",
                            "0_0_30px_rgba(59,130,246,0.1)"
                        ]
                    }}
                    transition={{
                        duration: 4,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                >
                    <div className="text-center">
                        <span className="block text-2xl md:text-4xl font-bold tech-gradient-text tracking-tighter">SDK</span>
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-accent/60">Core Stack</span>
                    </div>

                    {/* Orbital Rings */}
                    <div className="absolute inset-[-20%] rounded-full border border-border/20 animate-spin-slow pointer-events-none" />
                    <div className="absolute inset-[-40%] rounded-full border border-border/10 animate-spin-reverse-slow pointer-events-none" />
                </motion.div>

                {/* Floating Icons with Connections */}
                {technologies.map((tech, index) => {
                    const slotIndex = slots[index];
                    const pos = slotPositions[slotIndex];
                    const { x, y } = pos;

                    return (
                        <motion.div
                            key={tech.name}
                            className="absolute z-10"
                            initial={{ opacity: 0, x: 0, y: 0 }}
                            whileInView={{
                                opacity: 1,
                                x: x,
                                y: y,
                            }}
                            transition={{
                                duration: 1.2,
                                delay: index * 0.05,
                                type: "spring",
                                stiffness: 40,
                                damping: 12
                            }}
                            animate={{
                                x: x,
                                y: y,
                            }}
                        >
                            <motion.div
                                className="group relative"
                                animate={{
                                    y: [0, -10, 0],
                                }}
                                transition={{
                                    duration: 3 + Math.random() * 2,
                                    repeat: Infinity,
                                    ease: "easeInOut"
                                }}
                            >
                                <div className="flex flex-col items-center gap-2">
                                    <div className="w-12 h-12 md:w-16 md:h-16 rounded-2xl glass-card border border-border/40 p-3 md:p-4 flex items-center justify-center group-hover:border-accent/50 group-hover:shadow-[0_0_20px_rgba(59,130,246,0.2)] transition-all duration-300">
                                        <Image
                                            src={tech.icon}
                                            alt={tech.name}
                                            width={40}
                                            height={40}
                                            className="object-contain"
                                        />
                                    </div>
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground group-hover:text-accent transition-colors">
                                        {tech.name}
                                    </span>
                                </div>

                                {/* Connection Line to Center */}
                                <svg
                                    className="absolute top-1/2 left-1/2 -z-10 pointer-events-none overflow-visible"
                                    style={{ width: 0, height: 0 }}
                                >
                                    <motion.line
                                        x1={0}
                                        y1={0}
                                        x2={-x}
                                        y2={-y}
                                        stroke="currentColor"
                                        strokeWidth="0.5"
                                        className="text-accent/20"
                                        initial={{ pathLength: 0, opacity: 0 }}
                                        whileInView={{ pathLength: 1, opacity: 1 }}
                                        transition={{ duration: 1.5, delay: 0.8 + index * 0.05 }}
                                    />
                                </svg>
                            </motion.div>
                        </motion.div>
                    );
                })}
            </div>

            {/* Subtle Background Glows */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-accent/[0.03] blur-[150px] rounded-full -z-10 pointer-events-none" />
        </div>
    );
}
