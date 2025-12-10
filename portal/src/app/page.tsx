'use client';

import { useSession } from 'next-auth/react';
import { BarChart3, AlertTriangle, CheckCircle, Clock, Users, FileText } from 'lucide-react';
import { DashboardAPI } from '@/lib/api';
import { useEffect, useState } from 'react';
import { DashboardStats } from '@/types';

export default function Dashboard() {
  const { data: session } = useSession();
  const [stats, setStats] = useState<DashboardStats | null>(null);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const data = await DashboardAPI.getStats();
        setStats(data);
      } catch (error) {
        console.error('Failed to load dashboard stats:', error);
      }
    };
    loadStats();
  }, []);

  if (!session) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-lg p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">Quality Management Dashboard</h1>
        <p className="text-primary-100">
          Welcome back, {session.user?.name} ({session.user?.role})
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-red-100 rounded-lg">
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Open CAPAs</p>
              <p className="text-2xl font-bold text-gray-900">{stats?.capas.open || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Clock className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Overdue Actions</p>
              <p className="text-2xl font-bold text-gray-900">{stats?.capas.overdue || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <FileText className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Pending DCRs</p>
              <p className="text-2xl font-bold text-gray-900">{stats?.dcrs.pending_approval || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total CAPAs</p>
              <p className="text-2xl font-bold text-gray-900">{stats?.capas.total || 0}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* CAPA Severity Chart */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <BarChart3 className="h-5 w-5 mr-2 text-primary-600" />
            CAPAs by Severity
          </h3>
          <div className="space-y-3">
            {stats?.capas.by_severity && Object.entries(stats.capas.by_severity).map(([severity, count]) => (
              <div key={severity} className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">{severity}</span>
                <div className="flex items-center">
                  <div className={`w-24 h-2 rounded-full mr-3 ${
                    severity === 'Critical' ? 'bg-red-200' :
                    severity === 'Major' ? 'bg-yellow-200' : 'bg-green-200'
                  }`}>
                    <div className={`h-2 rounded-full ${
                      severity === 'Critical' ? 'bg-red-500' :
                      severity === 'Major' ? 'bg-yellow-500' : 'bg-green-500'
                    }`} style={{ width: `${(count / (stats?.capas.total || 1)) * 100}%` }}></div>
                  </div>
                  <span className="text-sm font-bold text-gray-900">{count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Users className="h-5 w-5 mr-2 text-primary-600" />
            Recent Activity
          </h3>
          <div className="space-y-4">
            {stats?.recent_activity.map((activity) => (
              <div key={activity.id} className="flex items-start space-x-3">
                <div className={`p-1 rounded-full ${
                  activity.type === 'capa' ? 'bg-red-100' : 'bg-blue-100'
                }`}>
                  {activity.type === 'capa' ? (
                    <AlertTriangle className="h-4 w-4 text-red-600" />
                  ) : (
                    <FileText className="h-4 w-4 text-blue-600" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-900">{activity.action}</p>
                  <p className="text-xs text-gray-500">
                    {activity.user} • {new Date(activity.timestamp).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {session.user?.permissions?.includes('capa:create') && (
            <a
              href="/capa"
              className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <AlertTriangle className="h-8 w-8 text-red-600 mr-3" />
              <div>
                <p className="font-medium text-gray-900">Create CAPA</p>
                <p className="text-sm text-gray-600">Report quality issue</p>
              </div>
            </a>
          )}
          
          {session.user?.permissions?.includes('dcr:create') && (
            <a
              href="/dcr"
              className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <FileText className="h-8 w-8 text-blue-600 mr-3" />
              <div>
                <p className="font-medium text-gray-900">Submit DCR</p>
                <p className="text-sm text-gray-600">Request document change</p>
              </div>
            </a>
          )}
          
          <button
            onClick={() => {
              const event = new CustomEvent('openAssistant');
              window.dispatchEvent(event);
            }}
            className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Users className="h-8 w-8 text-primary-600 mr-3" />
            <div>
              <p className="font-medium text-gray-900">Ask AI Assistant</p>
              <p className="text-sm text-gray-600">Get compliance help</p>
            </div>
          </button>
        </div>
      </div>

      {/* Compliance Footer */}
      <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
        <div className="flex items-center justify-center space-x-6 text-sm text-gray-600">
          <span className="flex items-center">
            <CheckCircle className="h-4 w-4 mr-1 text-green-600" />
            ISO 13485:2016
          </span>
          <span className="flex items-center">
            <CheckCircle className="h-4 w-4 mr-1 text-green-600" />
            FDA 21 CFR Part 11
          </span>
          <span className="flex items-center">
            <CheckCircle className="h-4 w-4 mr-1 text-green-600" />
            HIPAA Ready
          </span>
        </div>
      </div>
    </div>
  );
}