import type { DischargeContext, GroundedResponse } from './domain.js';
import { classifyQuestion, safetyResponse, validateGrounding } from './safety.js';

export interface ExplanationEngine { explain(question: string, context: DischargeContext): Promise<GroundedResponse>; }

export class MockExplanationEngine implements ExplanationEngine {
  async explain(question: string, context: DischargeContext): Promise<GroundedResponse> {
    const category = classifyQuestion(question);
    if (category !== 'SAFE_GROUNDED') return safetyResponse(category, context);
    const lower = question.toLowerCase();
    let response = '';
    let sources: GroundedResponse['sources'] = [];
    if (/medication|medicine|dose|take/.test(lower)) {
      response = `Your discharge plan lists ${context.medications.map((item) => `${item.name}, ${item.dose}, ${item.frequency}${item.duration ? ` for ${item.duration}` : ''}`).join('; ')}. ${context.medications[0]?.instructions ?? ''}`;
      sources = context.medications.map((item) => ({ type: 'MEDICATION', recordId: item.id }));
    } else if (/follow-up|appointment/.test(lower)) {
      const followUp = context.followUps[0];
      response = followUp?.date ? `Your follow-up is with ${followUp.service} on ${followUp.date}${followUp.time ? ` at ${followUp.time}` : ''}.` : 'Your discharge plan does not include a follow-up date.';
      sources = followUp ? [{ type: 'FOLLOW_UP', recordId: followUp.id }] : [];
    } else if (/warning|watch|signs|symptom/.test(lower)) {
      response = `Watch for ${context.warningSigns.map((item) => item.description.toLowerCase()).join(', ')}. ${context.emergencyInstructions}`;
      sources = context.warningSigns.map((item) => ({ type: 'WARNING_SIGN', recordId: item.id }));
    } else if (/home|rest|fluid|activity|diet/.test(lower)) {
      response = `Your home-care instructions are: ${context.homeCare.join('; ')}.`;
      sources = context.homeCare.map((_, index) => ({ type: 'HOME_CARE', recordId: `home-care-${index + 1}` }));
    } else {
      return safetyResponse('MISSING_INFORMATION', context);
    }
    if (!validateGrounding(response, context)) return safetyResponse('MISSING_INFORMATION', context);
    return { response, sources, category };
  }
}
