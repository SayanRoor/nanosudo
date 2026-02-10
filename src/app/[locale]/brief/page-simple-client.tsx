'use client';

/**
 * Simplified 3-step brief form page (client component)
 * Psychology-first approach for maximum conversion
 */

import type { ReactElement } from 'react';
import { useContext, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { Container } from '@/components/layout/container';
import { SiteShell } from '@/components/layout/site-shell';
import { BriefSimpleFormProvider, BriefSimpleFormContext } from '@/features/brief/components/brief-simple-form-provider';
import { BriefSimpleProgress } from '@/features/brief/components/brief-simple-progress';
import { ProjectTypeSimpleStep } from '@/features/brief/components/project-type-simple-step';
import { PrioritiesSimpleStep } from '@/features/brief/components/priorities-simple-step';
import { ContactSimpleStep } from '@/features/brief/components/contact-simple-step';
import { CalculationPreviewSimple } from '@/features/brief/components/calculation-preview-simple';

function BriefSimpleFormContent(): ReactElement {
  const context = useContext(BriefSimpleFormContext);
  const t = useTranslations('brief.simple');

  if (!context) {
    throw new Error('BriefSimpleFormContent must be used within BriefSimpleFormProvider');
  }

  const { currentStep, form } = context;
  const formValues = form.watch();

  // Hide background animations on brief page for clean, readable experience
  useEffect(() => {
    const backgrounds = document.querySelectorAll('[class*="fixed"][class*="inset-0"][class*="pointer-events-none"]');
    backgrounds.forEach((el) => {
      if (el instanceof HTMLElement) {
        el.style.display = 'none';
      }
    });

    return () => {
      backgrounds.forEach((el) => {
        if (el instanceof HTMLElement) {
          el.style.display = '';
        }
      });
    };
  }, []);

  return (
    <SiteShell>
      <main id="main-content" className="flex flex-1 flex-col pt-24 md:pt-32 pb-16">
        {/* Header */}
        <section className="border-b border-border/60 py-12 bg-surface/40">
          <Container className="max-w-4xl">
            <motion.div
              className="space-y-4 text-balance text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <motion.p
                className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
              >
                {t('header.label')}
              </motion.p>
              <motion.h1
                className="font-heading text-3xl md:text-4xl lg:text-5xl font-black"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                {t('header.title')}
              </motion.h1>
              <motion.p
                className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                {t('header.description')}
              </motion.p>
            </motion.div>
          </Container>
        </section>

        {/* Form Section */}
        <section className="py-12">
          <Container>
            <div className="max-w-6xl mx-auto">
              <BriefSimpleProgress />

              <div className="grid lg:grid-cols-[1fr,400px] gap-8 lg:gap-12">
                {/* Form Steps */}
                <motion.div
                  className="rounded-2xl border border-border/60 bg-surface/80 p-6 md:p-8 shadow-soft"
                  layout
                >
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentStep}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      {currentStep === 'projectType' && <ProjectTypeSimpleStep />}
                      {currentStep === 'priorities' && <PrioritiesSimpleStep />}
                      {currentStep === 'contact' && <ContactSimpleStep />}
                    </motion.div>
                  </AnimatePresence>
                </motion.div>

                {/* Calculation Preview */}
                <div className="lg:block hidden">
                  <CalculationPreviewSimple values={formValues} />
                </div>
              </div>

              {/* Mobile Calculation Preview */}
              <div className="lg:hidden mt-8">
                <CalculationPreviewSimple values={formValues} />
              </div>
            </div>
          </Container>
        </section>

        {/* Trust Signals */}
        <section className="py-8 border-t border-border/60">
          <Container>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <div className="text-center space-y-2">
                <p className="text-2xl font-heading font-black text-accent">{t('trustSignals.free.value')}</p>
                <p className="text-sm text-muted-foreground">{t('trustSignals.free.label')}</p>
              </div>
              <div className="text-center space-y-2">
                <p className="text-2xl font-heading font-black text-accent">{t('trustSignals.time.value')}</p>
                <p className="text-sm text-muted-foreground">{t('trustSignals.time.label')}</p>
              </div>
              <div className="text-center space-y-2">
                <p className="text-2xl font-heading font-black text-accent">{t('trustSignals.response.value')}</p>
                <p className="text-sm text-muted-foreground">{t('trustSignals.response.label')}</p>
              </div>
            </div>
          </Container>
        </section>
      </main>
    </SiteShell>
  );
}

export default function BriefSimplePage(): ReactElement {
  return (
    <BriefSimpleFormProvider enableAutosave={true}>
      <BriefSimpleFormContent />
    </BriefSimpleFormProvider>
  );
}
