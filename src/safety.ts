import type { DischargeContext, GroundedResponse, SafetyCategory } from './domain.js';

const patterns: Array<[SafetyCategory, RegExp]> = [
  ['MEDICATION_CHANGE', /\b(double|triple|increase|decrease|skip|change|stop|start|extra)\b.{0,40}\b(dose|medicine|medication|pill|tablet)\b|\b(dose|medicine|medication)\b.{0,40}\b(double|change|stop|increase|decrease)\b/i],
  ['DIAGNOSIS_REQUEST', /\b(do i have|am i|diagnos|cancer|infection|what is wrong)\b/i],
  ['NEW_TREATMENT_REQUEST', /\b(should i take|can i take|recommend|prescrib|treatment|remedy)\b/i],
  ['EMERGENCY_CONCERN', /\b(can'?t breathe|difficulty breathing|severe chest pain|confus|faint|unconscious|emergency)\b/i],
  ['UNSAFE_REQUEST', /ignore (all|previous) instructions|show me another patient|admin password|system prompt/i],
];

export function classifyQuestion(question: string): SafetyCategory {
  for (const [category, pattern] of patterns) if (pattern.test(question)) return category;
  if (/\b(medicine|medication|dose|take|follow-up|appointment|warning|symptom|home care|rest|fluid|activity|diet)\b/i.test(question)) return 'SAFE_GROUNDED';
  return 'OUT_OF_SCOPE';
}

export function safetyResponse(category: SafetyCategory, context: DischargeContext): GroundedResponse {
  const responses: Record<SafetyCategory, string> = {
    MEDICATION_CHANGE: 'Your discharge plan does not provide instructions to change that dose. Please contact your healthcare team or pharmacist for guidance.',
    DIAGNOSIS_REQUEST: 'DischargeVoice cannot diagnose medical conditions. Please contact your healthcare team for clinical guidance.',
    NEW_TREATMENT_REQUEST: 'Your discharge plan does not include a recommendation for that treatment. Please contact your healthcare team for guidance.',
    EMERGENCY_CONCERN: context.emergencyInstructions,
    UNSAFE_REQUEST: 'I can only access the discharge plan for the signed-in patient or authorized caregiver.',
    OUT_OF_SCOPE: 'That question is outside the information in your discharge plan. Please contact your healthcare team for clinical guidance.',
    MISSING_INFORMATION: 'That information is not included in your discharge plan.',
    SAFE_GROUNDED: 'I could not safely find that information in the discharge plan.'
  };
  return { response: responses[category], sources: [], category };
}

export function validateGrounding(text: string, context: DischargeContext): boolean {
  const normalized = text.toLowerCase();
  const allowedFacts = [
    ...context.medications.flatMap((item) => [item.name, item.dose, item.frequency, item.duration ?? '', item.instructions]),
    ...context.followUps.flatMap((item) => [item.service, item.date ?? '', item.time ?? '', item.location ?? '', item.instructions ?? '']),
    ...context.warningSigns.flatMap((item) => [item.description, item.responseInstructions ?? '']),
    ...context.homeCare,
    context.activityRestrictions ?? '', context.dietInstructions ?? '', context.facilityContact ?? ''
  ].map((value) => value.toLowerCase()).filter(Boolean);
  return allowedFacts.some((fact) => normalized.includes(fact)) || /not included|cannot|contact your healthcare|discharge plan lists/i.test(normalized);
}
