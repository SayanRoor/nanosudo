// Shared framer-motion animation variants for home page sections.

export const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
};

export const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1,
    },
  },
};

type ViewportSettings = { readonly once: true; readonly amount: number };
export const getViewportSettings = (amount = 0.2): ViewportSettings => ({ once: true, amount });
