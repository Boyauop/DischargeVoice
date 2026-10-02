export type UserRole = 'PATIENT' | 'CAREGIVER' | 'CLINICIAN' | 'PHARMACIST' | 'FACILITY_ADMIN' | 'ORGANIZATION_ADMIN' | 'SYSTEM_ADMIN';
export type PlanStatus = 'DRAFT' | 'UNDER_REVIEW' | 'APPROVED' | 'ARCHIVED';
export type SafetyCategory = 'SAFE_GROUNDED' | 'OUT_OF_SCOPE' | 'MEDICATION_CHANGE' | 'DIAGNOSIS_REQUEST' | 'NEW_TREATMENT_REQUEST' | 'EMERGENCY_CONCERN' | 'MISSING_INFORMATION' | 'UNSAFE_REQUEST';

export interface AuthContext { userId: string; organizationId: string; facilityId?: string; role: UserRole; patientId?: string; caregiverPatientIds?: string[]; }
export interface Medication { id: string; name: string; dose: string; route: string; frequency: string; duration?: string; instructions: string; }
export interface DischargeContext { patientId: string; planId: string; planVersion: number; status: 'APPROVED'; clinicalSummary?: string; medications: Medication[]; followUps: Array<{ id: string; service: string; date?: string; time?: string; location?: string; instructions?: string; }>; warningSigns: Array<{ id: string; description: string; responseInstructions?: string; }>; homeCare: string[]; activityRestrictions?: string; dietInstructions?: string; facilityContact?: string; emergencyInstructions: string; }
export interface GroundedResponse { response: string; sources: Array<{ type: string; recordId: string }>; category: SafetyCategory; }
