"use client";

import React, { useState } from "react";
import { CollegesTable } from "@/features/colleges/components/CollegesTable";
import { CollegeModal } from "@/features/colleges/components/CollegeModal";
import { useColleges } from "@/features/colleges/hooks/useColleges";
import { College, CollegeType } from "@/features/colleges/types";
import { Toast } from "@/shared/components/ui/toast";

export default function CollegesPage() {
  const { 
    colleges, 
    isLoading, 
    currentFilter,
    setFilter,
    toggleCourse, 
    toggleStatus, 
    deleteCollege, 
    saveCollege,
    refresh,
    error 
  } = useColleges('ALL');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCollege, setEditingCollege] = useState<College | null>(null);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" | "info" } | null>(null);

  const handleEdit = (college: College) => {
    if (college.id) {
        setEditingCollege(college);
    } else {
        setEditingCollege(null);
    }
    setIsModalOpen(true);
  };

  const handleSave = async (id: number | null, data: Partial<College>) => {
    const success = await saveCollege(id, data);
    if (success) {
      setToast({ 
        message: id ? "Institution updated successfully!" : "New institution registered successfully!", 
        type: "success" 
      });
      return true;
    } else {
      setToast({ message: "Failed to save institution details.", type: "error" });
      return false;
    }
  };

  return (
    <div className="h-full">
      {isLoading ? (
        <div className="w-full h-[60vh] flex flex-col items-center justify-center gap-4 text-center">
          <div className="h-12 w-12 border-4 border-[#00b4d8] border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-400 font-bold uppercase tracking-widest animate-pulse">Synchronizing Educational Archives...</p>
        </div>
      ) : (
        <CollegesTable 
          data={colleges}
          filter={currentFilter}
          onFilterChange={setFilter}
          onDelete={deleteCollege}
          onToggleStatus={toggleStatus}
          onToggleCourse={toggleCourse}
          onEdit={handleEdit}
          onRefresh={refresh}
        />
      )}

      <CollegeModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        category={currentFilter === 'ALL' ? 'engineering' : currentFilter.toLowerCase() as any}
        editData={editingCollege}
      />

      {/* Toast Notification */}
      {toast && (
        <Toast 
          message={toast.message} 
          type={toast.type} 
          onClose={() => setToast(null)} 
        />
      )}

      {error && (
        <div className="fixed bottom-4 right-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg shadow-lg flex items-center gap-3">
          <span className="font-bold text-sm">Error: {error}</span>
          <button onClick={refresh} className="underline font-bold text-xs uppercase tracking-tight">Retry</button>
        </div>
      )}
    </div>
  );
}
