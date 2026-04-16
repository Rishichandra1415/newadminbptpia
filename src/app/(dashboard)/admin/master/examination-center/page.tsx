"use client";

import React, { useState } from "react";
import { ExamCentersTable } from "@/features/master/components/ExamCenters/ExamCentersTable";
import { ExamCenterModal } from "@/features/master/components/ExamCenters/ExamCenterModal";
import { ExamCenterEntry } from "@/features/master/types";

// DEMO DATA AS REQUESTED
const DEMO_CENTERS: ExamCenterEntry[] = [
  { id: 1, name: "Patna (Govt. Polytechnic)", isActive: true },
  { id: 2, name: "Gaya (Gaya College)", isActive: true },
  { id: 3, name: "Muzaffarpur (LS College)", isActive: true },
  { id: 4, name: "Bhagalpur (TNB College)", isActive: true },
  { id: 5, name: "Darbhanga (CM Science College)", isActive: true },
  { id: 6, name: "Purnia (Purnia College)", isActive: true },
  { id: 7, name: "Katihar (Katihar Medical College)", isActive: true },
  { id: 8, name: "Munger (RD&DJ College)", isActive: false },
  { id: 9, name: "Sasaram (SP Jain College)", isActive: true },
];

export default function ExamCentersPage() {
  const [centers, setCenters] = useState<ExamCenterEntry[]>(DEMO_CENTERS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCenter, setEditingCenter] = useState<ExamCenterEntry | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleAdd = () => {
    setEditingCenter(null);
    setIsModalOpen(true);
  };

  const handleEdit = (center: ExamCenterEntry) => {
    setEditingCenter(center);
    setIsModalOpen(true);
  };

  const handleDelete = (id: number) => {
    if (window.confirm("Are you sure you want to delete this examination center?")) {
      setCenters(centers.filter(c => c.id !== id));
    }
  };

  const handleToggleStatus = (id: number) => {
    setCenters(centers.map(c => 
      c.id === id ? { ...c, isActive: !c.isActive } : c
    ));
  };

  const handleSave = async (formData: { name: string; isActive: boolean }) => {
    setIsLoading(true);
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 600));

    if (editingCenter) {
      // Update
      setCenters(centers.map(c => 
        c.id === editingCenter.id ? { ...c, ...formData } : c
      ));
    } else {
      // Create
      const newCenter: ExamCenterEntry = {
        id: Math.max(0, ...centers.map(c => c.id)) + 1,
        ...formData
      };
      setCenters([newCenter, ...centers]);
    }
    
    setIsLoading(false);
    return true;
  };

  return (
    <div className="p-4 md:p-6 min-h-screen bg-slate-50/30">
        <div className="max-w-[1600px] mx-auto">
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
        </div>
    </div>
  );
}
