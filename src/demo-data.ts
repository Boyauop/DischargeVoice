import type { DischargeContext } from './domain.js';

export const demoPatient = { id: 'patient-demo-001', organizationId: 'org-demo', facilityId: 'facility-demo', patientIdentifier: 'DEMO-001', firstName: 'Abebe', lastName: 'Demo' };
export const demoPlan: DischargeContext = {
  patientId: demoPatient.id, planId: 'plan-demo-001', planVersion: 1, status: 'APPROVED',
  clinicalSummary: 'Community-acquired pneumonia',
  medications: [{ id: 'med-demo-001', name: 'Amoxicillin', dose: '500 mg', route: 'oral', frequency: 'three times daily', duration: '5 days', instructions: 'Take according to the discharge plan.' }],
  followUps: [{ id: 'followup-demo-001', service: 'Medical Clinic', date: 'October 10', instructions: 'Bring your medication list.' }],
  warningSigns: [
    { id: 'warning-demo-001', description: 'Difficulty breathing', responseInstructions: 'Use the facility emergency instructions.' },
    { id: 'warning-demo-002', description: 'Severe chest pain', responseInstructions: 'Use the facility emergency instructions.' },
    { id: 'warning-demo-003', description: 'Confusion', responseInstructions: 'Use the facility emergency instructions.' }
  ],
  homeCare: ['Rest', 'Drink fluids', 'Follow medication instructions'],
  emergencyInstructions: 'If you have difficulty breathing, severe chest pain, or confusion, seek emergency help using your local emergency service or contact your care team using the number in your discharge plan.',
  facilityContact: 'Ward 4B care team'
};
