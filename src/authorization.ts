import type { AuthContext } from './domain.js';

export class AuthorizationError extends Error { constructor(message = 'Access denied.') { super(message); this.name = 'AuthorizationError'; } }

export function assertPatientAccess(auth: AuthContext, patientId: string): void {
  if (auth.organizationId.length === 0) throw new AuthorizationError();
  if (auth.role === 'SYSTEM_ADMIN' || auth.role === 'ORGANIZATION_ADMIN') return;
  if (auth.patientId === patientId) return;
  if (auth.caregiverPatientIds?.includes(patientId)) return;
  throw new AuthorizationError();
}

export function assertRole(auth: AuthContext, roles: AuthContext['role'][]): void {
  if (!roles.includes(auth.role)) throw new AuthorizationError('Your role cannot perform this action.');
}
