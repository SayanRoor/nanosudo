/**
 * Steps configuration for simplified 3-step brief form
 */

import type { BriefSimpleStep } from "../types/brief-simple";

export const BRIEF_SIMPLE_STEPS: readonly BriefSimpleStep[] = [
  { id: 'projectType', label: 'Что вы хотите?', order: 1 },
  { id: 'priorities', label: 'Что важно для вас?', order: 2 },
  { id: 'contact', label: 'Давайте познакомимся', order: 3 },
] as const;

export const BRIEF_SIMPLE_STEP_IDS = BRIEF_SIMPLE_STEPS.map((step) => step.id);
