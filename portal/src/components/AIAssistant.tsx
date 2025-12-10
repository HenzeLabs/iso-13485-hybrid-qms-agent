'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { Send, Bot, User, CheckCircle, XCircle, Loader2, FileText } from 'lucide-react';
import { LLMAssistant, AssistantMessage, PendingConfirmation, Citation } from '@/lib/openai';
import { formatDateTime } from '@/lib/utils';
import { ConversationManager, ConversationState } from '@/ai/conversation-state';

interface AIAssistantProps {
  userId: string;
}

export default function AIAssistant({ userId }: AIAssistantProps) {
  const [assistant] = useState(() => new LLMAssistant());
  const conversationManager = useMemo(() => new ConversationManager(), []);
  const [messages, setMessages] = useState<AssistantMessage[]>([]);
  const [pendingConfirmations, setPendingConfirmations] = useState<PendingConfirmation[]>([]);
  const [citations, setCitations] = useState<Citation[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string>('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const existingSession = typeof window !== 'undefined' ? window.localStorage.getItem('qms-ai-session-id') : null;
    const currentSession = existingSession || (typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `session-${Date.now()}`);
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('qms-ai-session-id', currentSession);
    }
    setSessionId(currentSession);
  }, []);

  useEffect(() => {
    const hydrate = async () => {
      if (!sessionId) return;
      try {
        const saved = await conversationManager.loadState(sessionId);
        if (saved) {
          assistant.setConversation({
            messages: saved.messages,
            pending_confirmations: saved.pendingActions.map((p) => ({
              id: p.id,
              function_call: {
                function_name: p.functionCall.name,
                arguments: p.functionCall.arguments,
                user_id: saved.userId,
                confirmed: false,
                session_id: saved.sessionId,
              },
              message: p.message,
              timestamp: p.createdAt,
            })),
          });
          setMessages(saved.messages);
          setPendingConfirmations(saved.pendingActions.map((p) => ({
            id: p.id,
            function_call: {
              function_name: p.functionCall.name,
              arguments: p.functionCall.arguments,
              user_id: saved.userId,
              confirmed: false,
              session_id: saved.sessionId,
            },
            message: p.message,
            timestamp: p.createdAt,
          })));
          setCitations(saved.citations || []);
        }
      } catch (error) {
        console.error('Failed to load conversation state:', error);
        // Fallback to default state
        setMessages([]);
        setPendingConfirmations([]);
        setCitations([]);
      }
    };
    void hydrate();
  }, [assistant, conversationManager, sessionId]);

  const persistConversation = async () => {
    if (!sessionId) return;
    const conversation = assistant.getConversation();
    const pendingActions = conversation.pending_confirmations.map((p) => ({
      id: p.id,
      functionCall: {
        name: p.function_call.function_name,
        arguments: p.function_call.arguments,
      },
      message: p.message,
      createdAt: p.timestamp,
    }));

    const aggregatedCitations = [
      ...citations,
      ...conversation.messages.flatMap((m) => m.citations || []),
    ];

    const state: ConversationState = {
      sessionId,
      userId,
      context: { lastInteraction: new Date().toISOString() },
      pendingActions,
      citations: aggregatedCitations,
      messages: conversation.messages,
    };

    await conversationManager.saveState(state);
    setCitations(aggregatedCitations);
  };

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userInput = input.trim();
    setInput('');
    setIsLoading(true);

    try {
      await assistant.sendMessage(userInput, userId, sessionId);
      const conversation = assistant.getConversation();
      setMessages([...conversation.messages]);
      setPendingConfirmations([...conversation.pending_confirmations]);
      const latestCitations = conversation.messages.flatMap((m) => m.citations || []);
      if (latestCitations.length) {
        setCitations((prev) => [...prev, ...latestCitations]);
      }
      await persistConversation();
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirmation = async (confirmationId: string, confirmed: boolean) => {
    setIsLoading(true);
    try {
      await assistant.confirmPendingAction(confirmationId, confirmed, userId, sessionId);
      const conversation = assistant.getConversation();
      setMessages([...conversation.messages]);
      setPendingConfirmations([...conversation.pending_confirmations]);
      const latestCitations = conversation.messages.flatMap((m) => m.citations || []);
      if (latestCitations.length) {
        setCitations((prev) => [...prev, ...latestCitations]);
      }
      await persistConversation();
    } catch (error) {
      console.error('Error handling confirmation:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex h-full flex-col">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="text-center text-gray-500 py-8">
            <Bot className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <p className="text-lg font-medium">QMS Assistant</p>
            <p className="text-sm">Ask me about CAPAs, DCRs, or quality management processes.</p>
          </div>
        )}

        {messages.map((message) => (
          <div key={message.id} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`flex max-w-[80%] ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
              <div className={`flex-shrink-0 ${message.role === 'user' ? 'ml-2' : 'mr-2'}`}>
                {message.role === 'user' ? (
                  <User className="h-6 w-6 text-gray-600" />
                ) : (
                  <Bot className="h-6 w-6 text-primary-600" />
                )}
              </div>
              <div className={`rounded-lg px-3 py-2 ${
                message.role === 'user' 
                  ? 'bg-primary-600 text-white' 
                  : 'bg-gray-100 text-gray-900'
              }`}>
                <div className="whitespace-pre-wrap text-sm">{message.content}</div>
                <div className={`text-xs mt-1 ${
                  message.role === 'user' ? 'text-primary-100' : 'text-gray-500'
                }`}>
                  {formatDateTime(message.timestamp)}
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Pending Confirmations */}
        {pendingConfirmations.map((confirmation) => (
          <div key={confirmation.id} className="bg-warning-50 border border-warning-200 rounded-lg p-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h4 className="text-sm font-medium text-warning-800 mb-2">
                  Confirmation Required
                </h4>
                <p className="text-sm text-warning-700 mb-3">
                  {confirmation.message}
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleConfirmation(confirmation.id, true)}
                    disabled={isLoading}
                    className="btn btn-success btn-sm flex items-center gap-1"
                  >
                    <CheckCircle className="h-3 w-3" />
                    Confirm
                  </button>
                  <button
                    onClick={() => handleConfirmation(confirmation.id, false)}
                    disabled={isLoading}
                    className="btn btn-secondary btn-sm flex items-center gap-1"
                  >
                    <XCircle className="h-3 w-3" />
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="flex items-center space-x-2 bg-gray-100 rounded-lg px-3 py-2">
              <Loader2 className="h-4 w-4 animate-spin text-primary-600" />
              <span className="text-sm text-gray-600">Assistant is thinking...</span>
            </div>
          </div>
        )}

        {/* Citations */}
        {citations.length > 0 && (
          <div className="bg-white border border-gray-200 rounded-lg p-3 space-y-2 shadow-sm">
            <div className="flex items-center gap-2 text-sm font-semibold text-gray-700">
              <FileText className="h-4 w-4" />
              Supporting documents
            </div>
            <div className="space-y-2">
              {citations.map((citation, idx) => (
                <div key={`${citation.url}-${idx}`} className="text-sm text-gray-700">
                  <a href={citation.url} target="_blank" rel="noreferrer" className="font-medium text-primary-700 hover:text-primary-900">
                    {citation.title}
                  </a>
                  <div className="text-xs text-gray-500">{citation.snippet}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="border-t border-gray-200 p-4">
        <div className="flex space-x-2">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask about CAPAs, DCRs, or quality processes..."
            className="flex-1 resize-none border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            rows={2}
            disabled={isLoading}
          />
          <button
            onClick={handleSendMessage}
            disabled={!input.trim() || isLoading}
            className="btn btn-primary px-3 py-2 disabled:opacity-50"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          Press Enter to send, Shift+Enter for new line
        </p>
      </div>
    </div>
  );
}