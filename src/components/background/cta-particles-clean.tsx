"use client";

/**
 * CTA Particles component - Simple particle animation
 * This is a placeholder/stub implementation to fix build errors
 */

import React from "react";

interface CTAParticlesProps {
  baseCount?: number;
  className?: string;
  text?: string;
  mode?: "text" | "default";
  rotate?: boolean;
  rotationSpeed?: number;
  followCursor?: boolean;
  center?: boolean;
  trail?: boolean;
}

export default function CTAParticles({
  className = "",
}: CTAParticlesProps): React.ReactElement {
  return (
    <div className={className} aria-hidden="true">
      {/* Placeholder - particle animation disabled temporarily */}
    </div>
  );
}
