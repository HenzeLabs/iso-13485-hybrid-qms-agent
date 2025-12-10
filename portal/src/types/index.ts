// User and Authentication Types
export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  permissions: Permission[];
}

export type UserRole = 'Engineer' | 'QA' | 'Production' | 'Manager' | 'Admin';

export type Permission = 
  | 'capa:create' | 'capa:update' | 'capa:approve' | 'capa:view'
  | 'dcr:create' | 'dcr:update' | 'dcr:approve' | 'dcr:view'
  | 'dashboard:view' | 'reports:view' | '*';

// CAPA Types
export interface CAPA {
  capa_id: string;
  issue_date: string;
  reported_by: string;
  department: string;
  issue_description: string;
  root_cause?: string;
  correction?: string;
  corrective_action?: string;
  preventive_action?: string;
  due_date?: string;
  status: CAPAStatus;
  severity: CAPASeverity;
  updated_at: string;
}

export type CAPAStatus = 'Open' | 'In Progress' | 'Awaiting Verification' | 'Closed';
export type CAPASeverity = 'Minor' | 'Major' | 'Critical';

export interface CAPAAction {
  action_id: string;
  capa_id: string;
  assigned_to: string;
  action_description: string;
  due_date: string;
  completed_date?: string;
  status: ActionStatus;
}

export type ActionStatus = 'Pending' | 'In Progress' | 'Completed' | 'Overdue';

// DCR Types
export interface DCR {
  dcr_id: string;
  request_date: string;
  requester: string;
  department: string;
  change_type: DCRChangeType;
  reason: string;
  description: string;
  affected_process: string;
  priority: DCRPriority;
  status: DCRStatus;
  target_completion_date?: string;
  updated_at: string;
}

export type DCRChangeType = 'addition' | 'deletion' | 'correction' | 'revision';
export type DCRPriority = 'Low' | 'Medium' | 'High';
export type DCRStatus = 'Draft' | 'In Review' | 'Approved' | 'Rejected' | 'Implemented';

// API Types
export interface APIResponse<T> {
  success: boolean;
  result?: T;
  error?: string;
  confirmation_required?: boolean;
  confirmation_message?: string;
  confirmation_id?: string;
  audit_id?: string;
}

export interface FunctionCall {
  function_name: string;
  arguments: Record<string, any>;
  user_id: string;
  confirmed: boolean;
  session_id?: string;
}

// Dashboard Types
export interface DashboardStats {
  capas: {
    total: number;
    open: number;
    overdue: number;
    by_severity: Record<CAPASeverity, number>;
  };
  dcrs: {
    total: number;
    pending_approval: number;
    in_review: number;
    by_priority: Record<DCRPriority, number>;
  };
  recent_activity: ActivityItem[];
}

export interface ActivityItem {
  id: string;
  type: 'capa' | 'dcr';
  action: string;
  user: string;
  timestamp: string;
  entity_id: string;
}