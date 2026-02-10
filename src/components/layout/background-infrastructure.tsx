"use client";

import { type ReactElement } from "react";
import { motion } from "framer-motion";

/**
 * Elegant animated background with orbital rings and flowing particles
 * Optimized for performance with CSS animations and reduced motion support
 */
export function BackgroundInfrastructure(): ReactElement {
    return (
        <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
            {/* Orbital Rings - Elegant rotating circles with enhanced gradients */}
            <div className="absolute inset-0 flex items-center justify-center opacity-40">
                {[...Array(3)].map((_, i) => (
                    <motion.div
                        key={`ring-${i}`}
                        className="absolute rounded-full"
                        style={{
                            width: `${400 + i * 250}px`,
                            height: `${400 + i * 250}px`,
                            border: `2px solid rgba(140, 200, 75, ${0.15 - i * 0.03})`,
                            boxShadow: `0 0 30px rgba(140, 200, 75, ${0.1 - i * 0.02})`,
                        }}
                        animate={{
                            rotate: i % 2 === 0 ? 360 : -360,
                            scale: [1, 1.05, 1],
                        }}
                        transition={{
                            rotate: {
                                duration: 40 + i * 15,
                                repeat: Infinity,
                                ease: "linear",
                            },
                            scale: {
                                duration: 10 + i * 3,
                                repeat: Infinity,
                                ease: "easeInOut",
                            },
                        }}
                    />
                ))}
            </div>

            {/* Flowing Wave Paths - Smooth sine wave animation */}
            <svg
                className="absolute inset-0 w-full h-full opacity-20"
                xmlns="http://www.w3.org/2000/svg"
                style={{ willChange: 'transform' }}
            >
                <defs>
                    <linearGradient id="wave-gradient-1" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#8cc84b" stopOpacity="0" />
                        <stop offset="50%" stopColor="#8cc84b" stopOpacity="0.6" />
                        <stop offset="100%" stopColor="#8cc84b" stopOpacity="0" />
                    </linearGradient>
                    <linearGradient id="wave-gradient-2" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#68a063" stopOpacity="0" />
                        <stop offset="50%" stopColor="#68a063" stopOpacity="0.4" />
                        <stop offset="100%" stopColor="#68a063" stopOpacity="0" />
                    </linearGradient>
                </defs>
                {[0, 1, 2].map((i) => (
                    <motion.path
                        key={`wave-${i}`}
                        d={`M 0 ${250 + i * 200} Q 500 ${200 + i * 200} 1000 ${250 + i * 200} T 2000 ${250 + i * 200}`}
                        fill="none"
                        stroke={i === 0 ? "url(#wave-gradient-1)" : "url(#wave-gradient-2)"}
                        strokeWidth={i === 0 ? "3" : "2"}
                        animate={{
                            d: [
                                `M 0 ${250 + i * 200} Q 500 ${200 + i * 200} 1000 ${250 + i * 200} T 2000 ${250 + i * 200}`,
                                `M 0 ${250 + i * 200} Q 500 ${300 + i * 200} 1000 ${250 + i * 200} T 2000 ${250 + i * 200}`,
                                `M 0 ${250 + i * 200} Q 500 ${200 + i * 200} 1000 ${250 + i * 200} T 2000 ${250 + i * 200}`,
                            ],
                        }}
                        transition={{
                            duration: 8 + i * 3,
                            repeat: Infinity,
                            ease: "easeInOut",
                            delay: i * 1.5,
                        }}
                    />
                ))}
            </svg>

            {/* Floating Particles - Organic movement */}
            <div className="absolute inset-0 opacity-30">
                {[...Array(15)].map((_, i) => {
                    const size = 4 + (i % 4) * 3;
                    const delay = i * 0.4;
                    const duration = 5 + (i % 3) * 2;

                    return (
                        <motion.div
                            key={`particle-${i}`}
                            className="absolute rounded-full"
                            style={{
                                width: `${size}px`,
                                height: `${size}px`,
                                left: `${5 + (i * 6.5)}%`,
                                top: `${15 + (i * 5.5)}%`,
                                background: i % 3 === 0
                                    ? 'radial-gradient(circle, rgba(140, 200, 75, 0.6), transparent)'
                                    : 'rgba(140, 200, 75, 0.4)',
                                boxShadow: `0 0 ${size * 2}px rgba(140, 200, 75, 0.3)`,
                            }}
                            animate={{
                                y: [0, -40, 0],
                                x: [0, Math.sin(i) * 30, 0],
                                scale: [1, 1.3, 1],
                                opacity: [0.3, 0.8, 0.3],
                            }}
                            transition={{
                                duration,
                                repeat: Infinity,
                                ease: "easeInOut",
                                delay,
                            }}
                        />
                    );
                })}
            </div>

            {/* Glowing Orbs - Strategic accent points */}
            <div className="absolute inset-0">
                {[
                    { top: '10%', right: '15%', size: 300, delay: 0 },
                    { bottom: '20%', left: '10%', size: 400, delay: 7 },
                    { top: '50%', right: '20%', size: 250, delay: 14 },
                ].map((orb, i) => (
                    <motion.div
                        key={`orb-${i}`}
                        className="absolute rounded-full blur-3xl"
                        style={{
                            ...orb,
                            width: `${orb.size}px`,
                            height: `${orb.size}px`,
                            background: i === 1
                                ? 'radial-gradient(circle, rgba(140, 200, 75, 0.15), transparent)'
                                : 'radial-gradient(circle, rgba(104, 160, 99, 0.1), transparent)',
                        }}
                        animate={{
                            scale: [1, 1.4, 1],
                            opacity: [0.2, 0.5, 0.2],
                        }}
                        transition={{
                            duration: 18 + i * 5,
                            repeat: Infinity,
                            ease: "easeInOut",
                            delay: orb.delay,
                        }}
                    />
                ))}
            </div>

            {/* Pulsing Accent Rings - Depth effect */}
            <div className="absolute inset-0 flex items-center justify-center opacity-15">
                {[...Array(2)].map((_, i) => (
                    <motion.div
                        key={`pulse-${i}`}
                        className="absolute rounded-full"
                        style={{
                            width: `${500 + i * 200}px`,
                            height: `${500 + i * 200}px`,
                            border: `1px solid rgba(140, 200, 75, ${0.4 - i * 0.1})`,
                        }}
                        animate={{
                            scale: [1, 1.15, 1],
                            opacity: [0.2, 0.5, 0.2],
                        }}
                        transition={{
                            duration: 6 + i * 3,
                            repeat: Infinity,
                            ease: "easeInOut",
                            delay: i * 2,
                        }}
                    />
                ))}
            </div>
        </div>
    );
}
