'use client';

/**
 * Animated gradient background component
 * Provides consistent animated orbs across pages with theme colors
 */

import { motion } from 'framer-motion';

interface AnimatedGradientBgProps {
  readonly intensity?: 'subtle' | 'normal' | 'strong';
}

export function AnimatedGradientBg({ intensity = 'normal' }: AnimatedGradientBgProps): React.ReactElement {
  // Adjust opacity based on intensity
  const opacityMultiplier = {
    subtle: 0.7,
    normal: 1,
    strong: 1.3,
  }[intensity];

  return (
    <div className="absolute inset-0 -z-10 pointer-events-none overflow-hidden" aria-hidden="true">
      {/* Base gradient */}
      <div className="absolute inset-0 bg-linear-to-br from-background via-background to-muted/20" />

      {/* Animated gradient orbs matching theme colors */}
      <div className="absolute inset-0">
        {/* Accent color orb - top left */}
        <motion.div
          className="absolute -left-1/4 -top-1/4 h-[500px] w-[500px] md:h-[700px] md:w-[700px] rounded-full bg-accent/20 dark:bg-accent/10 blur-[100px]"
          style={{ opacity: opacityMultiplier }}
          animate={{
            x: [0, 50, 0],
            y: [0, 30, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Secondary orb - bottom right */}
        <motion.div
          className="absolute -bottom-1/4 -right-1/4 h-[400px] w-[400px] md:h-[600px] md:w-[600px] rounded-full bg-accent/15 dark:bg-accent/8 blur-[120px]"
          style={{ opacity: opacityMultiplier }}
          animate={{
            x: [0, -30, 0],
            y: [0, -50, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
        />

        {/* Center glow */}
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[300px] w-[300px] md:h-[500px] md:w-[500px] rounded-full bg-accent/10 dark:bg-accent/5 blur-[80px]"
          style={{ opacity: opacityMultiplier }}
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.3 * opacityMultiplier, 0.6 * opacityMultiplier, 0.3 * opacityMultiplier],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>
    </div>
  );
}
