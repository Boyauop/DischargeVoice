import type { DischargeContext } from './domain.js';

export type TeachBackResult = 'CORRECT' | 'INCORRECT' | 'NEEDS_REVIEW';
export interface TeachBackAssessment { result: TeachBackResult; supportiveMessage: string; expectedAnswer: string; }

export function assessMedicationTeachBack(answer: string, context: DischargeContext): TeachBackAssessment {
  const medication = context.medications[0];
  if (!medication) return { result: 'NEEDS_REVIEW', supportiveMessage: 'That instruction is not available in your discharge plan. Please contact your care team.', expectedAnswer: 'Not available' };
  const expectedAnswer = `${medication.frequency}${medication.duration ? ` for ${medication.duration}` : ''}`;
  const normalized = answer.toLowerCase();
  const correct = normalized.includes(medication.frequency.toLowerCase()) && (!medication.duration || normalized.includes(medication.duration.toLowerCase()));
  return correct
    ? { result: 'CORRECT', supportiveMessage: 'That is right. You understood the medication schedule.', expectedAnswer }
    : { result: 'INCORRECT', supportiveMessage: `Let's review that instruction again. Your plan says to take ${medication.name}, ${medication.dose}, ${expectedAnswer}.`, expectedAnswer };
}
