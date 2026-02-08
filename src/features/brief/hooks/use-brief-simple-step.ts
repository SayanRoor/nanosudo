/**
 * Hook for managing simplified brief form step navigation
 */

import { useCallback, useContext } from 'react';
import type { UseFormReturn } from 'react-hook-form';
import { BriefSimpleFormContext } from '../components/brief-simple-form-provider';
import type { BriefSimpleFormValues } from '../schemas/brief-simple';
import type { BriefSimpleStepId } from '../types/brief-simple';
import { BRIEF_SIMPLE_STEPS } from '../constants/steps-simple';

interface UseBriefSimpleStepReturn {
  readonly form: UseFormReturn<BriefSimpleFormValues>;
  readonly goNext: () => Promise<void>;
  readonly goBack: () => void;
  readonly canGoBack: boolean;
  readonly canGoForward: boolean;
  readonly currentStep: BriefSimpleStepId;
  readonly isFirstStep: boolean;
  readonly isLastStep: boolean;
}

export function useBriefSimpleStep(stepId: BriefSimpleStepId): UseBriefSimpleStepReturn {
  const context = useContext(BriefSimpleFormContext);

  if (!context) {
    throw new Error('useBriefSimpleStep must be used within BriefSimpleFormProvider');
  }

  const { form, currentStep, setCurrentStep } = context;

  const currentStepIndex = BRIEF_SIMPLE_STEPS.findIndex((s) => s.id === currentStep);

  const isFirstStep = currentStepIndex === 0;
  const isLastStep = currentStepIndex === BRIEF_SIMPLE_STEPS.length - 1;
  const canGoBack = currentStepIndex > 0;
  const canGoForward = currentStepIndex < BRIEF_SIMPLE_STEPS.length - 1;

  const goNext = useCallback(async (): Promise<void> => {
    // Validate current step before proceeding
    const fieldsToValidate = getFieldsForStep(stepId);
    const isValid = await form.trigger(fieldsToValidate);

    if (!isValid) {
      return;
    }

    if (canGoForward) {
      const nextStep = BRIEF_SIMPLE_STEPS[currentStepIndex + 1];
      if (nextStep) {
        setCurrentStep(nextStep.id);
        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  }, [stepId, form, canGoForward, currentStepIndex, setCurrentStep]);

  const goBack = useCallback((): void => {
    if (canGoBack) {
      const prevStep = BRIEF_SIMPLE_STEPS[currentStepIndex - 1];
      if (prevStep) {
        setCurrentStep(prevStep.id);
        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  }, [canGoBack, currentStepIndex, setCurrentStep]);

  return {
    form,
    goNext,
    goBack,
    canGoBack,
    canGoForward,
    currentStep,
    isFirstStep,
    isLastStep,
  };
}

/**
 * Get form fields that belong to a specific step
 */
function getFieldsForStep(stepId: BriefSimpleStepId): (keyof BriefSimpleFormValues)[] {
  switch (stepId) {
    case 'projectType':
      return ['projectType', 'description'];
    case 'priorities':
      return ['mainGoal', 'budgetClarity', 'timeline'];
    case 'contact':
      return ['name', 'email', 'preferredContact'];
    default:
      return [];
  }
}
