"use client";

import { type ReactElement } from "react";
import { motion } from "framer-motion";

export function BackgroundInfrastructure(): ReactElement {
    return (
        <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
            {/* Subtle gradient orbs - clean and minimal */}
            <div className="absolute inset-0">
                <motion.div
                    className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-accent/5 blur-3xl"
                    animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.3, 0.5, 0.3],
                    }}
                    transition={{
                        duration: 15,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                />
                <motion.div
                    className="absolute bottom-0 left-0 w-[600px] h-[600px] rounded-full bg-accent/5 blur-3xl"
                    animate={{
                        scale: [1, 1.3, 1],
                        opacity: [0.2, 0.4, 0.2],
                    }}
                    transition={{
                        duration: 20,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: 5,
                    }}
                />
            </div>
        </div>
    );
}
