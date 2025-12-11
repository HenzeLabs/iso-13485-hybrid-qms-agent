import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-config';
import OpenAI from 'openai';

// PRODUCTION: Server-side OpenAI integration only
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

if (!process.env.OPENAI_API_KEY) {
  throw new Error('FATAL: OPENAI_API_KEY environment variable not configured');
}

export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { message, sessionId } = await request.json();
    
    if (!message) {
      return NextResponse.json({ error: 'Message required' }, { status: 400 });
    }

    // Log request for audit trail
    console.log('[AUDIT] AI_CHAT_REQUEST', {
      timestamp: new Date().toISOString(),
      userId: session.user.email,
      userRole: session.user.role,
      sessionId,
      messageLength: message.length
    });

    // Call OpenAI with system prompt
    const completion = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [
        {
          role: 'system',
          content: `You are a Quality Management System (QMS) assistant for an ISO 13485 compliant medical device company. You help users manage CAPA (Corrective and Preventive Actions) and DCR (Document Change Requests) workflows.

Key capabilities:
- Create and manage CAPA cases for quality issues
- Create and manage DCR requests for document changes
- Retrieve status information for existing CAPAs and DCRs
- Provide guidance on ISO 13485 compliance requirements

Important guidelines:
- Always ask for confirmation before creating or modifying records
- Provide clear, professional responses focused on quality management
- Include relevant CAPA/DCR IDs in responses when available
- Suggest next steps in workflows
- Be concise but thorough in explanations

Always maintain a professional, helpful tone focused on quality and compliance.`
        },
        {
          role: 'user',
          content: message
        }
      ],
      temperature: 0.1,
      max_tokens: 1000
    });

    const response = completion.choices[0]?.message?.content || 'I apologize, but I couldn\'t generate a response.';

    // Log response for audit trail
    console.log('[AUDIT] AI_CHAT_RESPONSE', {
      timestamp: new Date().toISOString(),
      userId: session.user.email,
      sessionId,
      responseLength: response.length,
      tokensUsed: completion.usage?.total_tokens || 0
    });

    return NextResponse.json({
      response,
      sessionId,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('[API] OpenAI chat error:', error);

    // Log error for audit trail
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.log('[AUDIT] AI_CHAT_ERROR', {
      timestamp: new Date().toISOString(),
      error: errorMessage,
      sessionId: request.headers.get('x-session-id')
    });

    return NextResponse.json(
      { error: 'Failed to process chat request' },
      { status: 500 }
    );
  }
}