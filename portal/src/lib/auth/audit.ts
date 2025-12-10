export interface AuditEvent {
  timestamp: string;
  userId: string;
  userEmail: string;
  userRole?: string;
  action: string;
  resource: string;
  resourceId?: string;
  ipAddress?: string;
  userAgent?: string;
  metadata?: Record<string, any>;
}

export class AuditLogger {
  async log(event: AuditEvent): Promise<void> {
    const auditRecord = {
      ...event,
      timestamp: event.timestamp || new Date().toISOString(),
    };

    // PRODUCTION: Persistent audit logging for FDA 21 CFR Part 11 compliance
    try {
      // Send to BigQuery audit table
      const response = await fetch('/api/audit/log', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(auditRecord)
      });

      if (!response.ok) {
        console.error('[AUDIT] Failed to log to persistent storage:', response.status);
        // Fallback to console for debugging
        console.log('[AUDIT_FALLBACK]', auditRecord);
      }
    } catch (error) {
      console.error('[AUDIT] Error logging to persistent storage:', error);
      // Fallback to console for debugging
      console.log('[AUDIT_FALLBACK]', auditRecord);
    }

    // Always log to console for immediate visibility
    console.log('[AUDIT]', auditRecord);
  }
}
