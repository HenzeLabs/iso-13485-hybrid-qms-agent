import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-config';

export async function POST(request: NextRequest) {
  try {
    // Verify authentication for audit logging
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const auditEvent = await request.json();
    
    // Add server-side metadata
    const enrichedEvent = {
      ...auditEvent,
      timestamp: auditEvent.timestamp || new Date().toISOString(),
      ipAddress: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown',
      userAgent: request.headers.get('user-agent') || 'unknown',
      serverTimestamp: new Date().toISOString()
    };

    // PRODUCTION: Send to BigQuery audit table
    // For now, log to server console with structured format
    console.log('[AUDIT_PERSISTENT]', JSON.stringify(enrichedEvent));

    // TODO: Implement BigQuery client integration
    // const bigQueryClient = new BigQuery({ projectId: process.env.PROJECT_ID });
    // await bigQueryClient.dataset('qms_audit').table('events').insert([enrichedEvent]);

    return NextResponse.json({ success: true, eventId: Date.now().toString() });

  } catch (error) {
    console.error('[AUDIT_API] Error processing audit log:', error);
    return NextResponse.json(
      { error: 'Failed to process audit log' },
      { status: 500 }
    );
  }
}