"use client";

import React, { useState } from "react";
import { ResultsTable } from "@/features/results/components/ResultsTable";
import { useResults } from "@/features/results/hooks/useResults";
import { Toast } from "@/shared/components/ui/toast";

export default function ResultsPage() {
  const { 
    results, 
    isLoading, 
    error, 
    refresh, 
    saveResult, 
    deleteResult, 
    toggleStatus 
  } = useResults();

  const [toast, setToast] = useState<{ message: string; type: "success" | "error" | "info" } | null>(null);

  const handleSave = async (id: number | null, formData: FormData) => {
    const success = await saveResult(id, formData);
    if (success) {
      setToast({ message: `Result ${id ? 'updated' : 'added'} successfully!`, type: "success" });
      return true;
    } else {
      setToast({ message: "Operation failed. Please check your data or connection.", type: "error" });
      return false;
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this result permanently?")) {
      const success = await deleteResult(id);
      if (success) {
        setToast({ message: "Result deleted successfully!", type: "success" });
      } else {
        setToast({ message: "Failed to delete result.", type: "error" });
      }
    }
  };

  const handleToggle = async (id: number) => {
    const success = await toggleStatus(id);
    if (success) {
      setToast({ message: "Visibility status updated!", type: "success" });
      return true;
    } else {
      setToast({ message: "Failed to update status.", type: "error" });
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
          className="px-6 py-2 bg-primary text-white rounded-lg hover:opacity-90 transition-all font-semibold"
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
          <p className="text-slate-400 font-medium animate-pulse">Fetching academic results...</p>
        </div>
      ) : (
        <ResultsTable 
          data={results}
          onDelete={handleDelete}
          onRefresh={refresh}
          onStatusUpdate={handleToggle}
          onSave={handleSave}
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
