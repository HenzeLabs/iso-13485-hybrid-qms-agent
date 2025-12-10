'use client';

import { useState } from 'react';
import Layout from '@/components/Layout';
import ConfirmationModal from '@/components/ConfirmationModal';
import { DCRAPI } from '@/lib/api';
import { 
  Plus, 
  Search,
  FileText,
  Calendar,
  User,
  Building
} from 'lucide-react';
import { formatDate, getStatusColor, getPriorityColor } from '@/lib/utils';

const mockDCRs = [
  {
    dcr_id: 'DCR-20251209-XYZ123',
    request_date: '2025-12-09',
    requester: 'engineer@company.com',
    department: 'Engineering',
    change_type: 'correction',
    reason: 'Procedure clarification needed',
    description: 'Update SOP-QC-001 to clarify temperature monitoring requirements',
    affected_process: 'Quality Control',
    priority: 'Medium',
    status: 'Draft',
    updated_at: '2025-12-09T14:30:00Z'
  },
  {
    dcr_id: 'DCR-20251208-ABC789',
    request_date: '2025-12-08',
    requester: 'qa.manager@company.com',
    department: 'Quality',
    change_type: 'addition',
    reason: 'New regulatory requirement',
    description: 'Add new validation step for sterilization process',
    affected_process: 'Sterilization',
    priority: 'High',
    status: 'In Review',
    updated_at: '2025-12-09T11:15:00Z'
  }
];

export default function DCRManager() {
  const [dcrs] = useState(mockDCRs);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [confirmationModal, setConfirmationModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {}
  });

  const [newDcr, setNewDcr] = useState({
    requester: 'demo.user@company.com',
    department: '',
    change_type: 'correction',
    reason: '',
    description: '',
    affected_process: '',
    priority: 'Medium'
  });

  const handleCreateDcr = async () => {
    if (!newDcr.department || !newDcr.reason || !newDcr.description || !newDcr.affected_process) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      const response = await DCRAPI.create(newDcr, 'demo.user@company.com', false);
      
      if (response.confirmation_required) {
        setConfirmationModal({
          isOpen: true,
          title: 'Confirm DCR Creation',
          message: response.confirmation_message || 'Create this DCR?',
          onConfirm: async () => {
            const confirmedResponse = await DCRAPI.create(newDcr, 'demo.user@company.com', true);
            if (confirmedResponse.success) {
              alert(`DCR created successfully: ${confirmedResponse.result?.dcr_id}`);
              setShowCreateModal(false);
              setNewDcr({
                requester: 'demo.user@company.com',
                department: '',
                change_type: 'correction',
                reason: '',
                description: '',
                affected_process: '',
                priority: 'Medium'
              });
            } else {
              alert(`Failed to create DCR: ${confirmedResponse.error}`);
            }
            setConfirmationModal(prev => ({ ...prev, isOpen: false }));
          }
        });
      }
    } catch (error) {
      console.error('Error creating DCR:', error);
      alert('Failed to create DCR. Please try again.');
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">DCR Manager</h1>
            <p className="text-gray-600">Document Change Request Management</p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="btn btn-primary flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            New DCR
          </button>
        </div>

        <div className="card">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search DCRs..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {dcrs.map((dcr) => (
            <div key={dcr.dcr_id} className="card hover:shadow-md transition-shadow cursor-pointer">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{dcr.dcr_id}</h3>
                    <span className={`status-badge ${getStatusColor(dcr.status)}`}>
                      {dcr.status}
                    </span>
                    <span className={`status-badge ${getPriorityColor(dcr.priority)}`}>
                      {dcr.priority}
                    </span>
                    <span className="status-badge bg-blue-50 text-blue-600">
                      {dcr.change_type}
                    </span>
                  </div>
                  
                  <p className="text-gray-700 mb-1 font-medium">{dcr.reason}</p>
                  <p className="text-gray-600 mb-3">{dcr.description}</p>
                  
                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <User className="h-4 w-4" />
                      {dcr.requester}
                    </div>
                    <div className="flex items-center gap-1">
                      <Building className="h-4 w-4" />
                      {dcr.department}
                    </div>
                    <div className="flex items-center gap-1">
                      <FileText className="h-4 w-4" />
                      {dcr.affected_process}
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {formatDate(dcr.request_date)}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 ml-4">
                  <FileText className="h-5 w-5 text-primary-600" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {showCreateModal && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
              <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={() => setShowCreateModal(false)} />
              
              <div className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                <div>
                  <h3 className="text-lg font-semibold leading-6 text-gray-900 mb-4">
                    Create New DCR
                  </h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Department *
                      </label>
                      <select
                        value={newDcr.department}
                        onChange={(e) => setNewDcr(prev => ({ ...prev, department: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      >
                        <option value="">Select Department</option>
                        <option value="Engineering">Engineering</option>
                        <option value="Quality">Quality</option>
                        <option value="Production">Production</option>
                        <option value="Regulatory">Regulatory</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Change Type *
                      </label>
                      <select
                        value={newDcr.change_type}
                        onChange={(e) => setNewDcr(prev => ({ ...prev, change_type: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      >
                        <option value="addition">Addition</option>
                        <option value="deletion">Deletion</option>
                        <option value="correction">Correction</option>
                        <option value="revision">Revision</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Reason for Change *
                      </label>
                      <input
                        type="text"
                        value={newDcr.reason}
                        onChange={(e) => setNewDcr(prev => ({ ...prev, reason: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        placeholder="Brief reason for the change..."
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Description *
                      </label>
                      <textarea
                        value={newDcr.description}
                        onChange={(e) => setNewDcr(prev => ({ ...prev, description: e.target.value }))}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        placeholder="Detailed description of the change..."
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Affected Process *
                      </label>
                      <input
                        type="text"
                        value={newDcr.affected_process}
                        onChange={(e) => setNewDcr(prev => ({ ...prev, affected_process: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        placeholder="Process or area affected by the change..."
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Priority
                      </label>
                      <select
                        value={newDcr.priority}
                        onChange={(e) => setNewDcr(prev => ({ ...prev, priority: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      >
                        <option value="Low">Low</option>
                        <option value="Medium">Medium</option>
                        <option value="High">High</option>
                      </select>
                    </div>
                  </div>
                </div>
                
                <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                  <button
                    type="button"
                    className="btn btn-primary w-full sm:ml-3 sm:w-auto"
                    onClick={handleCreateDcr}
                  >
                    Create DCR
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary mt-3 w-full sm:mt-0 sm:w-auto"
                    onClick={() => setShowCreateModal(false)}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        <ConfirmationModal
          isOpen={confirmationModal.isOpen}
          onClose={() => setConfirmationModal(prev => ({ ...prev, isOpen: false }))}
          onConfirm={confirmationModal.onConfirm}
          title={confirmationModal.title}
          message={confirmationModal.message}
        />
      </div>
    </Layout>
  );
}