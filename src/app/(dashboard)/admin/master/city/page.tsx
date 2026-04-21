"use client";

import React, { useState, useEffect } from "react";
import { MasterTable } from "@/features/master/components/MasterTable";
import { MasterModal } from "@/features/master/components/MasterModal";
import { useMasterData } from "@/features/master/hooks/useMasterData";
import { Toast } from "@/shared/components/ui/toast";
import { Filter, ChevronDown } from "lucide-react";

export default function CityManagementPage() {
  const { states, cities, isLoading, fetchStates, fetchCities, fetchAllCities, addCity, removeCity } = useMasterData();
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
    } else {
      fetchAllCities();
    }
  }, [selectedStateId, fetchCities, fetchAllCities]);

  const handleSave = async (data: { name: string; stateId: string }) => {
    const sId = parseInt(data.stateId);
    const success = await addCity(data.name, sId);
    if (success) {
      setToast({ message: "City saved successfully!", type: "success" });
    } else {
      setToast({ message: "Failed to save city.", type: "error" });
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this city?")) {
      const success = await removeCity(id, selectedStateId || 0); // Handle "all" case for reload if needed
      if (success) {
        setToast({ message: "City deleted successfully!", type: "success" });
        // Re-fetch appropriately
        if (selectedStateId) fetchCities(selectedStateId);
        else fetchAllCities();
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
        filter={
          <div className="relative group flex-grow md:flex-grow-0">
            <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-sm h-10 min-w-[180px] hover:border-primary/40 transition-all cursor-pointer">
              <Filter className="text-slate-400 shrink-0" size={16} />
              
              <select 
                  className="w-full text-[13px] bg-transparent border-none outline-none font-bold text-slate-700 cursor-pointer appearance-none relative z-10 pr-6"
                  value={selectedStateId || "all"}
                  onChange={(e) => {
                      const val = e.target.value;
                      setSelectedStateId(val === "all" ? null : parseInt(val));
                  }}
              >
                  <option value="all">All Cities</option>
                  {states.map((state) => (
                    <option key={state.id} value={state.id}>
                      {state.name.toUpperCase()}
                    </option>
                  ))}
              </select>
              
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none z-0" size={16} strokeWidth={2.5} />
            </div>
          </div>
        }
        onAdd={() => { setEditData(null); setIsModalOpen(true); }}
        onEdit={(item) => { setEditData({ ...item, stateId: item.stateId }); setIsModalOpen(true); }}
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
