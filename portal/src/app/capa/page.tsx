'use client';

import { useSession } from 'next-auth/react';
import { useState } from 'react';
import { AlertTriangle, Plus, Search, Filter } from 'lucide-react';
import { CAPAAPI } from '@/lib/api';

export default function CAPAManager() {
  const { data: session } = useSession();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({
    issue_description: '',
    department: '',
    severity: 'Major',
    due_date: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session?.user?.email) return;

    try {
      const result = await CAPAAPI.create({
        reported_by: session.user.email,
        department: formData.department,
        issue_description: formData.issue_description,
        severity: formData.severity,
        due_date: formData.due_date || undefined
      }, session.user.email, true);

      if (result.success) {
        alert(`CAPA created successfully: ${result.result?.capa_id}`);
        setShowCreateForm(false);
        setFormData({ issue_description: '', department: '', severity: 'Major', due_date: '' });
      }
    } catch (error) {
      console.error('Failed to create CAPA:', error);
      alert('Failed to create CAPA. Please try again.');
    }
  };

  if (!session?.user?.permissions?.includes('capa:view')) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-600">You don&apos;t have permission to view CAPA records.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center">
            <AlertTriangle className="h-8 w-8 text-red-600 mr-3" />
            CAPA Manager
          </h1>
          <p className="text-gray-600 mt-1">Corrective and Preventive Action Management</p>
        </div>
        
        {session.user.permissions?.includes('capa:create') && (
          <button
            onClick={() => setShowCreateForm(true)}
            className="btn btn-primary flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Create CAPA
          </button>
        )}
      </div>

      {/* Create CAPA Form */}
      {showCreateForm && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Create New CAPA</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Department
                </label>
                <select
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  required
                >
                  <option value="">Select Department</option>
                  <option value="Quality Assurance">Quality Assurance</option>
                  <option value="Production">Production</option>
                  <option value="Engineering">Engineering</option>
                  <option value="Regulatory">Regulatory</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Severity
                </label>
                <select
                  value={formData.severity}
                  onChange={(e) => setFormData({ ...formData, severity: e.target.value })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="Minor">Minor</option>
                  <option value="Major">Major</option>
                  <option value="Critical">Critical</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Issue Description
              </label>
              <textarea
                value={formData.issue_description}
                onChange={(e) => setFormData({ ...formData, issue_description: e.target.value })}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                rows={4}
                placeholder="Describe the quality issue requiring corrective action..."
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Due Date (Optional)
              </label>
              <input
                type="date"
                value={formData.due_date}
                onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                className="btn btn-primary"
              >
                Create CAPA
              </button>
              <button
                type="button"
                onClick={() => setShowCreateForm(false)}
                className="btn btn-secondary"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex items-center gap-4">
          <div className="flex-1 relative">
            <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search CAPAs..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
          <button className="btn btn-secondary flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Filters
          </button>
        </div>
      </div>

      {/* CAPA List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Recent CAPAs</h3>
        </div>
        
        <div className="divide-y divide-gray-200">
          {/* Sample CAPA Records */}
          <div className="p-6 hover:bg-gray-50">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className="font-mono text-sm font-medium text-primary-600">CAPA-20251210-ABC123</span>
                  <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full">Critical</span>
                  <span className="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">Open</span>
                </div>
                <h4 className="font-medium text-gray-900 mb-1">Sterilization indicator failure</h4>
                <p className="text-sm text-gray-600 mb-2">
                  Multiple lots showing inconsistent sterilization indicator results during routine testing.
                </p>
                <div className="flex items-center gap-4 text-xs text-gray-500">
                  <span>Reported by: qa@lwscientific.com</span>
                  <span>Department: Quality Assurance</span>
                  <span>Due: Dec 17, 2025</span>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="btn btn-sm btn-secondary">View</button>
                {session.user.permissions?.includes('capa:update') && (
                  <button className="btn btn-sm btn-primary">Edit</button>
                )}
              </div>
            </div>
          </div>

          <div className="p-6 hover:bg-gray-50">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className="font-mono text-sm font-medium text-primary-600">CAPA-20251209-XYZ789</span>
                  <span className="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">Major</span>
                  <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">In Progress</span>
                </div>
                <h4 className="font-medium text-gray-900 mb-1">Packaging seal integrity</h4>
                <p className="text-sm text-gray-600 mb-2">
                  Customer complaint regarding compromised package seals on Product X.
                </p>
                <div className="flex items-center gap-4 text-xs text-gray-500">
                  <span>Reported by: production@lwscientific.com</span>
                  <span>Department: Production</span>
                  <span>Due: Dec 20, 2025</span>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="btn btn-sm btn-secondary">View</button>
                {session.user.permissions?.includes('capa:update') && (
                  <button className="btn btn-sm btn-primary">Edit</button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}