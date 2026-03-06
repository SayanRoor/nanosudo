// Validation schema for client service request (support portal)
import { z } from "zod";

export const REQUEST_TYPES = ['incident', 'service_request', 'change', 'problem', 'task'] as const;
export type RequestType = typeof REQUEST_TYPES[number];

export const URGENCY_LEVELS = ['high', 'medium', 'low'] as const;
export type UrgencyLevel = typeof URGENCY_LEVELS[number];

export const IMPACT_LEVELS = ['high', 'medium', 'low'] as const;
export type ImpactLevel = typeof IMPACT_LEVELS[number];

export const PRIORITY_LEVELS = ['critical', 'high', 'medium', 'low'] as const;
export type PriorityLevel = typeof PRIORITY_LEVELS[number];

export const STATUS_VALUES = ['new', 'acknowledged', 'in_progress', 'on_hold', 'resolved', 'closed'] as const;
export type StatusValue = typeof STATUS_VALUES[number];

/**
 * ITIL priority matrix: urgency × impact
 */
export function computePriority(urgency: UrgencyLevel, impact: ImpactLevel): PriorityLevel {
  if (urgency === 'high' && impact === 'high') return 'critical';
  if ((urgency === 'high' && impact === 'medium') || (urgency === 'medium' && impact === 'high')) return 'high';
  if (urgency === 'low' && impact === 'low') return 'low';
  return 'medium';
}

/**
 * SLA deadlines in calendar hours by priority
 */
export const SLA_HOURS: Record<PriorityLevel, { reaction: number; resolution: number }> = {
  critical: { reaction: 1, resolution: 4 },
  high:     { reaction: 4, resolution: 8 },
  medium:   { reaction: 8, resolution: 24 },
  low:      { reaction: 24, resolution: 72 },
};

/**
 * Ticket number prefix by request type
 */
export const TICKET_PREFIX: Record<RequestType, string> = {
  incident:        'INC',
  service_request: 'SRQ',
  change:          'CHG',
  problem:         'PRB',
  task:            'TSK',
};

export const serviceRequestSchema = z.object({
  type: z.enum(REQUEST_TYPES),
  urgency: z.enum(URGENCY_LEVELS),
  impact: z.enum(IMPACT_LEVELS),
  title: z.string().min(5, 'Минимум 5 символов').max(200),
  description: z.string().min(20, 'Минимум 20 символов').max(5000),
  client_name: z.string().min(2).max(100),
  client_email: z.string().email(),
  client_phone: z.string().max(30).optional().or(z.literal('')),
  company_name: z.string().max(150).optional().or(z.literal('')),
});

export type ServiceRequestInput = z.infer<typeof serviceRequestSchema>;
