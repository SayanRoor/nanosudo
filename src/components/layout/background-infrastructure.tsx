"use client";

import { type ReactElement } from "react";
import { motion } from "framer-motion";

export function BackgroundInfrastructure(): ReactElement {
    return (
        <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
            {/* Orbital Rings - Elegant rotating circles */}
            <div className="absolute inset-0 flex items-center justify-center">
                {[...Array(4)].map((_, i) => (
                    <motion.div
                        key={`ring-${i}`}
                        className="absolute rounded-full border-2 border-accent/20"
                        style={{
                            width: `${300 + i * 200}px`,
                            height: `${300 + i * 200}px`,
                        }}
                        animate={{
                            rotate: i % 2 === 0 ? 360 : -360,
                            scale: [1, 1.1, 1],
                        }}
                        transition={{
                            rotate: {
                                duration: 30 + i * 10,
                                repeat: Infinity,
                                ease: "linear",
                            },
                            scale: {
                                duration: 8 + i * 2,
                                repeat: Infinity,
                                ease: "easeInOut",
                            },
                        }}
                    />
                ))}
            </div>

            {/* Flowing Waves - Smooth sine wave animation */}
            <svg className="absolute inset-0 w-full h-full opacity-30" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <linearGradient id="wave-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="currentColor" stopOpacity="0" className="text-accent" />
                        <stop offset="50%" stopColor="currentColor" stopOpacity="0.4" className="text-accent" />
                        <stop offset="100%" stopColor="currentColor" stopOpacity="0" className="text-accent" />
                    </linearGradient>
                </defs>
                {[...Array(3)].map((_, i) => (
                    <motion.path
                        key={`wave-${i}`}
                        d={`M 0 ${200 + i * 150} Q 400 ${150 + i * 150} 800 ${200 + i * 150} T 1600 ${200 + i * 150}`}
                        fill="none"
                        stroke="url(#wave-gradient)"
                        strokeWidth="3"
                        animate={{
                            d: [
                                `M 0 ${200 + i * 150} Q 400 ${150 + i * 150} 800 ${200 + i * 150} T 1600 ${200 + i * 150}`,
                                `M 0 ${200 + i * 150} Q 400 ${250 + i * 150} 800 ${200 + i * 150} T 1600 ${200 + i * 150}`,
                                `M 0 ${200 + i * 150} Q 400 ${150 + i * 150} 800 ${200 + i * 150} T 1600 ${200 + i * 150}`,
                            ],
                        }}
                        transition={{
                            duration: 6 + i * 2,
                            repeat: Infinity,
                            ease: "easeInOut",
                            delay: i * 1,
                        }}
                    />
                ))}
            </svg>

            {/* Floating Geometric Shapes - Abstract dots and circles */}
            <div className="absolute inset-0">
                {[...Array(12)].map((_, i) => (
                    <motion.div
                        key={`dot-${i}`}
                        className="absolute rounded-full bg-accent/30"
                        style={{
                            width: `${6 + (i % 3) * 4}px`,
                            height: `${6 + (i % 3) * 4}px`,
                            left: `${10 + (i * 8)}%`,
                            top: `${20 + (i * 6)}%`,
                        }}
                        animate={{
                            y: [0, -30, 0],
                            x: [0, Math.sin(i) * 20, 0],
                            scale: [1, 1.5, 1],
                            opacity: [0.3, 0.7, 0.3],
                        }}
                        transition={{
                            duration: 4 + i * 0.5,
                            repeat: Infinity,
                            ease: "easeInOut",
                            delay: i * 0.3,
                        }}
                    />
                ))}
            </div>

            {/* Diagonal Accents - Modern slanted lines */}
            <div className="absolute inset-0 overflow-hidden">
                {[...Array(5)].map((_, i) => (
                    <motion.div
                        key={`diagonal-${i}`}
                        className="absolute bg-linear-to-br from-transparent via-accent/25 to-transparent"
                        style={{
                            width: '200px',
                            height: '2px',
                            left: `${-10 + i * 25}%`,
                            top: `${10 + i * 20}%`,
                            transform: 'rotate(-45deg)',
                        }}
                        animate={{
                            left: [`${-10 + i * 25}%`, `${90 + i * 25}%`],
                            opacity: [0, 0.8, 0],
                        }}
                        transition={{
                            duration: 8 + i * 2,
                            repeat: Infinity,
                            ease: "easeInOut",
                            delay: i * 1.5,
                        }}
                    />
                ))}
            </div>

            {/* Pulsing Circles - Breathing effect */}
            <div className="absolute inset-0 flex items-center justify-center">
                {[...Array(3)].map((_, i) => (
                    <motion.div
                        key={`pulse-${i}`}
                        className="absolute rounded-full border border-accent/15"
                        style={{
                            width: `${400 + i * 150}px`,
                            height: `${400 + i * 150}px`,
                        }}
                        animate={{
                            scale: [1, 1.2, 1],
                            opacity: [0.1, 0.3, 0.1],
                        }}
                        transition={{
                            duration: 5 + i * 2,
                            repeat: Infinity,
                            ease: "easeInOut",
                            delay: i * 1,
                        }}
                    />
                ))}
            </div>
        </div>
    );
}
