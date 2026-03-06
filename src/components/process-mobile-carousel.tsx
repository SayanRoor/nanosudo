'use client';

// Mobile-only drag carousel for the Process section.
// Each card shows step number, duration, and output block.

import { useRef, useState, useCallback, useEffect } from 'react';
import {
  motion,
  useMotionValue,
  useTransform,
  useSpring,
  animate,
  type PanInfo,
  type MotionValue,
} from 'framer-motion';
import type { ReactElement, ReactNode } from 'react';
import { useTranslations } from 'next-intl';

// ── Constants ──────────────────────────────────────────────────────────────
const CARD_W = 268;
const CARD_H = 220;
const GAP = 16;
const STEP = CARD_W + GAP;
const CYBER = '#00ffe0';

const STEP_IDS = ['consult', 'scope', 'development', 'launch'] as const;
const STEP_NUMBERS = ['01', '02', '03', '04'] as const;
type StepId = (typeof STEP_IDS)[number];
const N = STEP_IDS.length;

// ── Types ──────────────────────────────────────────────────────────────────
type CardWrapperProps = {
  readonly index: number;
  readonly motionX: MotionValue<number>;
  readonly containerW: number;
  readonly children: ReactNode;
};

type ProcCardProps = {
  readonly stepId: StepId;
  readonly number: string;
  readonly t: ReturnType<typeof useTranslations>;
};

type DotsProps = {
  readonly activeIndex: number;
  readonly onSnap: (i: number) => void;
};

// ── Variants ───────────────────────────────────────────────────────────────
const CONTAINER_VARS = {
  hidden: {},
  show: { transition: { staggerChildren: 0.15, delayChildren: 0.1 } },
} as const;

const CARD_VARS = {
  hidden: { opacity: 0, y: 44, rotateX: 10 },
  show: {
    opacity: 1,
    y: 0,
    rotateX: 0,
    transition: { type: 'spring' as const, stiffness: 260, damping: 24 },
  },
} as const;

// ── Per-card scale + opacity wrapper ──────────────────────────────────────
function CardWrapper({ index, motionX, containerW, children }: CardWrapperProps): ReactElement {
  const dist = useTransform(
    motionX,
    (x: number) => x + index * STEP + CARD_W / 2 - containerW / 2,
  );
  const sDist = useSpring(dist, { stiffness: 200, damping: 28 });
  const scale  = useTransform(sDist, [-200, 0, 200], [0.88, 1.03, 0.88]);
  const opa    = useTransform(sDist, [-160, 0, 160], [0.55, 1.0, 0.55]);

  return (
    <motion.div variants={CARD_VARS} style={{ width: CARD_W, flexShrink: 0 }}>
      <motion.div style={{ scale, opacity: opa }}>
        <motion.div
          whileHover={{ scale: 1.02, y: -4 }}
          whileTap={{ scale: 0.97 }}
          transition={{ type: 'spring', stiffness: 380, damping: 28 }}
        >
          {children}
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

// ── Process card content ───────────────────────────────────────────────────
function ProcessCard({ stepId, number, t }: ProcCardProps): ReactElement {
  return (
    <div
      style={{
        width: CARD_W,
        height: CARD_H,
        borderRadius: 18,
        background: 'rgba(255,255,255,0.04)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        border: '1px solid rgba(255,255,255,0.08)',
        padding: 20,
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        willChange: 'transform',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Decorative large number background */}
      <span
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: -12,
          right: 8,
          fontSize: 88,
          fontFamily: 'var(--font-syne), var(--font-sans), sans-serif',
          fontWeight: 800,
          color: 'rgba(255,255,255,0.04)',
          lineHeight: 1,
          pointerEvents: 'none',
          userSelect: 'none',
        }}
      >
        {number}
      </span>

      <div>
        {/* Step number + title */}
        <div
          style={{
            fontSize: 10,
            fontWeight: 800,
            color: CYBER,
            letterSpacing: '0.12em',
            fontFamily: 'var(--font-syne), var(--font-sans), sans-serif',
            marginBottom: 8,
          }}
        >
          ШАГ {number}
        </div>
        <h3
          style={{
            fontFamily: 'var(--font-syne), var(--font-sans), sans-serif',
            fontWeight: 700,
            fontSize: 16,
            color: '#fff',
            margin: 0,
            lineHeight: 1.3,
          }}
        >
          {t(`home.process.steps.${stepId}.title` as Parameters<typeof t>[0])}
        </h3>
        {/* Duration */}
        <div
          style={{
            marginTop: 6,
            fontSize: 12,
            color: CYBER,
            fontWeight: 600,
            fontFamily: 'var(--font-dm-sans), var(--font-sans), sans-serif',
          }}
        >
          {t(`home.process.steps.${stepId}.duration` as Parameters<typeof t>[0])}
        </div>
      </div>

      {/* Output block */}
      <div
        style={{
          background: 'rgba(0,255,224,0.05)',
          border: '1px solid rgba(0,255,224,0.14)',
          borderRadius: 10,
          padding: '8px 12px',
        }}
      >
        <div
          style={{
            fontSize: 9,
            fontWeight: 800,
            color: CYBER,
            letterSpacing: '0.12em',
            fontFamily: 'var(--font-syne), var(--font-sans), sans-serif',
            marginBottom: 4,
          }}
        >
          {t('home.process.outputLabel' as Parameters<typeof t>[0])}
        </div>
        <div
          style={{
            fontSize: 11,
            color: 'rgba(255,255,255,0.65)',
            fontFamily: 'var(--font-dm-sans), var(--font-sans), sans-serif',
            display: 'flex',
            gap: 6,
            alignItems: 'flex-start',
            lineHeight: 1.4,
          }}
        >
          <span style={{ color: CYBER, flexShrink: 0, fontWeight: 700 }}>✓</span>
          <span>{t(`home.process.steps.${stepId}.output` as Parameters<typeof t>[0])}</span>
        </div>
      </div>
    </div>
  );
}

// ── Dots ───────────────────────────────────────────────────────────────────
function Dots({ activeIndex, onSnap }: DotsProps): ReactElement {
  return (
    <div
      role="tablist"
      aria-label="Шаги процесса"
      style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 6, marginTop: 20 }}
    >
      {STEP_IDS.map((id, i) => (
        <motion.button
          key={id}
          role="tab"
          aria-selected={i === activeIndex}
          aria-label={`Шаг ${i + 1}`}
          onClick={() => onSnap(i)}
          animate={{
            width: i === activeIndex ? 24 : 8,
            backgroundColor: i === activeIndex ? CYBER : 'rgba(255,255,255,0.2)',
          }}
          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
          style={{ height: 8, borderRadius: 4, border: 'none', padding: 0, cursor: 'pointer' }}
        />
      ))}
    </div>
  );
}

