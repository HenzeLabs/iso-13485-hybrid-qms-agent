"use client";

// Disable static generation for pages with session-dependent components
export const dynamic = "force-dynamic";

import { useState } from "react";
import Layout from "@/components/Layout";
import ConfirmationModal from "@/components/ConfirmationModal";
import { CAPAAPI } from "@/lib/api";
import {
  Plus,
  Search,
  AlertTriangle,
  Calendar,
  User,
  FileText,
} from "lucide-react";
import { formatDate, getStatusColor, getSeverityColor } from "@/lib/utils";

const mockCAPAs = [
  {
    capa_id: "CAPA-20251209-ABC123",
    issue_date: "2025-12-09",
    reported_by: "jane.doe@company.com",
    department: "Production",
    issue_description: "Sterilization indicator failure in Batch #ST-2025-001",
    status: "Open",
    severity: "Major",
    due_date: "2025-12-23",
    updated_at: "2025-12-09T10:30:00Z",
  },
  {
    capa_id: "CAPA-20251208-XYZ789",
    issue_date: "2025-12-08",
    reported_by: "john.smith@company.com",
    department: "Quality",
    issue_description:
      "Calibration drift detected in temperature monitoring system",
    status: "In Progress",
    severity: "Critical",
    due_date: "2025-12-15",
    updated_at: "2025-12-09T09:15:00Z",
  },
];

export default function CAPAManager() {
  const [capas] = useState(mockCAPAs);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [confirmationModal, setConfirmationModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: () => {},
  });

  const [newCapa, setNewCapa] = useState({
    reported_by: "demo.user@company.com",
    department: "",
    issue_description: "",
    severity: "Major",
    due_date: "",
  });

  const handleCreateCapa = async () => {
    if (!newCapa.department || !newCapa.issue_description) {
      alert("Please fill in all required fields");
      return;
    }

    try {
      const response = await CAPAAPI.create(
        newCapa,
        "demo.user@company.com",
        false
      );

      if (response.confirmation_required) {
        setConfirmationModal({
          isOpen: true,
          title: "Confirm CAPA Creation",
          message: response.confirmation_message || "Create this CAPA?",
          onConfirm: async () => {
            const confirmedResponse = await CAPAAPI.create(
              newCapa,
              "demo.user@company.com",
              true
            );
            if (confirmedResponse.success) {
              alert(
                `CAPA created successfully: ${confirmedResponse.result?.capa_id}`
              );
              setShowCreateModal(false);
              setNewCapa({
                reported_by: "demo.user@company.com",
                department: "",
                issue_description: "",
                severity: "Major",
                due_date: "",
              });
            } else {
              alert(`Failed to create CAPA: ${confirmedResponse.error}`);
            }
            setConfirmationModal((prev) => ({ ...prev, isOpen: false }));
          },
        });
      }
    } catch (error) {
      console.error("Error creating CAPA:", error);
      alert("Failed to create CAPA. Please try again.");
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">CAPA Manager</h1>
            <p className="text-gray-600">
              Corrective and Preventive Action Management
            </p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="btn btn-primary flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            New CAPA
          </button>
        </div>

        <div className="card">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search CAPAs..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {capas.map((capa) => (
            <div
              key={capa.capa_id}
              className="card hover:shadow-md transition-shadow cursor-pointer"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {capa.capa_id}
                    </h3>
                    <span
                      className={`status-badge ${getStatusColor(capa.status)}`}
                    >
                      {capa.status}
                    </span>
                    <span
                      className={`status-badge ${getSeverityColor(capa.severity)}`}
                    >
                      {capa.severity}
                    </span>
                  </div>

                  <p className="text-gray-700 mb-3">{capa.issue_description}</p>

                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <User className="h-4 w-4" />
                      {capa.reported_by}
                    </div>
                    <div className="flex items-center gap-1">
                      <FileText className="h-4 w-4" />
                      {capa.department}
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      Due: {formatDate(capa.due_date)}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 ml-4">
                  <AlertTriangle className="h-5 w-5 text-warning-600" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {showCreateModal && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
              <div
                className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
                onClick={() => setShowCreateModal(false)}
              />

              <div className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                <div>
                  <h3 className="text-lg font-semibold leading-6 text-gray-900 mb-4">
                    Create New CAPA
                  </h3>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Department *
                      </label>
                      <select
                        value={newCapa.department}
                        onChange={(e) =>
                          setNewCapa((prev) => ({
                            ...prev,
                            department: e.target.value,
                          }))
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      >
                        <option value="">Select Department</option>
                        <option value="Production">Production</option>
                        <option value="Quality">Quality</option>
                        <option value="Engineering">Engineering</option>
                        <option value="Regulatory">Regulatory</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Issue Description *
                      </label>
                      <textarea
                        value={newCapa.issue_description}
                        onChange={(e) =>
                          setNewCapa((prev) => ({
                            ...prev,
                            issue_description: e.target.value,
                          }))
                        }
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        placeholder="Describe the issue that requires corrective action..."
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Severity
                      </label>
                      <select
                        value={newCapa.severity}
                        onChange={(e) =>
                          setNewCapa((prev) => ({
                            ...prev,
                            severity: e.target.value,
                          }))
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      >
                        <option value="Minor">Minor</option>
                        <option value="Major">Major</option>
                        <option value="Critical">Critical</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                  <button
                    type="button"
                    className="btn btn-primary w-full sm:ml-3 sm:w-auto"
                    onClick={handleCreateCapa}
                  >
                    Create CAPA
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
          onClose={() =>
            setConfirmationModal((prev) => ({ ...prev, isOpen: false }))
          }
          onConfirm={confirmationModal.onConfirm}
          title={confirmationModal.title}
          message={confirmationModal.message}
        />
      </div>
    </Layout>
  );
}
