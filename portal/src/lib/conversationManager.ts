export interface ConversationManager {
  loadState(sessionId: string): Promise<ConversationState | null>;
  saveState(state: ConversationState): Promise<void>;
}

export interface ConversationState {
  sessionId: string;
  userId: string;
  context: Record<string, any>;
  pendingActions: PendingAction[];
  citations: Citation[];
  messages: AssistantMessage[];
}

interface PendingAction {
  id: string;
  functionCall: {
    name: string;
    arguments: Record<string, any>;
  };
  message: string;
  createdAt: string;
}

interface Citation {
  title: string;
  url: string;
  snippet: string;
}

interface AssistantMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  citations?: Citation[];
}