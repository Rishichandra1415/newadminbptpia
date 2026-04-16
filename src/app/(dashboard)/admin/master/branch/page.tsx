"use client";

import React, { useState } from "react";
import { BranchesTable } from "@/features/master/components/Branches/BranchesTable";
import { BranchModal } from "@/features/master/components/Branches/BranchModal";
import { BranchEntry } from "@/features/master/types";

// DEMO DATA AS REQUESTED
const DEMO_BRANCHES: BranchEntry[] = [
  { id: 1, name: "Computer Science & Engineering", isActive: true },
  { id: 2, name: "Mechanical Engineering", isActive: true },
  { id: 3, name: "Civil Engineering", isActive: true },
  { id: 4, name: "Electrical Engineering", isActive: true },
  { id: 5, name: "Electronics & Communication Engineering", isActive: true },
  { id: 6, name: "Information Technology", isActive: true },
  { id: 7, name: "Automobile Engineering", isActive: true },
  { id: 8, name: "Artificial Intelligence", isActive: false },
  { id: 9, name: "Mining Engineering", isActive: true },
];

export default function BranchesPage() {
  const [branches, setBranches] = useState<BranchEntry[]>(DEMO_BRANCHES);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBranch, setEditingBranch] = useState<BranchEntry | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleAdd = () => {
    setEditingBranch(null);
    setIsModalOpen(true);
  };

  const handleEdit = (branch: BranchEntry) => {
    setEditingBranch(branch);
    setIsModalOpen(true);
  };

  const handleDelete = (id: number) => {
    if (window.confirm("Are you sure you want to delete this branch?")) {
      setBranches(branches.filter(b => b.id !== id));
    }
  };

  const handleToggleStatus = (id: number) => {
    setBranches(branches.map(b => 
      b.id === id ? { ...b, isActive: !b.isActive } : b
    ));
  };

  const handleSave = async (formData: { name: string; isActive: boolean }) => {
    setIsLoading(true);
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 600));

    if (editingBranch) {
      // Update
      setBranches(branches.map(b => 
        b.id === editingBranch.id ? { ...b, ...formData } : b
      ));
    } else {
      // Create
      const newBranch: BranchEntry = {
        id: Math.max(0, ...branches.map(b => b.id)) + 1,
        ...formData
      };
      setBranches([newBranch, ...branches]);
    }
    
    setIsLoading(false);
    return true;
  };

  return (
    <div className="p-4 md:p-6 min-h-screen bg-slate-50/30">
        <div className="max-w-[1600px] mx-auto">
            <BranchesTable 
                data={branches}
                isLoading={isLoading}
                onAdd={handleAdd}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onToggleStatus={handleToggleStatus}
            />

            <BranchModal 
                isOpen={isModalOpen}
                editData={editingBranch}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSave}
            />
        </div>
    </div>
  );
}
