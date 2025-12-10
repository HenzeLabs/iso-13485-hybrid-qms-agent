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
    // In production, send to centralized audit store (e.g., BigQuery or SIEM)
    console.log('[AUDIT]', {
      ...event,
      timestamp: event.timestamp || new Date().toISOString(),
    });
  }
}
