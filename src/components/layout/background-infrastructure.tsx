"use client";

import { type ReactElement } from "react";
import { motion } from "framer-motion";

export function BackgroundInfrastructure(): ReactElement {
    return (
        <div className="fixed inset-0 z-0 pointer-events-none">
            {/* Moving Technical Beams - Visible on foreground */}
            <div className="absolute inset-0 overflow-hidden">
                {/* Horizontal beams */}
                {[...Array(8)].map((_, i) => (
                    <motion.div
                        key={`h-${i}`}
                        className="absolute bg-linear-to-r from-transparent via-accent/40 to-transparent"
                        style={{
                            height: '2px',
                            width: '50%',
                            left: '-50%',
                            top: `${10 + i * 12}%`,
                        }}
                        animate={{
                            left: ['-50%', '100%'],
                        }}
                        transition={{
                            duration: 8 + i * 1.5,
                            repeat: Infinity,
                            delay: i * 2,
                            ease: "linear",
                        }}
                    />
                ))}

                {/* Vertical beams */}
                {[...Array(8)].map((_, i) => (
                    <motion.div
                        key={`v-${i}`}
                        className="absolute bg-linear-to-b from-transparent via-accent/30 to-transparent"
                        style={{
                            width: '2px',
                            height: '50%',
                            top: '-50%',
                            left: `${8 + i * 13}%`,
                        }}
                        animate={{
                            top: ['-50%', '100%'],
                        }}
                        transition={{
                            duration: 10 + i * 1.5,
                            repeat: Infinity,
                            delay: i * 2.5,
                            ease: "linear",
                        }}
                    />
                ))}
            </div>
        </div>
    );
}
