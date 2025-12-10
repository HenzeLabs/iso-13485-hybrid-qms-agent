import { ActionAPI } from '@/lib/api';
import { APIResponse, FunctionCall as ActionFunctionCall } from '@/types';

export interface Citation {
  title: string;
  url: string;
  snippet: string;
  source?: string;
}

export interface FunctionCall {
  name: string;
  arguments: Record<string, any>;
  requiresConfirmation?: boolean;
}

export interface AIResponse {
  message: string;
  functionCalls?: FunctionCall[];
  citations: Citation[];
  requiresConfirmation: boolean;
}

export interface CAPAProposal {
  draft: Record<string, any>;
  citations: Citation[];
}

export interface DCRProposal {
  draft: Record<string, any>;
  citations: Citation[];
}

export class FunctionCallHandler {
  constructor(private readonly actionApi = ActionAPI) {}

  async executeFunctions(
    calls: FunctionCall[],
    userId: string,
    sessionId?: string
  ): Promise<APIResponse<any>[]> {
    const payload: ActionFunctionCall[] = calls.map((call) => this.toActionCall(call, userId, sessionId));
    return this.actionApi.batchExecute(payload);
  }
  
  async proposeCAPA(data: Record<string, any>, userId?: string, sessionId?: string): Promise<CAPAProposal> {
    const call = this.toActionCall({ name: 'create_capa', arguments: data }, userId || 'anonymous', sessionId);
    const response = await this.actionApi.validateFunction(call);

    return {
      draft: response?.result?.draft ?? data,
      citations: (response as any)?.citations ?? [],
    };
  }
  
  async proposeDCR(data: Record<string, any>, userId?: string, sessionId?: string): Promise<DCRProposal> {
    const call = this.toActionCall({ name: 'create_dcr', arguments: data }, userId || 'anonymous', sessionId);
    const response = await this.actionApi.validateFunction(call);

    return {
      draft: response?.result?.draft ?? data,
      citations: (response as any)?.citations ?? [],
    };
  }

  private toActionCall(call: FunctionCall, userId: string, sessionId?: string): ActionFunctionCall {
    return {
      function_name: call.name,
      arguments: call.arguments,
      user_id: userId,
      confirmed: false,
      session_id: sessionId,
    };
  }
}
