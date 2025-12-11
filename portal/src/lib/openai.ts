import { ActionAPI } from "./api";
import { FunctionCall } from "@/types";

// PRODUCTION: OpenAI calls moved to server-side API routes
// Client-side OpenAI usage removed for security

export interface AssistantMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
  function_calls?: FunctionCall[];
  citations?: Citation[];
}

export interface Citation {
  title: string;
  url: string;
  snippet: string;
}

export interface ConversationState {
  messages: AssistantMessage[];
  pending_confirmations: PendingConfirmation[];
}

export interface PendingConfirmation {
  id: string;
  function_call: FunctionCall;
  message: string;
  timestamp: string;
}

export class LLMAssistant {
  private conversation: ConversationState = {
    messages: [],
    pending_confirmations: [],
  };

  async sendMessage(
    message: string,
    userId: string,
    sessionId?: string
  ): Promise<AssistantMessage> {
    // Add user message to conversation
    const userMessage: AssistantMessage = {
      id: Date.now().toString(),
      role: "user",
      content: message,
      timestamp: new Date().toISOString(),
    };
    this.conversation.messages.push(userMessage);

    try {
      // Get available functions from Action Layer
      const functionsResponse = await ActionAPI.getFunctions();
      const functions = functionsResponse.functions || [];

      // Create OpenAI completion with function calling
      // PRODUCTION: Use server-side API for OpenAI calls
      const response = await fetch("/api/ai/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message,
          sessionId,
        }),
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
      }

      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }

      const apiResponse = {
        content: data.response,
        function_call: null, // Function calling handled separately
      };

      // Use API response as completion
      const completion = { choices: [{ message: apiResponse }] };

      const assistantResponse = completion.choices[0]?.message;
      if (!assistantResponse) {
        throw new Error("No response from OpenAI");
      }

      // Handle function calls
      if (assistantResponse.function_call) {
        return await this.handleFunctionCall(
          assistantResponse,
          userId,
          sessionId
        );
      }

      // Regular text response
      const assistantMessage: AssistantMessage = {
        id: Date.now().toString(),
        role: "assistant",
        content:
          assistantResponse.content ||
          "I apologize, but I couldn't generate a response.",
        timestamp: new Date().toISOString(),
      };

      this.conversation.messages.push(assistantMessage);
      return assistantMessage;
    } catch (error) {
      console.error("LLM Assistant error:", error);
      const errorMessage: AssistantMessage = {
        id: Date.now().toString(),
        role: "assistant",
        content:
          "I encountered an error processing your request. Please try again.",
        timestamp: new Date().toISOString(),
      };
      this.conversation.messages.push(errorMessage);
      return errorMessage;
    }
  }

  private async handleFunctionCall(
    response: any,
    userId: string,
    sessionId?: string
  ): Promise<AssistantMessage> {
    const functionCall = response.function_call;
    const functionName = functionCall.name;
    const functionArgs = JSON.parse(functionCall.arguments || "{}");

    // Create function call object
    const call: FunctionCall = {
      function_name: functionName,
      arguments: functionArgs,
      user_id: userId,
      confirmed: false,
      session_id: sessionId,
    };

    // Execute function call (will require confirmation for modifying operations)
    const result = await ActionAPI.executeFunction(call);

    if (result.confirmation_required) {
      // Add pending confirmation
      const pendingConfirmation: PendingConfirmation = {
        id: Date.now().toString(),
        function_call: call,
        message: result.confirmation_message || "Confirm this action?",
        timestamp: new Date().toISOString(),
      };
      this.conversation.pending_confirmations.push(pendingConfirmation);

      const assistantMessage: AssistantMessage = {
        id: Date.now().toString(),
        role: "assistant",
        content: `I'd like to ${functionName.replace("_", " ")} for you. ${result.confirmation_message}\n\nWould you like me to proceed?`,
        timestamp: new Date().toISOString(),
        function_calls: [call],
        citations: (result as any)?.citations,
      };

      this.conversation.messages.push(assistantMessage);
      return assistantMessage;
    }

    // Function executed successfully
    const assistantMessage: AssistantMessage = {
      id: Date.now().toString(),
      role: "assistant",
      content: this.formatFunctionResult(functionName, result),
      timestamp: new Date().toISOString(),
      function_calls: [call],
      citations: (result as any)?.citations,
    };

    this.conversation.messages.push(assistantMessage);
    return assistantMessage;
  }

  async confirmPendingAction(
    confirmationId: string,
    confirmed: boolean,
    userId: string,
    sessionId?: string
  ): Promise<AssistantMessage> {
    const pending = this.conversation.pending_confirmations.find(
      (p) => p.id === confirmationId
    );
    if (!pending) {
      throw new Error("Confirmation not found");
    }

    // Remove from pending
    this.conversation.pending_confirmations =
      this.conversation.pending_confirmations.filter(
        (p) => p.id !== confirmationId
      );

    if (!confirmed) {
      const cancelMessage: AssistantMessage = {
        id: Date.now().toString(),
        role: "assistant",
        content:
          "Action cancelled. Is there anything else I can help you with?",
        timestamp: new Date().toISOString(),
      };
      this.conversation.messages.push(cancelMessage);
      return cancelMessage;
    }

    // Execute confirmed action
    const confirmedCall = {
      ...pending.function_call,
      confirmed: true,
      session_id: sessionId,
    };
    const result = await ActionAPI.executeFunction(confirmedCall);

    const assistantMessage: AssistantMessage = {
      id: Date.now().toString(),
      role: "assistant",
      content: result.success
        ? this.formatFunctionResult(pending.function_call.function_name, result)
        : `Failed to execute action: ${result.error}`,
      timestamp: new Date().toISOString(),
      function_calls: [confirmedCall],
      citations: (result as any)?.citations,
    };

    this.conversation.messages.push(assistantMessage);
    return assistantMessage;
  }

  private formatFunctionResult(functionName: string, result: any): string {
    if (!result.success) {
      return `I encountered an error: ${result.error}`;
    }

    switch (functionName) {
      case "create_capa":
        return `✅ CAPA created successfully: **${result.result.capa_id}**\n\nThe CAPA has been created and is now available in the CAPA Manager. You can add root cause analysis, assign actions, and route for approvals.`;

      case "create_dcr":
        return `✅ DCR created successfully: **${result.result.dcr_id}**\n\nThe Document Change Request has been created and is now available in the DCR Manager. You can add supporting documents and route for approvals.`;

      case "update_capa_analysis":
        return `✅ CAPA analysis updated for **${result.result.capa_id}**\n\nThe root cause analysis and corrective/preventive actions have been documented.`;

      case "get_capa_status":
      case "get_dcr_status":
        const entity = result.result;
        return `📋 **Status:** ${entity.status}\n**Last Updated:** ${new Date(entity.updated_at).toLocaleDateString()}\n\n${entity.issue_description || entity.description}`;

      default:
        return `✅ Action completed successfully. ${JSON.stringify(result.result)}`;
    }
  }

  private getSystemPrompt(): string {
    return `You are a Quality Management System (QMS) assistant for an ISO 13485 compliant medical device company. You help users manage CAPA (Corrective and Preventive Actions) and DCR (Document Change Requests) workflows.

Key capabilities:
- Create and manage CAPA cases for quality issues
- Create and manage DCR requests for document changes
- Retrieve status information for existing CAPAs and DCRs
- Provide guidance on ISO 13485 compliance requirements

Important guidelines:
- Always ask for confirmation before creating or modifying records
- Provide clear, professional responses focused on quality management
- Include relevant CAPA/DCR IDs in responses when available
- Suggest next steps in workflows (e.g., "Next, you may want to add corrective actions")
- Be concise but thorough in explanations

When users ask about creating CAPAs or DCRs, gather the required information:
- For CAPAs: department, issue description, severity
- For DCRs: department, change type, reason, description, affected process

Always maintain a professional, helpful tone focused on quality and compliance.`;
  }

  getConversation(): ConversationState {
    return this.conversation;
  }

  setConversation(conversation: ConversationState): void {
    this.conversation = conversation;
  }

  clearConversation(): void {
    this.conversation = {
      messages: [],
      pending_confirmations: [],
    };
  }
}
