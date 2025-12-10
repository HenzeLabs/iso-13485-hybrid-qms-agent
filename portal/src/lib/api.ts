import axios from 'axios';
import { APIResponse, FunctionCall, CAPA, DCR, DashboardStats } from '@/types';

const API_BASE_URL = process.env.QMS_API_URL || 'https://qms-agent-728802725258.us-central1.run.app';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
// Note: NextAuth JWT session is handled via NextAuth middleware.
// Individual API requests include user context via function parameters.
// Token injection can be added here if API-level auth is needed in Phase 5.
api.interceptors.request.use((config) => {
  return config;
});

// Action Layer API Client
export class ActionAPI {
  // Execute function with confirmation flow
  static async executeFunction(functionCall: FunctionCall): Promise<APIResponse<any>> {
    const response = await api.post('/action/execute', functionCall);
    return response.data;
  }

  // Get available functions
  static async getFunctions() {
    const response = await api.get('/action/functions');
    return response.data;
  }

  // Validate function call
  static async validateFunction(functionCall: Omit<FunctionCall, 'confirmed'>) {
    const response = await api.post('/action/validate', functionCall);
    return response.data;
  }

  // Batch execute functions
  static async batchExecute(functionCalls: FunctionCall[]): Promise<APIResponse<any>[]> {
    const response = await api.post('/action/batch', functionCalls);
    return response.data;
  }
}

// CAPA API Client
export class CAPAAPI {
  static async create(data: {
    reported_by: string;
    department: string;
    issue_description: string;
    severity?: string;
    due_date?: string;
  }, userId: string, confirmed = false): Promise<APIResponse<{ capa_id: string }>> {
    return ActionAPI.executeFunction({
      function_name: 'create_capa',
      arguments: data,
      user_id: userId,
      confirmed,
    });
  }

  static async updateAnalysis(data: {
    capa_id: string;
    root_cause?: string;
    correction?: string;
    corrective_action?: string;
    preventive_action?: string;
  }, userId: string, confirmed = false): Promise<APIResponse<any>> {
    return ActionAPI.executeFunction({
      function_name: 'update_capa_analysis',
      arguments: data,
      user_id: userId,
      confirmed,
    });
  }

  static async addAction(data: {
    capa_id: string;
    assigned_to: string;
    action_description: string;
    due_date: string;
    status?: string;
  }, userId: string, confirmed = false): Promise<APIResponse<{ action_id: string }>> {
    return ActionAPI.executeFunction({
      function_name: 'add_capa_action',
      arguments: data,
      user_id: userId,
      confirmed,
    });
  }

  static async addApproval(data: {
    capa_id: string;
    approver: string;
    role: string;
    approval_status?: string;
    comments?: string;
  }, userId: string, confirmed = false): Promise<APIResponse<{ approval_id: string }>> {
    return ActionAPI.executeFunction({
      function_name: 'add_capa_approval',
      arguments: data,
      user_id: userId,
      confirmed,
    });
  }

  static async updateStatus(data: {
    capa_id: string;
    new_status: string;
  }, userId: string, confirmed = false): Promise<APIResponse<any>> {
    return ActionAPI.executeFunction({
      function_name: 'update_capa_status',
      arguments: data,
      user_id: userId,
      confirmed,
    });
  }

  static async getDetails(capaId: string, userId: string): Promise<APIResponse<any>> {
    return ActionAPI.executeFunction({
      function_name: 'get_capa_status',
      arguments: { capa_id: capaId },
      user_id: userId,
      confirmed: false, // Read operation doesn't need confirmation
    });
  }

  static async getById(id: string): Promise<CAPA> {
    const response = await api.get(`/capa/${id}`);
    return response.data;
  }
}

// DCR API Client
export class DCRAPI {
  static async create(data: {
    requester: string;
    department: string;
    change_type: string;
    reason: string;
    description: string;
    affected_process: string;
    priority?: string;
  }, userId: string, confirmed = false): Promise<APIResponse<{ dcr_id: string }>> {
    return ActionAPI.executeFunction({
      function_name: 'create_dcr',
      arguments: data,
      user_id: userId,
      confirmed,
    });
  }

  static async addDocuments(data: {
    dcr_id: string;
    documents: Array<{
      document_id: string;
      document_title: string;
      current_revision: string;
      proposed_revision: string;
      notes?: string;
    }>;
  }, userId: string, confirmed = false): Promise<APIResponse<any>> {
    return ActionAPI.executeFunction({
      function_name: 'add_dcr_documents',
      arguments: data,
      user_id: userId,
      confirmed,
    });
  }

  static async addApproval(data: {
    dcr_id: string;
    approver: string;
    role: string;
    approval_status?: string;
    comments?: string;
  }, userId: string, confirmed = false): Promise<APIResponse<{ approval_id: string }>> {
    return ActionAPI.executeFunction({
      function_name: 'add_dcr_approval',
      arguments: data,
      user_id: userId,
      confirmed,
    });
  }

  static async updateStatus(data: {
    dcr_id: string;
    new_status: string;
    comments?: string;
  }, userId: string, confirmed = false): Promise<APIResponse<any>> {
    return ActionAPI.executeFunction({
      function_name: 'update_dcr_status',
      arguments: data,
      user_id: userId,
      confirmed,
    });
  }

  static async getDetails(dcrId: string, userId: string): Promise<APIResponse<any>> {
    return ActionAPI.executeFunction({
      function_name: 'get_dcr_status',
      arguments: { dcr_id: dcrId },
      user_id: userId,
      confirmed: false, // Read operation doesn't need confirmation
    });
  }

  static async getById(id: string): Promise<DCR> {
    const response = await api.get(`/dcr/${id}`);
    return response.data;
  }
}

// Dashboard API Client
export class DashboardAPI {
  static async getStats(): Promise<DashboardStats> {
    // Mock data for now - will be replaced with real API calls
    return {
      capas: {
        total: 45,
        open: 12,
        overdue: 3,
        by_severity: { Minor: 15, Major: 25, Critical: 5 },
      },
      dcrs: {
        total: 28,
        pending_approval: 8,
        in_review: 5,
        by_priority: { Low: 10, Medium: 15, High: 3 },
      },
      recent_activity: [
        {
          id: '1',
          type: 'capa',
          action: 'Created CAPA for sterilization issue',
          user: 'jane.doe@company.com',
          timestamp: new Date().toISOString(),
          entity_id: 'CAPA-20251209-ABC123',
        },
        {
          id: '2',
          type: 'dcr',
          action: 'Approved DCR for SOP-001 update',
          user: 'john.smith@company.com',
          timestamp: new Date(Date.now() - 3600000).toISOString(),
          entity_id: 'DCR-20251209-XYZ789',
        },
      ],
    };
  }
}

export { api };