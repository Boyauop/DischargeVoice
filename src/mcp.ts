import type { AuthContext, DischargeContext } from './domain.js';
import { assertPatientAccess, AuthorizationError } from './authorization.js';
import { demoPatient, demoPlan } from './demo-data.js';

export type McpTool = 'get_discharge_plan' | 'get_medications' | 'get_medication' | 'get_follow_up' | 'get_warning_signs' | 'get_home_care' | 'get_activity_restrictions' | 'get_diet_instructions' | 'get_facility_contact' | 'get_emergency_instructions';

export class McpServer {
  async call(tool: McpTool, auth: AuthContext, patientId: string, args: Record<string, string> = {}): Promise<unknown> {
    assertPatientAccess(auth, patientId);
    if (patientId !== demoPatient.id || auth.organizationId !== demoPatient.organizationId) throw new AuthorizationError();
    const plan = demoPlan;
    switch (tool) {
      case 'get_discharge_plan': return plan;
      case 'get_medications': return { patientId, planVersion: plan.planVersion, medications: plan.medications };
      case 'get_medication': return plan.medications.find((item) => item.id === args.medicationId) ?? null;
      case 'get_follow_up': return plan.followUps;
      case 'get_warning_signs': return plan.warningSigns;
      case 'get_home_care': return plan.homeCare;
      case 'get_activity_restrictions': return plan.activityRestrictions ?? null;
      case 'get_diet_instructions': return plan.dietInstructions ?? null;
      case 'get_facility_contact': return plan.facilityContact ?? null;
      case 'get_emergency_instructions': return plan.emergencyInstructions;
    }
  }
}
