import { demoPatient, demoPlan } from './demo-data.js';
import type { AuthContext, DischargeContext, PlanStatus } from './domain.js';

export interface AuditEntry {
  event: string;
  userId: string;
  organizationId: string;
  resourceType?: string;
  resourceId?: string;
  requestId?: string;
  createdAt: string;
  metadata?: Record<string, unknown>;
}

const plans = new Map<string, DischargeContext>([[demoPlan.planId, structuredClone(demoPlan)]]);
const statuses = new Map<string, PlanStatus>([[demoPlan.planId, 'APPROVED']]);
const audits: AuditEntry[] = [];

export function getPlanForPatient(patientId: string): DischargeContext | undefined {
  return [...plans.values()].find((plan) => plan.patientId === patientId && statuses.get(plan.planId) === 'APPROVED');
}

export function createDraft(input: Omit<DischargeContext, 'planId' | 'planVersion' | 'status'>, auth: AuthContext): DischargeContext {
  const plan: DischargeContext = { ...input, planId: `plan-${crypto.randomUUID()}`, planVersion: 1, status: 'APPROVED' };
  plans.set(plan.planId, plan);
  statuses.set(plan.planId, 'DRAFT');
  recordAudit('DISCHARGE_CREATED', auth, 'DischargePlan', plan.planId);
  return plan;
}

export function approvePlan(planId: string, auth: AuthContext): DischargeContext {
  const plan = plans.get(planId);
  if (!plan) throw new Error('DISCHARGE_PLAN_NOT_FOUND');
  statuses.set(planId, 'APPROVED');
  recordAudit('DISCHARGE_APPROVED', auth, 'DischargePlan', planId, { version: plan.planVersion });
  return { ...plan, status: 'APPROVED' };
}

export function getStatus(planId: string): PlanStatus | undefined { return statuses.get(planId); }

export function recordAudit(event: string, auth: AuthContext, resourceType?: string, resourceId?: string, metadata?: Record<string, unknown>, requestId?: string): void {
  audits.push({ event, userId: auth.userId, organizationId: auth.organizationId, resourceType, resourceId, metadata, requestId, createdAt: new Date().toISOString() });
}

export function getAudits(auth: AuthContext): AuditEntry[] {
  return audits.filter((entry) => entry.organizationId === auth.organizationId);
}

export { demoPatient };