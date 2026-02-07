/**
 * Validation schemas for simplified 3-step brief form
 * Designed with client psychology in mind - minimal friction, maximum clarity
 */

import { z } from "zod";

// Step 1: What do you want? (WHAT)
export const projectTypeSchema = z.object({
  projectType: z.enum(['landing', 'corporate', 'ecommerce', 'service', 'mvp'], {
    required_error: "Выберите тип проекта",
  }),
  description: z.string()
    .min(10, "Опишите проект хотя бы в 10 символах")
    .max(500, "Максимум 500 символов"),
  hasExamples: z.boolean().default(false),
  examplesUrls: z.string().optional(),
});

// Step 2: What matters to you? (WHY)
export const prioritiesSchema = z.object({
  mainGoal: z.enum(['sales', 'leads', 'awareness', 'automation'], {
    required_error: "Выберите главную цель",
  }),
  budgetClarity: z.enum(['exact', 'approximate', 'no_idea'], {
    required_error: "Укажите понимание бюджета",
  }),
  timeline: z.enum(['urgent', 'normal', 'flexible'], {
    required_error: "Укажите желаемый срок",
  }),
  hasDesign: z.boolean().default(false),
  hasContent: z.boolean().default(false),
  hasDomain: z.boolean().default(false),
});

// Step 3: Let's get to know each other (WHO)
export const contactSimpleSchema = z.object({
  name: z.string()
    .min(2, "Имя должно содержать минимум 2 символа")
    .max(100, "Имя слишком длинное"),
  email: z.string()
    .email("Введите корректный email")
    .min(1, "Email обязателен"),
  phone: z.string().optional(),
  company: z.string().optional(),
  preferredContact: z.enum(['whatsapp', 'telegram', 'email', 'phone'], {
    required_error: "Выберите удобный способ связи",
  }),
});

// Combined form schema
export const briefSimpleSchema = z.object({
  projectType: projectTypeSchema.shape.projectType,
  description: projectTypeSchema.shape.description,
  hasExamples: projectTypeSchema.shape.hasExamples,
  examplesUrls: projectTypeSchema.shape.examplesUrls,
  mainGoal: prioritiesSchema.shape.mainGoal,
  budgetClarity: prioritiesSchema.shape.budgetClarity,
  timeline: prioritiesSchema.shape.timeline,
  hasDesign: prioritiesSchema.shape.hasDesign,
  hasContent: prioritiesSchema.shape.hasContent,
  hasDomain: prioritiesSchema.shape.hasDomain,
  name: contactSimpleSchema.shape.name,
  email: contactSimpleSchema.shape.email,
  phone: contactSimpleSchema.shape.phone,
  company: contactSimpleSchema.shape.company,
  preferredContact: contactSimpleSchema.shape.preferredContact,
});

export type ProjectTypeFormValues = z.infer<typeof projectTypeSchema>;
export type PrioritiesFormValues = z.infer<typeof prioritiesSchema>;
export type ContactSimpleFormValues = z.infer<typeof contactSimpleSchema>;
export type BriefSimpleFormValues = z.infer<typeof briefSimpleSchema>;
