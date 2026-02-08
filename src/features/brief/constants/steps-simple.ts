/**
 * Steps configuration for simplified 3-step brief form
 * Labels are now retrieved from i18n translations
 */

import type { BriefSimpleStepId } from "../types/brief-simple";

export const BRIEF_SIMPLE_STEPS: readonly { id: BriefSimpleStepId; order: number }[] = [
  { id: 'projectType', order: 1 },
  { id: 'priorities', order: 2 },
  { id: 'contact', order: 3 },
] as const;

export const BRIEF_SIMPLE_STEP_IDS = BRIEF_SIMPLE_STEPS.map((step) => step.id);