// ── Main export ────────────────────────────────────────────────────────────
export function ProcessMobileCarousel(): ReactElement {
  const t = useTranslations();
  const wrapRef   = useRef<HTMLDivElement>(null);
  const activeRef = useRef(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const [containerW, setContainerW]   = useState(360);
  const x = useMotionValue(0);

  const snapTo = useCallback(
    (idx: number): void => {
      const i = Math.max(0, Math.min(N - 1, idx));
      activeRef.current = i;
      setActiveIndex(i);
      const target = Math.round(containerW / 2 - i * STEP - CARD_W / 2);
      void animate(x, target, { type: 'spring', stiffness: 300, damping: 35 });
    },
    [containerW, x],
  );

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return undefined;
    const measure = (): void => {
      const w = el.offsetWidth;
      setContainerW(w);
      x.set(Math.round(w / 2 - activeRef.current * STEP - CARD_W / 2));
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return (): void => ro.disconnect();
  }, [x]);

  const handleDragEnd = useCallback(
    (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo): void => {
      const cur = activeRef.current;
      let next = cur;
      if (info.velocity.x < -500 || info.offset.x < -(CARD_W * 0.3))
        next = Math.min(N - 1, cur + 1);
      else if (info.velocity.x > 500 || info.offset.x > CARD_W * 0.3)
        next = Math.max(0, cur - 1);
      snapTo(next);
    },
    [snapTo],
  );

  const rightBound = Math.round(containerW / 2 - CARD_W / 2);
  const leftBound  = Math.round(containerW / 2 - (N - 1) * STEP - CARD_W / 2);

  return (
    <div ref={wrapRef} style={{ overflow: 'hidden', width: '100%' }}>
      <motion.div
        style={{ x, display: 'flex', gap: GAP, willChange: 'transform', cursor: 'grab' }}
        drag="x"
        dragConstraints={{ left: leftBound, right: rightBound }}
        dragElastic={0.08}
        dragTransition={{ bounceStiffness: 280, bounceDamping: 32 }}
        onDragEnd={handleDragEnd}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.3 }}
        variants={CONTAINER_VARS}
      >
        {STEP_IDS.map((stepId, i) => (
          <CardWrapper key={stepId} index={i} motionX={x} containerW={containerW}>
            <ProcessCard stepId={stepId} number={STEP_NUMBERS[i]} t={t} />
          </CardWrapper>
        ))}
      </motion.div>
      <Dots activeIndex={activeIndex} onSnap={snapTo} />
    </div>
  );
}
