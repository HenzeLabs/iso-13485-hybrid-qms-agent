import { User, UserRole, Permission } from '@/types';

// Role-based permissions mapping
const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  Engineer: [
    'dcr:create', 'dcr:update', 'dcr:view',
    'capa:view', 'dashboard:view'
  ],
  QA: [
    'capa:create', 'capa:update', 'capa:approve', 'capa:view',
    'dcr:approve', 'dcr:view',
    'dashboard:view', 'reports:view'
  ],
  Production: [
    'capa:view', 'dcr:view', 'dashboard:view'
  ],
  Manager: [
    'capa:create', 'capa:update', 'capa:approve', 'capa:view',
    'dcr:create', 'dcr:update', 'dcr:approve', 'dcr:view',
    'dashboard:view', 'reports:view'
  ],
};

// Mock user database - in production, this would be from a real database
const MOCK_USERS: Record<string, { role: UserRole; name: string }> = {
  'qa.manager@lwscientific.com': { role: 'QA', name: 'QA Manager' },
  'engineer@lwscientific.com': { role: 'Engineer', name: 'Engineering Lead' },
  'production@lwscientific.com': { role: 'Production', name: 'Production Manager' },
  'manager@lwscientific.com': { role: 'Manager', name: 'General Manager' },
};

export function getUserRole(email: string): UserRole {
  return MOCK_USERS[email]?.role || 'Production'; // Default to most restrictive role
}

export function getUserPermissions(role: UserRole): Permission[] {
  return ROLE_PERMISSIONS[role] || [];
}

export function hasPermission(user: User, permission: Permission): boolean {
  return user.permissions.includes(permission);
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
export function logAuthEvent(event: string, user: User, details?: any) {
  console.log(`[AUTH] ${event}`, {
    timestamp: new Date().toISOString(),
    user_id: user.email,
    user_role: user.role,
    event,
    details,
  });
  
  // In production, this would send to audit logging system
}