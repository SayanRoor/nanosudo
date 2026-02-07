'use client';

/**
 * Progress indicator for simplified 3-step brief
 */

import type { ReactElement } from 'react';
import { useContext } from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { BriefSimpleFormContext } from './brief-simple-form-provider';
import { BRIEF_SIMPLE_STEPS } from '../constants/steps-simple';

export function BriefSimpleProgress(): ReactElement {
  const context = useContext(BriefSimpleFormContext);

  if (!context) {
    throw new Error('BriefSimpleProgress must be used within BriefSimpleFormProvider');
  }

  const { currentStep, setCurrentStep } = context;
  const currentStepIndex = BRIEF_SIMPLE_STEPS.findIndex((s) => s.id === currentStep);

  return (
    <div className="mb-12">
      <div className="flex items-center justify-between max-w-2xl mx-auto">
        {BRIEF_SIMPLE_STEPS.map((step, index) => {
          const isActive = index === currentStepIndex;
          const isCompleted = index < currentStepIndex;
          const isClickable = index < currentStepIndex; // Can go back to completed steps

          return (
            <div key={step.id} className="flex items-center flex-1">
              {/* Step Circle */}
              <button
                type="button"
                onClick={() => isClickable && setCurrentStep(step.id)}
                disabled={!isClickable}
                className={`relative z-10 flex items-center justify-center w-10 h-10 rounded-full border-2 font-bold text-sm transition-all ${
                  isActive
                    ? 'border-accent bg-accent text-black scale-110'
                    : isCompleted
                    ? 'border-accent bg-accent/10 text-accent cursor-pointer hover:scale-105'
                    : 'border-border/60 bg-background text-muted-foreground'
                }`}
              >
                {isCompleted ? (
                  <Check className="w-5 h-5" />
                ) : (
                  <span>{step.order}</span>
                )}
              </button>

              {/* Connecting Line */}
              {index < BRIEF_SIMPLE_STEPS.length - 1 && (
                <div className="flex-1 h-0.5 bg-border/60 mx-2 relative">
                  <motion.div
                    className="absolute inset-0 bg-accent"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: isCompleted ? 1 : 0 }}
                    transition={{ duration: 0.3 }}
                    style={{ transformOrigin: 'left' }}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Step Labels */}
      <div className="flex items-start justify-between max-w-2xl mx-auto mt-3">
        {BRIEF_SIMPLE_STEPS.map((step, index) => {
          const isActive = index === currentStepIndex;
          return (
            <div
              key={step.id}
              className={`text-center flex-1 ${index < BRIEF_SIMPLE_STEPS.length - 1 ? 'pr-4' : ''}`}
            >
              <p
                className={`text-xs font-semibold transition-colors ${
                  isActive ? 'text-accent' : 'text-muted-foreground'
                }`}
              >
                {step.label}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
