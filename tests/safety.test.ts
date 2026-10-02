import { describe, expect, it } from 'vitest';
import { demoPlan } from '../src/demo-data.js';
import { MockExplanationEngine } from '../src/ai.js';
import { classifyQuestion } from '../src/safety.js';
import { assessMedicationTeachBack } from '../src/teachback.js';

describe('DischargeVoice safety boundary', () => {
  it('blocks medication changes before explanation', () => expect(classifyQuestion('Can I double my dose?')).toBe('MEDICATION_CHANGE'));
  it('rejects diagnosis requests', async () => expect((await new MockExplanationEngine().explain('Do I have cancer?', demoPlan)).category).toBe('DIAGNOSIS_REQUEST'));
  it('answers grounded medication questions', async () => { const result = await new MockExplanationEngine().explain('What medicines do I take?', demoPlan); expect(result.response).toContain('Amoxicillin'); expect(result.sources[0]?.type).toBe('MEDICATION'); });
  it('does not invent a missing appointment time', async () => { const result = await new MockExplanationEngine().explain('When is my follow-up?', demoPlan); expect(result.response).not.toContain('at 9'); expect(result.response).toContain('October 10'); });
  it('supports teach-back without blame', () => { const result = assessMedicationTeachBack('Tomorrow morning', demoPlan); expect(result.result).toBe('INCORRECT'); expect(result.supportiveMessage).toContain('review'); });
});
