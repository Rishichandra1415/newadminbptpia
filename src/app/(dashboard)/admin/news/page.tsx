"use client";

import React, { useState } from "react";
import { useNewsEvents } from "@/features/news/hooks/useNewsEvents";
import { Toast } from "@/shared/components/ui/toast";
import { NewsEventsTable } from "@/features/news/components/NewsEventsTable";

export default function NewsEventsPage() {
  const { 
    events, 
    isLoading, 
    error, 
    refresh, 
    deleteEvent,
    toggleStatus,
    saveEvent,
    totalRecords
  } = useNewsEvents();

  const [toast, setToast] = useState<{ message: string; type: "success" | "error" | "info" } | null>(null);

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this event? This will also remove any associated files.")) {
      const success = await deleteEvent(id);
      if (success) {
        setToast({ message: "Event deleted successfully!", type: "success" });
      } else {
        setToast({ message: "Failed to delete event.", type: "error" });
      }
    }
  };

  const handleStatusUpdate = async (id: number) => {
    const success = await toggleStatus(id);
    if (success) {
      setToast({ message: "Event status updated!", type: "success" });
    } else {
      setToast({ message: "Failed to update status.", type: "error" });
    }
  };

  const handleSave = async (id: number | null, formData: FormData) => {
    const success = await saveEvent(id, formData);
    if (success) {
      setToast({ 
        message: id ? "Event updated successfully!" : "New event added successfully!", 
        type: "success" 
      });
      return true;
    } else {
      setToast({ message: "Failed to save event. Check file size (max 10MB).", type: "error" });
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
          onClick={() => refresh()}
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
          <p className="text-slate-400 font-medium animate-pulse">Syncing News & Events...</p>
        </div>
      ) : (
        <NewsEventsTable 
          data={events}
          onDelete={handleDelete}
          onRefresh={() => refresh()}
          onStatusUpdate={handleStatusUpdate}
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
