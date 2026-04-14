"use client";

import React, { useState, useEffect } from "react";
import { MasterTable } from "@/features/master/components/MasterTable";
import { MasterModal } from "@/features/master/components/MasterModal";
import { useMasterData } from "@/features/master/hooks/useMasterData";
import { Toast } from "@/shared/components/ui/toast";
import { Filter } from "lucide-react";

export default function CityManagementPage() {
  const { states, cities, isLoading, fetchStates, fetchCities, addCity, removeCity } = useMasterData();
  const [selectedStateId, setSelectedStateId] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  // Initial Fetch States
  useEffect(() => {
    fetchStates();
  }, [fetchStates]);

  // Fetch Cities when state changes
  useEffect(() => {
    if (selectedStateId) {
      fetchCities(selectedStateId);
    }
  }, [selectedStateId, fetchCities]);

  const handleSave = async (data: { name: string; stateId: string }) => {
    const sId = parseInt(data.stateId);
    const success = await addCity(data.name, sId);
    if (success) {
      setToast({ message: "City saved successfully!", type: "success" });
      if (!selectedStateId) setSelectedStateId(sId);
    } else {
      setToast({ message: "Failed to save city.", type: "error" });
    }
  };

  const handleDelete = async (id: number) => {
    if (!selectedStateId) return;
    if (confirm("Are you sure you want to delete this city?")) {
      const success = await removeCity(id, selectedStateId);
      if (success) {
        setToast({ message: "City deleted successfully!", type: "success" });
      } else {
        setToast({ message: "Failed to delete city.", type: "error" });
      }
    }
  };

  return (
    <div className="h-full p-4 md:p-6 bg-slate-50/20 flex flex-col gap-6">
      
     

      <MasterTable 
        entity="city"
        data={cities}
        isLoading={isLoading}
        onAdd={() => { setEditData(null); setIsModalOpen(true); }}
        onEdit={(item) => { setEditData({ ...item, stateId: selectedStateId }); setIsModalOpen(true); }}
        onDelete={handleDelete}
      />

      <MasterModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        entity="city"
        editData={editData}
        states={states}
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
