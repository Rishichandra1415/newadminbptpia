"use client";

import React, { useState, useEffect } from "react";
import { CoursesTable } from "@/features/master/components/Courses/CoursesTable";
import { CourseModal } from "@/features/master/components/Courses/CourseModal";
import { CourseEntry } from "@/features/master/types";
import { masterService } from "@/features/master/services/masterService";

export default function CoursesPage() {
  const [courses, setCourses] = useState<CourseEntry[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<CourseEntry | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchCourses = async () => {
    setIsLoading(true);
    try {
      const response = await masterService.getCourses();
      if (response.success) {
        // Map backend 'courseName' to frontend 'name' if necessary
        const mappedData = response.data.map((item: any) => ({
          id: item.id,
          name: item.courseName,
          courseType: item.courseType,
          isActive: item.status === 'ACTIVE'
        }));
        setCourses(mappedData);
      }
    } catch (error) {
      console.error("Failed to fetch courses:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleAdd = () => {
    setEditingCourse(null);
    setIsModalOpen(true);
  };

  const handleEdit = (course: CourseEntry) => {
    setEditingCourse(course);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this course?")) {
      try {
        const response = await masterService.deleteCourse(id);
        if (response.success) {
          setCourses(courses.filter(c => c.id !== id));
        }
      } catch (error) {
        alert("Cannot delete course. It might be linked to existing branches.");
      }
    }
  };

  const handleToggleStatus = async (id: number) => {
    const course = courses.find(c => c.id === id);
    if (!course) return;

    try {
      const newStatus = course.isActive ? 'INACTIVE' : 'ACTIVE';
      const response = await masterService.updateCourse(id, { status: newStatus });
      if (response.success) {
        setCourses(courses.map(c => 
          c.id === id ? { ...c, isActive: !c.isActive } : c
        ));
      }
    } catch (error) {
      console.error("Toggle status failed:", error);
    }
  };

  const handleSave = async (formData: { name: string; courseType: string; isActive: boolean }) => {
    setIsLoading(true);
    try {
      if (editingCourse) {
        // Update
        const response = await masterService.updateCourse(editingCourse.id, {
          courseName: formData.name,
          courseType: formData.courseType,
          status: formData.isActive ? 'ACTIVE' : 'INACTIVE'
        });
        if (response.success) {
          fetchCourses(); // Refresh list
          return true;
        }
      } else {
        // Create
        const response = await masterService.createCourse({
          courseName: formData.name,
          courseType: formData.courseType
        });
        if (response.success) {
          fetchCourses();
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
            <CoursesTable 
                data={courses}
                isLoading={isLoading}
                onAdd={handleAdd}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onToggleStatus={handleToggleStatus}
            />

            <CourseModal 
                isOpen={isModalOpen}
                editData={editingCourse}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSave}
            />
        </div>
    </div>
  );
}
