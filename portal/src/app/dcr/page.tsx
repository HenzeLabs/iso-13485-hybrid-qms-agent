'use client';

import { useSession } from 'next-auth/react';
import { useState } from 'react';
import { FileText, Plus, Search, Filter } from 'lucide-react';
import { DCRAPI } from '@/lib/api';

export default function DCRManager() {
  const { data: session } = useSession();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({
    change_type: 'revision',
    reason: '',
    description: '',
    affected_process: '',
    priority: 'Medium'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session?.user?.email) return;

    try {
      const result = await DCRAPI.create({
        requester: session.user.email,
        department: 'Engineering',
        change_type: formData.change_type,
        reason: formData.reason,
        description: formData.description,
        affected_process: formData.affected_process,
        priority: formData.priority
      }, session.user.email, true);

      if (result.success) {
        alert(`DCR created successfully: ${result.result?.dcr_id}`);
        setShowCreateForm(false);
        setFormData({
          change_type: 'revision',
          reason: '',
          description: '',
          affected_process: '',
          priority: 'Medium'
        });
      }
    } catch (error) {
      console.error('Failed to create DCR:', error);
      alert('Failed to create DCR. Please try again.');
    }
  };

  if (!session?.user?.permissions?.includes('dcr:view')) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <FileText className="h-12 w-12 text-blue-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-600">You don&apos;t have permission to view DCR records.</p>
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
            <FileText className="h-8 w-8 text-blue-600 mr-3" />
            DCR Manager
          </h1>
          <p className="text-gray-600 mt-1">Document Change Request Management</p>
        </div>
        
        {session.user.permissions?.includes('dcr:create') && (
          <button
            onClick={() => setShowCreateForm(true)}
            className="btn btn-primary flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Submit DCR
          </button>
        )}
      </div>

      {/* Create DCR Form */}
      {showCreateForm && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Submit Document Change Request</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Change Type
                </label>
                <select
                  value={formData.change_type}
                  onChange={(e) => setFormData({ ...formData, change_type: e.target.value })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  required
                >
                  <option value="addition">Addition</option>
                  <option value="deletion">Deletion</option>
                  <option value="correction">Correction</option>
                  <option value="revision">Revision</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Priority
                </label>
                <select
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Affected Process/Document
              </label>
              <input
                type="text"
                value={formData.affected_process}
                onChange={(e) => setFormData({ ...formData, affected_process: e.target.value })}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="e.g., SOP-001 Sterilization Process"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Reason for Change
              </label>
              <textarea
                value={formData.reason}
                onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                rows={3}
                placeholder="Explain why this change is needed..."
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Detailed Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                rows={4}
                placeholder="Describe the specific changes to be made..."
                required
              />
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                className="btn btn-primary"
              >
                Submit DCR
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
              placeholder="Search DCRs..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
          <button className="btn btn-secondary flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Filters
          </button>
        </div>
      </div>

      {/* DCR List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Recent DCRs</h3>
        </div>
        
        <div className="divide-y divide-gray-200">
          {/* Sample DCR Records */}
          <div className="p-6 hover:bg-gray-50">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className="font-mono text-sm font-medium text-primary-600">DCR-20251210-DEF456</span>
                  <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full">High</span>
                  <span className="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">In Review</span>
                </div>
                <h4 className="font-medium text-gray-900 mb-1">SOP-001 Temperature Parameter Update</h4>
                <p className="text-sm text-gray-600 mb-2">
                  Update sterilization temperature parameters based on recent validation study results.
                </p>
                <div className="flex items-center gap-4 text-xs text-gray-500">
                  <span>Requested by: engineer@lwscientific.com</span>
                  <span>Type: Revision</span>
                  <span>Submitted: Dec 10, 2025</span>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="btn btn-sm btn-secondary">View</button>
                {session.user.permissions?.includes('dcr:approve') && (
                  <button className="btn btn-sm btn-success">Approve</button>
                )}
              </div>
            </div>
          </div>

          <div className="p-6 hover:bg-gray-50">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className="font-mono text-sm font-medium text-primary-600">DCR-20251209-GHI789</span>
                  <span className="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">Medium</span>
                  <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">Approved</span>
                </div>
                <h4 className="font-medium text-gray-900 mb-1">Quality Manual Section 4.2 Clarification</h4>
                <p className="text-sm text-gray-600 mb-2">
                  Add clarification to document control procedures for electronic records.
                </p>
                <div className="flex items-center gap-4 text-xs text-gray-500">
                  <span>Requested by: qa@lwscientific.com</span>
                  <span>Type: Addition</span>
                  <span>Submitted: Dec 9, 2025</span>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="btn btn-sm btn-secondary">View</button>
                <button className="btn btn-sm btn-primary">Implement</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}