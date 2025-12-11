import { FunctionCall } from './function-calling';

export interface PendingAction {
  id: string;
  functionCall: FunctionCall;
  message: string;
  createdAt: string;
}

export interface Citation {
  title: string;
  url: string;
  snippet: string;
  source?: string;
}

export interface ConversationState {
  sessionId: string;
  userId: string;
  context: Record<string, any>;
  pendingActions: PendingAction[];
  citations: Citation[];
  messages: Array<{ id: string; role: 'user' | 'assistant'; content: string; timestamp: string; citations?: Citation[] }>;
}

const STORAGE_PREFIX = 'qms-ai-conversation-state';

function getStorageKey(sessionId: string): string {
  return `${STORAGE_PREFIX}:${sessionId}`;
}

export class ConversationManager {
  async saveState(state: ConversationState): Promise<void> {
    if (typeof window === 'undefined') return;
    const key = getStorageKey(state.sessionId);
    window.localStorage.setItem(key, JSON.stringify(state));
  }

  async loadState(sessionId: string): Promise<ConversationState | null> {
    if (typeof window === 'undefined') return null;
    const raw = window.localStorage.getItem(getStorageKey(sessionId));
    if (!raw) return null;
    try {
      return JSON.parse(raw) as ConversationState;
    } catch (err) {
      console.warn('Failed to parse conversation state', err);
      return null;
    }
  }

  async addPendingAction(sessionId: string, action: PendingAction): Promise<void> {
    const existing = (await this.loadState(sessionId)) || {
      sessionId,
      userId: action.functionCall?.arguments?.userId || 'unknown',
      context: {},
      pendingActions: [] as PendingAction[],
      citations: [] as Citation[],
      messages: [],
    };

    existing.pendingActions.push(action);
    await this.saveState(existing);
  }

  async clearState(sessionId: string): Promise<void> {
    try {
      if (typeof window !== 'undefined') {
        const key = `qms-conversation-${sessionId}`;
        window.localStorage.removeItem(key);
        console.log(`[ConversationManager] Cleared state for session: ${sessionId}`);
      }
    } catch (error) {
      console.error('[ConversationManager] Failed to clear state:', error);
      throw error;
    }
  }
}
