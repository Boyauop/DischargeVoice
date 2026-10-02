import { PrismaClient, PlanStatus, UserRole } from '@prisma/client';

const prisma = new PrismaClient();
async function main() {
  const organization = await prisma.organization.upsert({ where: { id: 'org-demo' }, update: {}, create: { id: 'org-demo', name: 'Demo Health Network' } });
  const facility = await prisma.facility.upsert({ where: { id: 'facility-demo' }, update: {}, create: { id: 'facility-demo', organizationId: organization.id, name: 'Demo Community Hospital', emergencyInstructions: 'Use your local emergency service or contact your care team.' } });
  const patient = await prisma.patient.upsert({ where: { id: 'patient-demo-001' }, update: {}, create: { id: 'patient-demo-001', organizationId: organization.id, facilityId: facility.id, patientIdentifier: 'DEMO-001', firstName: 'Abebe', lastName: 'Demo' } });
  const clinician = await prisma.user.upsert({ where: { email: 'clinician@example.test' }, update: {}, create: { organizationId: organization.id, facilityId: facility.id, email: 'clinician@example.test', passwordHash: 'demo-only', role: UserRole.CLINICIAN } });
  await prisma.dischargePlan.upsert({ where: { id: 'plan-demo-001' }, update: {}, create: { id: 'plan-demo-001', organizationId: organization.id, facilityId: facility.id, patientId: patient.id, status: PlanStatus.APPROVED, currentVersion: 1, dischargeReason: 'Community-acquired pneumonia', versions: { create: { version: 1, status: PlanStatus.APPROVED, createdById: clinician.id, approvedById: clinician.id, approvedAt: new Date(), clinicalSummary: 'Community-acquired pneumonia', medications: { create: { name: 'Amoxicillin', dose: '500 mg', route: 'oral', frequency: 'three times daily', duration: '5 days', instructions: 'Take according to the discharge plan.' } }, followUps: { create: { service: 'Medical Clinic', instructions: 'Bring your medication list.' } }, warningSigns: { create: [{ description: 'Difficulty breathing' }, { description: 'Severe chest pain' }, { description: 'Confusion' }] }, homeCareInstructions: { create: [{ instruction: 'Rest' }, { instruction: 'Drink fluids' }, { instruction: 'Follow medication instructions' }] } } } } });
}
main().finally(() => prisma.$disconnect());
