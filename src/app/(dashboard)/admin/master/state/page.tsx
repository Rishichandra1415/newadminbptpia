"use client";

import React, { useState, useEffect } from "react";
import { MasterTable } from "@/features/master/components/MasterTable";
import { MasterModal } from "@/features/master/components/MasterModal";
import { useMasterData } from "@/features/master/hooks/useMasterData";
import { Toast } from "@/shared/components/ui/toast";

export default function StateManagementPage() {
  const { states, isLoading, fetchStates, addState, removeState } = useMasterData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  useEffect(() => {
    fetchStates();
  }, [fetchStates]);

  const handleSave = async (data: { name: string }) => {
    const success = await addState(data.name);
    if (success) {
      setToast({ message: "State saved successfully!", type: "success" });
    } else {
      setToast({ message: "Failed to save state.", type: "error" });
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this state? This may affect associated cities.")) {
      const success = await removeState(id);
      if (success) {
        setToast({ message: "State deleted successfully!", type: "success" });
      } else {
        setToast({ message: "Failed to delete state.", type: "error" });
      }
    }
  };

  return (
    <div className="h-full p-4 md:p-6 bg-slate-50/20">
      <MasterTable 
        entity="state"
        data={states}
        isLoading={isLoading}
        onAdd={() => { setEditData(null); setIsModalOpen(true); }}
        onEdit={(item) => { setEditData(item); setIsModalOpen(true); }}
        onDelete={handleDelete}
      />

      <MasterModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        entity="state"
        editData={editData}
      />

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
