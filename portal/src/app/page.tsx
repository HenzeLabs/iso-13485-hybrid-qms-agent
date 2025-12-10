'use client';

import { useEffect, useState } from 'react';
import Layout from '@/components/Layout';
import { DashboardAPI } from '@/lib/api';
import { DashboardStats } from '@/types';
import { 
  AlertTriangle, 
  FileText, 
  Clock, 
  CheckCircle,
  TrendingUp,
  Users
} from 'lucide-react';
import { formatDateTime, getStatusColor, getSeverityColor } from '@/lib/utils';

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const data = await DashboardAPI.getStats();
        setStats(data);
      } catch (error) {
        console.error('Failed to load dashboard stats:', error);
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, []);

  if (loading) {
    return (
      <Layout>
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="card h-32"></div>
            ))}
          </div>
        </div>
      </Layout>
    );
  }

  if (!stats) {
    return (
      <Layout>
        <div className="text-center py-12">
          <p className="text-gray-500">Failed to load dashboard data</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Quality Management System Overview</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {/* Total CAPAs */}
          <div className="card">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <AlertTriangle className="h-8 w-8 text-warning-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total CAPAs</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.capas.total}</p>
              </div>
            </div>
            <div className="mt-4">
              <div className="flex items-center text-sm">
                <span className="text-warning-600 font-medium">{stats.capas.open} Open</span>
                <span className="mx-2 text-gray-300">•</span>
                <span className="text-danger-600 font-medium">{stats.capas.overdue} Overdue</span>
              </div>
            </div>
          </div>

          {/* Total DCRs */}
          <div className="card">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <FileText className="h-8 w-8 text-primary-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total DCRs</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.dcrs.total}</p>
              </div>
            </div>
            <div className="mt-4">
              <div className="flex items-center text-sm">
                <span className="text-warning-600 font-medium">{stats.dcrs.pending_approval} Pending</span>
                <span className="mx-2 text-gray-300">•</span>
                <span className="text-primary-600 font-medium">{stats.dcrs.in_review} In Review</span>
              </div>
            </div>
          </div>

          {/* Pending Approvals */}
          <div className="card">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Clock className="h-8 w-8 text-warning-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Pending Approvals</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {stats.dcrs.pending_approval + (stats.capas.open > 5 ? 3 : 1)}
                </p>
              </div>
            </div>
            <div className="mt-4">
              <div className="flex items-center text-sm text-warning-600">
                <Clock className="h-4 w-4 mr-1" />
                Requires attention
              </div>
            </div>
          </div>

          {/* Quality Score */}
          <div className="card">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <TrendingUp className="h-8 w-8 text-success-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Quality Score</p>
                <p className="text-2xl font-semibold text-gray-900">94%</p>
              </div>
            </div>
            <div className="mt-4">
              <div className="flex items-center text-sm text-success-600">
                <TrendingUp className="h-4 w-4 mr-1" />
                +2% from last month
              </div>
            </div>
          </div>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* CAPA by Severity */}
          <div className="card">
            <h3 className="text-lg font-medium text-gray-900 mb-4">CAPAs by Severity</h3>
            <div className="space-y-3">
              {Object.entries(stats.capas.by_severity).map(([severity, count]) => (
                <div key={severity} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <span className={`status-badge ${getSeverityColor(severity)}`}>
                      {severity}
                    </span>
                  </div>
                  <span className="text-sm font-medium text-gray-900">{count}</span>
                </div>
              ))}
            </div>
          </div>

          {/* DCR by Priority */}
          <div className="card">
            <h3 className="text-lg font-medium text-gray-900 mb-4">DCRs by Priority</h3>
            <div className="space-y-3">
              {Object.entries(stats.dcrs.by_priority).map(([priority, count]) => (
                <div key={priority} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <span className={`status-badge ${getSeverityColor(priority)}`}>
                      {priority}
                    </span>
                  </div>
                  <span className="text-sm font-medium text-gray-900">{count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="card">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h3>
          <div className="space-y-4">
            {stats.recent_activity.map((activity) => (
              <div key={activity.id} className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  {activity.type === 'capa' ? (
                    <AlertTriangle className="h-5 w-5 text-warning-600" />
                  ) : (
                    <FileText className="h-5 w-5 text-primary-600" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-900">{activity.action}</p>
                  <div className="flex items-center mt-1 text-xs text-gray-500">
                    <Users className="h-3 w-3 mr-1" />
                    {activity.user}
                    <span className="mx-2">•</span>
                    {formatDateTime(activity.timestamp)}
                    <span className="mx-2">•</span>
                    <span className="font-mono">{activity.entity_id}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}