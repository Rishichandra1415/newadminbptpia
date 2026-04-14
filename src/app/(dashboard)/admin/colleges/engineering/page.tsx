"use client";

import React, { useState } from "react";
import { CollegesTable } from "@/features/colleges/components/CollegesTable";
import { CollegeModal } from "@/features/colleges/components/CollegeModal";
import { useColleges } from "@/features/colleges/hooks/useColleges";
import { College } from "@/features/colleges/types";
import { Toast } from "@/shared/components/ui/toast";

export default function EngineeringCollegesPage() {
  const { 
    colleges, 
    isLoading, 
    toggleCourse, 
    toggleStatus, 
    deleteCollege, 
    saveCollege 
  } = useColleges('engineering');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCollege, setEditingCollege] = useState<College | null>(null);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" | "info" } | null>(null);

  const handleEdit = (college: College) => {
    setEditingCollege(college);
    setIsModalOpen(true);
  };

  const handleSave = async (id: number | null, data: Partial<College>) => {
    const success = await saveCollege(id, data);
    if (success) {
      setToast({ 
        message: id ? "College details updated successfully!" : "New college registered successfully!", 
        type: "success" 
      });
      return true;
    } else {
      setToast({ message: "Failed to save college details.", type: "error" });
      return false;
    }
  };

  return (
    <div className="h-full">
      {isLoading ? (
        <div className="w-full h-[60vh] flex flex-col items-center justify-center gap-4 text-center">
          <div className="h-12 w-12 border-4 border-[#00b4d8] border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-400 font-medium animate-pulse">Syncing Engineering Institutions...</p>
        </div>
      ) : (
        <CollegesTable 
          data={colleges}
          category="engineering"
          onDelete={deleteCollege}
          onToggleStatus={toggleStatus}
          onToggleCourse={toggleCourse}
          onEdit={handleEdit}
          onRefresh={() => {}}
        />
      )}

      <CollegeModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        category="engineering"
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
    </div>
  );
}
