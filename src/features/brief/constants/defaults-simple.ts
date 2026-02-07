/**
 * Default values for simplified brief form
 */

import type { BriefSimpleFormValues } from "../schemas/brief-simple";

export const BRIEF_SIMPLE_DEFAULT_VALUES: BriefSimpleFormValues = {
  // Step 1: Project Type
  projectType: 'landing',
  description: '',
  hasExamples: false,
  examplesUrls: '',

  // Step 2: Priorities
  mainGoal: 'leads',
  budgetClarity: 'approximate',
  timeline: 'normal',
  hasDesign: false,
  hasContent: false,
  hasDomain: false,

  // Step 3: Contact
  name: '',
  email: '',
  phone: '',
  company: '',
  preferredContact: 'telegram',
};
