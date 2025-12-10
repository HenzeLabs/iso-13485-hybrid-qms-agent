import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(new Date(date));
}

export function formatDateTime(date: string | Date): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date));
}

export function getStatusColor(status: string): string {
  const statusMap: Record<string, string> = {
    'Open': 'status-open',
    'In Progress': 'status-in-progress',
    'Awaiting Verification': 'status-in-progress',
    'Completed': 'status-completed',
    'Closed': 'status-closed',
    'Draft': 'status-open',
    'In Review': 'status-in-progress',
    'Approved': 'status-completed',
    'Rejected': 'status-closed',
    'Implemented': 'status-completed',
    'Pending': 'status-open',
    'Overdue': 'bg-danger-50 text-danger-600',
  };
  
  return statusMap[status] || 'status-open';
}

export function getSeverityColor(severity: string): string {
  const severityMap: Record<string, string> = {
    'Minor': 'bg-blue-50 text-blue-600',
    'Major': 'bg-warning-50 text-warning-600',
    'Critical': 'bg-danger-50 text-danger-600',
  };
  
  return severityMap[severity] || 'bg-gray-50 text-gray-600';
}

export function getPriorityColor(priority: string): string {
  const priorityMap: Record<string, string> = {
    'Low': 'bg-gray-50 text-gray-600',
    'Medium': 'bg-warning-50 text-warning-600',
    'High': 'bg-danger-50 text-danger-600',
  };
  
  return priorityMap[priority] || 'bg-gray-50 text-gray-600';
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
}