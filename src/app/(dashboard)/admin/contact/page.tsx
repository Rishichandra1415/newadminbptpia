"use client";

import React, { useState, useMemo } from "react";
import { LeadTable } from "@/features/leads/components/LeadTable";
import { useLeads } from "@/features/leads/hooks/useLeads";
import { Toast } from "@/shared/components/ui/toast";

export default function ContactLeadsPage() {
  const { 
    leads, 
    isLoading, 
    error, 
    refresh, 
    deleteLead,
    updateLeadStatus 
  } = useLeads();

  const [searchTerm, setSearchTerm] = useState("");
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" | "info" } | null>(null);

  // Memoized filtered leads based on search term
  const filteredLeads = useMemo(() => {
    if (!searchTerm) return leads;
    
    const term = searchTerm.toLowerCase();
    return leads.filter(lead => 
      lead.fullName.toLowerCase().includes(term) ||
      lead.email.toLowerCase().includes(term) ||
      lead.phone.toLowerCase().includes(term) ||
      lead.message.toLowerCase().includes(term) ||
      lead.sourcePage.toLowerCase().includes(term) ||
      lead.status.toLowerCase().includes(term)
    );
  }, [leads, searchTerm]);

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this lead?")) {
      const success = await deleteLead(id);
      if (success) {
        setToast({ message: "Lead deleted successfully!", type: "success" });
      } else {
        setToast({ message: "Failed to delete lead. Please try again.", type: "error" });
      }
    }
  };

  const handleStatusUpdate = async (id: number, status: any) => {
    const success = await updateLeadStatus(id, status);
    if (success) {
      setToast({ message: `Status updated to ${status} successfully!`, type: "success" });
    } else {
      setToast({ message: "Failed to update status. Please try again.", type: "error" });
    }
  };

  const handleExport = () => {
    const headers = ["ID", "Name", "Email", "Phone", "Message", "Source", "Status", "Date"];
    const rows = filteredLeads.map(l => [
      l.id, 
      l.fullName, 
      l.email, 
      l.phone, 
      l.message.replace(/,/g, ' '), 
      l.sourcePage, 
      l.status, 
      new Date(l.createdAt).toLocaleDateString()
    ]);
    
    const csvContent = "data:text/csv;charset=utf-8," 
      + headers.join(",") + "\n" 
      + rows.map(e => e.join(",")).join("\n");
      
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `contact_leads_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="p-4 bg-red-50 text-red-600 rounded-xl border border-red-100 font-medium">
          Error: {error}
        </div>
        <button 
          onClick={refresh}
          className="px-6 py-2 bg-primary text-white rounded-lg hover:opacity-90 transition-all font-semibold"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 bg-gray-50/50 min-h-screen">
      {isLoading ? (
        <div className="w-full h-[60vh] flex flex-col items-center justify-center gap-4 text-center">
          <div className="h-12 w-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-400 font-medium animate-pulse">Fetching real-time leads...</p>
        </div>
      ) : (
        <LeadTable 
          data={filteredLeads}
          totalItems={filteredLeads.length}
          itemsPerPage={10}
          currentPage={1}
          baseUrl="/admin/contact"
          onDelete={handleDelete}
          onRefresh={refresh}
          onExport={handleExport}
          onSearch={setSearchTerm}
          onStatusUpdate={handleStatusUpdate}
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
