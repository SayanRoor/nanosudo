'use client';

/**
 * Calculation preview component for simplified brief
 * Shows estimated cost in real-time as user fills the form
 */

import { useEffect, useState } from 'react';
import type { ReactElement } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, CheckCircle2, Tag } from 'lucide-react';
import { useTranslations } from 'next-intl';
import type { BriefSimpleFormValues } from '../schemas/brief-simple';
import { calculateSimpleCost, formatPriceRange, formatTimeEstimate } from '../utils/calculation-simple';

interface CalculationPreviewSimpleProps {
  readonly values: Partial<BriefSimpleFormValues>;
  readonly locale?: string;
}

export function CalculationPreviewSimple({
  values,
  locale = 'ru',
}: CalculationPreviewSimpleProps): ReactElement {
  const t = useTranslations('brief.simple.calculation');
  const [isMounted, setIsMounted] = useState(false);

  // Avoid hydration mismatch
  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <div className="glass-card rounded-2xl p-6">
        <p className="text-sm text-muted-foreground">{t('title')}</p>
      </div>
    );
  }

  const calculation = calculateSimpleCost(values);
  const hasMinimalData = values.projectType !== undefined;

  return (
    <div className="sticky top-24 space-y-4">
      <motion.div
        className="glass-card rounded-2xl p-6 space-y-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <div className="space-y-2">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground">
            {t('title')}
          </p>
          <AnimatePresence mode="wait">
            {hasMinimalData ? (
              <motion.div
                key="price"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
              >
                <p className="font-heading text-3xl md:text-4xl font-black text-accent">
                  {formatPriceRange(calculation.priceRange, locale)}
                </p>
              </motion.div>
            ) : (
              <motion.p
                key="placeholder"
                className="text-sm text-muted-foreground"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {t('note')}
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        {hasMinimalData && (
          <>
            {/* Time Estimate */}
            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/20">
              <Clock className="w-5 h-5 text-accent shrink-0" />
              <div className="flex-1">
                <p className="text-xs font-semibold text-muted-foreground">{t('timeEstimate', { min: calculation.timeEstimate.min, max: calculation.timeEstimate.max })}</p>
                <p className="text-sm font-bold text-foreground">
                  {formatTimeEstimate(calculation.timeEstimate, locale)}
                </p>
              </div>
            </div>

            {/* Discounts Applied */}
            {(calculation.discounts.hasDesign || calculation.discounts.hasContent || calculation.discounts.urgency !== 1.0) && (
              <div className="space-y-2">
                <p className="text-xs font-semibold text-muted-foreground flex items-center gap-2">
                  <Tag className="w-4 h-4" />
                  {t('discounts.title')}
                </p>
                <div className="space-y-1 text-xs">
                  {calculation.discounts.hasDesign && (
                    <p className="text-green-600 dark:text-green-400">✓ {t('discounts.hasDesign')}</p>
                  )}
                  {calculation.discounts.hasContent && (
                    <p className="text-green-600 dark:text-green-400">✓ {t('discounts.hasContent')}</p>
                  )}
                  {calculation.discounts.urgency > 1.0 && (
                    <p className="text-orange-600 dark:text-orange-400">
                      ⚡ {t('discounts.urgency', { percent: Math.round((calculation.discounts.urgency - 1) * 100) })}
                    </p>
                  )}
                  {calculation.discounts.urgency < 1.0 && (
                    <p className="text-green-600 dark:text-green-400">
                      ⏱️ {t('discounts.flexible', { percent: Math.abs(Math.round((calculation.discounts.urgency - 1) * 100)) })}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* What's Included */}
            <div className="space-y-3">
              <p className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground">
                {t('included.title')}
              </p>
              <ul className="space-y-2">
                {calculation.included.map((feature, index) => (
                  <motion.li
                    key={feature}
                    className="flex items-start gap-2 text-sm text-foreground"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <CheckCircle2 className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                    <span>{feature}</span>
                  </motion.li>
                ))}
              </ul>
            </div>

            {/* Important Note */}
            <div className="p-4 rounded-lg bg-accent/5 border border-accent/20">
              <p className="text-xs text-muted-foreground leading-relaxed">
                💡 {t('note')}
              </p>
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
}
