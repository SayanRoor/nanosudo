/**
 * TypeScript types for simplified 3-step brief form
 */

export type ProjectType = 'landing' | 'corporate' | 'ecommerce' | 'service' | 'mvp';

export type MainGoal = 'sales' | 'leads' | 'awareness' | 'automation';

export type BudgetClarity = 'exact' | 'approximate' | 'no_idea';

export type Timeline = 'urgent' | 'normal' | 'flexible';

export type PreferredContact = 'whatsapp' | 'telegram' | 'email' | 'phone';

export type BriefSimpleStepId = 'projectType' | 'priorities' | 'contact';

export interface BriefSimpleStep {
  readonly id: BriefSimpleStepId;
  readonly label: string;
  readonly order: number;
}

export interface PriceRange {
  readonly min: number;
  readonly max: number;
}

export interface TimeEstimate {
  readonly min: number; // weeks
  readonly max: number; // weeks
}

export interface CalculationSimpleResult {
  readonly priceRange: PriceRange;
  readonly timeEstimate: TimeEstimate;
  readonly included: string[];
  readonly discounts: {
    readonly hasDesign: boolean;
    readonly hasContent: boolean;
    readonly urgency: number; // multiplier
  };
}
