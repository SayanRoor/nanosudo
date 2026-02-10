'use client';

/**
 * Navigation component for simplified brief form
 * Shows Back/Next buttons with proper validation
 */

import type { ReactElement } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { useBriefSimpleStep } from '../hooks/use-brief-simple-step';
import type { BriefSimpleStepId } from '../types/brief-simple';

interface BriefSimpleStepNavigatorProps {
  readonly stepId: BriefSimpleStepId;
  readonly isSubmitting?: boolean;
}

export function BriefSimpleStepNavigator({ stepId, isSubmitting = false }: BriefSimpleStepNavigatorProps): ReactElement {
  const t = useTranslations('brief.simple.navigation');
  const { goNext, goBack, canGoBack, canGoForward, isLastStep } = useBriefSimpleStep(stepId);

  return (
    <div className="flex items-center justify-between gap-4 pt-6">
      {canGoBack ? (
        <motion.button
          type="button"
          onClick={goBack}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full border-2 border-border/80 font-semibold text-foreground hover:border-accent hover:text-accent transition-all"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <ArrowLeft className="w-4 h-4" />
          {t('back')}
        </motion.button>
      ) : (
        <div></div>
      )}

      {canGoForward && (
        <motion.button
          type="button"
          onClick={() => void goNext()}
          disabled={isSubmitting}
          className="inline-flex items-center gap-2 px-8 py-3 rounded-full bg-accent text-black font-bold hover:bg-accent/90 transition-all ml-auto disabled:opacity-50 disabled:cursor-not-allowed"
          whileHover={isSubmitting ? {} : { scale: 1.05 }}
          whileTap={isSubmitting ? {} : { scale: 0.95 }}
        >
          {isSubmitting ? t('submitting') : (isLastStep ? t('submit') : t('next'))}
          <ArrowRight className="w-4 h-4" />
        </motion.button>
      )}
    </div>
  );
}
