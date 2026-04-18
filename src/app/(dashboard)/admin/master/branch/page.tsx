"use client";

import React, { useState, useEffect } from "react";
import { BranchesTable } from "@/features/master/components/Branches/BranchesTable";
import { BranchModal } from "@/features/master/components/Branches/BranchModal";
import { BranchEntry, CourseEntry } from "@/features/master/types";
import { masterService } from "@/features/master/services/masterService";

export default function BranchesPage() {
  const [branches, setBranches] = useState<BranchEntry[]>([]);
  const [courses, setCourses] = useState<CourseEntry[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBranch, setEditingBranch] = useState<BranchEntry | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const branchRes = await masterService.getBranches();
      const courseRes = await masterService.getCourses();

      if (branchRes.success && courseRes.success) {
        const mappedCourses = courseRes.data.map((c: any) => ({
          id: c.id,
          name: c.courseName,
          courseType: c.courseType,
          isActive: c.status === 'ACTIVE'
        }));
        setCourses(mappedCourses);

        const mappedBranches = branchRes.data.map((b: any) => ({
          id: b.id,
          name: b.branchName,
          courseId: b.courseId,
          courseType: b.courseType,
          isActive: b.status === 'ACTIVE',
          course: mappedCourses.find((c: any) => c.id === b.courseId)
        }));
        setBranches(mappedBranches);
      }
    } catch (error) {
      console.error("Fetch failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAdd = () => {
    setEditingBranch(null);
    setIsModalOpen(true);
  };

  const handleEdit = (branch: BranchEntry) => {
    setEditingBranch(branch);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this branch?")) {
      try {
        const response = await masterService.deleteBranch(id);
        if (response.success) {
          setBranches(branches.filter(b => b.id !== id));
        }
      } catch (error) {
        console.error("Delete failed:", error);
      }
    }
  };

  const handleToggleStatus = async (id: number) => {
    const branch = branches.find(b => b.id === id);
    if (!branch) return;

    try {
      const newStatus = branch.isActive ? 'INACTIVE' : 'ACTIVE';
      const response = await masterService.updateBranch(id, { status: newStatus });
      if (response.success) {
        setBranches(branches.map(b => 
          b.id === id ? { ...b, isActive: !b.isActive } : b
        ));
      }
    } catch (error) {
      console.error("Toggle status failed:", error);
    }
  };

  const handleSave = async (formData: { name: string; courseId: string; courseType: string; isActive: boolean }) => {
    setIsLoading(true);
    try {
      const payload = {
        branchName: formData.name,
        courseId: parseInt(formData.courseId),
        courseType: formData.courseType,
        status: formData.isActive ? 'ACTIVE' : 'INACTIVE'
      };

      if (editingBranch) {
        const response = await masterService.updateBranch(editingBranch.id, payload);
        if (response.success) {
          fetchData();
          return true;
        }
      } else {
        const response = await masterService.createBranch({
          branchName: payload.branchName,
          courseId: payload.courseId,
          courseType: payload.courseType
        });
        if (response.success) {
          fetchData();
          return true;
        }
      }
    } catch (error) {
      console.error("Save failed:", error);
    } finally {
      setIsLoading(false);
    }
    return false;
  };

  return (
    <div className="h-full bg-slate-50/30">
        <div className="h-full max-w-[1600px] mx-auto">
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
                courses={courses}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSave}
            />
        </div>
    </div>
  );
}
