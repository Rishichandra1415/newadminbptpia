"use client";

import React, { useState } from "react";
import { EnquiriesTable } from "@/features/enquiries/components/EnquiriesTable";
import { useEnquiries } from "@/features/enquiries/hooks/useEnquiries";
import { Toast } from "@/shared/components/ui/toast";

export default function AdmissionEnquiryPage() {
  const { 
    enquiries, 
    states,
    districts,
    isLoading, 
    error, 
    refresh, 
    saveEnquiry, 
    deleteEnquiry, 
    toggleResolution,
    fetchDistricts 
  } = useEnquiries();

  const [toast, setToast] = useState<{ message: string; type: "success" | "error" | "info" } | null>(null);

  const handleSave = async (id: number | null, data: any) => {
    const success = await saveEnquiry(id, data);
    if (success) {
      setToast({ message: `Enquiry ${id ? 'updated' : 'recorded'} successfully!`, type: "success" });
      return true;
    } else {
      setToast({ message: "Failed to save enquiry. Please check required fields.", type: "error" });
      return false;
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this enquiry record?")) {
      const success = await deleteEnquiry(id);
      if (success) {
        setToast({ message: "Enquiry deleted successfully!", type: "success" });
      } else {
        setToast({ message: "Failed to delete enquiry.", type: "error" });
      }
    }
  };

  const handleToggle = async (id: number) => {
    const success = await toggleResolution(id);
    if (success) {
      setToast({ message: "Resolution status updated!", type: "success" });
      return true;
    } else {
      setToast({ message: "Failed to update status. Please try again.", type: "error" });
      return false;
    }
  };

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="p-4 bg-red-50 text-red-600 rounded-xl border border-red-100 font-medium">
          Error: {error}
        </div>
        <button 
          onClick={refresh}
          className="px-6 py-2 bg-[#00b4d8] text-white rounded-lg hover:opacity-90 transition-all font-semibold"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="h-full">
      {isLoading ? (
        <div className="w-full h-[60vh] flex flex-col items-center justify-center gap-4 text-center">
          <div className="h-12 w-12 border-4 border-[#00b4d8] border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-400 font-medium animate-pulse">Synchronizing Admission Enquiries...</p>
        </div>
      ) : (
        <EnquiriesTable 
          data={enquiries}
          states={states}
          districts={districts}
          onDelete={handleDelete}
          onRefresh={refresh}
          onStatusUpdate={handleToggle}
          onSave={handleSave}
          onFetchDistricts={fetchDistricts}
        />
      )}

      {/* Toast Notification */}
      {toast && (
        <Toast 
          message={toast.message} 
          type={toast.type} 
          onClose={() => setToast(null)} 
        />
      )}
    </div>
  );
}
