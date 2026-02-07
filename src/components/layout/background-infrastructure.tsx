"use client";

import { type ReactElement } from "react";
import { motion } from "framer-motion";

export function BackgroundInfrastructure(): ReactElement {
    return (
        <div className="bg-infrastructure">
            {/* The Technical Grid */}
            <div className="grid-pattern" />

            {/* Moving Technical Beams - Showcase of Design/Code Skill */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {[...Array(6)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute bg-gradient-to-r from-transparent via-accent/30 to-transparent"
                        style={{
                            height: '1px',
                            width: '40%',
                            left: '-40%',
                            top: `${15 + i * 15}%`,
                        }}
                        animate={{
                            left: ['-40%', '110%'],
                        }}
                        transition={{
                            duration: 10 + i * 2,
                            repeat: Infinity,
                            delay: i * 3,
                            ease: "linear",
                        }}
                    />
                ))}
                {[...Array(6)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute bg-gradient-to-b from-transparent via-accent/20 to-transparent"
                        style={{
                            width: '1px',
                            height: '40%',
                            top: '-40%',
                            left: `${10 + i * 18}%`,
                        }}
                        animate={{
                            top: ['-40%', '110%'],
                        }}
                        transition={{
                            duration: 12 + i * 2,
                            repeat: Infinity,
                            delay: i * 4,
                            ease: "linear",
                        }}
                    />
                ))}
            </div>

            {/* Floating Lights - Multi-color for design depth */}
            <motion.div
                className="glow-orb w-[800px] h-[800px] bg-accent/10 top-[-20%] left-[-10%]"
                animate={{
                    x: [0, 50, 0],
                    y: [0, 30, 0],
                    scale: [1, 1.1, 1],
                }}
                transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: "linear"
                }}
            />

            <motion.div
                className="glow-orb w-[600px] h-[600px] bg-secondary/5 bottom-[-10%] right-[-5%]"
                animate={{
                    x: [0, -40, 0],
                    y: [0, -60, 0],
                    scale: [1, 1.2, 1],
                }}
                transition={{
                    duration: 25,
                    repeat: Infinity,
                    ease: "linear"
                }}
            />

            <motion.div
                className="glow-orb w-[400px] h-[400px] bg-accent/5 top-[40%] right-[20%]"
                animate={{
                    x: [0, 30, 0],
                    y: [0, 100, 0],
                }}
                transition={{
                    duration: 30,
                    repeat: Infinity,
                    ease: "linear"
                }}
            />

            {/* Noise texture for premium feel */}
            <div className="noise-overlay" />
        </div>
    );
}
