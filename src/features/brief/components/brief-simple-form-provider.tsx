'use client';

/**
 * Form provider for simplified 3-step brief
 * Manages form state, validation, and auto-save to localStorage
 */

import { createContext, useState, useEffect, type ReactNode, type ReactElement } from 'react';
import { useForm, type UseFormReturn } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { briefSimpleSchema, type BriefSimpleFormValues } from '../schemas/brief-simple';
import { BRIEF_SIMPLE_DEFAULT_VALUES } from '../constants/defaults-simple';
import type { BriefSimpleStepId } from '../types/brief-simple';

const STORAGE_KEY = 'nanosudo.brief.simple.draft';

interface BriefSimpleFormContextValue {
  readonly form: UseFormReturn<BriefSimpleFormValues>;
  readonly currentStep: BriefSimpleStepId;
  readonly setCurrentStep: (step: BriefSimpleStepId) => void;
}

export const BriefSimpleFormContext = createContext<BriefSimpleFormContextValue | null>(null);

interface BriefSimpleFormProviderProps {
  readonly children: ReactNode;
  readonly enableAutosave?: boolean;
}

export function BriefSimpleFormProvider({
  children,
  enableAutosave = true,
}: BriefSimpleFormProviderProps): ReactElement {
  const [currentStep, setCurrentStep] = useState<BriefSimpleStepId>('projectType');
  const [isHydrated, setIsHydrated] = useState(false);

  // Initialize form with default values or saved draft
  const form = useForm<BriefSimpleFormValues>({
    resolver: zodResolver(briefSimpleSchema),
    defaultValues: BRIEF_SIMPLE_DEFAULT_VALUES,
    mode: 'onBlur',
  });

  // Load saved draft from localStorage on mount
  useEffect(() => {
    if (!enableAutosave) {
      setIsHydrated(true);
      return;
    }

    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as {
          values: Partial<BriefSimpleFormValues>;
          step: BriefSimpleStepId;
        };

        // Restore form values
        const mergedValues = { ...BRIEF_SIMPLE_DEFAULT_VALUES, ...parsed.values };
        form.reset(mergedValues);

        // Restore current step
        if (parsed.step) {
          setCurrentStep(parsed.step);
        }
      }
    } catch (error) {
      console.error('Failed to load saved brief draft:', error);
    } finally {
      setIsHydrated(true);
    }
  }, [enableAutosave, form]);

  // Auto-save to localStorage when form values change
  useEffect(() => {
    if (!enableAutosave || !isHydrated) return;

    const subscription = form.watch((values) => {
      try {
        const dataToSave = {
          values,
          step: currentStep,
          timestamp: new Date().toISOString(),
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
      } catch (error) {
        console.error('Failed to auto-save brief draft:', error);
      }
    });

    return (): void => subscription.unsubscribe();
  }, [form, currentStep, enableAutosave, isHydrated]);

  // Don't render until hydrated to avoid SSR mismatch
  if (!isHydrated) {
    return <div className="min-h-screen flex items-center justify-center">
      <p className="text-muted-foreground">Загрузка...</p>
    </div>;
  }

  return (
    <BriefSimpleFormContext.Provider
      value={{
        form,
        currentStep,
        setCurrentStep,
      }}
    >
      {children}
    </BriefSimpleFormContext.Provider>
  );
}
