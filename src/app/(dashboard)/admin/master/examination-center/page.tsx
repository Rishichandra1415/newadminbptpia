"use client";

import React, { useState, useEffect, useCallback } from "react";
import { ExamCentersTable } from "@/features/master/components/ExamCenters/ExamCentersTable";
import { ExamCenterModal } from "@/features/master/components/ExamCenters/ExamCenterModal";
import { ExamCenterEntry } from "@/features/master/types";
import { masterService } from "@/features/master/services/masterService";
import { Toast } from "@/shared/components/ui/toast";

export default function ExamCentersPage() {
  const [centers, setCenters] = useState<ExamCenterEntry[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCenter, setEditingCenter] = useState<ExamCenterEntry | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" | "info" } | null>(null);

  const fetchCenters = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await masterService.getExamCenters();
      if (response.success) {
        setCenters(response.data);
      } else {
        setToast({ message: "Failed to load examination centers.", type: "error" });
      }
    } catch (error) {
      setToast({ message: "Server connection error.", type: "error" });
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCenters();
  }, [fetchCenters]);

  const handleAdd = () => {
    setEditingCenter(null);
    setIsModalOpen(true);
  };

  const handleEdit = (center: ExamCenterEntry) => {
    setEditingCenter(center);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this examination center?")) {
      try {
        const response = await masterService.deleteExamCenter(id);
        if (response.success) {
          setCenters(prev => prev.filter(c => c.id !== id));
          setToast({ message: "Center deleted successfully.", type: "success" });
        } else {
          setToast({ message: "Failed to delete center.", type: "error" });
        }
      } catch (error) {
        setToast({ message: "Error deleting center.", type: "error" });
      }
    }
  };

  const handleToggleStatus = async (id: number) => {
    const center = centers.find(c => c.id === id);
    if (!center) return;

    const newStatus = center.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    try {
      const response = await masterService.updateExamCenter(id, { status: newStatus });
      if (response.success) {
        setCenters(prev => prev.map(c => 
          c.id === id ? { ...c, status: newStatus } : c
        ));
        setToast({ message: `Center ${newStatus === 'ACTIVE' ? 'activated' : 'deactivated'} successfully.`, type: "success" });
      } else {
        setToast({ message: "Failed to update status.", type: "error" });
      }
    } catch (error) {
      setToast({ message: "Error updating status.", type: "error" });
    }
  };

  const handleSave = async (formData: { name: string; courseType: string; status: string }) => {
    setIsLoading(true);
    try {
      let response;
      if (editingCenter) {
        // Update
        response = await masterService.updateExamCenter(editingCenter.id, formData);
      } else {
        // Create
        response = await masterService.createExamCenter(formData);
      }

      if (response.success) {
        setToast({ 
          message: editingCenter ? "Center updated successfully!" : "New center added successfully!", 
          type: "success" 
        });
        fetchCenters(); // Refresh the list
        return true;
      } else {
        setToast({ message: "Failed to save exam center.", type: "error" });
        return false;
      }
    } catch (error) {
      setToast({ message: "Error connecting to server.", type: "error" });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-full bg-slate-50/30">
        <div className="h-full max-w-[1600px] mx-auto">
            <ExamCentersTable 
                data={centers}
                isLoading={isLoading}
                onAdd={handleAdd}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onToggleStatus={handleToggleStatus}
            />

            <ExamCenterModal 
                isOpen={isModalOpen}
                editData={editingCenter}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSave}
            />

            {toast && (
                <Toast 
                    message={toast.message} 
                    type={toast.type} 
                    onClose={() => setToast(null)} 
                />
            )}
        </div>
    </div>
  );
}
