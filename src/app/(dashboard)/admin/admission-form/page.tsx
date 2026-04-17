"use client";

import React, { useState, useEffect, useCallback } from "react";
import { AdmissionTable } from "@/features/admission/components/AdmissionTable";
import { AdmissionDetailsModal } from "@/features/admission/components/AdmissionDetailsModal";
import { AdmissionForm } from "@/features/admission/types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
// File server root — strips /api since static files are served from root
const FILE_BASE_URL = API_BASE_URL.replace(/\/api$/, '');


export default function AdmissionFormPage() {
  const [admissions, setAdmissions] = useState<AdmissionForm[]>([]);
  const [selectedForm, setSelectedForm] = useState<AdmissionForm | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const fetchAdmissions = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/admissions`);
      const json = await res.json();
      if (json.success && json.data) {
        // Map backend fields to the frontend AdmissionForm interface
        const mapped: AdmissionForm[] = json.data.map((item: any) => ({
          id: item.id,
          applicationNumber: `BPTPIA/${new Date(item.createdAt).getFullYear()}/${String(item.id).padStart(3, '0')}`,
          courseType: item.courseType,
          applicantName: item.applicantName,
          fatherName: item.fatherName,
          motherName: item.motherName,
          dateOfBirth: item.dob,
          aadharNumber: item.aadharNo,
          email: item.email,
          mobileNumber: item.mobile,
          gender: item.gender?.toUpperCase() as AdmissionForm['gender'],
          category: item.category,
          tenthPercentage: item.tenthPercentage,
          twelfthPercentage: item.twelfthPercentage,
          communicationAddress: item.communicationAddress,
          permanentAddress: item.permanentAddress,
          courseApplied: item.courseAppliedFor,
          branchApplied: item.branchAppliedFor,
          examCenter: `College ID: ${item.collegeId}`,
          photoUrl: item.passportPhotoUrl ? `${FILE_BASE_URL}${item.passportPhotoUrl}` : undefined,
          signatureUrl: item.signatureUrl ? `${FILE_BASE_URL}${item.signatureUrl}` : undefined,
          idDocumentType: item.identityDocType,
          idDocumentUrl: item.identityDocUrl ? `${FILE_BASE_URL}${item.identityDocUrl}` : undefined,
          paymentStatus: item.paymentStatus as AdmissionForm['paymentStatus'],
          feeAmount: 515,
          submissionDate: new Date(item.createdAt).toLocaleDateString('en-IN'),
        }));
        setAdmissions(mapped);
      }
    } catch (error) {
      console.error("Failed to fetch admissions:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAdmissions();
  }, [fetchAdmissions]);

  const handleView = (form: AdmissionForm) => {
    setSelectedForm(form);
    setIsDetailsOpen(true);
  };

  const handleEdit = (form: AdmissionForm) => {
    alert("Edit feature for full application is coming soon. Use 'View' to see current data.");
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this admission application? This action cannot be undone.")) {
      // Optimistic UI update
      setAdmissions(prev => prev.filter(a => a.id !== id));
    }
  };

  return (
    <div className="p-4 md:p-6 min-h-screen bg-slate-50/30">
        <div className="max-w-[1600px] mx-auto">
            <AdmissionTable 
                data={admissions}
                isLoading={isLoading}
                onView={handleView}
                onEdit={handleEdit}
                onDelete={handleDelete}
            />

            <AdmissionDetailsModal 
                isOpen={isDetailsOpen}
                data={selectedForm}
                onClose={() => setIsDetailsOpen(false)}
            />
        </div>
    </div>
  );
}
