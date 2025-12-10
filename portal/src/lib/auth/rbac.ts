import { Permission, User, UserRole } from '@/types';

export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  Engineer: ['dcr:create', 'dcr:update', 'dcr:view', 'capa:view', 'dashboard:view'],
  QA: ['capa:create', 'capa:update', 'capa:approve', 'capa:view', 'dcr:approve', 'dcr:view', 'dashboard:view', 'reports:view'],
  Production: ['capa:view', 'dcr:view', 'dashboard:view'],
  Manager: ['capa:create', 'capa:update', 'capa:approve', 'capa:view', 'dcr:create', 'dcr:update', 'dcr:approve', 'dcr:view', 'dashboard:view', 'reports:view'],
  Admin: ['*'],
};

// Simple, auditable mapping to keep role assignment deterministic.
export function mapEmailToRole(email: string): UserRole {
  const normalized = email.toLowerCase();
  if (normalized.includes('admin')) return 'Admin';
  if (normalized.includes('qa')) return 'QA';
  if (normalized.includes('engineer')) return 'Engineer';
  if (normalized.includes('manager')) return 'Manager';
  return 'Production';
}

export function getPermissionsForRole(role: UserRole): Permission[] {
  return ROLE_PERMISSIONS[role] || [];
}

export function hasPermission(role: UserRole, action: Permission): boolean {
  const permissions = getPermissionsForRole(role);
  return permissions.includes(action) || permissions.includes('*');
}

export function buildUser(email: string, name?: string): User {
  const role = mapEmailToRole(email);
  const permissions = getPermissionsForRole(role);

  return {
    id: email,
    email,
    name: name || email,
    role,
    permissions,
  };
}
