import { User, UserRole, Permission } from '@/types';
import { AuditLogger } from './auth/audit';
import { buildUser, getPermissionsForRole, hasPermission as roleHasPermission, mapEmailToRole } from './auth/rbac';

// Mock user database - in production, this would be from a real database
const MOCK_USERS: Record<string, { role: UserRole; name: string }> = {
  // Production test users for validation
  'qa.manager@lwscientific.com': { role: 'QA', name: 'QA Manager' },
  'engineer@lwscientific.com': { role: 'Engineer', name: 'Engineering Lead' },
  'production@lwscientific.com': { role: 'Production', name: 'Production Manager' },
  'manager@lwscientific.com': { role: 'Manager', name: 'General Manager' },
  'admin@lwscientific.com': { role: 'Admin', name: 'Administrator' },
  
  // Real stakeholder test accounts
  'sarah.chen@lwscientific.com': { role: 'QA', name: 'Sarah Chen (QA Lead)' },
  'mike.rodriguez@lwscientific.com': { role: 'Engineer', name: 'Mike Rodriguez (Product Dev Lead)' },
  'jennifer.kim@lwscientific.com': { role: 'Manager', name: 'Jennifer Kim (Operations Manager)' },
};

const auditLogger = new AuditLogger();

export function getUserRole(email: string): UserRole {
  return MOCK_USERS[email]?.role || mapEmailToRole(email);
}

export function getUserPermissions(role: UserRole): Permission[] {
  return getPermissionsForRole(role);
}

export function hasPermission(user: User, permission: Permission): boolean {
  return roleHasPermission(user.role, permission);
}

export function createUser(email: string, name?: string): User {
  const role = getUserRole(email);
  const permissions = getUserPermissions(role);
  
  return {
    id: email,
    email,
    name: name || MOCK_USERS[email]?.name || email,
    role,
    permissions,
  };
}

// Audit logging for authentication events
export async function logAuthEvent(event: string, user: User, details?: any) {
  const payload = {
    timestamp: new Date().toISOString(),
    userId: user.email,
    userEmail: user.email,
    userRole: user.role,
    action: event,
    resource: 'auth',
    metadata: details,
  };

  await auditLogger.log(payload);
}