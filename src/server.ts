import 'dotenv/config';
import crypto from 'node:crypto';
import express, { type NextFunction, type Request, type Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import pino from 'pino';
import { z } from 'zod';
import type { AuthContext, UserRole } from './domain.js';
import { assertPatientAccess, assertRole, AuthorizationError } from './authorization.js';
import { demoPatient, demoPlan } from './demo-data.js';
import { McpServer, type McpTool } from './mcp.js';
import { MockExplanationEngine } from './ai.js';
import { assessMedicationTeachBack } from './teachback.js';

const logger = pino({ redact: ['req.headers.authorization', 'body.question', 'res.body'] });
const app = express();
const mcp = new McpServer();
const ai = new MockExplanationEngine();
const port = Number(process.env.PORT ?? 4000);

app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors({ origin: process.env.CORS_ORIGIN ?? 'http://localhost:5173', credentials: true }));
app.use(express.json({ limit: '64kb' }));
app.use((request, _response, next) => { request.headers['x-request-id'] ??= crypto.randomUUID(); next(); });

function authFromRequest(request: Request): AuthContext {
  const token = request.header('authorization')?.replace(/^Bearer\s+/i, '');
  if (!token) throw new AuthorizationError('Authentication required.');
  if (token !== 'demo-patient-token' && token !== 'demo-clinician-token') throw new AuthorizationError('Invalid session.');
  return token === 'demo-patient-token'
    ? { userId: 'user-demo-patient', organizationId: demoPatient.organizationId, facilityId: demoPatient.facilityId, role: 'PATIENT', patientId: demoPatient.id }
    : { userId: 'user-demo-clinician', organizationId: demoPatient.organizationId, facilityId: demoPatient.facilityId, role: 'CLINICIAN' };
}

function protectedRoute(handler: (request: Request, response: Response, auth: AuthContext) => Promise<unknown>) {
  return async (request: Request, response: Response, next: NextFunction) => { try { await handler(request, response, authFromRequest(request)); } catch (error) { next(error); } };
}

const patientParam = z.object({ patientId: z.string().min(1).max(100) });
const questionBody = z.object({ question: z.string().trim().min(1).max(1000) });
const teachBackBody = z.object({ topic: z.literal('MEDICATION'), answer: z.string().trim().min(1).max(500) });

app.get('/health', (_request, response) => response.json({ status: 'ok', service: 'dischargevoice-api' }));
app.post('/api/auth/login', (request, response) => {
  const body = z.object({ email: z.string().email(), password: z.string().min(1) }).safeParse(request.body);
  if (!body.success) return response.status(400).json({ error: { code: 'INVALID_REQUEST', message: 'Email and password are required.' } });
  return response.json({ accessToken: body.data.email.includes('clinician') ? 'demo-clinician-token' : 'demo-patient-token', demo: true });
});
app.get('/api/auth/me', protectedRoute(async (_request, response, auth) => response.json({ user: auth })));
app.get('/api/patients/me/discharge', protectedRoute(async (_request, response, auth) => { if (!auth.patientId) throw new AuthorizationError(); assertPatientAccess(auth, auth.patientId); return response.json(demoPlan); }));
app.get('/api/discharges/:patientId', protectedRoute(async (request, response, auth) => { const params = patientParam.parse(request.params); assertPatientAccess(auth, params.patientId); return response.json(demoPlan); }));
app.post('/api/conversation/message', protectedRoute(async (request, response, auth) => { const body = questionBody.parse(request.body); const patientId = auth.patientId ?? demoPatient.id; assertPatientAccess(auth, patientId); const result = await ai.explain(body.question, demoPlan); return response.json({ ...result, patientId, planVersion: demoPlan.planVersion }); }));
app.post('/api/teach-back/response', protectedRoute(async (request, response, auth) => { const body = teachBackBody.parse(request.body); if (!auth.patientId) throw new AuthorizationError(); const assessment = assessMedicationTeachBack(body.answer, demoPlan); return response.json({ ...assessment, patientId: auth.patientId, planVersion: demoPlan.planVersion }); }));
app.post('/api/mcp/tools/:tool', protectedRoute(async (request, response, auth) => { assertRole(auth, ['PATIENT', 'CAREGIVER', 'CLINICIAN', 'PHARMACIST', 'FACILITY_ADMIN', 'ORGANIZATION_ADMIN', 'SYSTEM_ADMIN']); const tool = request.params.tool as McpTool; const patientId = auth.patientId ?? z.string().parse(request.body?.patientId); const result = await mcp.call(tool, auth, patientId, request.body ?? {}); return response.json({ data: result, audit: { event: 'MCP_REQUEST', tool } }); }));
app.get('/api/clinician/dashboard', protectedRoute(async (_request, response, auth) => { assertRole(auth, ['CLINICIAN', 'PHARMACIST', 'FACILITY_ADMIN', 'ORGANIZATION_ADMIN', 'SYSTEM_ADMIN']); return response.json({ demoData: true, todayDischarges: 8, readyToGo: 5, needsAttention: 3, teachBackScore: 91, patients: [{ ...demoPatient, name: `${demoPatient.firstName} ${demoPatient.lastName}`, status: demoPlan.status }] }); }));

app.use((error: unknown, _request: Request, response: Response, _next: NextFunction) => {
  if (error instanceof AuthorizationError) return response.status(403).json({ error: { code: 'ACCESS_DENIED', message: error.message } });
  if (error instanceof z.ZodError) return response.status(400).json({ error: { code: 'INVALID_REQUEST', message: 'The request could not be validated.' } });
  logger.error({ err: error }, 'request failed');
  return response.status(500).json({ error: { code: 'INTERNAL_ERROR', message: 'The request could not be completed safely.' } });
});

if (process.env.NODE_ENV !== 'test') app.listen(port, () => logger.info({ port }, 'DischargeVoice API listening'));
export { app };
